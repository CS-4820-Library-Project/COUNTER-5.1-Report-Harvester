import { contextBridge, ipcRenderer } from "electron";
import { VendorRecord } from "src/types/vendors";

/**
 * The vendorRouter object provides methods to interact with vendors data.
 */
const VendorAPI = () =>
  contextBridge.exposeInMainWorld("vendors", {
    /**
     * Reads the vendors from a JSON file.
     * @param {string | undefined} password - The password to decrypt the file. If it was set.
     * @returns {Promise<VendorRecord[] | boolean>} A promise that resolves with the vendors data.
     */
    read: async (password?: string) => {
      return ipcRenderer.invoke("read-json-vendors", password);
    },

    /**
     * Writes the vendors data to a JSON file.
     * @param {any} vendors - The vendors data to write.
     * @param {string} password - The password to encrypt the file. If it needs to be encrypted.
     * @returns {Promise<boolean>} A promise that resolves when the file has been written successfully.
     */
    write: async (vendors: VendorRecord[], password: string) => {
      return ipcRenderer.invoke("write-json-vendors", vendors, password);
    },

    /**
     * Writes the vendors data to a TSV file.
     * @param {VendorTSV[]} tsvVendors - The vendors data to write.
     * @returns {Promise<void>} A promise that resolves when the file has been written successfully.
     */
    writeTSVToFile: async (content: string, version: string, path: string) => {
        return ipcRenderer.invoke("write-vendor-tsv-to-file", content, version, path);
    },
  });

export default VendorAPI;
