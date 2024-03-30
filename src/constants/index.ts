import { AppSettings } from "src/types/settings";

export const defaultSettings: AppSettings = {
  isProtected: false,
  darkMode: false,
  directories: {
    main: "./data/main_reports/",
    custom: "./data/custom_reports/",
    vendor: "./data/vendors.json",
    db: "./prisma/dev.db",
  },
  request: {
    requestInterval: 3000,
    requestTimeout: 5000,
    concurrentVendors: 5,
  },
};

export const vendorHeaders: string[] = [
  "id",
  "usageCount",
  "createdAt",
  "updatedAt",
  "name",
  "customerId",
  "requestorId",
  "baseURL",
  "apiKey",
  "platform",
  "provider",
  "startingYear",
  "notes",
  "requireIpChecking",
  "requireTwoAttemptsPerReport",
  "requireRequestsThrottled",
];

export const REPORTS = {
  PR: "Platform Report",
  TR: "Title Report",
  DR: "Database Report",
  IR: "Item Report",
  PR_P1: "Platform Usage",
  DR_D1: "Database Search and Item Usage",
  DR_D2: "Database Access Denied",
  TR_B1: "Book Requests (controlled)",
  TR_B2: "Book Access Denied",
  TR_B3: "Book Usage by Access Type",
  TR_J1: "Journal Requests (Controlled)",
  TR_J2: "Journal Access Denied",
  TR_J3: "Journal Usage by Access Type",
  TR_J4: "Journal Requests by YOP (Controlled)",
  IR_A1: "Journal Article Requests",
  IR_M1: "Multimedia Item Requests",
};

export const dataVersions = {
  data5_0: "data5_0",
  data5_1: "data5_1",
} as const;
