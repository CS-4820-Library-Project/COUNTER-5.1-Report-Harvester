/**
 * This file serves as the entry point for the preload script.
 * It imports and initializes various APIs used in the application.
 */
import ReportsApi from "./API/FetchReportsAPI";
import DatabaseAPI from "./API/DatabaseAPI";
import SettingsAPI from "./API/SettingsAPI";
import VendorAPI from "./API/vendorsAPI";
import TsvAPI from "./API/TsvAPI";
import LoggerAPI from "./API/loggerAPI";

VendorAPI();
SettingsAPI();
ReportsApi();
DatabaseAPI();
LoggerAPI();
TsvAPI();
