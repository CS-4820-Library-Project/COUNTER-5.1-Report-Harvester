import ReportService from "./ReportService";
import { IFetchError } from "src/renderer/src/interface/IFetchError";
import {
  SushiExceptionDictionary,
  SushiGeneralWarningMeaning,
} from "../../renderer/src/const/ExceptionDictionary";
import { CounterVersion } from "../../renderer/src/const/CounterVersion";
import { VendorData, VendorInfo, VendorRecord } from "src/types/vendors";
import { LoggerService } from "./LoggerService";
import { Report, Report_Attributes, Report_Filters } from "src/types/counter";
import {
  FetchResult,
  FetchResults,
  SupportedAPIResponse,
} from "src/types/reports";
import { APIRequestSettingService } from "./APIRequestSettingService";
import TSVService from "./TSVService";
import { prismaReportService } from "./PrismaReportService";
import { BrowserWindow } from "electron";
import { IReport } from "src/renderer/src/interface/IReport";

export type FetchData = {
  fetchReports: Report[];
  selectedVendors: VendorRecord[];
  version: string;
  fromDate: Date;
  toDate: Date;
};

/** The main service for performing GET operations on vendors that use the SUSHI API */

export class FetchService {
  /**
   * Summarizes the results of fetching reports from vendors.
   * @param fetchResults - The results of fetching reports from vendors.
   * @param logger - The logger to use for logging.
   * @returns The summarized results.
   */
  private static summarizeResults(
    fetchResults: FetchResult[],
    logger: LoggerService
  ): FetchResults {
    const result = fetchResults.reduce(
      (
        acc: FetchResults,
        { reportId, vendorName, success, custom, error }: FetchResult
      ) => {
        const report = { reportId, success, error };

        // Determine if the vendor is 'main' or 'custom'
        const reportType = custom ? "custom" : "main";

        const vendor = acc[reportType].vendors.find(
          (v) => v.name === vendorName
        );
        if (vendor) {
          vendor.reports.push(report);
          if (success) {
            vendor.totalSucceed += 1;
            acc[reportType].succeeded += 1;
          }
        } else {
          acc[reportType].vendors.push({
            name: vendorName,
            reports: [report],
            totalSucceed: success ? 1 : 0,
          });
          if (success) acc[reportType].succeeded += 1;
        }

        if (!success) acc.failed += 1;

        return acc;
      },
      {
        main: { succeeded: 0, vendors: [] },
        custom: { succeeded: 0, vendors: [] },
        failed: 0,
        log: logger.writeLogsToFile(),
      }
    );

    return result;
  }

  /** Performs an *HTTP GET* call on the root of a vendor's SUSHI API to discover all the different types of reports
   *  they can supply.
   *  @param vendor - The vendor to fetch reports from.
   */
  static async getSupportedReports(
    vendor: VendorRecord | VendorData
  ): Promise<string[] | IFetchError | null> {
    const vendorInfo = vendor.data5_0 ?? vendor.data5_1;
    if (!vendorInfo) return [];

    const url =
      `${vendorInfo.baseURL}?customer_id=${vendorInfo.customerId}` +
      `&requestor_id=${vendorInfo.requestorId}` +
      `${this.getAPIKeySegment(vendorInfo)}`;

    try {
      const response = await fetch(url);
      const responseBody = await response.json();

      if (!response.ok) return this.getExistingFetchError(responseBody);

      const data = responseBody as SupportedAPIResponse[];

      const reportIds = Array.isArray(data)
        ? data.map((val) => val.Report_ID.toUpperCase())
        : [];

      return reportIds;
    } catch (error) {
      // console.error("Error fetching reports:", error);
      return null;
    }
  }

