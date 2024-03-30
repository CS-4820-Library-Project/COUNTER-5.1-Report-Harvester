/** Contains all possible Vendor headers (both 5.0 and 5.1) from the vendors Excel file */

export enum ExcelHeaders {
  ID = "ID",
  NAME = "Name",
  USAGE_COUNT = "Usage Count",
  CREATED_AT = "Created At",
  UPDATED_AT = "Updated At",
  CUSTOMER_ID = "Customer ID",
  REQUESTOR_ID = "Requestor ID",
  BASE_URL = "Base URL",
  API_KEY = "API Key",
  PLATFORM = "Platform",
  PROVIDER = "Provider",
  NOTES = "Description",
  NON_SUSHI = "Non SUSHI",
  REQUIRE_TWO_ATTEMPTS = "Require Two Attempts",
  REQUIRE_IP_CHECKING = "Require IP Checking",
  REQUIRE_REQUESTS_THROTTLED = "Require Throttling",
}

/** Contains all sheet names from the vendors Excel file */

export enum ExcelSheetNames {
  VENDORS_5_0 = "5.0 Vendors",
  VENDORS_5_1 = "5.1 Vendors",
}

/** An array of all the generic Vendor headers, in the order they appear in the vendors Excel file */

const BaseHeaders = [
  ExcelHeaders.ID,
  ExcelHeaders.NAME,
  ExcelHeaders.USAGE_COUNT,
  ExcelHeaders.CREATED_AT,
  ExcelHeaders.UPDATED_AT,
  ExcelHeaders.CUSTOMER_ID,
  ExcelHeaders.REQUESTOR_ID,
  ExcelHeaders.BASE_URL,
  ExcelHeaders.API_KEY,
  ExcelHeaders.PLATFORM,
  ExcelHeaders.PROVIDER,
  ExcelHeaders.NOTES,
];

/** An array of all the 5.0 Vendor headers, in the order they appear in the vendors Excel file */

export const Headers_5_0 = [...BaseHeaders, ExcelHeaders.NON_SUSHI];

/** An array of all the 5.1 Vendor headers, in the order they appear in the vendors Excel file */

export const Headers_5_1 = [
  ...BaseHeaders,
  ExcelHeaders.REQUIRE_TWO_ATTEMPTS,
  ExcelHeaders.REQUIRE_IP_CHECKING,
  ExcelHeaders.REQUIRE_REQUESTS_THROTTLED,
];
