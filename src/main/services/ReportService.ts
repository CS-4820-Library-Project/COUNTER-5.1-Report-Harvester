import {
  IDRReportItem,
  IInstitutionId,
  IItemId,
  IPerformance,
  IPublisherId,
  IReport,
  IReportHeader,
  IReportItem,
  ITRIRReportItem,
  ITRReportItem,
  I_IR_ReportItem,
} from "../../renderer/src/interface/IReport";
import {
  ReportIDTSVHeaderDict,
  TSVHeaders as THd,
  TSVHeaderSuffix,
} from "../../renderer/src/const/TSVStrings";
import { CounterVersion } from "../../renderer/src/const/CounterVersion";
import { NameValue, TypeValue } from "src/types/reports";

/** The main service for cleansing, coercing, and analyzing Reports from SUSHI APIs. */

export class ReportService {
  /** Converts a 5.0 report from JSON into an **IReport** object. */
  static get50ReportFromJSON(data: any): IReport | null {
    if (!(data && data.Report_Header && data.Report_Items)) {
      return null;
    }

    return {
      Report_Header: ReportService.getHeaderObjectFromJSON(data.Report_Header),
      Report_Items: data.Report_Items.map((reportItem) => {
        if (data.Report_Header.Report_ID.includes("IR")) {
          reportItem.Title = reportItem["Item"];
          delete reportItem["Item"];
        }
        return reportItem;
      }),
    } as IReport;
  }

  /** Converts a 5.1 report from JSON into an **IReport** object. */
  static get51ReportFromJson(data: any): IReport | null {
    try {
      if (data.Report_Header.Report_ID.includes("IR"))
        return ReportService.get51IRFromJSON(data);

      const reportId = data.Report_Header.Report_ID;
      const reportItems = data.Report_Items?.map((item: any) => {
        const performanceMap = new Map<string, IPerformance>();

        item.Attribute_Performance.forEach((attrPerf: any) => {
          const perf = attrPerf.Performance;

          Object.keys(perf).forEach((metricType: string) => {
            const monthData = perf[metricType];

            Object.keys(monthData).forEach((month: string) => {
              const year = Number(month.slice(0, 4));
              const lastDayOfMonth = new Date(
                year,
                Number(month.slice(5, 7)),
                0
              ).getDate();

              const periodKey = `${month}-01-${year}-${lastDayOfMonth}`;
              let performance = performanceMap.get(periodKey);

              if (!performance) {
                performance = {
                  Period: {
                    Begin_Date: `${month}-01`,
                    End_Date: `${month}-${lastDayOfMonth}`,
                  },
                  Instance: [],
                };
                performanceMap.set(periodKey, performance);
              }

              performance.Instance.push({
                Metric_Type: metricType,
                Count: monthData[month] || 0,
              });
            });
          });
        });

        const itemID = item.Item_ID
          ? Object.entries(item.Item_ID)?.map(([Type, Value]) => ({
              Type,
              Value,
            }))
          : [];

        const reportItem: IReportItem = {
          Platform: item.Platform,
          Item_ID: itemID as IItemId[],
          Performance: Array.from(performanceMap.values()),
        };

        // Process TR Report
        if (reportId.includes("TR")) {
          const trItem = item as ITRIRReportItem;
          const thisItem = reportItem as ITRIRReportItem;

          thisItem["Title"] = trItem.Title;
          thisItem["Publisher_ID"] = Object.entries(
            trItem.Publisher_ID
          )?.flatMap(([Type, Values]) =>
            Values.map((Value) => ({ Type, Value }))
          );
          thisItem["Publisher"] = trItem.Publisher;
          thisItem["Item_ID"] = Object.entries(trItem.Item_ID)?.map(
            ([Type, Value]) => ({ Type, Value })
          );
        }

        // Process IR Report
        else if (reportId.includes("IR")) {
          const irItem = item as I_IR_ReportItem;
          const thisItem = reportItem as I_IR_ReportItem;
          thisItem["Item"] = irItem.Item;
          thisItem["Item_ID"] = Object.entries(irItem.Item_ID)?.map(
            (Type, Value) => ({ Type, Value })
          );
        }

        // Process DR Report
        else if (reportId.includes("DR")) {
          const drItem = item as IDRReportItem;
          const thisItem = reportItem as IDRReportItem;

          thisItem["Database"] = drItem.Database;
          thisItem["Publisher"] = drItem.Publisher;
          thisItem["Publisher_ID"] = Object.entries(
            drItem.Publisher_ID
          )?.flatMap(([Type, Values]) =>
            Values.map((Value) => ({ Type, Value }))
          );
          thisItem["Item_ID"] = Object.entries(drItem.Item_ID)?.map(
            ([Type, Value]) => ({ Type, Value })
          );
        }

        return reportItem;
      });

      return {
        Report_Header: ReportService.getHeaderObjectFromJSON(
          data.Report_Header
        ),
        Report_Items: reportItems,
      } as IReport;
    } catch (error) {
      const logHeader = `Processing Report Data\t`;
      // console.log(logHeader + error);
      throw logHeader + error;
    }
  }

