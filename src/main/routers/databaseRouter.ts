// dataBaseRouter.ts
import { ipcMain } from "electron";
import {
  PrismaReportService,
  prismaReportService,
} from "../services/PrismaReportService";
import { DirectorySettingService } from "../services/DirectorySettingService";

/**
 * Handles database-related IPC events.
 */
const DatabaseRouter = () => {
  /**
   * Handles the "save-fetched-report" IPC event.
   * Saves the fetched report to the database.
   * @param _event - The IPC event object.
   * @param arg - The report to be saved.
   * @returns Promise<void>
   * @throws Error if there is an error saving the report.
   */
  ipcMain.handle("save-fetched-report", async (_event, arg) => {
    const report = arg;

    if (report !== null) {
      try {
        await prismaReportService.saveFetchedReport(report);
      } catch (error) {
        console.error("Error saving fetched report: ", error);
        throw error;
      }
    }
  });

  /**
   * Handles the "search-report" IPC event.
   * Searches for a report in the database based on the provided parameters.
   * @param _event - The IPC event object.
   * @param arg - The search parameters (title, issn, isbn).
   * @returns Promise<Report | null> - The found report, or null if not found.
   * @throws Error if there is an error searching for the report.
   */
  ipcMain.handle("write-searched-reports-to-tsv", async (_event, arg) => {
    const { title, issn, isbn } = arg;

    try {
      return await prismaReportService.writeSearchedReportsToTSV(
        title,
        issn,
        isbn,
      );
    } catch (error) {
      console.error("Error searching report: ", error);
      throw error;
    }
  });

  ipcMain.handle("rebuild-database", async (_event) => {
    try {
      await prismaReportService.rebuildDatabase();
      console.log("Database rebuild completed successfully.");
    } catch (e) {
      console.error(`Error rebuilding database: ${e}`);
      throw e;
    }
  });

  ipcMain.handle("export-database", async (_event) => {
    try {
      const path = await DirectorySettingService.getDirectoryFromUser();
      if (path && path != "") {
        await PrismaReportService.exportDatabase(path);
      }
    } catch (e) {
      console.log(`Error exporting database: ${e}`);
      throw e;
    }
  });
};

export default DatabaseRouter;
