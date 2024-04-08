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

export type ReportResult = {
  reportId: string;
  success: boolean;
  errors: (IFetchError | string | undefined)[];
  warnings: (IFetchError | string | undefined)[];
};

export type FetchResult = {
  timestamp: string;
  custom: boolean;
  vendorName: string;
} & ReportResult;

type VendorFetchSummary = {
  succeeded: number;
  vendors: {
    name: string;
    reports: ReportResult[];
    totalSucceed: number;
  }[];
};

export type FetchResults = {
  main: VendorFetchSummary;
  custom: VendorFetchSummary;
  failed: number;
  log: string;
};

export type NameValue = {
  Name: string;
  Value: string;
};

export type TypeValue = {
  Type: string;
  Value: string;
};
