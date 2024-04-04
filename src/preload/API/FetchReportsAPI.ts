import { contextBridge, ipcRenderer } from "electron";
import { FetchData } from "src/main/services/FetchService";
import { FetchResults } from "src/types/reports";
import { VendorData, VendorRecord } from "src/types/vendors";

const FetchReportsAPI = () => {
  /**
   * The fetch object provides methods to interact with the FetchService.
   * @module FetchReportsAPI
   */
  contextBridge.exposeInMainWorld("reports", {
    /**
     * Fetches reports from the FetchService.
     * @param {FetchData} fetchData - The data to be used to fetch reports.
     * @returns FetchResult[] - The promise object representing the result of the fetch operation
     */
    fetch: async (fetchData: FetchData) => {
      return await ipcRenderer.invoke("fetch-reports", fetchData);
    },

    /**
     * Fetches the supported reports from the FetchService.
     * @returns string[] - The promise object representing the supported reports
     */
    getSupported: async (vendor: VendorRecord | VendorData) => {
      return await ipcRenderer.invoke("supported-reports", vendor);
    },

    /**
     * Exports the fetch results.
     * @param {FetchResults} fetchResults - The fetch results to be exported.
     */
    exportFetchResults: (fetchResults: FetchResults) => {
      ipcRenderer.send("export-fetch-results", fetchResults);
    },

    /**
     * Cancels the fetch operation.
     */
    cancel: () => {
      ipcRenderer.send("cancel-fetch");
    },

    /**
     * Listens for the completion of the fetch operation for a vendor.
     * @param {Function} callback - The callback function to be executed when the fetch operation is completed.
     */
    onVendorCompleted: (callback: () => void) => {
      ipcRenderer.on("vendor-completed", callback);
    },

    /**
     * Removes the listener for the completion of the fetch operation for a vendor.
     * @param {Function} callback - The callback function to be removed.
     */
    removeVendorCompletedListeners: () => {
      ipcRenderer.removeAllListeners("vendor-completed");
    },
  });
};

export default FetchReportsAPI;
