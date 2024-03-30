import { ICreateVendorCommand } from "src/renderer/src/interface/ICreateVendorCommand";

/**
 * Represents the command to update a vendor.
 */
export interface IUpdateVendorCommand {
  name?: string;
  usageCount?: number;
  customerId?: string;
  requestorId?: string;
  baseURL?: string;
  apiKey?: string;
  platform?: string;
  provider?: string;
  notes?: string;
}

/**
 * Represents the command to update a vendor for version 5.0.
 * Extends the ICreateVendorCommand interface.
 */
export interface IUpdateVendor_5_0Command extends ICreateVendorCommand {
  requireIpChecking?: boolean;
}

/**
 * Represents the command to update a vendor for version 5.1.
 * Extends the ICreateVendorCommand interface.
 */
export interface IUpdateVendor_5_1Command extends ICreateVendorCommand {
  requireTwoAttemptsPerReport?: boolean;
  requireRequestsThrottled?: boolean;
}
