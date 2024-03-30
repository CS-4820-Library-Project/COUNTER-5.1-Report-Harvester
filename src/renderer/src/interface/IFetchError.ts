/**
 * Represents an error that occurs during a fetch operation.
 */
export interface IFetchError {
  code: number;
  message: string;
  meaning: string;
  severity: string;
}
