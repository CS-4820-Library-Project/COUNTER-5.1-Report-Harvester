import { UserDirectories } from "src/types/settings";

/**
 * Represents the API for managing directory settings.
 */
export interface ISettingsAPI {
  /**
   * Opens a dialog to choose a directory.
   * @param dir - The directory type ("main" or "custom").
   * @returns A promise that resolves with the chosen directory as string.
   */
  saveDirectory: (dir: string) => Promise<string>;

  /**
   * Saves the directory settings.
   * @param directories - The directory settings to be saved.
   * @returns A promise that resolves when the settings are saved.
   */
  saveDirectories: (directories: any) => Promise<string[]>;

  /**
   * Gets the directory settings.
   * @returns A promise that resolves with the directory settings.
   */
  getDirectories: () => Promise<UserDirectories>;

  /**
   * Opens a dialog to choose a directory.
   * @returns A promise that resolves with the chosen directory as string.
   */
  chooseDirectory: () => Promise<string>;

  /**
   * Resets the application.
   * @returns A promise that resolves when the application is reset.
   */
  resetApp: () => Promise<boolean>;

  /**
   * Saves the general settings.
   * @param settings - The general settings to be saved.
   * @returns A promise that resolves when the settings are saved.
   */
  saveSettings: (settings: any) => Promise<any>;

  /**
   * Reads the general settings.
   * @returns A promise that resolves with the general settings.
   */
  readSettings: () => Promise<any>;

  /**
   * Checks if the password is set.
   * @returns A promise that resolves with a boolean indicating whether the password is set.
   */
  isPasswordSet: () => Promise<boolean>;

  /**
   * Sets the password for the application.
   * @param password - The password to set.
   * @returns A promise that resolves when the password is set.
   */
  setPassword: (password: string) => Promise<boolean>;

  /**
   * Unsets the password for the application.
   * @param password - The password to unset.
   * @returns A promise that resolves when the password is unset.
   */
  unsetPassword: (password: string) => Promise<boolean>;
}
