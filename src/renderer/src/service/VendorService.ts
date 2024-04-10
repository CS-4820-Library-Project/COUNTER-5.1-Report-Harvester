import { dataVersions, vendorHeaders } from "../../../constants";
import {
  SortOptions,
  VendorData,
  VendorRecord,
  DataVersions,
  VendorVersions,
  VendorTsvError,
} from "src/types/vendors";
import { toCamelCase } from "../utils/string";

/** The main service for handling accessing and manipulating vendors and their associated data,
 *  acting as an abstraction layer between the app's React components and the local
 *  inter-process communication API. Should be accessed via `VendorServiceInstance`. */

class VendorService {
  private vendors: VendorRecord[] = [];
  private vendorsReady: Promise<void>;
  private password: string | undefined = undefined;

  constructor() {
    this.vendorsReady = window.vendors
      .read()
      .then((vendors: VendorRecord[] | false) => {
        if (vendors) this.vendors = vendors;
      });
  }

  /** Takes in a password and reads the vendors from the local storage, setting the vendors list to the read vendors */
  setPassword(password: string) {
    this.password = password;
    this.vendorsReady = window.vendors
      .read(password)
      .then((vendors: VendorRecord[] | false) => {
        if (vendors) this.vendors = vendors;
      });
  }

  /** Returns an array of all vendors (both 5.0-formatted vendors and 5.1-formatted vendors) */

  async getVendors(sortby?: SortOptions): Promise<VendorRecord[]> {
    await this.vendorsReady;
    this.sort(sortby || "name");
    return this.vendors;
  }

  async refreshVendors() {
    this.vendorsReady = window.vendors
      .read(this.password)
      .then((vendors: VendorRecord[] | false) => {
        if (vendors) this.vendors = vendors;
      });
  }

  /** Returns an array of only 5.0-formatted vendors */

  async get_5_0_Vendors(sortby?: SortOptions): Promise<VendorRecord[]> {
    await this.vendorsReady;
    this.sort(sortby || "name");
    return this.vendors.filter((v) => v.data5_0 !== undefined);
  }

  /** Returns an array of only 5.1-formatted vendors */

  async get_5_1_Vendors(sortby?: SortOptions): Promise<VendorRecord[]> {
    await this.vendorsReady;
    this.sort(sortby || "name");
    return this.vendors.filter((v) => v.data5_1 !== undefined);
  }

  /** Takes in an ID and returns the Vendor object associated with said ID */

  getVendorById(idP: number): VendorRecord | null {
    const result = this.vendors.find((v) => v.id === idP);
    return result || null;
  }

  /** Takes in Vendor Data and creates a Vendor object type,
   *  adding it to the vendor list and Excel file, and returning the ID of the new vendor if successful, or `-1`
   *  if an error occurs.
   * */

  async addVendor(vendorData: VendorData) {
    const id = this.generateUniqueId();
    let newVendor = {
      id,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...vendorData,
    };

    this.vendors.push(newVendor);
    return (await this.storeVendors()) ? id : null;
  }

  /** Takes in a vendor ID and an Update Vendor command (of either 5.0 or 5.1 type) and updates the corresponding vendor
   *  with the information found in the command, saving it to the vendor list and Excel file, and returning a true/false
   *  depending on whether the operation was successful */

  updateVendor(id: number, vendorData: VendorData): Promise<boolean> {
    const ogVendor = this.getVendorById(id);
    if (!ogVendor) throw new Error("Vendor not found");

    this.vendors = this.vendors.filter((v) => v.id !== id);

    const updatedVendor = {
      ...ogVendor, // Keep old 5_0 or 5_1 data not included in update
      usageCount: ogVendor.usageCount + 1,
      updatedAt: new Date(),
      ...vendorData, // Overwrite with new 5_0 or 5_1 data included
    };

    this.vendors.push(updatedVendor);
    return this.storeVendors();
  }

  /** Takes in a vendor ID and removes the associated vendor record from the vendor list
   *  and JSON file.
   *  If the vendor doesn't have either record gets deleted completety.
   *  @returns {boolean} depending on whether the operation is successful
   */

