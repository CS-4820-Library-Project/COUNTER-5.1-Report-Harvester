import { ipcMain } from "electron";
import { writeFile } from "../utils/files";
import { DirectorySettingService } from "../services/DirectorySettingService";

/**
 * Registers the IPC handler for writing logs to a file.
 */
const tsvRouter = () => {
  /**
   * Handles the "write-log-to-file" IPC event.
   * Writes the provided content to a file with the given filename.
   * @param _ The event object.
   * @param filename The name of the file to write to.
   * @param content The content to write to the file.
   * @returns A boolean indicating whether the write operation was successful.
   */
  ipcMain.handle(
    "write-log-to-file",
    async (_, filename: string, content: string) => {
      try {
        const dirService = new DirectorySettingService();
        const logsPath = await dirService.getPath("logs", `${filename}.txt`);

        await writeFile(logsPath, content);
        return true;
      } catch (error) {
        console.error("Error writing logs to file:", error);
        return false;
      }
    }
  );
};

export default tsvRouter;
