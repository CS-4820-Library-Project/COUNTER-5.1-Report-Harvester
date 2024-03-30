/**
 * Represents the settings for making requests.
 */
export interface IRequestSetting {
  requestInterval: number;
  requestTimeout: number;
  concurrentReports: number;
  concurrentVendors: number;
}
