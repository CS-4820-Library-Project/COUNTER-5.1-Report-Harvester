import { FetchData } from "src/main/services/FetchService";
import { VendorData, VendorRecord } from "src/types/vendors";

/**
 * Represents the API for fetching reports.
 */
export interface IFetchReportsAPI {
  /**
   * Fetches reports from the FetchService.
   * @param {FetchData} fetchData - The data to be used to fetch reports.
   * @returns string[] - The promise object representing the result of the fetch operation
   */
  fetch: (fetchData: FetchData) => Promise<string[]>;

  /**
   * Fetches the supported reports from the FetchService.
   * @returns string[] - The promise object representing the supported reports
   */
  getSupported: (vendor: VendorRecord | VendorData) => Promise<string[]>;
}
