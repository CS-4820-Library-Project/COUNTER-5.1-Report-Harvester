import crypto from "crypto";
import fs from "fs";
import lockfile from "lockfile";

const algorithm = "aes-256-cbc";
const iv = Buffer.alloc(16, 0); // Initialization vector.

/**
 * Checks if a string is encrypted by checking if the first line is 'ENCRYPTED'.
 * @param data - The string to be checked.
 * @returns A boolean indicating whether the string is encrypted or not.
 */
export const isEncrypted = (data: string): boolean => {
  const lines = data.split("\n");
  return lines[0] === "ENCRYPTED";
};

/**
 * Decrypts an encrypted string using AES-256-CBC encryption algorithm.
 * @param data - The encrypted data to be decrypted.
 * @param password - The password used for decryption.
 * @returns The decrypted data as a string.
 */
export const decryptData = (data: string, password: string): string => {
  const key = crypto.createHash("sha256").update(password).digest();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const encryptedData = data.replace("ENCRYPTED\n", "");
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
};

/**
 * Encrypts a string using AES-256-CBC encryption algorithm.
 * @param data - The data to be encrypted.
 * @param password - The password used for encryption.
 * @returns The encrypted data as a string.
 */
export const encryptData = (data: string, password: string): string => {
  const key = crypto.createHash("sha256").update(password).digest();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return "ENCRYPTED\n" + encryptedData;
};

/**
 * Encrypts a file using AES-256-CBC encryption algorithm. And adds an encryption header to the file.
 * @param filePath - The path to the file to be encrypted.
 * @param password - The password used for encryption.
 * @returns A boolean indicating whether the file was encrypted successfully.
 */
export function encryptFile(filePath: string, password: string): boolean {
  try {
    lockfile.lockSync(`${filePath}.lock`);
    const data = fs.readFileSync(filePath, "utf-8");
    const encryptedData = encryptData(data, password);
    fs.writeFileSync(filePath, encryptedData);
    lockfile.unlockSync(`${filePath}.lock`); // Unlock the file after encryption
    return true;
  } catch (error) {
    console.error(`Failed to encrypt file: \n${error}`);
    lockfile.unlockSync(`${filePath}.lock`);
    return false;
  }
}

/**
 * Decrypts a file that was encrypted using AES-256-CBC encryption algorithm.
 * @param filePath - The path to the file to be decrypted.
 * @param password - The password used for decryption.
 * @returns A boolean indicating whether the file was decrypted successfully.
 */
export function decryptFile(filePath: string, password: string): boolean {
  try {
    lockfile.lockSync(`${filePath}.lock`);
    const data = fs.readFileSync(filePath, "utf8");
    const decryptedData = decryptData(data, password);
    fs.writeFileSync(filePath, decryptedData);
    lockfile.unlockSync(`${filePath}.lock`);
    return true;
  } catch (error) {
    console.error(`Failed to decrypt file: \n${error}`);
    lockfile.unlockSync(`${filePath}.lock`);
    return false;
  }
}
