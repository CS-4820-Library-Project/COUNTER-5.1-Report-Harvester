/**
 * Represents a report containing header information and report items.
 */
export interface IReport {
  Report_Header: IReportHeader;
  Report_Items: IReportItem[];
}

/**
 * Represents the header information of a report.
 */
export interface IReportHeader {
  Report_Name: string;
  Report_ID: string;
  Institution_Name: string;
  Release: string;
  Institution_ID: IInstitutionId[] | string;
  Metric_Types?: string;
  Report_Filters?: string | IReportFilter[];
  Report_Attributes?: string;
  Exceptions?: string;
  Reporting_Period?: string;
  Created: string;
  Created_By: string;
  Registry_Record?: string;
}

/**
 * Represents an institution ID.
 */
export interface IInstitutionId {
  Type: string;
  Value: string;
}

/**
 * Represents a report filter.
 */
export interface IReportFilter {
  Name: string;
  Value: string;
}

/**
 * Represents a report item containing platform information and performance data.
 */
export interface IReportItem {
  Platform: string;
  Item_ID: IItemId[];
  Performance: IPerformance[];
}

/**
 * Represents a report item with additional publisher information.
 */
export interface IItemPubReportItem extends IReportItem {
  Publisher_ID: IPublisherId[];
  Publisher: string;
}

/**
 * Represents a report item with additional title information.
 */
export interface ITRIRReportItem extends IItemPubReportItem {
  Title: string;
}

/**
 * Represents a report item with additional database information.
 */
export interface IDRReportItem extends IItemPubReportItem {
  Database: string;
}

/**
 * Represents the performance data for a specific period and instance.
 */
export interface IPerformance {
  Period: IPeriod;
  Instance: IInstance[];
}

/**
 * Represents a specific period.
 */
export interface IPeriod {
  Begin_Date: string;
  End_Date: string;
}

/**
 * Represents a specific instance of a metric type and count.
 */
export interface IInstance {
  Metric_Type: string;
  Count: number;
}

/**
 * Represents an item ID.
 */
export interface IItemId {
  Type: string;
  Value: string;
}

/**
 * Represents a publisher ID.
 */
export interface IPublisherId {
  Type: string;
  Value: string;
}
