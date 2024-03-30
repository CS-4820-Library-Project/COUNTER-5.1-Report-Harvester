/**
 * Represents the TSV API.
 */
export interface ITsvAPI {
  /**
   * Writes the content to a TSV file.
   * @param content - The content to write.
   * @param filename - The filename of the TSV file.
   */
  writeTsvToFile: (
    content: string,
    filename: string,
    isCustom: boolean
  ) => void;
}
