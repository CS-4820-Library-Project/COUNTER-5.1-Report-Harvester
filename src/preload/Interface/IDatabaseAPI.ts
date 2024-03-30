/**
 * Represents the API for managing database operations.
 */
export interface IDatabaseAPI {
  /**
   * Saves the fetched report to the database.
   * @param report - The fetched report to save.
   * @returns A promise that resolves when the report has been saved successfully.
   */
  saveFetchedReport: (report: any) => Promise<void>;

  /**
   * Searches for a report in the database.
   * @param title - The title of the report to search for.
   * @param issn - The ISSN of the report to search for.
   * @param isbn - The ISBN of the report to search for.
   * @returns A promise that resolves with the search results.
   */
  writeSearchedReportsToTSV: (
    title: string,
    issn: string,
    isbn: string
  ) => Promise<any>;
}