  /**
   *  Converts a 5.1 IR report from JSON into an **IReport** object.
   * @param data
   * @returns  An **IReport** object.
   */
  static get51IRFromJSON(data: any): IReport | null {
    const reportItems: ITRIRReportItem[] = [];

    data.Report_Items.forEach((item: any) => {
      item.Items.forEach((subItem: any) => {
        const attrPerf = subItem.Attribute_Performance[0];
        const perf = attrPerf.Performance;

        Object.keys(perf).forEach((metricType: string) => {
          const monthData = perf[metricType];

          Object.keys(monthData).forEach((month: string) => {
            const year = Number(month.slice(0, 4));
            const lastDayOfMonth = new Date(
              year,
              Number(month.slice(5, 7)),
              0
            ).getDate();

            const itemID = item.Item_ID
              ? Object.entries(item.Item_ID)?.map(([Type, Value]) => ({
                  Type,
                  Value,
                }))
              : [];

            const publisherID = Object.entries(subItem.Publisher_ID)?.flatMap(
              ([Type, Values]) => Values.map((Value) => ({ Type, Value }))
            );

            const reportItem: ITRIRReportItem = {
              Title: item.Title ?? "",
              Item: subItem.Item ?? "",
              Platform: item.Platform ?? "",
              Publisher_ID: publisherID ?? "",
              Publisher: subItem.Publisher ?? "",
              Item_ID: (itemID as IItemId[]) ?? "",
              Performance: [
                {
                  Period: {
                    Begin_Date: `${month}-01`,
                    End_Date: `${month}-${lastDayOfMonth}`,
                  },
                  Instance: [
                    {
                      Metric_Type: metricType,
                      Count: monthData[month] || 0,
                    },
                  ],
                },
              ],
            };

            reportItems.push(reportItem);
          });
        });
      });
    });

    return {
      Report_Header: ReportService.getHeaderObjectFromJSON(data.Report_Header),
      Report_Items: reportItems,
    } as IReport;
  }

