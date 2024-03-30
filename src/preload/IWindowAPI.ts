/**
 * Represents the API for managing directory settings, fetching reports, managing vendors,
 * and interacting with Prisma reports.
 */
import { LocalAPI } from "./Interface/ILocalAPI";
import { IReportsApi } from "./Interface/IReportsAPI";
import { IVendorsApi } from "./Interface/IVendorAPI";
import { ITsvAPI } from "./Interface/ITsvAPI";
import { ISettingsAPI } from "./Interface/ISettingsAPI";
import { ILoggerAPI } from "src/preload/Interface/ILoggerAPI";
import { IDatabaseAPI } from "./Interface/IDatabaseAPI";

declare global {
  interface Window {
    /**
     * API for managing local directory settings.
     */
    localAPI: LocalAPI;

    /**
     * API for fetching reports.
     */
    reports: IReportsApi;

    /**
     * API for managing vendors.
     */
    vendors: IVendorsApi;

    /**
     * API for interacting with TSV (Tab-Separated Values) files.
     */
    tsv: ITsvAPI;

    /**
     * API for managing application settings.
     */
    settings: ISettingsAPI;

    /**
     * API for logging messages.
     */
    logger: ILoggerAPI;

    /**
     * API for interacting with the database.
     */
    database: IDatabaseAPI;
  }
}
