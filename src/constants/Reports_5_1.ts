import { Report, Reports } from "../types/counter";
import { Access_Methods, Data_Types } from "./ReportMetadata5";

// --------------------------- PR TEMPLATE - Platform Report TEMPLATE---------------------------
export const PR_TEMPLATE: Report = {
  id: "PR",
  name: "Platform Report",
  filters: {
    Data_Type: Data_Types.filter(
      (d) =>
        d !== "Database_Aggregrated" &&
        d !== "Database_AI" &&
        d !== "Database_Full"
    ),
    Metric_Type: [
      "Searches_Platform",
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Unique_Title_Investigations",
      "Unique_Title_Requests",
    ],
    Access_Method: Access_Methods,
  },
  attributes: {
    Exclude_Monthly_Details: false,
    Attributes_To_Show: [
      "Platform",
      "Data_Type",
      "Access_Method",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
  },
};

// --------------------------- PR - Platform Report---------------------------
export const PR: Report = {
  id: "PR",
  name: "Platform Report",
  filters: {
    Data_Type: Data_Types.filter(
      (d) =>
        d !== "Database_Aggregrated" &&
        d !== "Database_AI" &&
        d !== "Database_Full"
    ),
    Metric_Type: [
      "Searches_Platform",
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Unique_Title_Investigations",
      "Unique_Title_Requests",
    ],
    Access_Method: Access_Methods,
  },
  attributes: {
    Exclude_Monthly_Details: false,
    Attributes_To_Show: [
      "Platform",
      "Data_Type",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
  },
};

//-----------------------------  PR_P1 - Platform Usage ------------------------
export const PR_P1: Report = {
  id: "PR_P1",
  name: "Platform Usage",
  filters: {
    Access_Method: ["Regular"],
    Metric_Type: [
      "Searches_Platform",
      "Total_Item_Requests",
      "Unique_Item_Requests",
      "Unique_Title_Requests",
    ],
    Data_Type: Data_Types.filter(
      (d) =>
        d !== "Database_Aggregrated" &&
        d !== "Database_AI" &&
        d !== "Database_Full"
    ),
  },
  attributes: {
    Attributes_To_Show: [
      "Platform",
      "Data_Type",
      "Access_Method",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

//  ------------------------------- DR TEMPLATE - Database Report TEMPLATE--------------------------
export const DR_TEMPLATE: Report = {
  id: "DR",
  name: "Database Report",
  filters: {
    Data_Type: Data_Types.filter(
      (d) =>
        d !== "Article" &&
        d !== "Book_Segment" &&
        d !== "Conference_Item" &&
        d !== "Dataset" &&
        d !== "News_Item" &&
        d !== "Platform" &&
        d !== "Reference_Item" &&
        d !== "Software"
    ),
    Metric_Type: [
      "Searches_Automated",
      "Searches_Federated",
      "Searches_Regular",
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Unique_Title_Investigations",
      "Unique_Title_Requests",
      "Limit_Exceeded",
      "No_License",
    ],
    Access_Method: Access_Methods,
  },
  attributes: {
    Attributes_To_Show: [
      "Database",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "Proprietary_ID",
      "Data_Type",
      "Access_Method",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
  },
};

//  ------------------------------- DR - Database Report --------------------------
export const DR: Report = {
  id: "DR",
  name: "Database Report",
  filters: {
    Data_Type: Data_Types.filter(
      (d) =>
        d !== "Article" &&
        d !== "Book_Segment" &&
        d !== "Conference_Item" &&
        d !== "Dataset" &&
        d !== "News_Item" &&
        d !== "Platform" &&
        d !== "Reference_Item" &&
        d !== "Software"
    ),
    Metric_Type: [
      "Searches_Automated",
      "Searches_Federated",
      "Searches_Regular",
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Unique_Title_Investigations",
      "Unique_Title_Requests",
      "Limit_Exceeded",
      "No_License",
    ],
    Access_Method: Access_Methods,
  },
  attributes: {
    Attributes_To_Show: [
      "Database",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "Proprietary_ID",
      "Data_Type",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
  },
};

//  -----------------------  DR_D1 - Database Search and Item Usage -----------------
export const DR_D1: Report = {
  id: "DR_D1",
  name: "Database Search and Item Usage",
  filters: {
    Data_Type: Data_Types.filter(
      (d) =>
        d !== "Article" &&
        d !== "Book_Segment" &&
        d !== "Conference_Item" &&
        d !== "Dataset" &&
        d !== "News_Item" &&
        d !== "Platform" &&
        d !== "Reference_Item" &&
        d !== "Software"
    ),
    Metric_Type: [
      "Searches_Automated",
      "Searches_Federated",
      "Searches_Regular",
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
    ],
    Access_Method: ["Regular"],
  },
  attributes: {
    Attributes_To_Show: [
      "Database",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "Proprietary_ID",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
  },
};

//  ------------------------  DR_D2 - Database Access Denied ----------------------------
export const DR_D2: Report = {
  id: "DR_D2",
  name: "Database Access Denied",
  filters: {
    Data_Type: Data_Types.filter(
      (d) =>
        d !== "Article" &&
        d !== "Book_Segment" &&
        d !== "Conference_Item" &&
        d !== "Dataset" &&
        d !== "News_Item" &&
        d !== "Platform" &&
        d !== "Reference_Item" &&
        d !== "Software"
    ),
    Metric_Type: ["Limit_Exceeded", "No_License"],
    Access_Method: ["Regular"],
  },
  attributes: {
    Attributes_To_Show: [
      "Database",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "Proprietary_ID",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
  },
};
//  -------------------------------  TR TEMPLATE - Title Report TEMPLATE-------------------------------
export const TR_TEMPLATE: Report = {
  id: "TR",
  name: "Title Report",
  filters: {
    Metric_Type: [
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Unique_Title_Investigations",
      "Unique_Title_Requests",
      "Limit_Exceeded",
      "No_License",
    ],
    Data_Type: [
      "Book",
      "Conference",
      "Journal",
      "Newspaper_or_Newsletter",
      "Other",
      "Patent",
      "Reference_Work",
      "Report",
      "Standard",
      "Thesis_or_Dissertation",
      "Unspecified",
    ],
    Access_Method: ["Regular", "TDM"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "ISBN",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Data_Type",
      "YOP",
      "Access_Type",
      "Access_Method",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};
//  -------------------------------  TR - Title Report -------------------------------
export const TR: Report = {
  id: "TR",
  name: "Title Report",
  filters: {
    Metric_Type: [
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Unique_Title_Investigations",
      "Unique_Title_Requests",
      "Limit_Exceeded",
      "No_License",
    ],
    Data_Type: [
      "Book",
      "Conference",
      "Journal",
      "Newspaper_or_Newsletter",
      "Other",
      "Patent",
      "Reference_Work",
      "Report",
      "Standard",
      "Thesis_or_Dissertation",
      "Unspecified",
    ],
    Access_Method: ["Regular", "TDM"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "ISBN",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Data_Type",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

// -----------------------   TR_B1 - Book Requests (controlled) -----------------
export const TR_B1: Report = {
  id: "TR_B1",
  name: "Book Requests (controlled)",
  filters: {
    Metric_Type: ["Total_Item_Requests", "Unique_Title_Requests"],
    Data_Type: ["Book", "Reference_Work"],
    Access_Method: ["Regular"],
    Access_Type: ["Controlled"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "ISBN",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Data_Type",
      "YOP",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

// --------------------------  TR_B2 - Book Access Denied -----------------
export const TR_B2: Report = {
  id: "TR_B2",
  name: "Book Access Denied",
  filters: {
    Metric_Type: ["Limit_Exceeded", "No_License"],
    Data_Type: ["Book", "Reference_Work"],
    Access_Method: ["Regular"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "ISBN",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Data_Type",
      "YOP",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

// -----------------  TR_B3 - Book Usage by Access Type -----------------
export const TR_B3: Report = {
  id: "TR_B3",
  name: "Book Usage by Access Type",
  filters: {
    Metric_Type: [
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Unique_Title_Investigations",
      "Unique_Title_Requests",
    ],
    Data_Type: ["Book", "Reference_Work"],
    Access_Method: ["Regular"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "ISBN",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Data_Type",
      "YOP",
      "Access_Type",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

// -----------------  TR_J1 - Journal Requests (Controlled) -----------------
export const TR_J1: Report = {
  id: "TR_J1",
  name: "Journal Requests (Controlled)",
  filters: {
    Metric_Type: ["Total_Item_Requests", "Unique_Item_Requests"],
    Data_Type: ["Journal"],
    Access_Method: [],
    Access_Type: ["Controlled"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "ISBN",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

// -----------------  TR_J2 - Journal Access Denied -----------------
export const TR_J2: Report = {
  id: "TR_J2",
  name: "Journal Access Denied",
  filters: {
    Metric_Type: ["Limit_Exceeded", "No_License"],
    Data_Type: ["Journal"],
    Access_Method: ["Regular"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

// -----------------  TR_J3 - Journal Usage by Access Type -----------------
export const TR_J3: Report = {
  id: "TR_J3",
  name: "Journal Usage by Access Type",
  filters: {
    Metric_Type: [
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
    ],
    Data_Type: ["Journal"],
    Access_Method: ["Regular"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Access_Type",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

// -----------------  TR_J4 - Journal Requests by YOP (Controlled) -----------------
export const TR_J4: Report = {
  id: "TR_J4",
  name: "Journal Requests by YOP (Controlled)",
  filters: {
    Metric_Type: ["Total_Item_Requests", "Unique_Item_Requests"],
    Data_Type: ["Journal"],
    Access_Method: ["Regular"],
    Access_Type: ["Controlled"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Title",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "YOP",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
  },
};

// -----------------  IR - Item Report TEMPLATE -----------------
export const IR_TEMPLATE: Report = {
  id: "IR",
  name: "Item Report",
  filters: {
    Metric_Type: [
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Limit_Exceeded",
      "No_License",
    ],
    Data_Type: Data_Types.filter(
      (d) =>
        [
          "Book",
          "Conference",
          "Database_Aggregated",
          "Database_AI",
          "Database_Full",
          "Journal",
          "Newspaper_or_Newsletter",
          "Platform",
          "Reference_Work",
        ].includes(d) // TODO
    ),

    Access_Method: ["Regular", "TDM"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Item",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "Authors",
      "Publication_Date",
      "Article_Version",
      "DOI",
      "Proprietary_ID",
      "ISBN",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Data_Type",
      "YOP",
      "Access_Type",
      "Access_Method",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
    Include_Component_Details: false,
    Include_Parent_Details: false,
  },
};

// -----------------  IR - Item Report -----------------
export const IR: Report = {
  id: "IR",
  name: "Item Report",
  filters: {
    Metric_Type: [
      "Total_Item_Investigations",
      "Total_Item_Requests",
      "Unique_Item_Investigations",
      "Unique_Item_Requests",
      "Limit_Exceeded",
      "No_License",
    ],
    Data_Type: [], // TODO
    Access_Method: ["Regular", "TDM"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Item",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "ISBN",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Data_Type",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
    Include_Component_Details: false,
    Include_Parent_Details: false,
  },
};

// -----------------  IR_A1 - Journal Access Denied -----------------
export const IR_A1: Report = {
  id: "IR_A1",
  name: "Journal Article Requests",
  filters: {
    Metric_Type: ["Total_Item_Requests", "Unique_Item_Requests"],
    Data_Type: ["Article"],
    Access_Method: ["Regular"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Item",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "Authors",
      "Publication_Date",
      "Article_Version",
      "DOI",
      "Proprietary_ID",
      "Print_ISSN",
      "Online_ISSN",
      "URI",
      "Access_Type",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
    Include_Component_Details: false,
    Include_Parent_Details: false,
  },
};

// -----------------  IR_M1 - Journal Usage by Access Type -----------------
export const IR_M1: Report = {
  id: "IR_M1",
  name: "Multimedia Item Requests",
  filters: {
    Data_Type: [
      "Audiovisual",
      "Image",
      "Interactive_Resource",
      "Multimedia",
      "Sound",
    ],
    Metric_Type: ["Total_Item_Requests", "Unique_Item_Requests"],
    Access_Method: ["Regular"],
    Access_Type: ["Controlled", "Open", "Free_To_Read"],
    YOP: "All",
  },
  attributes: {
    Attributes_To_Show: [
      "Item",
      "Publisher",
      "Publisher_ID",
      "Platform",
      "DOI",
      "Proprietary_ID",
      "URI",
      "Data_Type",
      "Metric_Type",
      "Reporting_Period_Total",
    ],
    Exclude_Monthly_Details: false,
    Include_Component_Details: false,
    Include_Parent_Details: false,
  },
};

export const reports_5_1: Reports = {
  label: "COUNTER 5.1 Reports",
  main: [PR, DR, TR, IR],
  templates: [PR_TEMPLATE, DR_TEMPLATE, TR_TEMPLATE, IR_TEMPLATE],
  standard: [
    PR_P1,
    DR_D1,
    DR_D2,
    TR_B1,
    TR_B2,
    TR_B3,
    TR_J1,
    TR_J2,
    TR_J3,
    TR_J4,
    IR_A1,
    IR_M1,
  ],
  all: [
    PR,
    DR,
    TR,
    IR,
    PR_P1,
    DR_D1,
    DR_D2,
    TR_B1,
    TR_B2,
    TR_B3,
    TR_J1,
    TR_J2,
    TR_J3,
    TR_J4,
    IR_A1,
    IR_M1,
  ],
};
