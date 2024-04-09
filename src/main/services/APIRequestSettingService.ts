import { IRequestSetting } from "src/renderer/src/interface/IRequestSetting";
import * as fs from "fs";
import { promisify } from "util";
import { DirectorySettingService } from "./DirectorySettingService";
<<<<<<< HEAD
import { writeFile } from "../utils/files";
=======
>>>>>>> origin/main

const readFileAsync = promisify(fs.readFile);
/**
 * Service class for managing API request settings.
 */
export class APIRequestSettingService {
  private dirService = new DirectorySettingService();
  private reqSettingsDir = this.dirService.getPath(
    "settings",
    "requestSettings.json"
  );

  /**
   * Saves the provided request settings to a file.
   * @param settings - The request settings to be saved.
   * @throws Error if there was an error writing the file.
   */
  async saveSettings(settings: IRequestSetting): Promise<void> {
    const data = JSON.stringify(settings, null, 2);
    try {
<<<<<<< HEAD
      await writeFile(this.reqSettingsDir, data);
=======
      await writeFileAsync(this.reqSettingsDir, data);
>>>>>>> origin/main
    } catch (err) {
      console.error("There was an error writing the file", err);
      throw err;
    }
  }

  /**
   * Reads the request settings from the file.
   * @returns The request settings if the file exists, otherwise null.
   */
  async readSettings(): Promise<IRequestSetting | null> {
    if (fs.existsSync(this.reqSettingsDir)) {
      const data = await readFileAsync(this.reqSettingsDir, "utf-8");
      return JSON.parse(data) as IRequestSetting;
    } else {
      return null;
    }
  }
}
