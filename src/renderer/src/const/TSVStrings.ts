const TSVHeaderSuffix = '\tMetric_Type\tReporting_Period_Total\t';

const createHeaderRow = (headers: Array<string>) => headers.join('\t') + TSVHeaderSuffix;


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
    YOP = "YOP"
}


/** An array of all Item ID - related TSV headers for TRs */

export const TRItemIdHeaders = [
    TSVHeaders.DOI, TSVHeaders.YOP, TSVHeaders.PROPRIETARY_ID, TSVHeaders.ISBN, TSVHeaders.PRINT_ISSN,
    TSVHeaders.ONLINE_ISSN, TSVHeaders.URI, TSVHeaders.DATA_TYPE
];


/** A dictionary mapping Report IDs (report types) to their respective TSV headers */

export const ReportIDTSVHeaderDict: Record<string, string> = {
    "TR": createHeaderRow([
        TSVHeaders.TITLE, TSVHeaders.PUBLISHER, TSVHeaders.PUBLISHER_ID,
        TSVHeaders.PLATFORM, ...TRItemIdHeaders
    ]),
    "PR": createHeaderRow([TSVHeaders.PLATFORM]),
    "IR": createHeaderRow([TSVHeaders.TITLE, TSVHeaders.PLATFORM, TSVHeaders.DOI, TSVHeaders.YOP]),
    "DR": createHeaderRow([TSVHeaders.DATABASE, TSVHeaders.PLATFORM])
}

