import fs from "fs";
import crypto from "crypto";
import lockfile from "lockfile";
import { DirectorySettingService } from "./DirectorySettingService";
import { readFile, writeFile } from "../utils/files";

const algorithm = "aes-256-cbc";
const iv = Buffer.alloc(16, 0);

/**
 * Represents the password setting interface.
 */
export interface IPasswordSetting {
  isProtected: boolean;
}

/**
 * Represents the password setting service.
 */
export class PasswordSettingService {
  private isProtected = false;
  private isReady: Promise<void>;
  private dirService = new DirectorySettingService();

  constructor() {
    const vendorPath = this.dirService.getPath("vendors", "vendors.json");
    this.isReady = readFile(vendorPath).then((data) => {
      this.isProtected = data ? this.isEncrypted(data) : false;
    });
  }

  /**
   * Checks if a password is set.
   * @returns A boolean indicating if a password is set.
   */
  async isPasswordSet(): Promise<boolean> {
    await this.isReady;
    return this.isProtected;
  }

  /**
   * Sets the password.
   * @param password - The password to set.
   * @returns A promise that resolves to a boolean indicating if the password was set successfully.
   */
  async setPassword(password: string): Promise<boolean> {
    try {
      const vendorPath = this.dirService.getPath("vendors", "vendors.json");

      const success = this.encryptFile(vendorPath, password);

      if (success) {
        this.isProtected = true;
        const passwordSettingsPath = this.dirService.getPath(
          "settings",
          "passwordSettings.json"
        );
        await writeFile(
          passwordSettingsPath,
          JSON.stringify({ isProtected: this.isProtected })
        );
      }

      return success;
    } catch (error) {
      console.error(`Error occurred: ${error}`);
      return false;
    }
  }

  /**
   * Unsets the password.
   * @param password - The password to unset.
   * @returns A promise that resolves to a boolean indicating if the password was unset successfully.
   */
  async unsetPassword(password: string): Promise<boolean> {
    try {
      const vendorPath = this.dirService.getPath("vendors", "vendors.json");
      const passwordSettingsPath = this.dirService.getPath(
        "settings",
        "passwordSettings.json"
      );

      const success = this.decryptFile(vendorPath, password);

      if (success) {
        this.isProtected = false;
        await writeFile(
          passwordSettingsPath,
          JSON.stringify({ isProtected: this.isProtected })
        );
      }

      return success;
    } catch (error) {
      console.error(`Error occurred: ${error}`);
      return false;
    }
  }

  // Helper functions

  /**
   * Checks if the data is encrypted.
   * @param data - The data to check.
   * @returns A boolean indicating if the data is encrypted.
   */
  isEncrypted(data: string): boolean {
    const lines = data.split("\n");
    return lines[0] === "ENCRYPTED";
  }

  /**
   * Decrypts the data using the provided password.
   * @param data - The data to decrypt.
   * @param password - The password to use for decryption.
   * @returns The decrypted data.
   */
  decryptData(data: string, password: string): string {
    const key = crypto.createHash("sha256").update(password).digest();
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    const encryptedData = data.replace("ENCRYPTED\n", "");

    let decryptedData = decipher.update(encryptedData, "hex", "utf8");
    decryptedData += decipher.final("utf8");

    return decryptedData;
  }

  /**
   * Encrypts the data using the provided password.
   * @param data - The data to encrypt.
   * @param password - The password to use for encryption.
   * @returns The encrypted data.
   */
  encryptData(data: string, password: string): string {
    const key = crypto.createHash("sha256").update(password).digest();
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encryptedData = cipher.update(data, "utf8", "hex");
    encryptedData += cipher.final("hex");

    return "ENCRYPTED\n" + encryptedData;
  }

  /**
   * Encrypts the file using the provided password.
   * @param filePath - The path of the file to encrypt.
   * @param password - The password to use for encryption.
   * @returns A boolean indicating if the file was encrypted successfully.
   */
  encryptFile(filePath: string, password: string): boolean {
    try {
      lockfile.lockSync(`${filePath}.lock`);

      const data = fs.readFileSync(filePath, "utf-8");
      const encryptedData = this.encryptData(data, password);

      fs.writeFileSync(filePath, encryptedData);

      lockfile.unlockSync(`${filePath}.lock`);

      return true;
    } catch (error) {
      console.error(`Failed to encrypt file: \n${error}`);
      lockfile.unlockSync(`${filePath}.lock`);

      return false;
    }
  }

  /**
   * Decrypts the file using the provided password.
   * @param filePath - The path of the file to decrypt.
   * @param password - The password to use for decryption.
   * @returns A boolean indicating if the file was decrypted successfully.
   */
  decryptFile(filePath: string, password: string): boolean {
    try {
      lockfile.lockSync(`${filePath}.lock`);

      const data = fs.readFileSync(filePath, "utf8");
      const decryptedData = this.decryptData(data, password);

      fs.writeFileSync(filePath, decryptedData);

      lockfile.unlockSync(`${filePath}.lock`);

      return true;
    } catch (error) {
      console.error(`Failed to decrypt file: \n${error}`);
      lockfile.unlockSync(`${filePath}.lock`);

      return false;
    }
  }
}
