const createHeaderRow = (headers: Array<string>) => headers.join("\t");

/** A generic suffix for TSV report item headers */

export const TSVHeaderSuffix = `${TSVHeaders.METRIC_TYPE}\t${TSVHeaders.REPORTING_PERIOD_TOTAL}\t`;

/** An enum containing all different possible headers for a column in a TSV file */

export enum TSVHeaders {
  // Report Header

  REPORT_NAME = "Report_Name",
  REPORT_ID = "Report_ID",
  RELEASE = "Release",
  INST_NAME = "Institution_Name",
  INST_ID = "Institution_ID",
  METRIC_TYPES = "Metric_Types",
  REPORT_FILTERS = "Report_Filters",
  REPORT_ATTRIBUTES = "Report_Attributes",
  EXCEPTIONS = "Exceptions",
  REPORTING_PERIOD = "Reporting_Period",
  CREATED = "Created",
  CREATED_BY = "Created_By",
  REGISTRY_RECORD = "Registry_Record",

  // Report Items

  TITLE = "Title",
  PUBLISHER = "Publisher",
  PUBLISHER_ID = "Publisher_ID",
  PLATFORM = "Platform",
  DOI = "DOI",
  PROPRIETARY_ID = "Proprietary_ID",
  ISBN = "ISBN",
  PRINT_ISSN = "Print_ISSN",
  ONLINE_ISSN = "Online_ISSN",
  URI = "URI",
  DATA_TYPE = "Data_Type",
  DATABASE = "Database",
  YOP = "YOP",
  AUTHORS = "Authors",
  PUBLICATION_DATE = "Publication_Date",
  ARTICLE_VERSION = "Article_Version",
  ACCESS_TYPE = "Access_Type",
  ACCESS_METHOD = "Access_Method",
  METRIC_TYPE = "Metric_Type",
  REPORTING_PERIOD_TOTAL = "Reporting_Period_Total",
}

const DRTRIRSharedHeaders = [
  TSVHeaders.PUBLISHER,
  TSVHeaders.PUBLISHER_ID,
  TSVHeaders.PLATFORM,
];

const TRIRSharedHeaders = [TSVHeaders.TITLE, ...DRTRIRSharedHeaders];

/** A dictionary mapping Report IDs (report types) to their respective TSV headers */

export const ReportIDTSVHeaderDict: Record<string, string> = {
  TR: createHeaderRow([...TRIRSharedHeaders]),
  PR: createHeaderRow([TSVHeaders.PLATFORM]),
  IR: createHeaderRow([...TRIRSharedHeaders]),
  DR: createHeaderRow([TSVHeaders.DATABASE, ...DRTRIRSharedHeaders]),
};
