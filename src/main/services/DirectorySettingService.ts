import { shell, dialog, app } from "electron";
import path from "path";
import { UserDirectories } from "src/types/settings";
import { writeFile } from "../utils/files";

export interface IDirectorySetting {
  [key: string]: string;
}

export const defaultUserDirectories: UserDirectories = {
  data: "./",
  search: "./search",
  vendors: "./vendors",
  main: "./reports/main",
  custom: "./reports/custom",
  logs: "./logs",
};

/**
 * Service for managing directory settings. Get, Store, and Validate User Paths.
 */
export class DirectorySettingService {
  private settingsPath = path.join(__dirname, "../../../settings");
  private userDirectories: UserDirectories;

  constructor() {
    this.userDirectories = this.readSettingsFromFile();
  }

  /**
   * Checks if the specified path is valid.
   * @param pathString - The path to check.
   * @returns `true` if the path is valid, otherwise `false`.
   */
  isValidPath(pathString: string) {
    return path.isAbsolute(pathString);
  }

  /**
   * Opens the specified directory in the file explorer.
   * @param path - The directory path.
   * @returns A promise that resolves when the directory is opened.
   * @example
   */
  openPath(path: string) {
    return shell
      .openPath(path)
      .catch((error) =>
        console.error(
          "DirectorySettignsService: Failed to open directory:",
          error
        )
      );
  }

  /**
   * Opens a dialog to choose a directory.
   * @returns A promise that resolves with the selected directory path.
   */
  async chooseDirectory(): Promise<string> {
    let selectedPath: string = "";
    await dialog
      .showOpenDialog({
        properties: ["openDirectory"],
      })
      .then((result) => {
        if (!result.canceled && result.filePaths.length > 0)
          selectedPath = result.filePaths[0];
      })
      .catch((error) => console.error("Failed to open directory:", error));
    return selectedPath;
  }

  /**
   * Saves the specified directory path and updates the directory settings.
   * @param dir - The directory name.
   * @returns A promise that resolves with the selected directory path.
   */
  getDirectories(): UserDirectories {
    return this.userDirectories;
  }

  /**
   * Gets the full path of a user directory.
   * @param dir - The directory name. One of "data", "vendors", "search", "main", "custom",
   * @returns The full path of the directory for the user OS.
   * @example getDirectory("data")
   */
  getDirectory(dir: keyof UserDirectories | "settings"): string {
    return dir === "settings" ? this.settingsPath : this.userDirectories[dir];
  }

  /**
   * Gets the full path of a file in the specified directory.
   * @param dir - The directory name.
   * @param filepath - The file path. One of "data", "vendors", "search", "main", "custom",
   * "logs", or "settings
   * @returns The full path of the file.
   * @example getPath("data", "myTextFile.txt") // Returns "/path/to/data/file.txt"
   */
  getPath(dir: keyof UserDirectories | "settings", filepath: string): string {
    const storedPath =
      dir === "settings" ? this.settingsPath : this.userDirectories[dir];

    const resolved = path.join(storedPath, filepath);
    return resolved;
  }

  /**
   *  Opens a Dialog to Choose a Directory and saves the specified directory path
   * to the user directory settings.
   * @param dir  - The directory name.
   * @returns  A promise that resolves with the selected directory path.
   * @example saveDirectory("data") // Returns "/newPath/to/data"
   */
  async saveDirectory(dir: keyof UserDirectories): Promise<string> {
    let selectedPath: string = "";

    try {
      const result: Electron.OpenDialogReturnValue =
        await dialog.showOpenDialog({
          properties: ["openDirectory"],
        });

      if (!result.canceled && result.filePaths.length > 0) {
        selectedPath = result.filePaths[0];
        this.userDirectories[dir] = selectedPath;
        await this.writeSettingsToFile();
      }
    } catch (error) {
      console.error("Failed to open directory:", error);
    }
    return selectedPath;
  }

  /**
   * Validates and Writtes a directory settings object to the User Directories Settings File.
   * Used when saving multiple directories at once in the UI.
   * @param directories - The directory settings to save.
   * @returns An array of invalid directory names.
   * @example saveDirectories({ data: "/newPath/to/data", vendors: "/newPath/to/vendors" })
   */
  async saveDirectories(directories: UserDirectories): Promise<string[]> {
    const invalidDirectories: string[] = [];

    for (const dir in directories) {
      if (!this.isValidPath(directories[dir as keyof UserDirectories]))
        invalidDirectories.push(dir);
    }

    if (invalidDirectories.length === 0) {
      this.userDirectories = directories;
      await this.writeSettingsToFile();
    }

    return invalidDirectories;
  }

  /**
   * Reads the directory settings from the JSON file.
   * @returns The directory settings.
   */
  private readSettingsFromFile(): UserDirectories {
    try {
      const settings = require(
        this.getPath("settings", "directorySettings.json")
      );

      return settings;
    } catch (error) {
      const documentsPath = path.join(
        app.getPath("documents"),
        "COUNTER Havester"
      );
      const userDataPath = app.getPath("userData");

      const settings = { ...defaultUserDirectories };

      settings.vendors = path.join(userDataPath, settings.vendors);
      settings.data = path.join(documentsPath, settings.data);
      settings.search = path.join(documentsPath, settings.search);
      settings.main = path.join(documentsPath, settings.main);
      settings.custom = path.join(documentsPath, settings.custom);
      settings.logs = path.join(documentsPath, settings.logs);

      this.userDirectories = settings;

      this.writeSettingsToFile();

      return settings;
    }
  }

  /**
   * Writes the directory settings to the JSON file.
   * @returns Boolean Result - A promise that resolves when the settings are written.
   */
  private async writeSettingsToFile() {
    try {
      const settings = JSON.stringify(this.userDirectories, null, 2);
      const path = this.getPath("settings", "directorySettings.json");

      await writeFile(path, settings);
      return true;
    } catch (error) {
      console.error(
        "Failed to write directory settings to the JSON file:",
        error
      );
      return false;
    }
  }
}
