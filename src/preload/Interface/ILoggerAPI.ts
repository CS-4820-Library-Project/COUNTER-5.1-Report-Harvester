/**
 * Represents the Logger API.
*/
export interface ILoggerAPI {
  /**
   * Writes the content to a .txt file.
   * @param content - The content to write.
   * @param filename - The filename of the .txt file.
   */
  writeLogToFile: (content: string, filename: string) => void;
}