  deleteVendor(idP: number, version: VendorVersions): boolean {
    if (!this.getVendorById(idP)) return false;

    const vendorData = version === "5.0" ? "data5_0" : "data5_1";

    this.vendors = this.vendors
      .map((v) =>
        v.id === idP
          ? // Delete whole vendor if no version available
            v[vendorData] === undefined
            ? undefined
            : // Delete selected version
              { ...v, [vendorData]: undefined }
          : v
      )
      // filter deleted vendors
      .filter((v): v is VendorRecord => v !== undefined)
      .filter((v) => v.data5_0 || v.data5_1);

    this.storeVendors();
    return true;
  }

  /** Generates a unique number (unused for any other vendor) in the range between 10000 and 99999 */

  private generateUniqueId(): number {
    const genFunc = () => Math.floor(Math.random() * 90000) + 10000;
    let id = genFunc();
    while (id in this.vendors.map((v) => v.id)) {
      id = genFunc();
    }
    return id;
  }

  /**
   * Sorts the vendors array based on the specified field.
   * @param field - The field to sort by. Can be 'name', 'createdAt', or 'updatedAt'.
   */

  private sort(field: SortOptions): void {
    this.vendors.sort((a, b) =>
      field === "name"
        ? a.name.localeCompare(b.name)
        : new Date(b[field]).getTime() - new Date(a[field]).getTime()
    );
  }

  /**
   * Stores the vendors in the local storage using the window.localAPI.writeVendors method.
   * @returns A promise that resolves to true if the vendors are successfully stored, or false otherwise.
   */

  private storeVendors() {
    return window.vendors.write(this.vendors);
  }

  /** Exports the vendors to a TSV file using the window.localAPI.writeTSVToFile method.
   * @param version - The version of the vendors to export. Can be '5.0' or '5.1'.
   * @param path
   */

  async exportVendors(version: DataVersions, path: string) {
    const { data5_0, data5_1 } = dataVersions;

    const vendors =
      version === data5_0
        ? await this.get_5_0_Vendors()
        : await this.get_5_1_Vendors();

    let headers: string[] = [];

    let isFirstVendor = true;

    const tsv = [headers.join("\t") as string];

    vendors.map((v) => {
      // Not include the other version of the data
      delete v[version === data5_0 ? data5_1 : data5_0];

      let row: string[] = [];

      Object.entries(v).map(([key, value]) => {
        if (key === version) {
          if (isFirstVendor) headers = headers.concat(Object.keys(value));
          Object.values(value).map((vendorData) => row.push(vendorData));
        } else {
          isFirstVendor && headers.push(key);
          row.push(value as string);
        }
      });

      if (isFirstVendor) {
        tsv[0] = headers.join("\t");
        isFirstVendor = false;
      }

      tsv.push(row.join("\t"));
    });

    // Export Template if no vendors
    const tsvHeaders =
      version === data5_0
        ? vendorHeaders
        : vendorHeaders.filter((header) => header !== "requireIpChecking");

    const tsvTemplate = tsvHeaders.join("\t");
    const tsvString = vendors.length === 0 ? tsvTemplate : tsv.join("\n");

    // Write to file
    window.vendors.writeTSVToFile(tsvString, version, path);
  }