  /**
   * Fetches reports from a list of vendors.
   * @param fetchData - The data needed to fetch reports. As an Object include the following props
   * @prop fetchReports - The list of reports to fetch.
   * @prop selectedVendors - The list of vendors to fetch reports from.
   * @prop version - The version of the COUNTER standard to use.
   * @prop fromDate - The start date of the report.
   * @prop toDate - The end date of the report.
   */
  static async fetchReports(
    { fetchReports, selectedVendors, version, fromDate, toDate }: FetchData,
    mainWindow: BrowserWindow
  ) {
    const logger = new LoggerService();

    const dataVersion = version === "5.1" ? "data5_1" : "data5_0";

    const settings = await new APIRequestSettingService().readSettings();
    const requestInterval = settings?.requestInterval || 1000;
    const requestTimeout = settings?.requestTimeout || 30000;

    const allPromises = selectedVendors.map(async (vendor) => {
      const supported = await this.getSupportedReports(vendor);

      if (!Array.isArray(supported)) {
        mainWindow.webContents.send("vendor-completed");
        return [];
      }

      const vendorReports = fetchReports.filter((report) =>
        supported.some((r) => r.toUpperCase() === report.id)
      );

      // If requests need to be throttled for this vendor, fetch reports sequentially
      if (vendor[dataVersion]?.requireRequestsThrottled) {
        const results = await vendorReports.reduce(
          async (prevPromise, report) => {
            const results = await prevPromise;
            await new Promise((resolve) =>
              setTimeout(resolve, requestInterval)
            );

            // TODO: Remove console log
            // console.log(
            //   "\nThrottling requests for",
            //   vendor.name,
            //   "... With Interval",
            //   requestInterval
            // );

            const result = await FetchService.fetchReport(
              vendor,
              report,
              fromDate,
              toDate,
              version as CounterVersion,
              requestTimeout,
              logger
            );
            return [...results, result];
          },
          Promise.resolve([] as FetchResult[])
        );
        mainWindow.webContents.send("vendor-completed");
        return results;
      }

      // If requests don't need to be throttled for this vendor, fetch reports concurrently
      else {
        const results = await Promise.all(
          vendorReports.map((report) =>
            FetchService.fetchReport(
              vendor,
              report,
              fromDate,
              toDate,
              version as CounterVersion,
              requestTimeout,
              logger
            )
          )
        );
        mainWindow.webContents.send("vendor-completed");
        return results;
      }
    });

    // Wait for all promises to resolve
    const fetchResults = (
      await Promise.all(allPromises)
    ).flat() as FetchResult[];

    // console.log(fetchResults);

    const summary = this.summarizeResults(fetchResults, logger);
    return summary;
  }

