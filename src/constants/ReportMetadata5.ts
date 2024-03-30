import {
  Access_Method,
  Access_Type,
  Data_Type,
  Host_Type,
  Metric_Type,
  Report_Filters_Labels,
} from "../types/counter";

export const Host_Types: Host_Type[] = [
  "A&I_Database",
  "Aggregated_Full_Content",
  "Data_Repository",
  "Discovery_Service",
  "eBook",
  "eBook_Collection",
  "eJournal",
  "Full_Content_Database",
  "Multimedia",
  "Multimedia_Collection",
  "Repository",
  "Scholarly_Collaboration_Network",
];

export const Data_Types: Data_Type[] = [
  "Article",
  "Book",
  "Book_Segment",
  "Database",
  "Dataset",
  "Journal",
  "Multimedia",
  "Newspaper_or_Newsletter",
  "Other",
  "Platform",
  "Thesis_or_Dissertation",
  "Unspecified",
];

// TITLE REPORT ONLY
export const Section_Types = [
  "Article",
  "Journal",
  "Chapter",
  "Other",
  "Section",
];

export const Metric_Types: Metric_Type[] = [
  "Searches_Regular",
  "Searches_Automated",
  "Searches_Federated",
  "Searches_Platform",
  "Total_Item_Investigations",
  "Unique_Item_Investigations",
  "Unique_Title_Investigations",
  "Total_Item_Requests",
  "Unique_Item_Requests",
  "Unique_Title_Requests",
  "No_License",
  "Limit_Exceeded",
];

export const Access_Methods: Access_Method[] = ["Regular", "TDM"];

export const Access_Types: Access_Type[] = [
  "Controlled",
  "OA_Gold",
  "OA_Delayed",
  "Other_Free_To_Read",
];

export const allowedFilters: Report_Filters_Labels[] = [
  "Access_Method",
  "Access_Type",
  "Begin_Date",
  "End_Date",
  "Data_Type",
  "Item_Contributor",
  "Item_ID",
  "Metric_Type",
  "Section_Type",
  "YOP",
];

export const allowedAttributes = [
  "Attributes_To_Show",
  "Exclude_Monthly_Details", // TAB
  "Granularity", // JSON
  "Include_Component_Details",
  "Include_Parent_Details",
];