  /**
   * Converts an `IReport` object into a string representing the data in TSV format.
   * @throws An string error message if the conversion fails.
   */
  static convertReportToTSV(report: IReport): string {
    let tsv = "";

    try {
      // PARSE REPORT HEADERS
      const header = report.Report_Header;
      if (!header)
        throw (
          "Report Header is missing. Server send this object\t" +
          JSON.stringify(report)
        );

      const release = header.Release;

      tsv += `${THd.REPORT_NAME}\t${header.Report_Name}\n`;
      tsv += `${THd.REPORT_ID}\t${header.Report_ID}\n`;
      tsv += `${THd.RELEASE}\t${release}\n`;
      tsv += `${THd.INST_NAME}\t${header.Institution_Name}\n`;

      // Convert Institution_ID to string
      let institutionIDs = header.Institution_ID as IInstitutionId[];
      const institutionIdString = institutionIDs
        ?.map((id) => `${id.Type}:${id.Value}`)
        .join(";");

      tsv += `${THd.INST_ID}\t${institutionIdString}\n`;

      for (const headerRow of [
        THd.METRIC_TYPES,
        THd.REPORT_FILTERS,
        THd.REPORT_ATTRIBUTES,
        THd.EXCEPTIONS,
        THd.REPORTING_PERIOD,
      ]) {
        tsv += `${headerRow.toString()}\t${header[headerRow] ?? ""}\n`;
      }

      tsv += `${THd.CREATED}\t${header.Created}\n`;
      tsv += `${THd.CREATED_BY}\t${header.Created_By}\n`;

      if (release == "5.1")
        tsv += `${THd.REGISTRY_RECORD}\t${header.Registry_Record ?? ""}\n`;

      tsv += "\n";
      tsv += ReportIDTSVHeaderDict[header.Report_ID.substring(0, 2)] ?? "";
      tsv += "\t";

      const itemIdHeaders: string[] = [];

      // This collects all Item_ID types and turns them into parts of the TSV header
      report.Report_Items?.forEach((reportItem) => {
        reportItem.Item_ID?.forEach((itemID) => {
          if (!itemIdHeaders.includes(itemID.Type))
            itemIdHeaders.push(itemID.Type);
        });
      });

      if (itemIdHeaders.length) tsv += itemIdHeaders.join("\t") + "\t";
      tsv += TSVHeaderSuffix;

      // PARSE REPORT ITEMS
      const reportItems = report.Report_Items;

      if (!reportItems) return tsv;

      const uniqueMonths: Set<string> = new Set();
      report.Report_Items?.forEach((item) => {
        if (!item) return tsv;

        item.Performance?.forEach((performance) => {
          if (!performance) return tsv;

          const startDate = performance.Period.Begin_Date;
          const endDate = performance.Period.End_Date;
          const startMonth = startDate.slice(0, 7);
          const endMonth = endDate.slice(0, 7);
          uniqueMonths.add(startMonth);
          uniqueMonths.add(endMonth);
        });
      });

      const monthHeaders = Array.from(uniqueMonths).sort();
      tsv += monthHeaders.join("\t") + "\n";

      if (report.Report_Items)
        report.Report_Items?.forEach((item) => {
          if (!item || !item.Performance) return tsv;

          const metricCounts: { [metricType: string]: number[] } = {};

          if (!item.Performance) return tsv;

          item.Performance?.forEach((performance) => {
            if (!performance) return tsv;

            performance.Instance?.forEach((instance) => {
              if (!metricCounts[instance.Metric_Type]) {
                metricCounts[instance.Metric_Type] = new Array(
                  monthHeaders.length
                ).fill(0);
              }
              const startDate = performance.Period.Begin_Date;
              const endDate = performance.Period.End_Date;
              const startMonthIndex = monthHeaders.indexOf(
                startDate.slice(0, 7)
              );
              const endMonthIndex = monthHeaders.indexOf(endDate.slice(0, 7));
              const count =
                instance.Count / (endMonthIndex - startMonthIndex + 1);
              for (let i = startMonthIndex; i <= endMonthIndex; i++) {
                metricCounts[instance.Metric_Type][i] += count;
              }
            });
          });

          if (!metricCounts || !item) return tsv;

          Object.keys(metricCounts).forEach((metricType) => {
            if (!metricType) return tsv;

            let rowData = ``;

            if (header.Report_ID.includes("TR")) {
              let trItem = item as ITRReportItem;
              rowData += `${trItem.Title}\t${trItem.Publisher}\t`;

              let publisherID: IPublisherId[] | string =
                trItem.Publisher_ID || "";

              if (publisherID)
                publisherID = publisherID
                  ?.map((id: TypeValue) => `${id.Type}:${id.Value}`)
                  .join(";");

              rowData += `${publisherID}\t${trItem.Platform}\t`;
            }

            if (header.Report_ID.includes("IR")) {
              let irItem = item as ITRIRReportItem;
              rowData += `${irItem.Item}\t${irItem.Publisher}\t`;

              let publisherID: IPublisherId[] | string =
                irItem.Publisher_ID || "";

              if (publisherID)
                publisherID = publisherID
                  ?.map((id: TypeValue) => `${id.Type}:${id.Value}`)
                  .join(";");

              rowData += `${publisherID}\t${irItem.Platform}\t`;
            }

            if (header.Report_ID.includes("DR")) {
              let drItem = item as IDRReportItem;
              rowData += `${drItem.Database}\t${drItem.Publisher}\t`;

              let publisherID: IPublisherId[] | string =
                drItem.Publisher_ID || "";

              if (publisherID)
                publisherID = publisherID
                  ?.map((id: TypeValue) => `${id.Type}:${id.Value}`)
                  .join(";");

              rowData += `${publisherID}\t${drItem.Platform}\t`;
            }

            if (header.Report_ID.includes("PR")) {
              rowData += `${item.Platform}\t`;
            }

            // This will match all Item_ID values to the headers that are collected above
            itemIdHeaders?.forEach((itemIdHeader) => {
              item.Item_ID?.forEach((itemID) => {
                if (itemIdHeader == itemID.Type) rowData += itemID.Value;
              });

              rowData += `\t`;
            });

            rowData += `${metricType}\t${this.getSum(metricCounts[metricType])}\t`;
            rowData += `${metricCounts[metricType].join("\t")}\n`;

            tsv += rowData;
          });
        });

      return tsv;
    } catch (error) {
      let logMessage = `Converting Report to TSV\t`;
      logMessage += error;
      // console.log(logMessage);
      throw logMessage;
    }
  }

