import ReportService from "./ReportService";
import { writeFile } from "../utils/files";
import { DirectorySettingService } from "./DirectorySettingService";

/**
 * A service for logging lines of text to a text file.
 */
export class LoggerService {
  private currentLogs: string[] = [];

  /**
   * Logs a line of text to an instance of a `LoggerService` object's memory, to be written to a file later.
   * @param line - The line of text to be logged.
   */
  public log(line: string): void {
    // console.log("LOGGER SERVICE", line);
    this.currentLogs.push(line);
  }

  /**
   * Writes all lines of text in memory into a text file.
   * @returns The filename of the written log file.
   */
  public writeLogsToFile(): string {
    const filename = this.generateFileName();
    const dirService = new DirectorySettingService();

    const logFilePath = dirService.getPath("logs", `${filename}.tsv`);
    writeFile(logFilePath, this.currentLogs.join("\n"));

    return logFilePath;
  }

  /**
   * Generates a filename for the log file based on the current date and time.
   * @returns The generated filename.
   */
  private generateFileName(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = ReportService.padLeft(now.getHours().toString(), 2, "0");
    const minutes = ReportService.padLeft(now.getMinutes().toString(), 2, "0");
    const seconds = ReportService.padLeft(now.getSeconds().toString(), 2, "0");

    let filename = `log_${year}_${ReportService.padLeft(month.toString(), 2, "0")}_`;
    filename += `${ReportService.padLeft(day.toString(), 2, "0")}_${hours}_${minutes}_${seconds}`;
    return filename;
  }
}
