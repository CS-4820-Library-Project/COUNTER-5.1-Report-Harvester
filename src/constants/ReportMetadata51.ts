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

export const Data_Types: Data_Type[] = [
  "Article",
  "Audiovisual",
  "Book",
  "Book_Segment",
  "Conference",
  "Conference_Item",
  "Database_Aggregrated",
  "Database_AI",
  "Database_Full",
  "Database_Full_Item",
  "Dataset",
  "Image",
  "Interactive_Resource",
  "Journal",
  "Multimedia",
  "News_Item",
  "Newspaper_or_Newsletter",
  "Other",
  "Patent",
  "Platform",
  "Reference_Item",
  "Reference_Work",
  "Report",
  "Software",
  "Sound",
  "Standard",
  "Thesis_or_Dissertation",
  "Unspecified",
];

export const Access_Types: Access_Type[] = [
  "Controlled",
  "Open",
  "Free_To_Read",
];

export const Access_Methods: Access_Method[] = ["Regular", "TDM"];

export const AllowedFilters: Report_Filters_Labels[] = [
  "Access_Method",
  "Access_Type",
  "Begin_Date",
  "End_Date",
  "Data_Type",
  "Item_Contributor",
  "Item_ID",
  "Metric_Type",
  "YOP",
];

export const AllowedAttributes = [
  "Attributes_To_Show",
  "Exclude_Monthly_Details", // TAB
  "Granularity", // JSON
  "Include_Component_Details",
  "Include_Parent_Details",
];
