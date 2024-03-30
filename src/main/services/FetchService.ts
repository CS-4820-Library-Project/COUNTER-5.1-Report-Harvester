import ReportService from "../../renderer/src/service/ReportService";
import { IFetchError } from "src/renderer/src/interface/IFetchError";
import {
  SushiExceptionDictionary,
  SushiGeneralWarningMeaning,
} from "../../renderer/src/const/ExceptionDictionary";
import { IReport } from "../../renderer/src/interface/IReport";
import { CounterVersion } from "../../renderer/src/const/CounterVersion";
import { VendorData, VendorInfo, VendorRecord } from "src/types/vendors";
import { LoggerService } from "./LoggerService";
import { Report, Report_Attributes, Report_Filters } from "src/types/counter";
import { SupportedAPIResponse } from "src/types/reports";

/** The main service for performing GET operations on vendors that use the SUSHI API */

export class FetchService {
  //

  /** Performs an *HTTP GET* call on the root of a vendor's SUSHI API to discover all the different types of reports
   * they can supply. */
  static async getSupportedReportIds(
    vendor: VendorRecord | VendorData
  ): Promise<string[] | IFetchError | null> {
    const vendorInfo = vendor.data5_0 ?? vendor.data5_1;
    if (!vendorInfo) return [];

    const url = `${vendorInfo.baseURL}?customer_id=${vendorInfo.customerId}
                  &requestor_id=${vendorInfo.requestorId}
                  ${this.getAPIKeySegment(vendorInfo)}`;

    try {
      const response = await fetch(url);
      if (!response.ok)
        return this.getExistingFetchError(await response.json());

      const data = (await response.json()) as SupportedAPIResponse[];

      return Array.isArray(data) ? data.map((val) => val.Report_ID) : null;
    } catch (error) {
      console.error("Error fetching reports:", error);
      return null;
    }
  }

  /** Performs an *HTTP GET* call on a specific route of a vendor's SUSHI API to harvest reports of a specified type. */

  static async fetchReport(
    vendor: VendorRecord,
    reportSettings: Report,
    startDate: Date,
    endDate: Date,
    counterVersion: CounterVersion,
    requestTimeout: number,
    logger = new LoggerService()
  ): Promise<IReport | IFetchError | Error | null> {
    if (!reportSettings.id || !vendor) return null;

    const isCustomReport = reportSettings.name.includes("Custom");

    logger.log(`Started fetch for vendor with ID ${vendor.id}`);

    try {
      const reportFromJsonFunc =
        counterVersion == CounterVersion.v5_0
          ? ReportService.get50ReportFromJSON
          : ReportService.get51ReportFromJson;

      const vendorInfo =
        counterVersion == CounterVersion.v5_0 ? vendor.data5_0 : vendor.data5_1;

      if (!vendorInfo) return null;

      logger.log(`Vendor has counter version ${counterVersion}`);

      const reportUrl = `${vendorInfo.baseURL}/${reportSettings.id.toLowerCase()}?customer_id=${
        vendorInfo.customerId
      }&requestor_id=${
        vendorInfo.requestorId
      }&begin_date=${this.getDateAsString(
        startDate
      )}&end_date=${this.getDateAsString(endDate)}${this.getAPIKeySegment(
        vendorInfo
      )}${this.convertFiltersToURLParams(reportSettings, counterVersion)}`;

      logger.log(
        `Fetching from URL ${reportUrl}. Vendor requires ${vendorInfo.requireTwoAttemptsPerReport ? 2 : 1} fetch(es).`
      );

      let attempts = vendorInfo.requireTwoAttemptsPerReport ? 2 : 1;

      let response = null;

      for (let i = 0; i < attempts; i++) {
        const responsePromise = fetch(reportUrl);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () =>
              reject({
                code: -1,
                severity: "Minor",
                message: "Request timeout exceeded",
                meaning: "Adjust your request timeout settings to be longer",
              } as IFetchError),
            requestTimeout * 1000
          );
        });

        response = (await Promise.race([responsePromise, timeoutPromise])) as
          | Response
          | IFetchError;
      }

      logger.log(`Response received!`);

      if ("ok" in response && !response.ok) {
        return this.getExistingFetchError(await response.json());
      }

      response = response as Response;
      const data = await response.json();

      logger.log(`Converting results from JSON to object`);

      let report = reportFromJsonFunc(data);

      if (!report) {
        return null;
      }

      console.log(report);

      logger.log(`Converting object to TSV`);

      let tsv = ReportService.convertReportToTSV(report);

      const tsvFilename = ReportService.generateTSVFilename(
        vendor.name,
        reportSettings.id
      );

      logger.log(`Writing TSV content to ${tsvFilename}.tsv`);

      await window.tsv.writeTsvToFile(tsv, tsvFilename, isCustomReport);

      return report;
    } catch (error) {
      if (error.hasOwnProperty("meaning")) {
        logger.log(
          `ERROR ${error.code} (${reportSettings.id} from ${vendor.name}): ${error.message}`
        );
      }
      const errorMessage = `Error fetching report ${reportSettings.id}: ${error}`;
      console.error(errorMessage);
      logger.log(errorMessage);
      return error;
    }
  }

  /** Attempts to discover a fetch error in a fetch result, returning the error as an **IFetchError** object
   * if one is found, and *null* otherwise. */

  static getExistingFetchError(data: any): IFetchError | null {
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