  /**
   * Performs an *HTTP GET* call on a specific route of a vendor's SUSHI API to harvest reports of a specified type.
   * @param vendor - The vendor to fetch reports from.
   * @param reportSettings - The settings of the report to fetch.
   * @param startDate - The start date of the report.
   * @param endDate - The end date of the report.
   * @param counterVersion - The version of the COUNTER standard to use.
   * @param requestTimeout - The timeout for the request.
   * @param logger - The logger to use for logging.
   * @returns The result of the fetch operation.
   */
  private static async fetchReport(
    vendor: VendorRecord,
    reportSettings: Report,
    startDate: Date,
    endDate: Date,
    counterVersion: CounterVersion,
    requestTimeout: number,
    logger = new LoggerService()
  ): Promise<FetchResult> {
    let fetchResult: FetchResult = {
      reportId: reportSettings.id,
      vendorName: vendor.name,
      success: false,
      custom: reportSettings.name.includes("Custom"),
    };
    if (!reportSettings.id || !vendor) return fetchResult;

    const now = new Date().toLocaleString();

    const logHeader = now + `\t${vendor.name}\t${reportSettings.id}\t`;
    const isCustomReport = reportSettings.name.includes("Custom");

    try {
      const vendorInfo =
        counterVersion == CounterVersion.v5_0 ? vendor.data5_0 : vendor.data5_1;
      if (!vendorInfo) return fetchResult;

      let reportUrl = `${vendorInfo.baseURL}/${reportSettings.id.toLowerCase()}?customer_id=${
        vendorInfo.customerId
      }&requestor_id=${
        vendorInfo.requestorId
      }&begin_date=${this.getDateAsString(
        startDate
      )}&end_date=${this.getDateAsString(endDate)}${this.getAPIKeySegment(
        vendorInfo
      )}`;

      if (isCustomReport)
        reportUrl += `${this.convertFiltersToURLParams(reportSettings, counterVersion)}`;

      // TODO: Improve Log
      logger.log(
        logHeader +
          "Fetching Sushi API from URL\t" +
          `${reportUrl}\tVendor requires ${vendorInfo.requireTwoAttemptsPerReport ? 2 : 1} fetch(es).\n`
      );

      const response = await this.fetchWithAttempts(
        vendorInfo,
        reportUrl,
        requestTimeout
      );

      // Throw TSV Error Message or Returns Data
      const data = await this.validateResponse(response, fetchResult);

      const reportFromJsonFunc =
        counterVersion == CounterVersion.v5_0
          ? ReportService.get50ReportFromJSON
          : ReportService.get51ReportFromJson;

      let report = reportFromJsonFunc(data);
      if (!report) return fetchResult;

      let tsv = ReportService.convertReportToTSV(report);

      // const tsvFilename = ReportService.generateTSVFilename(
      //   counterVersion,
      //   vendor.name,
      //   reportSettings.id,
      //   startDate,
      //   endDate
      // );

      // TODO: THROWS MANY ERRORS
      // TSVService.writeTSVReport(tsvFilename, tsv, isCustomReport);

      // TODO: DATABASE CRASHING
      // if (reportSettings.id === "TR")
      //   prismaReportService.saveFetchedReport(report);

      fetchResult.success = true;
      fetchResult.warning = report.Report_Header.Exceptions;

      return fetchResult;
    } catch (error) {
      let errorMessage = logHeader + error;
      errorMessage += error;

      console.log(errorMessage);

      logger.log(errorMessage);

      return {
        reportId: reportSettings.id,
        custom: isCustomReport,
        vendorName: vendor.name,
        success: false,
        error: fetchResult.error ? fetchResult.error : (error as IFetchError),
      };
    }
  }

