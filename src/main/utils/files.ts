import fs from "fs";
import path from "path";
import { AppSettings } from "../../types/settings";

/**
 * Reads a file from a relative path of the process directory and return its contents as a string.
 * @param filePath - The relative path to the file to be read.
 * @returns A promise that resolves to the contents of the file as a string.
 */
export const readFile = async (filePath: string): Promise<string | null> => {
  try {
    const currentPath = (process && process.cwd()) || "";
    const resolvedPath = path.resolve(currentPath, filePath);
    const data = await fs.promises.readFile(resolvedPath, "utf-8");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Writes a file from a relative path of the process directory and returns true or false
 * if it worked its contents as a string.
 * It creates directories if they don't exist.
 * @param filePath - The path to write the file.
 * @param data - The contents to be written to the file.
 * @returns A promise that resolves to a boolean indicating whether the file was successfully written.
 */
export const writeFile = async (
  filePath: string,
  data: string
): Promise<boolean> => {
  try {
    const currentPath = (process && process.cwd()) || "";
    const resolvedPath = path.resolve(currentPath, filePath);
    const dirPath = path.dirname(filePath);
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.promises.writeFile(resolvedPath, data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
