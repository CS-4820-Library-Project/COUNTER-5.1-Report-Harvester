/**
 * Represents the API for fetching reports.
 */
export interface IReportsApi {
  /**
   * Fetches the specified reports.
   * @param reports - The reports to be fetched.
   * @returns A promise that resolves when the reports are fetched.
   */
  fetchReports: (reports: Report[]) => Promise<void>;
}
