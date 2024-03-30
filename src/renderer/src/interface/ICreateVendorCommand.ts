/**
 * Represents a command to create a vendor.
 */
export interface ICreateVendorCommand {
  name: string;
  customerId: string;
  requestorId?: string;
  baseURL: string;
  apiKey?: string;
  platform: string;
  provider: string;
  notes: string;
}

/**
 * Represents a command to create a vendor for version 5.0.
 * Extends the base `ICreateVendorCommand` interface.
 */
export interface ICreateVendor_5_0Command extends ICreateVendorCommand {
  requireIpChecking: boolean;
}

/**
 * Represents a command to create a vendor for version 5.1.
 * Extends the base `ICreateVendorCommand` interface.
 */
export interface ICreateVendor_5_1Command extends ICreateVendorCommand {
  requireTwoAttemptsPerReport: boolean;
  requireRequestsThrottled: boolean;
}
