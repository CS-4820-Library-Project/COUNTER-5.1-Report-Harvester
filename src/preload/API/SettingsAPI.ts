import { contextBridge, ipcRenderer } from "electron";
import { AppSettings, UserDirectories } from "src/types/settings";

const SettingsAPI = () =>
  contextBridge.exposeInMainWorld("settings", {
    /**
     * Opens the specified path in the operating system's default file manager.
     */
    openPath: (path: string) => {
      return ipcRenderer.send("open-path", path);
    },

    /**
     * Opens a dialog to choose a directory.
     * @returns {Promise<string>} A promise that resolves with the chosen directory.
     */
    chooseDirectory: () => {
      return ipcRenderer.invoke("choose-directory");
    },

    /**
     * Gets the directory settings.
     * @returns {Promise<string>} A promise that resolves with the directory settings.
     */
    getDirectory: (dir: keyof UserDirectories): Promise<string> => {
      return ipcRenderer.invoke("get-directory", dir);
    },

    /**
     * Gets the directory settings.
     * @returns {Promise<UserDirectories>} A promise that resolves with the directory settings.
     */
    getDirectories: (): Promise<UserDirectories> => {
      return ipcRenderer.invoke("get-directories");
    },

    /**
     * Opens a dialog to choose a directory and store it in the settings.
     * @param {string} dir - The directory identifier that is being chosen.
     * Can be "main", "custom", "vendors" or "db".
     */
    saveDirectory: (dir: "main" | "custom" | "vendors" | "db") => {
      return ipcRenderer.invoke("save-directory", dir);
    },

    /**
     * Saves the directory settings.
     * @param {any} directories - The directory settings to save.
     * @returns {Promise<string[]>} A promise that resolves when the settings have been saved successfully.
     */
    saveDirectories: (directories: any) => {
      return ipcRenderer.invoke("save-directories", directories);
    },

    /**
     * Saves the general settings.
     * @param {any} settings - The general settings to save.
     * @returns {Promise<void>} A promise that resolves when the settings have been saved successfully.
     */
    saveSettings: (settings: AppSettings): Promise<void> => {
      return ipcRenderer.invoke("save-settings", settings);
    },

    /**
     * Reads the general settings.
     * @returns {Promise<any>} A promise that resolves with the general settings.
     */
    readSettings: (): Promise<AppSettings> => {
      return ipcRenderer.invoke("read-settings");
    },

    /**
     * Checks if the password is set.
     * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the password is set.
     */
    isPasswordSet: (): Promise<boolean> => {
      return ipcRenderer.invoke("is-password-set");
    },

    /**
     * Sets the password for the application.
     * @param {string} password - The password to set.
     * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the password was set successfully.
     */
    setPassword: (password: string): Promise<boolean> => {
      return ipcRenderer.invoke("set-password", password);
    },

    /**
     * Unsets the password for the application.
     * @param {string} password - The password to unset.
     * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the password was unset successfully.
     */
    unsetPassword: (password: string): Promise<boolean> => {
      return ipcRenderer.invoke("unset-password", password);
    },

    /**
     * Resets the application.
     * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the application was reset successfully.
     */
    resetApp: (): Promise<boolean> => {
      return ipcRenderer.invoke("reset-app");
    },
  });

export default SettingsAPI;
