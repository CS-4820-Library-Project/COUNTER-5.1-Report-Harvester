import { BrowserWindow, ipcMain } from "electron";
import FetchService from "../services/FetchService";

const FetchRouter = (mainWindow: BrowserWindow) => {
  /**
   * Fetches reports from the FetchService.
   * @param {FetchData} fetchData - The data to be used to fetch reports.
   * @returns string[] - The promise object representing the result of the fetch operation
   */
  ipcMain.handle("fetch-reports", async (_, fetchData) => {
    return await FetchService.fetchReports(fetchData, mainWindow);
  });

  /**
   * Fetches the supported reports from the FetchService.
   * @returns string[] - The promise object representing the supported reports
   */
  ipcMain.handle("supported-reports", async (_, args) => {
    return await FetchService.getSupportedReports(args);
  });

  /**
   * Opens a dialog to export results and writtes a tsv file from the fetch results.
   * @param {FetchResults} fetchResults - The fetch results to be exported.
   * @returns void
   */
  ipcMain.on("export-fetch-results", (_, fetchResults) => {
    FetchService.exportResults(fetchResults);
  });
};

export default FetchRouter;
