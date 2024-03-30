import { IRequestSetting } from "src/renderer/src/interface/IRequestSetting";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const settingsDir = path.join(__dirname, "..", "..", "data");
const settingsPath = path.join(settingsDir, "requestSettings.json");

/**
 * Service class for managing API request settings.
 */
export class APIRequestSettingService {
  /**
   * Saves the provided request settings to a file.
   * @param settings - The request settings to be saved.
   * @throws Error if there was an error writing the file.
   */
  async saveSettings(settings: IRequestSetting): Promise<void> {
    const data = JSON.stringify(settings, null, 2);

    if (!fs.existsSync(settingsDir)) {
      fs.mkdirSync(settingsDir, { recursive: true });
    }

    try {
      await writeFileAsync(settingsPath, data);
      console.log("Successfully wrote settings to file");
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
    if (fs.existsSync(settingsPath)) {
      const data = await readFileAsync(settingsPath, "utf-8");
      return JSON.parse(data) as IRequestSetting;
    } else {
      return null;
    }
  }
}