  /**
   * Generates a filename for a TSV file based on the report's metadata.
   * @param version The version of the COUNTER standard. 5.0 or 5.1.
   * @param vendorName The name of the vendor.
   * @param reportType The type of report.
   * @param startDate The start date of the report.
   * @param endDate The end date of the report.
   * @returns The generated filename. of the form:
   * year_data/VendorName/vendorName_ReportType_version__yyyymm-yyyymm
   * @example: 2022/ProQuest/ProQuest_JR5_5_1_202201-202202.tsv
   */
  static generateTSVFilename(
    version: CounterVersion,
    vendorName: string,
    reportType: string,
    startDate: Date,
    endDate: Date
  ): string {
    try {
      const year = startDate.getFullYear();

      const startPeriod =
        startDate.getFullYear() +
        this.padLeft((startDate.getMonth() + 1).toString(), 2, "0");

      const endPeriod =
        endDate.getFullYear() +
        this.padLeft((endDate.getMonth() + 1).toString(), 2, "0");

      vendorName = vendorName.replace(/ /g, "-");
      version = version.replace(".", "_") as CounterVersion;

      let filename = `${year}/${vendorName}/`;
      filename += `${vendorName}_${reportType}_${version}_${startPeriod}-${endPeriod}`;

      return filename;
    } catch (error) {
      let logMessage = `Generating TSV Filename\t`;
      throw logMessage + error;
    }
  }

  /**
   * Pads a string with a specified character until it reaches a target length.
   * @param str The string to pad.
   * @param targetLength The target length of the string.
   * @param padString The character to pad the string with.
   * @returns The padded string.
   * @example padLeft("123", 5, "0") => "00123"
   */
  static padLeft(str: string, targetLength: number, padString = " "): string {
    while (str.length < targetLength) {
      str = padString + str;
    }
    return str;
  }

  /**
   * Sums the values in an array of numbers.
   * @param array The array of numbers to sum.
   * @returns The sum of the numbers in the array.
   * @example getSum([1, 2, 3]) => 6
   */
  private static getSum(array: Array<number>) {
    let sum: number = 0;
    array.forEach((num) => (sum += num));
    return sum;
  }

