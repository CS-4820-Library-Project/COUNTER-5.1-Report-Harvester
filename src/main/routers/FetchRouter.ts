import { ipcMain } from "electron";
import FetchService from "../services/FetchService";

const FetchRouter = () => {
  /**
   * Fetches reports from the FetchService.
   * @param {FetchData} fetchData - The data to be used to fetch reports.
   * @returns string[] - The promise object representing the result of the fetch operation
   */
  ipcMain.handle("fetch-reports", async (_, args) => {
    return await FetchService.fetchReports(args);
  });

  /**
   * Fetches the supported reports from the FetchService.
   * @returns string[] - The promise object representing the supported reports
   */
  ipcMain.handle("supported-reports", async (_, args) => {
    return await FetchService.getSupportedReports(args);
  });
};

export default FetchRouter;
