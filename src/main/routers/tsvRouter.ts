import { ipcMain } from "electron";
import { writeFile } from "../utils/files";

import { DirectorySettingService } from "../services/DirectorySettingService";

/**
 * Handles the `write-tsv-to-file` event to handle writing report data to TSV from the Fetch service.
 */
const tsvRouter = () => {
  /**
   * Handles the `write-tsv-to-file` event to write report data to a TSV file.
   * @param filename - The name of the file to be written.
   * @param content - The content to be written to the file.
   * @returns A boolean indicating whether the write operation was successful.
   */
  ipcMain.handle(
    "write-tsv-to-file",
    async (_, filename: string, content: string, isCustom: boolean) => {
      try {
        const dirService = new DirectorySettingService();
        const dirType = isCustom ? "custom" : "main";

        const reportPath = dirService.getPath(dirType, filename + ".tsv");
        await writeFile(reportPath, content);
        return true;
      } catch (error) {
        console.error("Error saving vendors to Excel file:", error);
        return false;
      }
    }
  );
};

export default tsvRouter;
