/**
 * Service class for interacting with the Prisma report database.
 */
import {
  Prisma,
  PrismaClient,
  Report,
  ReportFilter,
  ReportItem,
} from "@prisma/client";
import {
  IDRReportItem,
  IReport,
  ITRIRReportItem,
} from "../../renderer/src/interface/IReport";
import { DirectorySettingService } from "./DirectorySettingService";
import { writeFile } from "../utils/files";
import { exec } from "child_process";
import { format } from "date-fns";
import * as fs from "fs";
import path from "path";

const prisma = new PrismaClient();

/**
 * Service class for interacting with the Prisma report database.
 */
export class PrismaReportService {
  /**
   * Creates a new report.
   *
   * @param data - The data for the report, excluding the id.
   * @returns A promise that resolves to the created report.
   * @throws If an error occurs while creating the report.
   */
  async createReport(
    // data
    {
      report_id,
      report_name,
      release,
      institution_name,
      institution_id,
      created,
      created_by,
    }: Omit<Report, "id">
  ): Promise<Report> {
    try {
      // console.log("STORING report", data);
      // return {} as Report;
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

  /**
   * Creates a new report filter.
   *
   * @param data - The data for the report filter, excluding the id.
   * @returns A promise that resolves to the created report filter.
   * @throws If an error occurs while creating the report filter.
   */
  async createReportFilter(
    data: Omit<ReportFilter, "id">
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

  /**
   * Creates a new report item.
   *
   * @param data - The data for the report item, excluding the id.
   * @returns A promise that resolves to the created report item.
   * @throws If an error occurs while creating the report item.
   */
  async createReportItem(data: Omit<ReportItem, "id">): Promise<ReportItem> {
    try {
      return await prisma.reportItem.create({
        data,
      });
    } catch (error) {
      console.error("Error creating report item:", error);
      throw error;
    }
  }

  /**
   * Creates a new report metric.
   *
   * @returns A promise that resolves to the created report metric.
   * @throws If an error occurs while creating the report metric.
   * @param details
   */
  async createReportMetric(details: any) {
    return prisma.reportMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType, // properly handled
      },
    });
  }

