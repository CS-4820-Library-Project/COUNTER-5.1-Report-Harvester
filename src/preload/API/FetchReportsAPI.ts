import { contextBridge, ipcRenderer } from "electron";
import { FetchData } from "src/main/services/FetchService";
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
      console.log("Getting Get Supported Reports", vendor);
      return await ipcRenderer.invoke("supported-reports", vendor);
    },
  });
};

export default FetchReportsAPI;
