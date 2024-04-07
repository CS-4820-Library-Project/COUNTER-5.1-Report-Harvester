export type Reports = {
  label: string;
  main: Report[];
  templates: Report[];
  standard: Report[];
  all: Report[];
};

export type Report = {
  id: Report_Id;
  name: Report_Name;
  filters: Report_Filters;
  attributes: Report_Attributes;
  Period?: Period;
};

export type Report_Filters = {
  Access_Method?: Access_Method[];
  Access_Type?: Access_Type[];
  Period?: Period;
  Section_Type?: Section_Type[]; // Only in Title Report 5.0.3
  Data_Type?: Data_Type[];
  Metric_Type?: Metric_Type[];
  YOP?: string | "All";

  // API FILTERS
  itemContributor?: string;
  itemID?: string;
};

export type Report_Attributes = {
  Attributes_To_Show?: ReportColumns[];
  Granularity?: Granularity; // JSON
  Exclude_Monthly_Details?: boolean; // Tabular
  Include_Component_Details?: boolean;
  Include_Parent_Details?: boolean;
};

export type ReportHeader = {
  reportName: Report_Name;
  reportId: Report_Id;
  release: number;
  institutionName: string;
  institutionId: string;
  Metric_Types: Metric_Type[];
  reportFilters: Report_Filters[];
  exceptions: Exception[];
  reportingPeriod: Period;
  created: Date;
  createdBy: string;
  registryRecord: string;
};

export type Exception = {
  code: string;
  message: string;
  data: string;
};

export type Period = {
  beginDate: string | Date;
  endDate: string | Date;
};

export type MainReportIDs = "TR" | "PR" | "IR" | "DR";

export type Report_Id =
  | "PR"
  | "DR"
  | "TR"
  | "IR"
  | "PR_P1"
  | "DR_D1"
  | "DR_D2"
  | "TR_B1"
  | "TR_B2"
  | "TR_B3"
  | "TR_J1"
  | "TR_J2"
  | "TR_J3"
  | "TR_J4"
  | "IR_A1"
  | "IR_M1"
  | "PR_Custom"
  | "DR_Custom"
  | "TR_Custom"
  | "IR_Custom";

export type Report_Name =
  | "Platform Report"
  | "Database Report"
  | "Title Report"
  | "Item Report"
  | "Custom Platform Report"
  | "Custom Database Report"
  | "Custom Title Report"
  | "Custom Item Report"
  | "Platform Usage"
  | "Database Search and Item Usage"
  | "Database Access Denied"
  | "Book Requests (controlled)"
  | "Book Access Denied"
  | "Book Usage by Access Type"
  | "Journal Requests (Controlled)"
  | "Journal Access Denied"
  | "Journal Usage by Access Type"
  | "Journal Requests by YOP (Controlled)"
  | "Journal Article Requests"
  | "Multimedia Item Requests";

export type Report_Filters_Labels =
  | "Access_Method"
  | "Access_Type"
  | "Begin_Date"
  | "Section_Type"
  | "End_Date"
  | "Data_Type"
  | "Item_Contributor"
  | "Item_ID"
  | "Metric_Type"
  | "YOP";

export type Report_Attributes_Labels =
  | "Exclude_Monthly_Details"
  | "Include_Component_Details"
  | "Include_Parent_Details"
  | "Attributes_To_Show";

export type ReportColumns =
  | "Title"
  | "DOI"
  | "ISBN"
  | "Print_ISSN"
  | "Online_ISSN"
  | "URI"
  | "YOP"
  | "Access_Type"
  | "Platform"
  | "Data_Type"
  | "Section_Type"
  | "Access_Method"
  | "Metric_Type"
  | "Reporting_Period_Total"
  | "Database"
  | "Publisher"
  | "Publisher_ID"
  | "Proprietary_ID"
  | "Publication_Date"
  | "Authors"
  | "Article_Version"
  | "Item";

export type Granularity = "Month" | "Totals";

export type Host_Type =
  | "A&I_Database"
  | "Aggregated_Full_Content"
  | "Data_Repository"
  | "Discovery_Service"
  | "eBook"
  | "eBook_Collection"
  | "eJournal"
  | "Full_Content_Database"
  | "Multimedia"
  | "Multimedia_Collection"
  | "Repository"
  | "Scholarly_Collaboration_Network";

export type Metric_Type =
  // Searches
  | "Searches_Regular"
  | "Searches_Automated"
  | "Searches_Federated"
  | "Searches_Platform"
  // Investigations and Requests of Items and Titles
  | "Total_Item_Investigations"
  | "Unique_Item_Investigations"
  | "Unique_Title_Investigations"
  | "Total_Item_Requests"
  | "Unique_Item_Requests"
  | "Unique_Title_Requests"
  // Access Denied
  | "No_License"
  | "Limit_Exceeded";

export type Data_Type =
  | "Article"
  | "Audiovisual"
  | "Book"
  | "Book_Segment"
  | "Database"
  | "Book"
  | "Book_Segment"
  | "Conference"
  | "Conference_Item"
  | "Database_Aggregrated"
  | "Database_AI"
  | "Database_Full"
  | "Database_Full_Item"
  | "Dataset"
  | "Image"
  | "Interactive_Resource"
  | "Journal"
  | "Multimedia"
  | "News_Item"
  | "Newspaper_or_Newsletter"
  | "Other"
  | "Patent"
  | "Platform"
  | "Reference_Work"
  | "Reference_Item"
  | "Report"
  | "Software"
  | "Sound"
  | "Standard"
  | "Thesis_or_Dissertation"
  | "Unspecified";

export type Section_Type = "Article" | "Book" | "Chapter" | "Other" | "Section";

export type Access_Method = "Regular" | "TDM";

export type Access_Type =
  | "Controlled"
  | "Other_Free_To_Read"
  | "Free_To_Read"
  | "Open"
  | "OA_Gold"
  | "OA_Delayed"
  | "Other_Subscription";

export type YOP = string;

export type Exclude_Monthly_Details = boolean;
