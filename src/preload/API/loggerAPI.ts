import { contextBridge, ipcRenderer } from "electron";
import { VendorRecord, VendorTSV } from "src/types/vendors";

/**
 * The tsv object provides methods to interact with vendors data.
 */
const LoggerAPI = () =>
  contextBridge.exposeInMainWorld("logger", {
    /**
     * Writes TSV content to a given file.
     * @param {string} filename - The filename (without file extension) of the TSV file.
     * @param {string} content - The content to be written to the file.
     */
    writeLogToFile: async (filename: string, content: string) => {
      return ipcRenderer.invoke("write-log-to-file", content, filename);
    },
  });

export default LoggerAPI;
