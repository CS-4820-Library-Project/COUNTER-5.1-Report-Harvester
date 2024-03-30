import { ipcMain } from "electron";
import { APIRequestSettingService } from "../services/APIRequestSettingService";
import { DirectorySettingService } from "../services/DirectorySettingService";
import { PasswordSettingService } from "../services/PasswordSettingService";
import path from "path";
import fs from "fs";

/**
 * Creates a router for handling settings-related functionality.
 */

const SettingsRouter = () => {
  const directorySettingService = new DirectorySettingService();
  const apiRequestSettingService = new APIRequestSettingService();
  const passwordSettingService = new PasswordSettingService();

  /**
   * Handles the "open-path" event and opens the specified path.
   * @param event - The event object.
   * @param path - The path to open.
   */
  ipcMain.on("open-path", async (event, path: string) => {
    try {
      await directorySettingService.openPath(path);
      event.reply("open-path-response", `Path ${path} opened successfully.`);
    } catch (error) {
      console.error(`Failed to open directory: ${error}`);
      event.reply(
        "open-path-response",
        `Failed to open path: ${path}. Error: ${error}`
      );
    }
  });

  /**
   * Handles the "choose-directory" event and allows the user to choose a directory.
   * @returns The chosen directory as path.
   */
  ipcMain.handle("choose-directory", async () => {
    return directorySettingService.chooseDirectory();
  });

  /**
   * Handles the "save-directory" event and allows the user to choose a directory.
   * @param _ - The event object.
   * @param dir - The directory type ("main" or "custom").
   * @returns The chosen directory.
   */
  ipcMain.handle("save-directory", async (_, dir: "main" | "custom") => {
    return directorySettingService.saveDirectory(dir);
  });

  /**
   * Handles the "save-directories" event and saves the provided directories.
   * @param _ - The event object.
   * @param directories - The directories to save.
   * @returns The invalid directories.
   */
  ipcMain.handle("save-directories", async (_, directories) => {
    return directorySettingService.saveDirectories(directories);
  });

  /**
   * Handles the "save-settings" event and saves the provided settings.
   * @param _ - The event object.
   * @param settings - The settings to save.
   * @returns A boolean indicating whether the settings were saved successfully.
   */
  ipcMain.handle("save-settings", (_, settings) => {
    apiRequestSettingService.saveSettings(settings);
    return true;
  });

  /**
   * Handles the "read-settings" event and reads the saved settings.
   * @returns The saved settings.
   */
  ipcMain.handle("read-settings", async () => {
    return await apiRequestSettingService.readSettings();
  });

  /**
   * Handles the "get-directories" event and gets the saved directories.
   * @returns The saved directories.
   */
  ipcMain.handle("get-directories", async () => {
    return await directorySettingService.getDirectories();
  });

  /**
   * Handles the "is-password-set" event and checks if the password is set.
   * @returns A boolean indicating whether the password is set.
   */
  ipcMain.handle("is-password-set", async () => {
    return passwordSettingService.isPasswordSet(); // Updated line, now we delegated the check to the service
  });

  /**
   * Handles the "set-password" event and sets the password for the application.
   * @param _ - The event object.
   * @param password - The password to set.
   * @returns A boolean indicating whether the password was set successfully.
   */
  ipcMain.handle("set-password", async (_, password) => {
    return await passwordSettingService.setPassword(password);
  });

  /**
   * Handles the "unset-password" event and unsets the password for the application.
   * @param _ - The event object.
   * @param password - The password to unset.
   * @returns A boolean indicating whether the password was unset successfully.
   */
  ipcMain.handle("unset-password", async (_, password) => {
    return await passwordSettingService.unsetPassword(password);
  });

  /**
   * Handles the "reset-app" event and resets the application.
   * @returns A boolean indicating whether the application was reset successfully.
   */
  ipcMain.handle("reset-app", async () => {
    // TODO: Use User Settings Path.
    try {
      const passwordSettingsDir = path.join(__dirname, "..", "..", "data");
      const passwordSettingsPath = path.join(
        passwordSettingsDir,
        "passwordSettings.json"
      );

      const passwordSettings = JSON.parse(
        fs.readFileSync(passwordSettingsPath, "utf8")
      );

      let isProtected = passwordSettings.isProtected;

      if (isProtected) {
        isProtected = false;
        const settingsDir = path.join(__dirname, "..", "..", "data");
        const passwordSettingsFile = path.join(
          settingsDir,
          "passwordSettings.json"
        );
        await fs.promises.writeFile(
          passwordSettingsFile,
          JSON.stringify({ isProtected: isProtected })
        );

        return true;
      }
    } catch (error) {
      console.error(`Failed to reset app: ${error}`);

      return false;
    }
  });
};

export default SettingsRouter;
