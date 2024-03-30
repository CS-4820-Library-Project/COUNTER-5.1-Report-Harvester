import { Report_Id } from "./counter";

type SupportedAPIResponse = {
  Path: string;
  Performance: [];
  Release: string;
  Report_Description: string;
  Report_ID: typeof Report_Id;
  Report_Name: string;
};
