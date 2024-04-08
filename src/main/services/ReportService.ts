import {
  IDRReportItem,
  IInstitutionId,
  IPerformance,
  IReport,
  IReportHeader,
  IReportItem,
  ITRIRReportItem,
} from "../../renderer/src/interface/IReport";
import {
  ReportIDTSVHeaderDict,
  TSVHeaders as THd,
  TSVHeaderSuffix,
} from "../../renderer/src/const/TSVStrings";
import { CounterVersion } from "../../renderer/src/const/CounterVersion";
import { json } from "express";
import { Count } from "@prisma/client/runtime/library";

/** The main service for cleansing, coercing, and analyzing Reports from SUSHI APIs. */

export class ReportService {
  /** Converts a 5.0 report from JSON into an **IReport** object. */

  static get50ReportFromJSON(data: any): IReport | null {
    if (!(data && data.Report_Header && data.Report_Items)) {
      return null;
    }
    return {
      Report_Header: ReportService.getHeaderObjectFromJSON(data.Report_Header),
      Report_Items: data.Report_Items.map(reportItem => {
        if (data.Report_Header.Report_ID.includes("IR")) {
          reportItem.Title = reportItem["Item"]
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

        const reportItem: IReportItem = {
          Platform: item.Platform,
          Item_ID: item.Item_ID,
          Performance: Array.from(performanceMap.values()),
        };

        // Process TR Report
        if (reportId.includes("TR")) {
          const reportItem = item as ITRIRReportItem;
          const trItem = item as ITRIRReportItem;

          reportItem["Title"] = trItem.Title;
          reportItem["Publisher_ID"] = Object.keys(trItem.Publisher_ID)?.map(
            (key) => ({
              Type: key,
              Value: trItem.Publisher_ID[
                key as unknown as number
              ] as unknown as string,
            })
          );
          reportItem["Publisher"] = trItem.Publisher;
          reportItem["Item_ID"] = Object.keys(trItem.Item_ID)?.map((key) => ({
            Type: key,
            Value: trItem.Item_ID[key]
          }));
        }
        // Process IR Report
        else if (reportId.includes("IR")) {
          const irItem = item as ITRIRReportItem;
          const reportItem = item as ITRIRReportItem;

          reportItem["Title"] = irItem.Title;

          reportItem["Item_ID"] = Object.keys(irItem.Item_ID)?.map((key) => ({
            Type: key,
            Value: irItem.Item_ID[key]
          }));
        }
        // Process DR Report
        else if (reportId.includes("DR")) {
          const drItem = item as IDRReportItem;
          const reportItem = item as IDRReportItem;

          reportItem["Database"] = drItem.Database;
          reportItem["Publisher"] = drItem.Publisher;
          reportItem["Publisher_ID"] = Object.keys(drItem.Publisher_ID)?.map(
            (key) => ({
              Type: key,
              Value: drItem.Publisher_ID[key]
            })
          );
          reportItem["Item_ID"] = Object.keys(drItem.Item_ID)?.map((key) => ({
            Type: key,
            Value: drItem.Item_ID[key]
          }));
        }

        return reportItem;
      });

      return {
        Report_Header: ReportService.getHeaderObjectFromJSON(
          data.Report_Header
        ), // direct call to self as `this` is lost in promise
        Report_Items: reportItems,
      } as IReport;
    } catch (error) {
      const logHeader = `Processing Report Data\t`;
      console.log(logHeader + error);
      throw logHeader + error;
    }
  }

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

            const reportItem: ITRIRReportItem = {
              Title: item.Item,
              Platform: item.Platform ?? "",
              Publisher_ID: subItem.Publisher_ID,
              Publisher: subItem.Publisher,
              Item_ID: item.Item_ID,
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
      Report_Header: ReportService.getHeaderObjectFromJSON(data.Report_Header), // direct call to self as `this` is lost in promise
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

      console.log(JSON.stringify(report.Report_Header));
      const header = report.Report_Header;
      if (!header)
        throw (
          "Report Header is missing. Server send this object\t" +
          JSON.stringify(report)
        );

      tsv += `${THd.REPORT_NAME}\t${header.Report_Name}\n`;
      tsv += `${THd.REPORT_ID}\t${header.Report_ID}\n`;
      tsv += `${THd.RELEASE}\t${header.Release}\n`;
      tsv += `${THd.INST_NAME}\t${header.Institution_Name}\n`;

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
      tsv += `${THd.REGISTRY_RECORD}\t${header.Registry_Record ?? ""}\n`;
      tsv += "\n";
      tsv += ReportIDTSVHeaderDict[header.Report_ID.substring(0, 2)] ?? "";
      tsv += "\t"

      const itemIdHeaders: string[] = [];

      // This collects all Item_ID types and turns them into parts of the TSV header
      report.Report_Items.forEach(reportItem => {
        reportItem.Item_ID.forEach(itemID => {
          if (!itemIdHeaders.includes(itemID.Type))
            itemIdHeaders.push(itemID.Type);
        });
      });

      tsv += itemIdHeaders.join("\t") + "\t";
      tsv += TSVHeaderSuffix;



      // PARSE REPORT ITEMS
      const reportItems = report.Report_Items;

      if (!reportItems) return tsv;

      const uniqueMonths: Set<string> = new Set();
      report.Report_Items.forEach((item) => {
        if (!item) return tsv;

        item.Performance.forEach((performance) => {
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
        report.Report_Items.forEach((item) => {
          if (!item || !item.Performance) return tsv;

          const metricCounts: { [metricType: string]: number[] } = {};

          if (!item.Performance) return tsv;

          item.Performance.forEach((performance) => {
            if (!performance) return tsv;

            performance.Instance.forEach((instance) => {
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
              let trItem = item as ITRIRReportItem;
              rowData += `${trItem.Title}\t${trItem.Publisher}\t`;

              const publisherIDs = trItem.Publisher_ID?.map(
                (id) => `${id.Type}:${id.Value}`
              ).join(";");
              rowData += `${publisherIDs}\t${trItem.Platform}\t`;
            }

            if (header.Report_ID.includes("IR")) {
              let irItem = item as ITRIRReportItem;
              rowData += `${irItem.Title}\t${irItem.Publisher}\t`;

              const publisherIDs = irItem.Publisher_ID?.map(
                  (id) => `${id.Type}:${id.Value}`
              ).join(";");
              rowData += `${publisherIDs}\t${irItem.Platform}\t`;
            }

            if (header.Report_ID.includes("DR")) {
              let drItem = item as IDRReportItem;
              rowData += `${drItem.Database}\t${drItem.Publisher}\t`;

              const publisherIDs = drItem.Publisher_ID?.map(
                  (id) => `${id.Type}:${id.Value}`
              ).join(";");
              rowData += `${publisherIDs}\t${drItem.Platform}\t`;
            }

            if (header.Report_ID.includes("PR")) {
              rowData += `${item.Platform}\t`;
            }

            // This will match all Item_ID values to the headers that are collected above
            itemIdHeaders.forEach(itemIdHeader => {
              item.Item_ID.forEach(itemId => {
                if (itemIdHeader == itemId.Type) {
                  rowData += itemId.Value;
                }
              })
              rowData += `\t`;
            })

            rowData += `${metricType}\t${this.getSum(metricCounts[metricType])}\t`;
            rowData += `${metricCounts[metricType].join("\t")}\n`;

            tsv += rowData;
          });
        });

      return tsv;
    } catch (error) {
      let logMessage = `Converting Report to TSV\t`;
      logMessage += error;
      console.log(logMessage);
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

  static getHeaderObjectFromJSON(jsonHeader: any): IReportHeader {
    return {
      Report_Name: jsonHeader.Report_Name,
      Report_ID: jsonHeader.Report_ID,
      Release: jsonHeader.Release,
      Report_Filters: ReportService.getSemicolonDelimitedString(
        "Report_Filters",
        jsonHeader
      ),
      Metric_Types: ReportService.getSemicolonDelimitedString(
        "Metric_Types",
        jsonHeader
      ),
      Report_Attributes: ReportService.getSemicolonDelimitedString(
        "Report_Attributes",
        jsonHeader
      ),
      Exceptions: ReportService.getSemicolonDelimitedString(
        "Exceptions",
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
            })),
      Created: jsonHeader.Created,
      Created_By: jsonHeader.Created_By,
      Registry_Record: jsonHeader.Registry_Record ?? "",
    } as IReportHeader;
  }

  static getSemicolonDelimitedString(
    member: string,
    jsonHeader: { [key: string]: any }
  ): string {
    if (!jsonHeader[member]) return "";

    if (jsonHeader.Release == "5") {
      return jsonHeader[member]
        .map((filter) => {
          if (Array.isArray(filter.Value)) {
            return `${filter.Name}=${(filter.Value as string[]).join("|")}`;
          } else {
            return `${filter.Name}=${filter.Value}`;
          }
        })
        .join(";");
    }

    return Object.keys(jsonHeader[member])
      ?.map((key) => {
        let result = `${key}=`;
        let memberValue = jsonHeader[member][key];
        if (Array.isArray(memberValue)) {
          for (let value of jsonHeader[member][key]) {
            result += `${value}|`;
          }
        } else {
          result += `${memberValue}|`;
        }
        return result.slice(0, -1);
      })
      .join(";");
  }
}

export default ReportService;