  /**
   * Fetches a report from a vendor with multiple attempts.
   * @param vendorInfo - The vendor to fetch the report from.
   * @param reportUrl - The URL of the report to fetch.
   * @param requestTimeout - The timeout for the request.
   * @returns The response of the fetch operation.
   * @throws An error if the fetch operation fails.
   */
  private static async fetchWithAttempts(
    vendorInfo: VendorInfo,
    reportUrl: string,
    requestTimeout: number
  ) {
    let attempts = vendorInfo.requireTwoAttemptsPerReport ? 2 : 1;

    let response = null;

    for (let i = 0; i < attempts; i++) {
      // TODO: Remove Console Log
      // if (attempts > 1)
      //   console.log(
      //     vendorInfo.baseURL + " Attempt ",
      //     i + 1,
      //     " TimeOut ",
      //     requestTimeout,
      //     new Date().toISOString()
      //   );

      const responsePromise = fetch(reportUrl);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () =>
            reject({
              code: -1,
              severity: "Minor",
              message:
                "Request timeout exceeded - No response received in " +
                requestTimeout +
                " seconds.",
              meaning: "Adjust your request timeout settings to be longer",
            } as IFetchError),
          requestTimeout * 1000
        );
      });

      response = (await Promise.race([
        responsePromise,
        timeoutPromise,
      ])) as Response;

      if (
        response instanceof Response &&
        response.status === 429 &&
        i < attempts - 1
      ) {
        // TODO: Remove Console Log
        // console.log("Rate limit exceeded, waiting for 3 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    return response;
  }

  /**
   * Validates a fetch response, throwing a tsv string error if the response is not valid.
   * And attaches the COUNTER Error if any to the fetch result.
   * @param response - The response to validate.
   */
  private static async validateResponse(
    response: Response | null,
    fetchResult: FetchResult
  ) {
    let fetchingError = "Fetching Reports\t";
    if (!response) throw (fetchingError += "No response received");

    response = response as Response;
    let data;

    // Handle JSON RESPONSE
    if (response.headers.get("content-type")?.includes("application/json")) {
      try {
        data = await response.json();
        const counterError = this.getExistingFetchError(data);

        // Get Counter Error If not Report Data
        if (counterError) {
          fetchResult.error = counterError;
          fetchingError +=
            "Exception " +
            counterError.code +
            " - " +
            counterError.message +
            "\t";
          throw fetchingError;

          // Handle Other Data Sent
        } else {
          // Hopefully the data is a report
          if (response.ok) return data as IReport;
          // Ramdom Responses from API - usually { message: "Internal Server Error" } with a 200 status
          else fetchingError += "Unknown error:" + JSON.stringify(data);
        }

        // Handle Invalid JSON RESPONSE FORMAT
      } catch (error) {
        throw (
          fetchingError +
          "Invalid JSON Format ( " +
          JSON.stringify(response) +
          " ):\n"
        );
      }
    }
    // Handle HTTP RESPONSE
    else {
      fetchingError += `Network Error: HTTP ${response.status} - ${response.statusText}`;
    }
  }

  /**
   * Attempts to discover a fetch error in a fetch result, returning the error as an **IFetchError** object
   * if one is found, and *null* otherwise.
   * @param data - The data to search for a fetch error. Must JSON Data
   */
  private static getExistingFetchError(data: any): IFetchError | null {
    if (Array.isArray(data)) data = data[0];

    if ("Code" in data) {
      const meaning = SushiExceptionDictionary[data.Code];
      return {
        code: data.Code,
        meaning: meaning ?? SushiGeneralWarningMeaning,
        message: data.Message,
        severity: data.Severity,
      } as IFetchError;
    }
    return null;
  }

  /**
   * Converts the filters and attributes of a report to URL parameters.
   * @param reportSettings - The report settings to convert to URL parameters.
   * @param counterVersion - The version of the COUNTER standard to use.
   * @returns The URL parameters.
   */
  private static convertFiltersToURLParams(
    reportSettings: Report,
    counterVersion: CounterVersion = CounterVersion.v5_0
  ) {
    const filters = reportSettings.filters;
    const attributes = reportSettings.attributes;
    let params = "";

    // Add filters to URL
    for (const filter in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, filter)) {
        if (filter.includes("Access") && counterVersion == CounterVersion.v5_1)
          continue;

        const val = filters[filter as keyof Report_Filters];
        if (Array.isArray(val) && val.length > 0) {
          params += `&${filter}=${val.join("|")}`;
          //
        } else if (filter === "YOP") {
          // Exclude "All" to select all years
          if (val !== "All" && typeof val === "string")
            params += `&${filter}=${val}`;
          else continue;
          //
        } else if (val && typeof val === "string") {
          params += `&${filter}=${val}`;
        }
      }
    }

    // Add attributes to the URL
    for (const attribute in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, attribute)) {
        const val = attributes[attribute as keyof Report_Attributes];

        // Attributes to show
        if (Array.isArray(val) && val.length > 0) {
          params += `&${attribute}=${val.join("|")}`;

          // Exclude monthly details into granularity
        } else if (
          attribute === "Exclude_Monthly_Details" &&
          counterVersion != CounterVersion.v5_1
        ) {
          params += `&granularity=${val ? "totals" : "month"}`;

          // Include component / parent details
        } else if (typeof val === "boolean") {
          params += `&${attribute.toLowerCase()}`;
        }
      }
    }

    return params;
  }

  private static getDateAsString = (date: Date) =>
    `${date.getFullYear()}-${ReportService.padLeft((date.getMonth() + 1).toString(), 2, "0")}`;

  private static getAPIKeySegment = (vendorInfo: VendorInfo) =>
    vendorInfo.apiKey ? `&api_key=${vendorInfo.apiKey}` : "";
}

export default FetchService;
