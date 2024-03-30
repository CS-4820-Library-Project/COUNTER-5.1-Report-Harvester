import { contextBridge, ipcRenderer } from "electron";

/**
 * The tsv object provides methods to interact with vendors data.
 */
const TsvAPI = () =>
  contextBridge.exposeInMainWorld("tsv", {
    /**
     * Writes TSV content to a given file.
     * @param {string} filename - The filename (without file extension) of the TSV file.
     * @param {string} content - The content to be written to the file.
     */
    writeTsvToFile: async (
      filename: string,
      content: string,
      isCustom: boolean
    ) => {
      return ipcRenderer.invoke(
        "write-tsv-to-file",
        content,
        filename,
        isCustom
      );
    },
  });

export default TsvAPI;
