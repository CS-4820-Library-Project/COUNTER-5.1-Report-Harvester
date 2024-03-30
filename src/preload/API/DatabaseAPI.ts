// DatabaseAPI.ts
import { contextBridge, ipcRenderer } from "electron";

const DatabaseAPI = () => {
  contextBridge.exposeInMainWorld("database", {
    /**
     * Saves the fetched report to the database.
     * @param {Object} report - The fetched report to save.
     * @returns {Promise<void>} A promise that resolves when the report has been saved successfully.
     */
    saveFetchedReport: (report: any): Promise<void> => {
      return ipcRenderer.invoke("save-fetched-report", report);
    },

    /**
     * Searches for a report in the database.
     * @returns {Promise<any>} A promise that resolves with the search results.
     * @param filepath
     * @param title
     * @param issn
     * @param isbn
     */
    writeSearchedReportsToTSV: (
      title: string,
      issn: string,
      isbn: string
    ): Promise<void> => {
      return ipcRenderer.invoke("write-searched-reports-to-tsv", {
        title,
        issn,
        isbn,
      });
    },
  });
};

export default DatabaseAPI;