  /** Imports vendors from a TSV file using the window.localAPI.importVendors method.
   * @param version - The version of the vendors to import. Can be '5.0' or '5.1'.
   * @param tsv - The TSV file to import.
   * @param action - The action to perform. Can be 'add' or 'replace'.
   * @returns true if import was succesfull or an array or errors as string[].
   */
  async importVendors(
    version: VendorVersions,
    tsv: File,
    action: "add" | "replace"
  ): Promise<boolean | VendorTsvError[]> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const fileContent = fileReader.result as string;
        try {
          const result = this.parseVendorsTSV(fileContent, version, action);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      fileReader.onerror = (error) => reject(error);

      fileReader.readAsText(tsv);
    });
  }
  /**
   * Parses the content of a TSV file and adds or replaces the vendors in the vendor list.
   * @param content - The content of the TSV file.
   * @param version - The version of the vendors to import. Can be '5.0' or '5.1'.
   * @param action - The action to perform. Can be 'add' or 'replace'.
   * @return true if import was succesfull or an array or errors as string[].
   */

  private parseVendorsTSV(
    content: string,
    version: VendorVersions,
    action: "add" | "replace"
  ) {
    try {
      const dataVersion = version === "5.0" ? "data5_0" : "data5_1";
      const recordHeaders = [
        "id",
        "name",
        "usageCount",
        "updatedAt",
        "createdAt",
      ];

      const lines = content.split("\n");

      // Get the headers from the first line
      let headers = lines[0].split("\t");
      headers = headers.map((header) => toCamelCase(header));

      const vendorNameIndex = headers.indexOf("name");

      // Create Vendor Objects
      let newVendors: VendorRecord[] = [];
      const vendorLines = lines.slice(1);

      // Collects all errors are returns after parsing all lines
      const tsvErrors: VendorTsvError[] = [];

      for (const vendorData of vendorLines) {
        if (!vendorData.trim()) continue; // Skip empty rows

        // Parse Values to JS types
        const vendorValues: (string | boolean | number)[] = vendorData
          .split("\t")
          .map((value) => {
            const normalizedValue = value.trim().toLowerCase();
            if (["true", "false"].includes(normalizedValue))
              return normalizedValue === "true";

            return value;
          });

        let vendor: { [key: string]: any } = {};
        vendor[dataVersion] = {};

        headers.forEach((header, index) => {
          this.validateImportValues(
            header,
            index,
            vendorValues,
            version,
            tsvErrors,
            vendorNameIndex
          );

          // Add valid values to the vendor object
          !recordHeaders.includes(header)
            ? (vendor[dataVersion][header] = vendorValues[index])
            : (vendor[header] = vendorValues[index]);
        });

        newVendors.push(vendor as VendorRecord);
      }

      if (tsvErrors.length) throw tsvErrors;

      // Add or replace vendors
      if (action === "add") {
        const notUpdated = this.vendors.filter(
          (vendor) =>
            !newVendors.some((newVendor) => newVendor?.id === vendor.id)
        );

        this.vendors = [...notUpdated, ...newVendors];
      }
      // Replace all vendors
      else this.vendors = newVendors;

      this.storeVendors();
      return true;
    } catch (errors) {
      console.error(errors);
      return errors as VendorTsvError[];
    }
  }

  /**
   * Validates the values of a vendor record.
   * @param header - The header of the value.
   * @param index - The index of the value.
   * @param values - The values of the record.
   * @param version - The version of the vendor.
   * @throws An array of errors.
   */
  private validateImportValues(
    header: string,
    index: number,
    values: any[],
    version: VendorVersions,
    tsvErrors: VendorTsvError[],
    vendorNameIndex: number
  ) {
    const errors: string[] = [];

    if (!vendorHeaders.includes(header))
      errors.push(`Invalid header: ${header}`);

    if (header === "id" && !values[index])
      values[index] = this.generateUniqueId();

    if (header === "requireIpChecking" && version === "5.1")
      errors.push("Selected version doesn't match file version");

    if (
      [
        "baseURL",
        "name",
        "customerId",
        "requireTwoAttemptsPerReport",
        "requireRequestsThrottled",
      ].includes(header) &&
      values[index] === "" &&
      version === "5.1"
    ) {
      errors.push(
        `COUNTER 5.1 - Missing a value in required field:\n
            - ${header} is missing`
      );
    }

    if (
      [
        "baseURL",
        "name",
        "requireTwoAttemptsPerReport",
        "requireRequestsThrottled",
        "requireIpChecking",
      ].includes(header) &&
      values[index] === "" &&
      version === "5.0"
    ) {
      errors.push(
        `COUNTER 5.0.3 - Missing a value in required field: ${header} is missing`
      );
    }

    if (header === "cretedAt" && !values[index])
      values[index] = new Date().toISOString();

    if (header === "updatedAt") values[index] = new Date().toISOString();

    if (header === "usageCount" && !values[index]) values[index] = 0;

    if (["id", "usageCount"].includes(header))
      values[index] = parseInt(values[index] as string);

    if (header === "baseURL") {
      if (!values[index].startsWith("https://"))
        errors.push(`Base URL must start with 'https://`);

      if (!values[index].includes("/r51/") && version === "5.1")
        errors.push(`Base URL must contain '/r51/' in COUNTER 5.1 vendors`);
    }

    if (
      [
        "requireTwoAttemptsPerReport",
        "requireIpChecking",
        "requireRequestsThrottled",
      ].includes(header) &&
      typeof values[index] === "string"
    )
      errors.push(
        `Invalid value for ${header}: ${values[index]}. Must be a boolean value. (true/false)`
      );

    if (errors.length) {
      tsvErrors.push({
        id: index + 1,
        vendor: values[vendorNameIndex],
        errors,
      });
    }
  }
}

const VendorServiceInstance = new VendorService();

export default VendorServiceInstance;