  /**
   * Retrieves a report by its id.
   *
   * @param id - The id of the report to retrieve.
   * @returns A promise that resolves to the retrieved report, or null if not found.
   * @throws If an error occurs while retrieving the report.
   */
  async getReportById(id: number): Promise<Report | null> {
    try {
      return await prisma.report.findUnique({
        where: { id },
        include: {
          ReportFilter: true,
          ReportItem: {
            include: {
              ReportMetric: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error getting report by id:", error);
      throw error;
    }
  }

  /**
   * Retrieves all reports.
   *
   * @returns A promise that resolves to an array of all reports.
   * @throws If an error occurs while retrieving the reports.
   */
  async getAllReports(): Promise<Report[]> {
    try {
      return await prisma.report.findMany({
        include: {
          ReportFilter: true,
          ReportItem: {
            include: {
              ReportMetric: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error getting all reports:", error);
      throw error;
    }
  }

  /**
   * Updates a report by its id.
   *
   * @param id - The id of the report to update.
   * @param data - The partial data to update the report with.
   * @returns A promise that resolves to the updated report, or null if not found.
   * @throws If an error occurs while updating the report.
   */
  async updateReportById(
    id: number,
    data: Partial<Report>
  ): Promise<Report | null> {
    try {
      return await prisma.report.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Error updating report by id:", error);
      throw error;
    }
  }

  /**
   * Deletes a report by its id.
   *
   * @param id - The id of the report to delete.
   * @returns A promise that resolves to the deleted report, or null if not found.
   * @throws If an error occurs while deleting the report.
   */
  async deleteReportById(id: number): Promise<Report | null> {
    try {
      return await prisma.report.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting report by id:", error);
      throw error;
    }
  }

  /**
   * This function is responsible for saving the fetched report into the database.
   * @param {Object} report - The report object that contains all the information about the report.
   * @returns {Promise<void>} - Aromise that resolves when all the report information has been saved into the database.
   */
  async saveFetchedReport(report: IReport): Promise<void> {
    const reportHeader = report.Report_Header;
    const reportItems = report.Report_Items;

    try {
      // if (!reportHeader || !reportItems) throw "Invalid report object";

      const institution_id = Array.isArray(reportHeader.Institution_ID)
        ? reportHeader.Institution_ID[0].Value
        : reportHeader.Institution_ID;

      if (!institution_id) throw "Institution ID not found";

      const savedReport = await this.createReport({
        report_id: reportHeader.Report_ID,
        report_name: reportHeader.Report_Name,
        release: reportHeader.Release,
        institution_name: reportHeader.Institution_Name || "undefined",
        institution_id,
        created: reportHeader.Created,
        created_by: reportHeader.Created_By,
      });

      for (const filter of report.Report_Header.Report_Filters) {
        if (typeof filter === "string") return;
        await this.createReportFilter({
          reportId: savedReport.id,
          filter_type: filter.Name,
          value: filter.Value,
        });
      }
      for (const rawItem of reportItems) {
        const reportItemDetails: any = {
          reportId: savedReport.id,
          platform: rawItem.Platform,
        };

        // Create TR REPORT
        if (report.Report_Header.Report_ID.includes("TR")) {
          const trItem = rawItem as ITRIRReportItem;
          reportItemDetails.title = trItem.Title;
          reportItemDetails.publisher = trItem.Publisher;
          trItem.Publisher_ID?.map((id) => `${id.Type}:${id.Value}`).join(";");
          trItem.Item_ID?.map((id) => `${id.Type}:${id.Value}`).join(";");
          reportItemDetails.doi =
            trItem.Item_ID?.find((id) => id.Type === "DOI")?.Value || null;
          reportItemDetails.isbn =
            trItem.Item_ID?.find((id) => id.Type === "ISBN")?.Value || null;
          reportItemDetails.print_issn =
            trItem.Item_ID?.find((id) => id.Type === "Print_ISSN")?.Value ||
            null;
          reportItemDetails.online_issn =
            trItem.Item_ID?.find((id) => id.Type === "Online_ISSN")?.Value ||
            null;
          reportItemDetails.uri =
            trItem.Item_ID?.find((id) => id.Type === "URI")?.Value || null;
          reportItemDetails.data_type =
            trItem.Item_ID?.find((id) => id.Type === "Data_Type")?.Value ||
            null;
        }

        // Create IR REPORT
        else if (report.Report_Header.Report_ID.includes("IR")) {
          const irItem = rawItem as ITRIRReportItem;
          reportItemDetails.title = irItem.Title;
          reportItemDetails.publisher = irItem.Publisher;
          irItem.Publisher_ID?.map((id) => `${id.Type}:${id.Value}`).join(";");
          irItem.Item_ID?.map((id) => `${id.Type}:${id.Value}`).join(";");
          reportItemDetails.doi =
            irItem.Item_ID?.find((id) => id.Type === "DOI")?.Value || null;
          reportItemDetails.isbn =
            irItem.Item_ID?.find((id) => id.Type === "ISBN")?.Value || null;
          reportItemDetails.print_issn =
            irItem.Item_ID?.find((id) => id.Type === "Print_ISSN")?.Value ||
            null;
          reportItemDetails.online_issn =
            irItem.Item_ID?.find((id) => id.Type === "Online_ISSN")?.Value ||
            null;
          reportItemDetails.uri =
            irItem.Item_ID?.find((id) => id.Type === "URI")?.Value || null;
          reportItemDetails.data_type =
            irItem.Item_ID?.find((id) => id.Type === "Data_Type")?.Value ||
            null;
        }

        // Create DR REPORT
        else if (report.Report_Header.Report_ID.includes("DR")) {
          const drItem = rawItem as IDRReportItem;
          reportItemDetails.database = drItem.Database;
          reportItemDetails.publisher = drItem.Publisher;
          drItem.Publisher_ID?.map((id) => `${id.Type}:${id.Value}`).join(";");
          drItem.Item_ID?.map((id) => `${id.Type}:${id.Value}`).join(";");
          reportItemDetails.doi =
            drItem.Item_ID?.find((id) => id.Type === "DOI")?.Value || null;
          reportItemDetails.isbn =
            drItem.Item_ID?.find((id) => id.Type === "ISBN")?.Value || null;
          reportItemDetails.print_issn =
            drItem.Item_ID?.find((id) => id.Type === "Print_ISSN")?.Value ||
            null;
          reportItemDetails.online_issn =
            drItem.Item_ID?.find((id) => id.Type === "Online_ISSN")?.Value ||
            null;
          reportItemDetails.uri =
            drItem.Item_ID?.find((id) => id.Type === "URI")?.Value || null;
          reportItemDetails.data_type =
            drItem.Item_ID?.find((id) => id.Type === "Data_Type")?.Value ||
            null;
        }

        // TODO: Gets Bugs
        console.log("Saving Report Item", reportItemDetails);
        // const savedItem = await this.createReportItem(reportItemDetails);

        // TODO: Gets Bugs
        // console.log("Saving Report Metric", rawItem.Performance);
        //   for (const performance of rawItem.Performance) {
        //     const periodString = `${performance.Period.Begin_Date} - ${performance.Period.End_Date}`;
        //     for (const instance of performance.Instance) {
        //       await this.createReportMetric({
        //         reportItemId: savedItem.id,
        //         period: periodString,
        //         value: instance.Count,
        //         metricType: instance.Metric_Type,
        //       });
        //     }
        //   }
      }
    } catch (error) {
      const errorMessage = "Storing Reports in Database\t";
      console.error(errorMessage, error);
      throw errorMessage + "Report Couldn't be saved " + typeof error ===
        "string"
        ? error
        : "";
      // +
      // JSON.stringify(reportHeader)
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
    isbn?: string
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
      (filter: any) => `${filter.filter_type}=${filter.value}`
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
    isbn?: string
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
          vendorName
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
        }
      );
    } catch (error) {
      console.error("Error while rebuilding the database:", error);
      throw error;
    }
  }

  static async exportDatabase(exportPath: string) {
    const dbFile = process.env.DATABASE_FILE || "../../../prisma/search.db";

    console.log(dbFile)

    // If the database file exists, proceed with export
    if (fs.existsSync(dbFile)) {
      try {
        const currentDate: Date = new Date();
        const formattedDate: string = format(currentDate, 'dd-MM-yyyy');

        const exportFilePath = path.join(exportPath, `CH_SearchDB_Export_${formattedDate}.db`);

        fs.copyFileSync(dbFile, exportFilePath);

        console.log(`Database exported successfully to: ${exportFilePath}`);
      } catch (error) {
        console.error("Error while exporting the database file:", error);
      }
    } else {
      console.error("Database file does not exist.");
    }
  }
}


export const prismaReportService = new PrismaReportService();
