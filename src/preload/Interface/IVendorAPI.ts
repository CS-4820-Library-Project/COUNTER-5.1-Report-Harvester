import { DataVersions, VendorRecord } from "src/types/vendors";

/**
 * Represents the API for managing vendors.
 */
export interface IVendorsApi {
  /**
   * Reads the vendors.
   * @param password - The password to decrypt the file.
   * @returns A promise that resolves with the list of vendors.
   */
  read: (password?: string) => Promise<VendorRecord[] | false>;

  /**
   * Writes the vendors.
   * @param vendors - The vendors to be written.
   * @returns A promise that resolves with a boolean indicating whether the vendors were successfully written.
   */
  write: (vendors: VendorRecord[]) => Promise<boolean>;

  /**
   * Writes the vendors to an Excel file.
   * @param vendors - The vendors to write.
   */
  writeTSVToFile: (
    content: string,
    version: DataVersions,
    filepath: string
  ) => Promise<boolean>;
}
