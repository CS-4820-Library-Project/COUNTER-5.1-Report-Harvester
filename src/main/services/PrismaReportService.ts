import {
  PR_Item,
  PR_ItemMetric,
  PR_P1_Item,
  PR_P1_ItemMetric,
  Prisma,
  PrismaClient,
  Report,
  ReportFilter,
  TR_Item,
  TR_ItemMetric,
} from "@prisma/client";
import {
  IDRReportItem,
  IReport,
  ITRIRReportItem,
} from "src/renderer/src/interface/IReport";
import { DirectorySettingService } from "./DirectorySettingService";
import { writeFile } from "../utils/files";
import { exec } from "child_process";
import { format } from "date-fns";
import * as fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export class PrismaReportService {
  async createReport({
    report_id,
    report_name,
    release,
    institution_name,
    institution_id,
    created,
    created_by,
  }: Omit<Report, "id">): Promise<Report> {
    try {
      return await prisma.report.create({
        data: {
          report_id,
          report_name,
          release,
          institution_name,
          institution_id,
          created,
          created_by,
        },
      });
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  async createReportFilter(
    data: Omit<ReportFilter, "id">,
  ): Promise<ReportFilter> {
    try {
      return await prisma.reportFilter.create({
        data,
      });
    } catch (error) {
      console.error("Error creating report filter:", error);
      throw error;
    }
  }

  async createPRItem(data: Omit<PR_Item, "id">): Promise<PR_Item> {
    try {
      const { reportId, platform, metricType, periodTotal } = data;

      return await prisma.pR_Item.create({
        data: {
          reportId,
          platform,
          metricType,
          periodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  async createPRItemMetric(details: Omit<PR_ItemMetric, "id">) {
    return prisma.pR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  async createPRP1Item(data: Omit<PR_P1_Item, "id">): Promise<PR_P1_Item> {
    try {
      const { reportId, platform, metricType, reportingPeriodTotal } = data;

      return await prisma.pR_P1_Item.create({
        data: {
          reportId,
          platform,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  async createPRP1ItemMetric(details: Omit<PR_P1_ItemMetric, "id">) {
    return prisma.pR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  async createTRItem(data: Omit<TR_Item, "id">): Promise<TR_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  async createTRItemMetric(details: Omit<TR_ItemMetric, "id">) {
    return prisma.tR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * This function is responsible for saving the fetched report into the database.
   * @param {Object} report - The report object that contains all the information about the report.
   * @returns {Promise<void>} - A promise that resolves when all the report information has been saved into the database.
   */
  async saveFetchedReport(report: IReport): Promise<void> {
    try {
      const savedReport = await this.createReport({
        report_id: report.Report_Header.Report_ID,
        report_name: report.Report_Header.Report_Name,
        release: report.Report_Header.Release,
        institution_name: report.Report_Header.Institution_Name || "undefined",
        institution_id:
          report.Report_Header.Institution_ID[0].Type +
          ":" +
          report.Report_Header.Institution_ID[0].Value,
        created: report.Report_Header.Created,
        created_by: report.Report_Header.Created_By,
      });

      for (const filter of report.Report_Header.Report_Filters) {
        if (typeof filter === "string") return;
        await this.createReportFilter({
          reportId: savedReport.id,
          filter_type: filter.Name,
          value: filter.Value,
        });
      }

      if (report.Report_Header.Report_ID == "PR") {
        for (const rawItem of report.Report_Items) {
          const reportItemDetails: any = {
            reportId: savedReport.id,
            platform: rawItem.Platform,
          };
          const metricCounts = new Map<string, number>();
          const metricPeriods = new Map<
            string,
            Array<{ period: string; value: number }>
          >();

          for (let i = 0; i < rawItem.Performance.length; i++) {
            const period = `${rawItem.Performance[i].Period.Begin_Date} - ${rawItem.Performance[i].Period.End_Date}`;

            for (let j = 0; j < rawItem.Performance[i].Instance.length; j++) {
              const metricType = rawItem.Performance[i].Instance[j].Metric_Type;

              const count = rawItem.Performance[i].Instance[j].Count;

              if (metricCounts.has(metricType)) {
                const currCount = metricCounts.get(metricType);
                metricCounts.set(metricType, (currCount ?? 0) + count);
              } else {
                metricCounts.set(metricType, count);
              }

              if (metricPeriods.has(metricType)) {
                metricPeriods.get(metricType)?.push({ period, value: count });
              } else {
                metricPeriods.set(metricType, [{ period, value: count }]);
              }
            }
          }

          for (const [metricType, periodTotal] of metricCounts.entries()) {
            const reportId = reportItemDetails.reportId;
            const platform = rawItem.Platform;

            const pr_item = await this.createPRItem({
              reportId,
              platform,
              metricType,
              periodTotal,
            });

            const periodsValues = metricPeriods.get(metricType);

            if (periodsValues) {
              for (const { period, value } of periodsValues) {
                await this.createPRItemMetric({
                  reportItemId: pr_item.id,
                  metricType,
                  period,
                  value,
                });
              }
            }
          }
        }
      } else if (report.Report_Header.Report_ID == "PR_P1") {
        console.log("PR P1 Report");
        for (const rawItem of report.Report_Items) {
          const reportItemDetails: any = {
            reportId: savedReport.id,
            platform: rawItem.Platform,
          };
          const metricCounts = new Map<string, number>();
          const metricPeriods = new Map<
            string,
            Array<{ period: string; value: number }>
          >();

          for (let i = 0; i < rawItem.Performance.length; i++) {
            const period = `${rawItem.Performance[i].Period.Begin_Date} - ${rawItem.Performance[i].Period.End_Date}`;

            for (let j = 0; j < rawItem.Performance[i].Instance.length; j++) {
              const metricType = rawItem.Performance[i].Instance[j].Metric_Type;

              const count = rawItem.Performance[i].Instance[j].Count;

              if (metricCounts.has(metricType)) {
                const currCount = metricCounts.get(metricType);
                metricCounts.set(metricType, (currCount ?? 0) + count);
              } else {
                metricCounts.set(metricType, count);
              }

              if (metricPeriods.has(metricType)) {
                metricPeriods.get(metricType)?.push({ period, value: count });
              } else {
                metricPeriods.set(metricType, [{ period, value: count }]);
              }
            }
          }

          for (const [metricType, periodTotal] of metricCounts.entries()) {
            const reportId = reportItemDetails.reportId;
            const platform = rawItem.Platform;

            const pr_item = await this.createPRItem({
              reportId,
              platform,
              metricType,
              periodTotal,
            });

            const periodsValues = metricPeriods.get(metricType);

            if (periodsValues) {
              for (const { period, value } of periodsValues) {
                await this.createPRP1ItemMetric({
                  reportItemId: pr_item.id,
                  metricType,
                  period,
                  value,
                });
              }
            }
          }
        }
      }

      if (report.Report_Header.Report_ID == "TR") {
        for (const rawItem of report.Report_Items) {
          const trItem = rawItem as ITRIRReportItem;
          let reportItemDetails: any = {
            reportId: savedReport.id,
            title: trItem.Title,
            publisher: trItem.Publisher,
            publisherId: trItem.Publisher_ID.map(
              (id) => `${id.Type}:${id.Value}`,
            ).join(";"),
            platform: trItem.Platform,
            doi: trItem.Item_ID.find((id) => id.Type === "DOI")?.Value || null,
            yop: trItem.Item_ID.find((id) => id.Type === "YOP")?.Value || null,
            proprietaryId:
              trItem.Item_ID.find((id) => id.Type === "Proprietary")?.Type +
                ":" +
                trItem.Item_ID.find((id) => id.Type === "Proprietary")?.Value ||
              null,
            isbn:
              trItem.Item_ID.find((id) => id.Type === "ISBN")?.Value || null,
            printIssn:
              trItem.Item_ID.find((id) => id.Type === "Print_ISSN")?.Value ||
              null,
            onlineIssn:
              trItem.Item_ID.find((id) => id.Type === "Online_ISSN")?.Value ||
              null,
            uri: trItem.Item_ID.find((id) => id.Type === "URI")?.Value || null,
            dataType:
              trItem.Item_ID.find((id) => id.Type === "Data_Type")?.Value ||
              null,
          };

          const metricCounts = new Map<string, number>();
          const metricPeriods = new Map<
            string,
            Array<{ period: string; value: number }>
          >();

          for (let i = 0; i < rawItem.Performance.length; i++) {
            const period = `${rawItem.Performance[i].Period.Begin_Date} - ${rawItem.Performance[i].Period.End_Date}`;

            for (let j = 0; j < rawItem.Performance[i].Instance.length; j++) {
              const metricType = rawItem.Performance[i].Instance[j].Metric_Type;
              const count = rawItem.Performance[i].Instance[j].Count;

              if (metricCounts.has(metricType)) {
                const currCount = metricCounts.get(metricType);
                metricCounts.set(metricType, (currCount ?? 0) + count);
              } else {
                metricCounts.set(metricType, count);
              }

              if (metricPeriods.has(metricType)) {
                metricPeriods.get(metricType)?.push({ period, value: count });
              } else {
                metricPeriods.set(metricType, [{ period, value: count }]);
              }
            }
          }

          for (const [
            metricType,
            reportingPeriodTotal,
          ] of metricCounts.entries()) {
            reportItemDetails["metricType"] = metricType;
            reportItemDetails["reportingPeriodTotal"] = reportingPeriodTotal;
            const tr_item = await this.createTRItem(reportItemDetails);

            const periodsValues = metricPeriods.get(metricType);
            if (periodsValues) {
              for (const { period, value } of periodsValues) {
                await this.createTRItemMetric({
                  reportItemId: tr_item.id,
                  metricType,
                  period,
                  value,
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.log("There was an error while saving reports:", error);
      throw new Error("Failed to save report.");
    }
  }

  /**
   * This function is responsible for retrieving reports stored in database.
   * @param title - The title of the report to search for.
   * @param issn - The ISSN of the report to search for.
   * @param isbn - The ISBN of the report to search for.
   * @returns {Promise<Report[]>} - A promise that resolves to an array of reports that match the search criteria.
   */
  async searchReport(
    title?: string,
    issn?: string,
    isbn?: string,
  ): Promise<Report[]> {
    try {
      let whereClause: Prisma.ReportItemWhereInput = {};

      if (title) {
        whereClause.title = {
          contains: title.toLowerCase(),
        };
      } else if (issn) {
        whereClause.OR = [
          { online_issn: { contains: issn.toLowerCase() } },
          { print_issn: { contains: issn.toLowerCase() } },
        ];
      } else if (isbn) {
        whereClause.isbn = {
          contains: isbn.toLowerCase(),
        };
      }

      // Get the report items that match our where clause
      const reportItems = await prisma.reportItem.findMany({
        where: whereClause,
        include: {
          report: {
            include: {
              ReportItem: {
                include: {
                  ReportMetric: true, // Include linked ReportMetric
                },
              },
              ReportFilter: true, // Include linked ReportFilter
            },
          },
        },
      });

      return reportItems?.map((item) => item.report);
    } catch (error) {
      console.error("Error searching reports:", error);
      throw error;
    }
  }

  /**
   * Converts a JS report into a TSV string.
   * @param report
   * @returns tsv string.
   */
  async convertReportToTSV(report: any): Promise<string> {
    let tsv = "";

    /* Headers */
    tsv += `Report_Name\t${report.report_name}\n`;
    tsv += `Report_ID\t${report.report_id}\n`;
    tsv += `Release\t${report.release}\n`;
    tsv += `Institution_Name\t${report.institution_name}\n`;
    tsv += `Institution_ID\t${report.institution_id}\n`;

    /* Report Filters */
    const reportFilters = report.ReportFilter?.map(
      (filter: any) => `${filter.filter_type}=${filter.value}`,
    ).join(";");
    tsv += `Report_Filters\t${reportFilters}\n`;

    tsv += `Created\t${report.created}\n`;
    tsv += `Created_By\t${report.created_by}\n`;
    tsv += "\n";

    tsv += `Title\tPublisher\tPublisher_ID\tPlatform\tDOI\tYOP\tProprietary_ID\tISBN\tPrint_ISSN\tOnline_ISSN\tURI\tData_Type\tMetric_Type\n`;

    /* Report_Items */
    report.ReportItem.forEach((item: any) => {
      if (report.report_id.includes("TR")) {
        item.ReportMetric.forEach((metric: any) => {
          tsv += `${item.title}\t${item.publisher}\t${item.publisher_id}\t${item.platform}\t${item.doi}\t${item.proprietary_id}\t${item.isbn}\t${item.print_issn}\t${item.online_issn}\t${item.uri}\t${item.data_type}\t${metric.metricType}\t${metric.value}\n`;
        });
        tsv += "\n";
      }
    });

    return tsv;
  }

  /**
   * This function is responsible for writing the TSV file to the file system.
   * @param tsv - The TSV content to write to the file.
   * @param fileName - The name of the file to write the TSV content to.
   * @returns {Promise<void>} - A promise that resolves when the TSV content has been written to the file.
   */
  async writeTSVToFile(tsv: string, fileName: string): Promise<void> {
    const dirService = new DirectorySettingService();
    const filePath = dirService.getPath("search", `${fileName}.tsv`);

    writeFile(filePath, tsv);
  }

  /**
   * This function is responsible for writing the searched reports to a TSV file.
   * @param title - The title of the report to search for.
   * @param issn - The ISSN of the report to search for.
   * @param isbn - The ISBN of the report to search for.
   * @returns {Promise<Report[]>} - A promise that resolves to an array of reports that match the search criteria.
   */
  async writeSearchedReportsToTSV(
    title?: string,
    issn?: string,
    isbn?: string,
  ): Promise<Report[]> {
    const reports = await this.searchReport(title, issn, isbn);

    console.log("Search Reports: \n", reports.length);

    let total = 0;

    for (const report of reports) {
      if (report) {
        const tsv = this.convertReportToTSV(report);
        const vendorName = report.institution_id.split(":")[0];

        const fileName = this.generateSearchFilename(
          title || issn || isbn || "",
          vendorName,
        );
        await this.writeTSVToFile(await tsv, fileName);
        total++;
      }
    }

    console.log("Total : ", total);
    return reports;
  }

  /**
   * This function is responsible for generating a filename for the search results.
   * @param query = The search query used to generate the filename.
   * @param vendorName = The name of the vendor who provided the report.
   * @returns {string} - The generated filename for the search results.
   * @example generateSearchFilename("test query", "ACS") => "test_query_results:acs_20210810120000"
   */
  private generateSearchFilename(query: string, vendorName: string) {
    let filename = query.replace(/ /g, "_") + "_";
    filename += vendorName.toLowerCase() + "_";
    filename += format(new Date(), "yyyyMMddHHmmss");

    return filename;
  }

  // rebuilding database
  async rebuildDatabase() {
    // specify the database file
    const dbFile = process.env.DATABASE_FILE || "../../../prisma/search.db";

    // if the database file exists, delete the file
    if (fs.existsSync(dbFile)) {
      try {
        await fs.promises.unlink(dbFile);
        console.log("Previous database file deleted.");
      } catch (error) {
        console.error("Error while deleting the database file:", error);
      }
    }

    // re-run the prisma migrations, which will create a new database file and apply the schema
    try {
      exec(
        "npx prisma migrate dev --rebuild-database",
        (error, stdout, stderr) => {
          if (error) {
            console.error("Error while running Prisma migrate:", error);
            throw error;
          } else if (stderr) {
            console.warn("Warnings during Prisma migrate:", stderr);
          } else {
            console.log("Prisma migrate output:", stdout);
          }
        },
      );
    } catch (error) {
      console.error("Error while rebuilding the database:", error);
      throw error;
    }
  }

  static async exportDatabase(exportPath: string) {
    const dbFile = process.env.DATABASE_FILE || "../../prisma/search.db";

    const dbPath = path.join(__dirname, dbFile);

    if (fs.existsSync(dbPath)) {
      try {
        const currentDate: Date = new Date();
        const formattedDate: string = format(currentDate, "dd-MM-yyyy");

        const exportFilePath = path.join(
          exportPath,
          `CH_SearchDB_Export_${formattedDate}.db`,
        );

        fs.copyFileSync(dbPath, exportFilePath);

        console.log(`Database exported successfully to: ${exportFilePath}`);
      } catch (error) {
        console.error("Error while exporting the database file:", error);
      }
    } else {
      console.error("Database file does not exist. ", dbPath);
    }
  }
}

export const prismaReportService = new PrismaReportService();
