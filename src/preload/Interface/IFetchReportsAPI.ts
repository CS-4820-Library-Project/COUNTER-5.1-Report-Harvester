import { FetchData } from "src/main/services/FetchService";
import { FetchResult, FetchResults } from "src/types/reports";
import { VendorData, VendorRecord } from "src/types/vendors";

/**
 * Represents the API for fetching reports.
 */
export interface IFetchReportsAPI {
  /**
   * Fetches reports from the FetchService.
   * @param {FetchData} fetchData - The data to be used to fetch reports.
   * @returns {FetchResult[]} results - The promise object representing the result of the fetch operation
   */
  fetch: (fetchData: FetchData) => Promise<FetchResults>;

  /**
   * Fetches the supported reports from the FetchService.
   * @returns string[] - The promise object representing the supported reports
   */
  getSupported: (vendor: VendorRecord | VendorData) => Promise<string[]>;

  /**
   * Cancels the fetch operation.
   */
  cancel: () => void;

  /**
   * Listens for the completion of the fetch operation for a vendor.
   * @param {Function} callback - The callback function to be executed when the fetch operation is completed.
   */
  onVendorCompleted: (callback: Function) => void;

  /**
   * Removes the listener for the completion of the fetch operation for a vendor.
   * @param {Function} callback - The callback function to be removed.
   */
  removeVendorCompletedListeners: () => void;
}
