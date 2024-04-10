export type VendorRecord = VendorData & {
  id: number;
  usageCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type VendorInfo = {
  customerId: string;
  requestorId: string;
  baseURL: string;
  apiKey?: string;
  platform: string;
  provider: string;
  notes: string;
  // startingYear: number;
  requireTwoAttemptsPerReport: boolean;
  requireRequestsThrottled: boolean;
};

export type VendorData = {
  name: string;
  data5_1?: VendorInfo;
  data5_0?: VendorInfo & {
    requireIpChecking: boolean;
  };
};

export type VendorTSV = VendorInfo & {
  id: number;
  version: VendorVersions;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  requireIpChecking?: boolean;
};

export type VendorTsvError = {
  id: number;
  vendor: string;
  errors: string[];
};

export type VendorHeaders = keyof VendorTSV;

export type SortOptions = "name" | "updatedAt" | "createdAt";

export type VendorVersions = "All" | "5.0" | "5.1";

export type DataVersions = "data5_0" | "data5_1";
