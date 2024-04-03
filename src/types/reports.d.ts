import { IFetchError } from "src/renderer/src/interface/IFetchError";
import { Report_Id } from "./counter";
import { string } from "yup";

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
  custom: boolean;
  vendorName: string;
  success: boolean;
  error?: IFetchError | string;
  warning?: IFetchError | string;
};

type VendorFetchSummary = {
  succeeded: number;
  vendors: {
    name: string;
    reports: {
      reportId: string;
      success: boolean;
      error?: IFetchError | string;
      warning?: IFetchError | string;
    }[];
    totalSucceed: number;
  }[];
};

export type FetchResults = {
  main: VendorFetchSummary;
  custom: VendorFetchSummary;
  failed: number;
  log: string;
};
