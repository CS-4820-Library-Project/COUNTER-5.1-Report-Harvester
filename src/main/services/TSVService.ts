import { writeFile } from "../utils/files";
import { DirectorySettingService } from "./DirectorySettingService";

class TSVService {
  /**
   * Writes the content to a TSV file.
   * @param filename The name of the file.
   * @param content The content to write to the file.
   * @param isCustom A boolean indicating whether the file is a custom file.
   * @returns A boolean indicating whether the file was written successfully.
   */
  static async writeTSVReport(
    filename: string,
    content: string,
    isCustom: boolean
  ) {
    try {
      const dirService = new DirectorySettingService();
      const dirType = isCustom ? "custom" : "main";

      const reportPath = dirService.getPath(dirType, filename + ".tsv");
      await writeFile(reportPath, content);
      return true;
    } catch (error) {
      const errorMessage = "\tWritting TSV to File\t";
      // console.error(errorMessage, error);
      throw errorMessage + "Failed Writing TSV to File. Not Directory Found.";
    }
  }
}

export default TSVService;