  /**
   * Converts a JSON object into an **IReportHeader** object.
   * @param jsonHeader The JSON object to convert.
   * @returns The **IReportHeader** object.
   * @throws An error message if the conversion fail
   */
  static getHeaderObjectFromJSON(jsonHeader: any): IReportHeader {
    try {
      return {
        Report_Name: jsonHeader.Report_Name,
        Report_ID: jsonHeader.Report_ID,
        Release: jsonHeader.Release,

        Metric_Types: ReportService.getSemicolonDelimitedString(
          "Metric_Types",
          jsonHeader
        ),
        Exceptions: ReportService.getSemicolonDelimitedString(
          "Exceptions",
          jsonHeader
        ),

        // differs
        Report_Filters: ReportService.getSemicolonDelimitedString(
          "Report_Filters",
          jsonHeader
        ),
        Report_Attributes: ReportService.getSemicolonDelimitedString(
          "Report_Attributes",
          jsonHeader
        ),

        Reporting_Period: ReportService.getSemicolonDelimitedString(
          "Reporting_Period",
          jsonHeader
        ),
        Institution_Name: jsonHeader.Institution_Name,

        Institution_ID:
          jsonHeader.Release == "5"
            ? jsonHeader.Institution_ID
            : Object.keys(jsonHeader.Institution_ID)?.map((key) => ({
                Type: key,
                Value: jsonHeader.Institution_ID[key],
              })) || "",

        Created: jsonHeader.Created,
        Created_By: jsonHeader.Created_By,
        Registry_Record: jsonHeader.Registry_Record ?? "",
      } as IReportHeader;
    } catch (error) {
      let logMessage = `Getting Header Object from JSON\t`;
      logMessage += error;
      throw logMessage;
    }
  }

  /**
   * Converts a JSON object into a string of semicolon-delimited key-value pairs.
   * @param header The member of the JSON object to convert.
   * @param jsonHeader The JSON object to convert.
   * @returns The string of semicolon-delimited key-value pairs.
   */
  static getSemicolonDelimitedString(
    header: string,
    jsonHeader: { [key: string]: any }
  ): string {
    let headerValues = jsonHeader[header];
    if (!headerValues && header !== "Reporting_Period") return "";

    try {
      if (jsonHeader.Release == "5") {
        // Remove Begin_Date and End_Date from filters
        if (header === "Report_Filters")
          headerValues = headerValues.filter((filter: any) => {
            return filter.Name !== "Begin_Date" && filter.Name !== "End_Date";
          });

        // Get Reporting_Period from filters
        if (header === "Reporting_Period") {
          return jsonHeader["Report_Filters"]
            ?.filter((headerValue: NameValue) =>
              ["Begin_Date", "End_Date"].includes(headerValue.Name)
            )
            .sort((a: NameValue, b: NameValue) => a.Name.localeCompare(b.Name))
            .map(
              (headerValue: NameValue) =>
                `${headerValue.Name}=${headerValue.Value}`
            )
            .join(";");
        }

        return headerValues
          .map((headerValue: any) => {
            //
            if (header === "Exceptions") {
              let exceptionString = `${headerValue.Code}=${headerValue.Message}`;
              if (headerValue.Data) exceptionString += `(${headerValue.Data})`;

              return exceptionString;
            }

            if (Array.isArray(headerValue.Value)) {
              return `${headerValue.Name}=${(headerValue.Value as string[]).join("|")}`;
            }
            //
            else return `${headerValue.Name}=${headerValue.Value}`;
          })
          .join(";");
      }

      // Parse 5.1 Headers
      if (header === "Reporting_Period") {
        const beginDate = jsonHeader["Report_Filters"]?.Begin_Date ?? "";
        const endDate = jsonHeader["Report_Filters"]?.End_Date ?? "";

        return `Begin_Date=${beginDate};End_Date=${endDate}`;
      }

      // All other headers
      return Object.keys(headerValues)
        ?.filter(
          (headerMember) =>
            headerMember !== "Begin_Date" && headerMember !== "End_Date"
        )
        ?.map((headerMember) => {
          let result = `${headerMember}=`;
          let memberValues = jsonHeader[header][headerMember];
          if (Array.isArray(memberValues)) {
            for (let value of jsonHeader[header][headerMember]) {
              result += `${value}|`;
            }
          } else {
            result += `${memberValues}|`;
          }
          return result.slice(0, -1);
        })
        .join(";");
    } catch (error) {
      let logMessage = `Getting Semicolon Delimited String 5.1\t`;
      // console.log(logMessage, error);
      throw logMessage;
    }
  }
}

export default ReportService;
