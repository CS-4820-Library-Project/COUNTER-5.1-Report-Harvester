import { ipcMain } from "electron";
import { readFile, writeFile } from "../utils/files";
import { decryptData, encryptData, isEncrypted } from "../utils/encrypt";
import { DataVersions, VendorRecord } from "src/types/vendors";
import { DirectorySettingService } from "../services/DirectorySettingService";
import path from "path";
import { PasswordSettingService } from "../services/PasswordSettingService";

/**
 * Handles the IPC requests related to vendors.
 */
const VendorRouter = () => {
  /**
   * Handles the "read-json-vendors" IPC request.
   * @param _ - The event object.
   * @param password - The password for decrypting the data.
   * @returns A promise that resolves to an array of vendor records.
   */
  ipcMain.handle("read-json-vendors", async (_, password?: string) => {
    try {
      let vendorPath = new DirectorySettingService().getPath(
        "vendors",
        "vendors.json"
      );

      let data = await readFile(vendorPath);

      if (!data) {
        await writeFile(vendorPath, "[]");
        return [];
      }

      if (isEncrypted(data) && password) data = decryptData(data, password);
      const vendors: VendorRecord[] = JSON.parse(data);
      return vendors;
    } catch (error) {
      console.error("\nError reading vendors.json\n", error);
      return false;
    }
  });

  /**
   * Handles the "write-json-vendors" IPC request.
   * @param _ - The event object.
   * @param vendors - The vendors data to be written.
   * @param password - The password for encrypting the data.
   * @returns A promise that resolves to the result of the write operation.
   */
  ipcMain.handle("write-json-vendors", async (_, vendors, password: string) => {
    const dirService = new DirectorySettingService();

    let data = vendors;

    const isProtected = await new PasswordSettingService().isPasswordSet();
    if (isProtected) data = encryptData(data, password);

    const vendorPath = dirService.getPath("vendors", "vendors.json");

    return await writeFile(vendorPath, JSON.stringify(data));
  });

  /**
   * Handles the "write-vendor-tsv-to-file" IPC request.
   * @param _ - The event object.
   * @param content - The content to be written to the file.
   * @param version - The data version.
   * @returns A promise that resolves to the result of the write operation.
   */
  ipcMain.handle(
    "write-vendor-tsv-to-file",
    async (_, content: string, version: DataVersions, userDir?: string) => {
      const dirService = new DirectorySettingService();
      const defaultDir = dirService.getPath("vendors", "exports");

      const filepath = path.join(
        userDir || defaultDir,
        `/vendors_${version}.tsv`
      );

      const result = await writeFile(filepath, content)
        .then((result) => result)
        .catch(() => {
          console.error("Error saving TSV file");
          new DirectorySettingService().openPath(filepath);
          return false;
        });

      if (result) dirService.openPath(filepath);

      return result;
    }
  );
};

export default VendorRouter;
