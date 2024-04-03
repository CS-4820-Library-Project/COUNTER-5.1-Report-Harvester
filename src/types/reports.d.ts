import { Report_Id } from "./counter";

export type SupportedAPIResponse = {
  Path: string;
  Performance: [];
  Release: string;
  Report_Description: string;
  Report_ID: typeof Report_Id;
  Report_Name: string;
};

export type FetchData = {
  fetchReports: Report[];
  selectedVendors: VendorRecord[];
  version: string;
  fromDate: Date;
  toDate: Date;
};

export type FetchResult = {
  reportId: string;
  custom: true;
  vendorName: string;
  success: boolean;
};

type VendorFetchSummary = {
  succeeded: number;
  vendors: {
    name: string;
    reports: { reportId: string; success: boolean }[];
    totalSucceed: number;
  }[];
};

export type FetchResults = {
  main: VendorFetchSummary;
  custom: VendorFetchSummary;
  failed: number;
  log: string;
};
