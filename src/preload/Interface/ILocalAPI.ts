/**
 * Represents the local API. General Purpose API for interacting with the local file system.
 */
export interface LocalAPI {
  /**
   * Writes the content to a TSV file.
   * @param content - The content to write.
   * @param filename - The filename of the TSV file.
   */
  writeTsvToFile: (content: string, filename: string) => void;

  /**
   * Opens the specified path.
   * @param path - The path to open.
   */
  openPath: (path: string) => void;

  /**
   * Opens a directory chooser dialog.
   * @param dir - The initial directory to display in the dialog.
   * @returns The selected directory path, or false if no directory was selected.
   */
  saveDirectory: (dir: string) => string | false;
}
