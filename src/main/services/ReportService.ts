import {
  IDRReportItem,
  IPerformance,
  IReport,
  IReportFilter,
  IReportHeader,
  IReportItem,
  ITRIRReportItem,
} from "../../renderer/src/interface/IReport";
import {
  ReportIDTSVHeaderDict,
  TRItemIdHeaders,
  TSVHeaders as THd,
} from "../../renderer/src/const/TSVStrings";
import { CounterVersion } from "../../renderer/src/const/CounterVersion";

/** The main service for cleansing, coercing, and analyzing Reports from SUSHI APIs. */

export class ReportService {
  /** Converts a 5.0 report from JSON into an **IReport** object. */

  static get50ReportFromJSON(data: any): IReport | null {
    return data as IReport;
  }

  /** Converts a 5.1 report from JSON into an **IReport** object. */

  static get51ReportFromJson(data: any): IReport | null {
    try {
      if (data.Report_Header.Report_ID.includes("IR"))
        return ReportService.get51IRFromJSON(data); // direct call to self as `this` is lost in promise

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
          Performance: Array.from(performanceMap.values()),
        };

        if (reportId.includes("TR")) {
          const trItem = item as ITRIRReportItem;
          reportItem["Title"] = trItem.Title;
          reportItem["Publisher_ID"] = Object.keys(trItem.Publisher_ID)?.map(
            (key) => ({
              Type: key,
              Value: trItem.Publisher_ID[key],
            })
          );
          reportItem["Publisher"] = trItem.Publisher;
          reportItem["Item_ID"] = Object.keys(trItem.Item_ID)?.map((key) => ({
            Type: key,
            Value: trItem.Item_ID[key],
          }));
        } else if (reportId.includes("IR")) {
          const irItem = item as ITRIRReportItem;
          reportItem["Title"] = irItem.Title;
          reportItem["Item_ID"] = [
            { Type: "DOI", Value: irItem.Item_ID["DOI"] },
            { Type: "YOP", Value: irItem.Item_ID["YOP"] },
          ];
        } else if (reportId.includes("DR")) {
          const drItem = item as IDRReportItem;
          reportItem["Database"] = drItem.Database;
          reportItem["Publisher"] = drItem.Publisher;
          reportItem["Publisher_ID"] = Object.keys(drItem.Publisher_ID)?.map(
            (key) => ({
              Type: key,
              Value: drItem.Publisher_ID[key],
            })
          );
          reportItem["Item_ID"] = Object.keys(drItem.Item_ID)?.map((key) => ({
            Type: key,
            Value: drItem.Item_ID[key],
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
      const logHeader = `\tProcessing Report Data\t`;
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
              Title: item.Title,
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

  /** Converts an `IReport` object into a string representing the data in TSV format. */

  static convertReportToTSV(report: IReport): string {
    let tsv = "";

    try {
      const header = report.Report_Header;
      tsv += `${THd.REPORT_NAME}\t${header.Report_Name}\n`;
      tsv += `${THd.REPORT_ID}\t${header.Report_ID}\n`;
      tsv += `${THd.RELEASE}\t${header.Release}\n`;
      tsv += `${THd.INST_NAME}\t${header.Institution_Name}\n`;

      const institutionIDs = header.Institution_ID?.map(
        (id) => `${id.Type}:${id.Value}`
      ).join(";");

      tsv += `${THd.INST_ID}\t${institutionIDs}\n`;

      if (header.Release == "5.1") {
        tsv += `${THd.METRIC_TYPES}\t${header.Metric_Types}\n`;
        tsv += `${THd.REPORT_FILTERS}\t${header.Report_Filters ?? "undefined"}\n`;
        tsv += `${THd.REPORT_ATTRIBUTES}\t${header.Report_Attributes ?? "undefined"}\n`;
        tsv += `${THd.EXCEPTIONS}\t${header.Exceptions ?? "undefined"}\n`;
        tsv += `${THd.REPORTING_PERIOD}\t${header.Reporting_Period ?? "undefined"}\n`;
      } else {
        const filtersArray = header.Report_Filters as IReportFilter[];
        const reportFilters = filtersArray
          ?.map((filter) => `${filter.Name}=${filter.Value}`)
          .join(";");
        tsv += `${THd.REPORT_FILTERS}\t${reportFilters}\n`;
      }

      tsv += `${THd.CREATED}\t${header.Created}\n`;
      tsv += `${THd.CREATED_BY}\t${header.Created_By}\n`;

      if (header.Release == "5.1")
        tsv += `${THd.REGISTRY_RECORD}\t${header.Registry_Record ?? ""}\n`;

      tsv += "\n";

      tsv += ReportIDTSVHeaderDict[header.Report_ID.substring(0, 2)] ?? "";

      const uniqueMonths: Set<string> = new Set();
      report.Report_Items.forEach((item) => {
        item.Performance.forEach((performance) => {
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

      report.Report_Items.forEach((item) => {
        const metricCounts: { [metricType: string]: number[] } = {};
        item.Performance.forEach((performance) => {
          performance.Instance.forEach((instance) => {
            if (!metricCounts[instance.Metric_Type]) {
              metricCounts[instance.Metric_Type] = new Array(
                monthHeaders.length
              ).fill(0);
            }
            const startDate = performance.Period.Begin_Date;
            const endDate = performance.Period.End_Date;
            const startMonthIndex = monthHeaders.indexOf(startDate.slice(0, 7));
            const endMonthIndex = monthHeaders.indexOf(endDate.slice(0, 7));
            const count =
              instance.Count / (endMonthIndex - startMonthIndex + 1);
            for (let i = startMonthIndex; i <= endMonthIndex; i++) {
              metricCounts[instance.Metric_Type][i] += count;
            }
          });
        });

        Object.keys(metricCounts).forEach((metricType) => {
          let rowData = ``;

          if (header.Report_ID.includes("TR")) {
            let trItem = item as ITRIRReportItem;
            rowData += `${trItem.Title}\t${trItem.Publisher}\t`;
            const publisherIDs = trItem.Publisher_ID?.map(
              (id) => `${id.Type}:${id.Value}`
            ).join(";");
            rowData += `${publisherIDs}\t${trItem.Platform}\t`;

            const itemIDs = trItem.Item_ID.reduce(
              (acc: { [key: string]: string }, id) => {
                if (
                  TRItemIdHeaders?.map((h) => h as string).includes(id.Type)
                ) {
                  acc[id.Type] = id.Value;
                }
                return acc;
              },
              {}
            );

            TRItemIdHeaders.forEach(
              (header) => (rowData += `${itemIDs[header] || ``}\t`)
            );
          }

          if (header.Report_ID.includes("IR")) {
            const irItem = item as ITRIRReportItem;
            if (Array.isArray(irItem.Item_ID)) {
              const doi =
                irItem.Item_ID.find((id) => id.Type === THd.DOI)?.Value || "";
              const yop =
                irItem.Item_ID.find((id) => id.Type === THd.YOP)?.Value || "";
              rowData += `${irItem.Title}\t${irItem.Platform}\t${doi}\t${yop}`;
            } else {
              rowData += `${irItem.Title}\t${irItem.Platform}\t\t`;
            }
          }

          if (header.Report_ID.includes("DR")) {
            const drItem = item as IDRReportItem;
            const propId =
              drItem.Item_ID.find((id) => id.Type === THd.PROPRIETARY_ID)
                ?.Value || "";
            rowData += `${drItem.Database}\t${drItem.Platform}\t${propId}\t`;
          }

          if (header.Report_ID.includes("PR")) {
            rowData += `${item.Platform}\t`;
          }

          rowData += `${metricType}\t${this.getSum(metricCounts[metricType])}\t`;
          rowData += `${metricCounts[metricType].join("\t")}\n`;

          tsv += rowData;
        });
      });

      return tsv;
    } catch (error) {
      let logMessage = `\tConverting Report to TSV\t`;
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
      let logMessage = `\tGenerating TSV Filename\t`;
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
    let header = {
      Report_Name: jsonHeader.Report_Name,
      Report_ID: jsonHeader.Report_ID,
      Release: jsonHeader.Release,
      Institution_Name: jsonHeader.Institution_Name,
      Institution_ID: Object.keys(jsonHeader.Institution_ID)?.map((key) => ({
        Type: key,
        Value: jsonHeader.Institution_ID[key],
      })),
      Report_Filters: Object.keys(jsonHeader.Report_Filters)?.map((key) => ({
        Name: key,
        Value: jsonHeader.Report_Filters[key],
      })),
      Created: jsonHeader.Created,
      Created_By: jsonHeader.Created_By,
    } as IReportHeader;

    if (header.Release == "5.1") {
      for (let member of [
        "Report_Filters",
        "Metric_Types",
        "Report_Attributes",
        "Exceptions",
        "Reporting_Period",
      ]) {
        if (jsonHeader[member]) {
          console.log(`${member}: ${jsonHeader[member]}`);
          header[member] = ReportService.getSemicolonDelimitedString(
            member,
            jsonHeader
          );
        }
      }

      if (jsonHeader.Registry_Record) {
        header["Registry_Record"] = jsonHeader.Registry_Record;
      }
    }

    return header;
  }

  static getSemicolonDelimitedString(member, jsonHeader): string {
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
