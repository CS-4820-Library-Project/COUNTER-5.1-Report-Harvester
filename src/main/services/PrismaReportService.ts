import {
  DR_D1_Item,
  DR_D1_ItemMetric,
  DR_D2_Item,
  DR_D2_ItemMetric,
  DR_Item,
  DR_ItemMetric,
  IR_A1_Item,
  IR_A1_ItemMetric,
  IR_Item,
  IR_ItemMetric,
  IR_M1_Item,
  IR_M1_ItemMetric,
  PR_Item,
  PR_ItemMetric,
  PR_P1_Item,
  PR_P1_ItemMetric,
  PrismaClient,
  Report,
  ReportFilter,
  TR_B1_Item,
  TR_B1_ItemMetric,
  TR_B2_Item,
  TR_B2_ItemMetric,
  TR_B3_Item,
  TR_B3_ItemMetric,
  TR_Item,
  TR_ItemMetric,
  TR_J1_Item,
  TR_J1_ItemMetric,
  TR_J2_Item,
  TR_J2_ItemMetric,
  TR_J3_Item,
  TR_J3_ItemMetric,
  TR_J4_Item,
  TR_J4_ItemMetric,
} from "@prisma/client";
import {
  IDRReportItem,
  IReport,
  ITRIRReportItem,
} from "src/renderer/src/interface/IReport";
import { DirectorySettingService } from "./DirectorySettingService";
import { writeFile } from "fs-extra";
import { format } from "date-fns";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { reports_5 } from "src/constants/Reports_5";

const prisma = new PrismaClient();

type WhereClause = {
  title?: {
    contains: string;
  };
  OR?: [
    {
      onlineIssn: {
        contains: string;
      };
    },
    {
      printIssn: {
        contains: string;
      };
    },
  ];
  isbn?: {
    contains: string;
  };
};

export class PrismaReportService {
  /**
   * Creates a report with the given information.
   *
   * @param {Object} report - The report data.
   * @param {string} report.report_id - The ID of the report.
   * @param {string} report.report_name - The name of the report.
   * @param {string} report.release - The release of the report.
   * @param {string[]} report.metric_types - The metric types of the report.
   * @param {string[]} report.report_attributes - The attributes of the report.
   * @param {string[]} report.exceptions - The exceptions to the report.
   * @param {string} report.reporting_period - The reporting period of the report.
   * @param {string} report.institution_name - The name of the institution for the report.
   * @param {string} report.institution_id - The ID of the institution for the report.
   * @param {string} report.created - The creation date of the report.
   * @param {string} report.created_by - The creator of the report.
   * @param {string} report.registry_record - The registry record of the report.
   * @returns {Promise<Report>} A promise that resolves with the created report.
   * @throws {Error} If there is an error creating the report.
   */
  async createReport({
    report_id,
    report_name,
    release,
    metric_types,
    report_attributes,
    exceptions,
    reporting_period,
    institution_name,
    institution_id,
    created,
    created_by,
    registry_record,
  }: Omit<Report, "id">): Promise<Report> {
    try {
      return await prisma.report.create({
        data: {
          report_id,
          report_name,
          release,
          metric_types,
          report_attributes,
          exceptions,
          reporting_period,
          institution_name,
          institution_id,
          created,
          created_by,
          registry_record,
        },
      });
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  /**
   * Creates a new report filter.
   *
   * @param {Omit<ReportFilter, "id">} data - The data for the new report filter.
   * @return {Promise<ReportFilter>} A Promise that resolves with the created report filter.
   * @throws {Error} If there is an error creating the report filter.
   */
  async createReportFilter(
    data: Omit<ReportFilter, "id">,
  ): Promise<ReportFilter> {
    try {
      return await prisma.reportFilter.create({
        data,
      });
    } catch (error) {
      console.error("Error creating report filter:", error);
      throw error;
    }
  }

  /**
   * Creates a new PR_Item in the database.
   *
   * @param {Object} data - The data required to create a new PR_Item.
   * @param {string} data.reportId - The report ID associated with the PR_Item.
   * @param {string} data.platform - The platform associated with the PR_Item.
   * @param {string} data.metricType - The metric type associated with the PR_Item.
   * @param {number} data.periodTotal - The period total associated with the PR_Item.
   *
   * @returns {Promise<Object>} - A promise that resolves with the created PR_Item object.
   * @throws {Error} - If there is an error creating the PR_Item.
   */
  async createPRItem(data: Omit<PR_Item, "id">): Promise<PR_Item> {
    try {
      const { reportId, platform, metricType, periodTotal } = data;

      return await prisma.pR_Item.create({
        data: {
          reportId,
          platform,
          metricType,
          periodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new PR_ItemMetric.
   *
   * @param {Object} details - The details of the PR_ItemMetric to be created.
   * @param {number} details.reportItemId - The ID of the report item associated with the metric.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @returns {Promise<Object>} - A Promise that resolves with the created PR_ItemMetric object.
   */
  async createPRItemMetric(
    details: Omit<PR_ItemMetric, "id">,
  ): Promise<PR_ItemMetric> {
    return prisma.pR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new PR_P1_Item.
   *
   * @param {Object} data - The data for the new PR_P1_Item.
   * @param {string} data.reportId - The report ID.
   * @param {string} data.platform - The platform.
   * @param {string} data.metricType - The metric type.
   * @param {number} data.reportingPeriodTotal - The reporting period total.
   * @returns {Promise<PR_P1_Item>} - A Promise that resolves with the created PR_P1_Item.
   * @throws {Error} - If an error occurs while creating the PR_P1_Item.
   */
  async createPRP1Item(data: Omit<PR_P1_Item, "id">): Promise<PR_P1_Item> {
    try {
      const { reportId, platform, metricType, reportingPeriodTotal } = data;

      return await prisma.pR_P1_Item.create({
        data: {
          reportId,
          platform,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a PR_P1_ItemMetric record.
   *
   * @param {Object} details - The details for the PR_P1_ItemMetric record.
   * @param {number} details.reportItemId - The ID of the report item.
   * @param {string} details.period - The period for the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @returns {Promise<Object>} - A promise that resolves to the created PR_P1_ItemMetric record.
   */
  async createPRP1ItemMetric(
    details: Omit<PR_P1_ItemMetric, "id">,
  ): Promise<PR_P1_ItemMetric> {
    return prisma.pR_P1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new TR_Item in the database.
   *
   * @param {Omit<TR_Item, "id">} data - The data to create the TR_Item with.
   * @returns {Promise<TR_Item>} - A Promise that resolves with the created TR_Item.
   * @throws {Error} - If an error occurs while creating the TR_Item.
   */
  async createTRItem(data: Omit<TR_Item, "id">): Promise<TR_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new TR_ItemMetric.
   *
   * @param {object} details - The details for creating a new TR_ItemMetric.
   * @param {string} details.reportItemId - The ID of the report item.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @return {Promise<object>} - A Promise that resolves to the created TR_ItemMetric.
   */
  async createTRItemMetric(
    details: Omit<TR_ItemMetric, "id">,
  ): Promise<TR_ItemMetric> {
    return prisma.tR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new TR_B1_Item in the database.
   *
   * @param {Object} data - The data for the new TR_B1_Item.
   * @param {string} data.reportId - The report ID of the item.
   * @param {string} data.title - The title of the item.
   * @param {string} data.publisher - The publisher of the item.
   * @param {string} data.publisherId - The publisher ID of the item.
   * @param {string} data.platform - The platform of the item.
   * @param {string} data.doi - The DOI of the item.
   * @param {number} data.yop - The year of publication of the item.
   * @param {string} data.proprietaryId - The proprietary ID of the item.
   * @param {string} data.isbn - The ISBN of the item.
   * @param {string} data.printIssn - The print ISSN of the item.
   * @param {string} data.onlineIssn - The online ISSN of the item.
   * @param {string} data.uri - The URI of the item.
   * @param {string} data.dataType - The data type of the item.
   * @param {string} data.metricType - The metric type of the item.
   * @param {number} data.reportingPeriodTotal - The reporting period total of the item.
   * @returns {Promise<TR_B1_Item>} - A promise that resolves to the created TR_B1_Item.
   * @throws {Error} - If there is an error creating the TR_B1_Item.
   */
  async createTRB1Item(data: Omit<TR_B1_Item, "id">): Promise<TR_B1_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_B1_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new TR_B1_ItemMetric record in the database.
   *
   * @param {Object} details - The details of the TR_B1_ItemMetric record to be created.
   * @param {number} details.reportItemId - The ID of the report item associated with the metric.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @return {Promise<Object>} - A promise that resolves to the newly created TR_B1_ItemMetric record.
   */
  async createTRB1ItemMetric(
    details: Omit<TR_B1_ItemMetric, "id">,
  ): Promise<TR_B1_ItemMetric> {
    return prisma.tR_B1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new TR_B2_Item object with the provided data.
   *
   * @param {Omit<TR_B2_Item, "id">} data - The data used to create the TR_B2_Item object.
   * @return {Promise<TR_B2_Item>} - A promise that resolves with the created TR_B2_Item object.
   * @throws {Error} - If an error occurs while creating the TR_B2_Item object.
   */
  async createTRB2Item(data: Omit<TR_B2_Item, "id">): Promise<TR_B2_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_B2_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a TRB2ItemMetric record in the database.
   *
   * @param {Omit<TR_B2_ItemMetric, "id">} details - The details of the TRB2ItemMetric to be created.
   *
   * @return {Promise<TR_B2_ItemMetric>} - A promise that resolves to the created TRB2ItemMetric record.
   */
  async createTRB2ItemMetric(
    details: Omit<TR_B2_ItemMetric, "id">,
  ): Promise<TR_B2_ItemMetric> {
    return prisma.tR_B2_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new TR_B3_Item.
   *
   * @param {object} data - An object containing the properties for the TR_B3_Item.
   *                        The following properties are required: reportId, title, publisher,
   *                        publisherId, platform, doi, yop, proprietaryId, isbn, printIssn,
   *                        onlineIssn, uri, dataType, metricType, and reportingPeriodTotal.
   *
   * @return {Promise} - A promise that resolves with the created TR_B3_Item.
   *
   * @throws {Error} - If there was an error creating the TR_B3_Item.
   */
  async createTRB3Item(data: Omit<TR_B3_Item, "id">): Promise<TR_B3_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_B3_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new TR_B3_ItemMetric record
   *
   * @param {Object} details - The details of the TR_B3_ItemMetric record to be created.
   * @param {number} details.reportItemId - The ID of the report item that the metric corresponds to.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @returns {Promise<Object>} - A promise that resolves to the created TR_B3_ItemMetric record.
   */
  async createTRB3ItemMetric(
    details: Omit<TR_B3_ItemMetric, "id">,
  ): Promise<TR_B3_ItemMetric> {
    return prisma.tR_B3_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a TR_J1_Item record with the given data.
   *
   * @param {Omit<TR_J1_Item, "id">} data - The data used for creating the TR_J1_Item record.
   * @returns {Promise<TR_J1_Item>} A promise that resolves to the created TR_J1_Item record.
   * @throws {Error} If an error occurs while creating the TR_J1_Item record.
   */
  async createTRJ1Item(data: Omit<TR_J1_Item, "id">): Promise<TR_J1_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_J1_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new TR_J1_ItemMetric record with the given details.
   *
   * @param {object} details - The details to create the TR_J1_ItemMetric record.
   * @param {number} details.reportItemId - The report item ID for the TR_J1_ItemMetric record.
   * @param {string} details.period - The period for the TR_J1_ItemMetric record.
   * @param {number} details.value - The value for the TR_J1_ItemMetric record.
   * @param {string} details.metricType - The metric type for the TR_J1_ItemMetric record.
   * @returns {Promise<object>} A promise that resolves to the created TR_J1_ItemMetric record.
   */
  async createTRJ1ItemMetric(
    details: Omit<TR_J1_ItemMetric, "id">,
  ): Promise<TR_J1_ItemMetric> {
    return prisma.tR_J1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a TR_J2_Item record in the database.
   *
   * @param {object} data - The data for creating the TR_J2_Item. Properties include:
   *   - reportId: The ID of the report to which the item belongs.
   *   - title: The title of the item.
   *   - publisher: The publisher of the item.
   *   - publisherId: The ID of the publisher of the item.
   *   - platform: The platform of the item.
   *   - doi: The DOI of the item.
   *   - yop: The year of publication of the item.
   *   - proprietaryId: The proprietary ID of the item.
   *   - isbn: The ISBN of the item.
   *   - printIssn: The print ISSN of the item.
   *   - onlineIssn: The online ISSN of the item.
   *   - uri: The URI of the item.
   *   - dataType: The type of data of the item.
   *   - metricType: The metric type of the item.
   *   - reportingPeriodTotal: The reporting period total of the item.
   * @returns {Promise<TR_J2_Item>} A promise that resolves to the created TR_J2_Item object.
   * @throws {Error} If there was an error creating the record.
   */
  async createTRJ2Item(data: Omit<TR_J2_Item, "id">): Promise<TR_J2_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_J2_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new TR_J2_ItemMetric in the database.
   *
   * @async
   * @param {object} details - The details of the TR_J2_ItemMetric to be created.
   * @param {string} details.reportItemId - The ID of the report item.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   * @returns {Promise<object>} - A Promise that resolves to the created TR_J2_ItemMetric object.
   */
  async createTRJ2ItemMetric(
    details: Omit<TR_J2_ItemMetric, "id">,
  ): Promise<TR_J2_ItemMetric> {
    return prisma.tR_J2_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new TR_J3_Item in the database.
   *
   * @param {Omit<TR_J3_Item, "id">} data - The data for the TR_J3_Item.
   * @returns {Promise<TR_J3_Item>} - A Promise that resolves with the created TR_J3_Item.
   * @throws {Error} - If there was an error creating the TR_J3_Item.
   */
  async createTRJ3Item(data: Omit<TR_J3_Item, "id">): Promise<TR_J3_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_J3_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new TR_J3_ItemMetric entry in the database.
   *
   * @param {Object} details - The details of the TR_J3_ItemMetric entry to be created.
   * @param {number} details.reportItemId - The report item ID associated with the metric.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @returns {Promise} - A Promise that resolves with the newly created TR_J3_ItemMetric entry.
   *
   * @example
   * const details = {
   *   reportItemId: 1,
   *   period: '2021-01',
   *   value: 10,
   *   metricType: 'metric A'
   * };
   *
   * const createdItemMetric = await createTRJ3ItemMetric(details);
   * // { id: 123, reportItemId: 1, period: '2021-01', value: 10, metricType: 'metric A' }
   */
  async createTRJ3ItemMetric(
    details: Omit<TR_J3_ItemMetric, "id">,
  ): Promise<TR_J3_ItemMetric> {
    return prisma.tR_J3_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new TR_J4_Item record in the database.
   *
   * @param {Omit<TR_J4_Item, "id">} data - The data for the new TR_J4_Item record. It should exclude the "id" field.
   * @return {Promise<TR_J4_Item>} - A promise that resolves with the created TR_J4_Item record.
   * @throws {Error} - Throws an error if there is an error creating the record.
   */
  async createTRJ4Item(data: Omit<TR_J4_Item, "id">): Promise<TR_J4_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        proprietaryId,
        isbn,
        printIssn,
        onlineIssn,
        uri,
        dataType,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.tR_J4_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          proprietaryId,
          isbn,
          printIssn,
          onlineIssn,
          uri,
          dataType,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new TR_J4_ItemMetric.
   *
   * @param {Object} details - The details of the TR_J4_ItemMetric to be created (excluding the 'id' field).
   * @param {number} details.reportItemId - The ID of the report item.
   * @param {string} details.period - The period of the item metric.
   * @param {number} details.value - The value of the item metric.
   * @param {string} details.metricType - The metric type of the item metric.
   *
   * @returns {Promise<TR_J4_ItemMetric>} - A promise that resolves to the created TR_J4_ItemMetric object.
   */
  async createTRJ4ItemMetric(
    details: Omit<TR_J4_ItemMetric, "id">,
  ): Promise<TR_J4_ItemMetric> {
    return prisma.tR_J4_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new IR_Item.
   *
   * @param {Omit<IR_Item, "id">} data - The data for the new IR_Item.
   * @param {string} data.reportId - The report ID of the IR_Item.
   * @param {string} data.title - The title of the IR_Item.
   * @param {string} data.publisher - The publisher of the IR_Item.
   * @param {string} data.publisherId - The publisher ID of the IR_Item.
   * @param {string} data.platform - The platform of the IR_Item.
   * @param {string} data.doi - The DOI of the IR_Item.
   * @param {number} data.yop - The year of publication of the IR_Item.
   * @param {string} data.item - The item of the IR_Item.
   * @param {string} data.metricType - The metric type of the IR_Item.
   * @param {number} data.reportingPeriodTotal - The reporting period total of the IR_Item.
   * @returns {Promise<IR_Item>} The new created IR_Item.
   * @throws {Error} If there is an error creating the PR_Item.
   */
  async createIRItem(data: Omit<IR_Item, "id">): Promise<IR_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        item,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.iR_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          item,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Create a new IR_ItemMetric.
   *
   * @param {Omit<IR_ItemMetric, "id">} details - The details of the IR_ItemMetric.
   * @param {string} details.reportItemId - The ID of the related report item.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @return {Promise<IR_ItemMetric>} A promise that resolves with the created IR_ItemMetric.
   */
  async createIRItemMetric(
    details: Omit<IR_ItemMetric, "id">,
  ): Promise<IR_ItemMetric> {
    return prisma.iR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates an IR_A1_Item and returns it.
   *
   * @param {Object} data - The data used to create the IR_A1_Item.
   * @param {string} data.reportId - The ID of the report.
   * @param {string} data.title - The title of the item.
   * @param {string} data.publisher - The publisher of the item.
   * @param {string} data.publisherId - The ID of the publisher.
   * @param {string} data.platform - The platform of the item.
   * @param {string} data.doi - The DOI of the item.
   * @param {number} data.yop - The year of publication of the item.
   * @param {string} data.item - The item.
   * @param {string} data.metricType - The type of metric.
   * @param {number} data.reportingPeriodTotal - The total reporting period.
   * @returns {Promise<IR_A1_Item>} The created IR_A1_Item.
   * @throws If there was an error creating the IR_A1_Item.
   */
  async createIRA1Item(data: Omit<IR_A1_Item, "id">): Promise<IR_A1_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        item,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.iR_A1_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          item,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new IRA1 item metric.
   *
   * @param {Object} details The details of the new IRA1 item metric to be created.
   * @param {number} details.reportItemId The ID of the report item.
   * @param {string} details.period The period of the metric.
   * @param {number} details.value The value of the metric.
   * @param {string} details.metricType The type of the metric.
   * @returns {Promise} A promise that resolves with the newly created IRA1 item metric object.
   */
  async createIRA1ItemMetric(
    details: Omit<IR_A1_ItemMetric, "id">,
  ): Promise<IR_A1_ItemMetric> {
    return prisma.iR_A1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new IR_M1_Item asynchronously.
   *
   * @param {Omit<IR_M1_Item, "id">} data - The data object containing the properties of the IR_M1_Item to create.
   * @return {Promise<IR_M1_Item>} A promise that resolves with the created IR_M1_Item.
   * @throws {Error} If an error occurs while creating the IR_M1_Item.
   */
  async createIRM1Item(data: Omit<IR_M1_Item, "id">): Promise<IR_M1_Item> {
    try {
      const {
        reportId,
        title,
        publisher,
        publisherId,
        platform,
        doi,
        yop,
        item,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.iR_M1_Item.create({
        data: {
          reportId,
          title,
          publisher,
          publisherId,
          platform,
          doi,
          yop,
          item,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new IR_M1_ItemMetric in the database.
   *
   * @param {Omit<IR_M1_ItemMetric, "id">} details - The details of the IR_M1_ItemMetric to create.
   * @param {string} details.reportItemId - The ID of the report item to associate the metric with.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @returns {Promise<IR_M1_ItemMetric>} A Promise resolving to the created IR_M1_ItemMetric.
   */
  async createIRM1ItemMetric(
    details: Omit<IR_M1_ItemMetric, "id">,
  ): Promise<IR_M1_ItemMetric> {
    return prisma.iR_M1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new DR_Item record in the database.
   *
   * @param {Omit<DR_Item, "id">} data - The data for the new DR_Item record, excluding the "id" field.
   * @returns {Promise<DR_Item>} - A Promise that resolves to the created DR_Item record.
   * @throws {Error} - If an error occurs while creating the DR_Item record.
   */
  async createDRItem(data: Omit<DR_Item, "id">): Promise<DR_Item> {
    try {
      const {
        reportId,
        database,
        proprietary,
        publisher,
        publisherId,
        platform,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.dR_Item.create({
        data: {
          reportId,
          database,
          proprietary,
          publisher,
          publisherId,
          platform,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new DR_ItemMetric record in the database.
   *
   * @param {Omit<DR_ItemMetric, "id">} details - The details of the DR_ItemMetric record (excluding the id).
   * @property {string} details.reportItemId - The id of the report item associated with the metric.
   * @property {string} details.period - The period of the metric.
   * @property {number} details.value - The value of the metric.
   * @property {string} details.metricType - The type of the metric.
   *
   * @return {Promise<DR_ItemMetric>} - A promise that resolves to the created DR_ItemMetric record.
   */
  async createDRItemMetric(
    details: Omit<DR_ItemMetric, "id">,
  ): Promise<DR_ItemMetric> {
    return prisma.dR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new DR_D1_Item record in the database.
   * @param {Omit<DR_D1_Item, "id">} data - The data for the new DR_D1_Item.
   * @returns {Promise<DR_D1_Item>} A promise that resolves to the created DR_D1_Item record.
   * @throws {Error} Throws an error if there was an error creating the DR_D1_Item record.
   */
  async createDRD1Item(data: Omit<DR_D1_Item, "id">): Promise<DR_D1_Item> {
    try {
      const {
        reportId,
        database,
        proprietary,
        publisher,
        publisherId,
        platform,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.dR_D1_Item.create({
        data: {
          reportId,
          database,
          proprietary,
          publisher,
          publisherId,
          platform,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a DRD1 Item Metric in the database.
   *
   * @param {Object} details - The details of the DRD1 Item Metric to be created.
   * @param {string} details.reportItemId - The ID of the report item to which the metric belongs.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @return {Promise<DR_D1_ItemMetric>} - The created DRD1 Item Metric object.
   */
  async createDRD1ItemMetric(
    details: Omit<DR_D1_ItemMetric, "id">,
  ): Promise<DR_D1_ItemMetric> {
    return prisma.dR_D1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * Creates a new DR_D2_Item.
   *
   * @param {Object} data - The data object containing the properties of the DR_D2_Item.
   *   @param {string} data.reportId - The report Id.
   *   @param {string} data.database - The database.
   *   @param {string} data.proprietary - The proprietary status.
   *   @param {string} data.publisher - The publisher.
   *   @param {string} data.publisherId - The publisher Id.
   *   @param {string} data.platform - The platform.
   *   @param {string} data.metricType - The metric type.
   *   @param {number} data.reportingPeriodTotal - The reporting period total.
   *
   * @returns {Promise<DR_D2_Item>} A promise that resolves with the created DR_D2_Item.
   *
   * @throws If an error occurs while creating the DR_D2_Item.
   */
  async createDRD2Item(data: Omit<DR_D2_Item, "id">): Promise<DR_D2_Item> {
    try {
      const {
        reportId,
        database,
        proprietary,
        publisher,
        publisherId,
        platform,
        metricType,
        reportingPeriodTotal,
      } = data;

      return await prisma.dR_D2_Item.create({
        data: {
          reportId,
          database,
          proprietary,
          publisher,
          publisherId,
          platform,
          metricType,
          reportingPeriodTotal,
        },
      });
    } catch (error) {
      console.error("Error creating PR_Item:", error);
      throw error;
    }
  }

  /**
   * Creates a new DRD2ItemMetric in the database.
   *
   * @async
   * @param {Omit<DR_D2_ItemMetric, "id">} details - The details of the DRD2ItemMetric to be created.
   * @param {string} details.reportItemId - The ID of the report item.
   * @param {string} details.period - The period of the metric.
   * @param {number} details.value - The value of the metric.
   * @param {string} details.metricType - The type of the metric.
   *
   * @returns {Promise} - A Promise that resolves with the created DRD2ItemMetric object.
   */
  async createDRD2ItemMetric(
    details: Omit<DR_D2_ItemMetric, "id">,
  ): Promise<DR_D2_ItemMetric> {
    return prisma.dR_D2_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

  /**
   * This function is responsible for saving the fetched report into the database.
   * @param {Object} report - The report object that contains all the information about the report.
   * @returns {Promise<void>} - A promise that resolves when all the report information has been saved into the database.
   */
  async saveFetchedReport(report: IReport): Promise<void> {
    try {
      const savedReport = await this.createReport({
        report_id: report.Report_Header.Report_ID,
        report_name: report.Report_Header.Report_Name,
        release: report.Report_Header.Release,
        metric_types: report.Report_Header.Metric_Types || "",
        report_attributes: report.Report_Header.Report_Attributes || "",
        exceptions: report.Report_Header.Exceptions || "",
        reporting_period: report.Report_Header.Reporting_Period || "",
        institution_name: report.Report_Header.Institution_Name || "",
        institution_id:
          Array.isArray(report.Report_Header.Institution_ID) &&
          report.Report_Header.Institution_ID.length > 0
            ? `${report.Report_Header.Institution_ID[0].Type}:${report.Report_Header.Institution_ID[0].Value}`
            : "undefined",
        created: report.Report_Header.Created,
        created_by: report.Report_Header.Created_By,
        registry_record: report.Report_Header.Registry_Record || "",
      });

      const filtersString = report.Report_Header.Report_Filters;
      if (typeof filtersString === "string") {
        const filtersArray = filtersString.split(";");

        for (let filter of filtersArray) {
          let Name = filter ? filter.split("=")[0] || "" : "";
          let Value = filter ? filter.split("=")[1] || "" : "";

          await this.createReportFilter({
            reportId: savedReport.id,
            filter_type: Name,
            value: Value,
          });
        }
      } else if (Array.isArray(filtersString)) {
        for (const filter of filtersString) {
          let Name = filter && filter.Name ? filter.Name : "";
          let Value = filter && filter.Value ? filter.Value : "";

          await this.createReportFilter({
            reportId: savedReport.id,
            filter_type: Name,
            value: Value,
          });
        }
      } else {
        await this.createReportFilter({
          reportId: savedReport.id,
          filter_type: "",
          value: "",
        });
      }

      // PR Report
      if (report.Report_Header.Report_ID.includes("PR")) {
        for (const rawItem of report.Report_Items) {
          const metricCounts = new Map<string, number>();
          const metricPeriods = new Map<
            string,
            Array<{ period: string; value: number }>
          >();

          for (let i = 0; i < rawItem.Performance.length; i++) {
            const period = `${rawItem.Performance[i].Period.Begin_Date} - ${rawItem.Performance[i].Period.End_Date}`;

            for (let j = 0; j < rawItem.Performance[i].Instance.length; j++) {
              const metricType = rawItem.Performance[i].Instance[j].Metric_Type;

              const count = rawItem.Performance[i].Instance[j].Count;

              if (metricCounts.has(metricType)) {
                const currCount = metricCounts.get(metricType);
                metricCounts.set(metricType, (currCount ?? 0) + count);
              } else {
                metricCounts.set(metricType, count);
              }

              if (metricPeriods.has(metricType)) {
                metricPeriods.get(metricType)?.push({ period, value: count });
              } else {
                metricPeriods.set(metricType, [{ period, value: count }]);
              }
            }
          }
          const reportItemDetails: any = {
            reportId: savedReport.id,
            platform: rawItem.Platform,
          };

          for (const [metricType, periodTotal] of metricCounts.entries()) {
            const reportId = reportItemDetails.reportId;
            const platform = rawItem.Platform;

            // PR Report
            if (report.Report_Header.Report_ID == "PR") {
              const pr_item = await this.createPRItem({
                reportId,
                platform,
                metricType,
                periodTotal,
              });
              const periodsValues = metricPeriods.get(metricType);

              if (periodsValues) {
                for (const { period, value } of periodsValues) {
                  await this.createPRItemMetric({
                    reportItemId: pr_item.id,
                    metricType,
                    period,
                    value,
                  });
                }
              }
            } else if (report.Report_Header.Report_ID == "PR_P1") {
              const pr_item = await this.createPRP1Item({
                reportId,
                platform,
                metricType,
                reportingPeriodTotal: periodTotal,
              });
              const periodsValues = metricPeriods.get(metricType);

              if (periodsValues) {
                for (const { period, value } of periodsValues) {
                  await this.createPRP1ItemMetric({
                    reportItemId: pr_item.id,
                    metricType,
                    period,
                    value,
                  });
                }
              }
            }
          }
        }
      }

      // DR Report
      if (report.Report_Header.Report_ID.includes("DR")) {
        for (const rawItem of report.Report_Items) {
          const drItem = rawItem as IDRReportItem;
          let reportItemDetails: any = {
            reportId: savedReport.id,
            database: drItem.Database || "undefined",
            proprietary:
              (Array.isArray(drItem.Item_ID) ? drItem.Item_ID : []).find(
                (id) => id.Type === "Proprietary",
              )?.Value || null,
            publisher: drItem.Publisher || "undefined",
            publisherId:
              (drItem.Publisher_ID || [])
                .map((id) => `${id.Type}:${id.Value}`)
                .join(";") || null,
            platform: drItem.Platform || "undefined",
          };

          const metricCounts = new Map<string, number>();
          const metricPeriods = new Map<
            string,
            Array<{ period: string; value: number }>
          >();

          for (let i = 0; i < rawItem.Performance.length; i++) {
            const period = `${rawItem.Performance[i].Period.Begin_Date} - ${rawItem.Performance[i].Period.End_Date}`;

            for (let j = 0; j < rawItem.Performance[i].Instance.length; j++) {
              const metricType = rawItem.Performance[i].Instance[j].Metric_Type;
              const count = rawItem.Performance[i].Instance[j].Count;

              if (metricCounts.has(metricType)) {
                const currCount = metricCounts.get(metricType);
                metricCounts.set(metricType, (currCount ?? 0) + count);
              } else {
                metricCounts.set(metricType, count);
              }

              if (metricPeriods.has(metricType)) {
                metricPeriods.get(metricType)?.push({ period, value: count });
              } else {
                metricPeriods.set(metricType, [{ period, value: count }]);
              }
            }
          }

          for (const [
            metricType,
            reportingPeriodTotal,
          ] of metricCounts.entries()) {
            reportItemDetails["metricType"] = metricType;
            reportItemDetails["reportingPeriodTotal"] = reportingPeriodTotal;

            if (report.Report_Header.Report_ID == "DR") {
              const ir_item = await this.createDRItem(reportItemDetails);
              const periodsValues = metricPeriods.get(metricType);
              if (periodsValues) {
                for (const { period, value } of periodsValues) {
                  await this.createDRItemMetric({
                    reportItemId: ir_item.id,
                    metricType,
                    period,
                    value,
                  });
                }
              }
            } else if (report.Report_Header.Report_ID == "DR_D1") {
              const ir_item = await this.createDRD1Item(reportItemDetails);
              const periodsValues = metricPeriods.get(metricType);
              if (periodsValues) {
                for (const { period, value } of periodsValues) {
                  await this.createDRD1ItemMetric({
                    reportItemId: ir_item.id,
                    metricType,
                    period,
                    value,
                  });
                }
              }
            } else if (report.Report_Header.Report_ID == "DR_D2") {
              const ir_item = await this.createDRD2Item(reportItemDetails);
              const periodsValues = metricPeriods.get(metricType);
              if (periodsValues) {
                for (const { period, value } of periodsValues) {
                  await this.createDRD2ItemMetric({
                    reportItemId: ir_item.id,
                    metricType,
                    period,
                    value,
                  });
                }
              }
            }
          }
        }
      }

      // IR Report
      if (report.Report_Header.Report_ID.includes("IR")) {
        for (const rawItem of report.Report_Items) {
          const irItem = rawItem as ITRIRReportItem;

          let reportItemDetails: any = {
            reportId: savedReport.id,
            title: irItem.Title || "undefined",
            publisher: irItem.Publisher || "undefined",
            publisherId:
              (irItem.Publisher_ID || [])
                .map((id) => `${id.Type}:${id.Value}`)
                .join(";") || null,
            platform: irItem.Platform || "undefined",
            doi:
              (Array.isArray(irItem.Item_ID) ? irItem.Item_ID : []).find(
                (id) => id.Type === "DOI",
              )?.Value || null,
            yop:
              (Array.isArray(irItem.Item_ID) ? irItem.Item_ID : []).find(
                (id) => id.Type === "YOP",
              )?.Value || null,
            item: irItem.Item || "undefined",
          };

          const metricCounts = new Map<string, number>();
          const metricPeriods = new Map<
            string,
            Array<{ period: string; value: number }>
          >();

          for (let i = 0; i < rawItem.Performance.length; i++) {
            const period = `${rawItem.Performance[i].Period.Begin_Date} - ${rawItem.Performance[i].Period.End_Date}`;

            for (let j = 0; j < rawItem.Performance[i].Instance.length; j++) {
              const metricType = rawItem.Performance[i].Instance[j].Metric_Type;
              const count = rawItem.Performance[i].Instance[j].Count;

              if (metricCounts.has(metricType)) {
                const currCount = metricCounts.get(metricType);
                metricCounts.set(metricType, (currCount ?? 0) + count);
              } else {
                metricCounts.set(metricType, count);
              }

              if (metricPeriods.has(metricType)) {
                metricPeriods.get(metricType)?.push({ period, value: count });
              } else {
                metricPeriods.set(metricType, [{ period, value: count }]);
              }
            }
          }

          for (const [
            metricType,
            reportingPeriodTotal,
          ] of metricCounts.entries()) {
            reportItemDetails["metricType"] = metricType;
            reportItemDetails["reportingPeriodTotal"] = reportingPeriodTotal;

            if (report.Report_Header.Report_ID == "IR") {
              const ir_item = await this.createIRItem(reportItemDetails);
              const periodsValues = metricPeriods.get(metricType);
              if (periodsValues) {
                for (const { period, value } of periodsValues) {
                  await this.createIRItemMetric({
                    reportItemId: ir_item.id,
                    metricType,
                    period,
                    value,
                  });
                }
              }
            } else if (report.Report_Header.Report_ID == "IR_A1") {
              const ir_item = await this.createIRA1Item(reportItemDetails);
              const periodsValues = metricPeriods.get(metricType);
              if (periodsValues) {
                for (const { period, value } of periodsValues) {
                  await this.createIRA1ItemMetric({
                    reportItemId: ir_item.id,
                    metricType,
                    period,
                    value,
                  });
                }
              }
            } else if (report.Report_Header.Report_ID == "IR_M1") {
              const ir_item = await this.createIRM1Item(reportItemDetails);
              const periodsValues = metricPeriods.get(metricType);
              if (periodsValues) {
                for (const { period, value } of periodsValues) {
                  await this.createIRM1ItemMetric({
                    reportItemId: ir_item.id,
                    metricType,
                    period,
                    value,
                  });
                }
              }
            }
          }
        }
      }

      // TR Report
      if (report.Report_Header.Report_ID.includes("TR")) {
        for (const rawItem of report.Report_Items) {
          const trItem = rawItem as ITRIRReportItem;
          let reportItemDetails: any = {
            reportId: savedReport.id,
            title: trItem.Title || "undefined",
            publisher: trItem.Publisher || "undefined",
            publisherId:
              (trItem.Publisher_ID || [])
                .map((id) => `${id.Type}:${id.Value}`)
                .join(";") || null,
            platform: trItem.Platform,
            doi:
              (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                (id) => id.Type === "DOI",
              )?.Value || null,
            yop:
              (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                (id) => id.Type === "YOP",
              )?.Value || null,

            proprietaryId:
              (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                (id) => id.Type === "Proprietary",
              )?.Type ||
              "undefined" +
                ":" +
                (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                  (id) => id.Type === "Proprietary",
                )?.Value ||
              null,
            isbn:
              (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                (id) => id.Type === "ISBN",
              )?.Value || null,
            printIssn:
              (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                (id) => id.Type === "Print_ISSN",
              )?.Value || null,
            onlineIssn:
              (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                (id) => id.Type === "Online_ISSN",
              )?.Value || null,
            uri:
              (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                (id) => id.Type === "URI",
              )?.Value || null,
            dataType:
              (Array.isArray(trItem.Item_ID) ? trItem.Item_ID : []).find(
                (id) => id.Type === "Data_Type",
              )?.Value || null,
          };

          const metricCounts = new Map<string, number>();
          const metricPeriods = new Map<
            string,
            Array<{ period: string; value: number }>
          >();

          for (let i = 0; i < rawItem.Performance.length; i++) {
            const period = `${rawItem.Performance[i].Period.Begin_Date} - ${rawItem.Performance[i].Period.End_Date}`;

            for (let j = 0; j < rawItem.Performance[i].Instance.length; j++) {
              const metricType = rawItem.Performance[i].Instance[j].Metric_Type;
              const count = rawItem.Performance[i].Instance[j].Count;

              if (metricCounts.has(metricType)) {
                const currCount = metricCounts.get(metricType);
                metricCounts.set(metricType, (currCount ?? 0) + count);
              } else {
                metricCounts.set(metricType, count);
              }

              if (metricPeriods.has(metricType)) {
                metricPeriods.get(metricType)?.push({ period, value: count });
              } else {
                metricPeriods.set(metricType, [{ period, value: count }]);
              }
            }
          }

          for (const [
            metricType,
            reportingPeriodTotal,
          ] of metricCounts.entries()) {
            reportItemDetails["metricType"] = metricType;
            reportItemDetails["reportingPeriodTotal"] = reportingPeriodTotal;

            let tr_item = null;
            switch (report.Report_Header.Report_ID) {
              case "TR_B1": {
                tr_item = await this.createTRB1Item(reportItemDetails);
                const periodsValues = metricPeriods.get(metricType);
                if (periodsValues) {
                  for (const { period, value } of periodsValues) {
                    await this.createTRB1ItemMetric({
                      reportItemId: tr_item.id,
                      metricType,
                      period,
                      value,
                    });
                  }
                }
                break;
              }
              case "TR_B2": {
                tr_item = await this.createTRB2Item(reportItemDetails);
                const periodsValues = metricPeriods.get(metricType);
                if (periodsValues) {
                  for (const { period, value } of periodsValues) {
                    await this.createTRB2ItemMetric({
                      reportItemId: tr_item.id,
                      metricType,
                      period,
                      value,
                    });
                  }
                }
                break;
              }
              case "TR_B3": {
                tr_item = await this.createTRB3Item(reportItemDetails);
                const periodsValues = metricPeriods.get(metricType);
                if (periodsValues) {
                  for (const { period, value } of periodsValues) {
                    await this.createTRB3ItemMetric({
                      reportItemId: tr_item.id,
                      metricType,
                      period,
                      value,
                    });
                  }
                }
                break;
              }
              case "TR_J1": {
                tr_item = await this.createTRJ1Item(reportItemDetails);
                const periodsValues = metricPeriods.get(metricType);
                if (periodsValues) {
                  for (const { period, value } of periodsValues) {
                    await this.createTRJ1ItemMetric({
                      reportItemId: tr_item.id,
                      metricType,
                      period,
                      value,
                    });
                  }
                }
                break;
              }
              case "TR_J2": {
                tr_item = await this.createTRJ2Item(reportItemDetails);
                const periodsValues = metricPeriods.get(metricType);
                if (periodsValues) {
                  for (const { period, value } of periodsValues) {
                    await this.createTRJ2ItemMetric({
                      reportItemId: tr_item.id,
                      metricType,
                      period,
                      value,
                    });
                  }
                }
                break;
              }
              case "TR_J3": {
                tr_item = await this.createTRJ3Item(reportItemDetails);
                const periodsValues = metricPeriods.get(metricType);
                if (periodsValues) {
                  for (const { period, value } of periodsValues) {
                    await this.createTRJ3ItemMetric({
                      reportItemId: tr_item.id,
                      metricType,
                      period,
                      value,
                    });
                  }
                }
                break;
              }
              case "TR_J4": {
                tr_item = await this.createTRJ4Item(reportItemDetails);
                const periodsValues = metricPeriods.get(metricType);
                if (periodsValues) {
                  for (const { period, value } of periodsValues) {
                    await this.createTRJ4ItemMetric({
                      reportItemId: tr_item.id,
                      metricType,
                      period,
                      value,
                    });
                  }
                }
                break;
              }
              default: {
                tr_item = await this.createTRItem(reportItemDetails);
                const periodsValues = metricPeriods.get(metricType);
                if (periodsValues) {
                  for (const { period, value } of periodsValues) {
                    await this.createTRItemMetric({
                      reportItemId: tr_item.id,
                      metricType,
                      period,
                      value,
                    });
                  }
                }
                break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.log("There was an error while saving reports:", error);
      throw new Error("Failed to save report.");
    }
  }

  /**
   * Searches for reports based on various parameters.
   *
   * @async
   * @param {number} page - The page number. Defaults to 1 if not provided.
   * @param {number} limit - The number of items per page. Defaults to 10 if not provided.
   * @param {string} [title] - The title of the report.
   * @param {string} [issn] - The ISSN of the report.
   * @param {string} [isbn] - The ISBN of the report.
   * @returns {Promise<Array<Report>>} - A promise that resolves to an array of unique reports.
   * @throws {Error} - If an error occurs during the search process.
   */
  async searchReport(
    page: number, // page set to default 1 if not provided
    limit: number, // limit set to default 10 if not provided
    title?: string,
    issn?: string,
    isbn?: string,
  ): Promise<Report[]> {
    try {
      let whereClause: WhereClause = {};

      if (title) {
        whereClause.title = {
          contains: title.toLowerCase(),
        };
      } else if (issn) {
        whereClause.OR = [
          {
            onlineIssn: {
              contains: issn.toLowerCase(),
            },
          },
          {
            printIssn: {
              contains: issn.toLowerCase(),
            },
          },
        ];
      } else if (isbn) {
        whereClause.isbn = {
          contains: isbn.toLowerCase(),
        };
      }

      const reportItemsOfAllModels = await Promise.all(
        [
          "TR_Item",
          "TR_B1_Item",
          "TR_B2_Item",
          "TR_B3_Item",
          "TR_J1_Item",
          "TR_J2_Item",
          "TR_J3_Item",
          "TR_J4_Item",
        ].map((model) => {
          switch (model) {
            case "TR_Item":
              return prisma.tR_Item.findMany({
                where: whereClause,
                include: {
                  report: {
                    include: {
                      TR_Item: {
                        include: {
                          TR_ItemMetric: true,
                        },
                      },
                      ReportFilter: true,
                    },
                  },
                },
                skip: (page - 1) * limit, // This will skip the items of previous pages
                take: limit, // This will limit the number of items returned
              });
            case "TR_B1_Item":
              return prisma.tR_B1_Item.findMany({
                where: whereClause,
                include: {
                  report: {
                    include: {
                      TR_B1_Item: {
                        include: {
                          TR_B1_ItemMetric: true,
                        },
                      },
                      ReportFilter: true,
                    },
                  },
                },
                skip: (page - 1) * limit, // This will skip the items of previous pages
                take: limit, // This will limit the number of items returned
              });
            case "TR_B2_Item":
              return prisma.tR_B2_Item.findMany({
                where: whereClause,
                include: {
                  report: {
                    include: {
                      TR_B2_Item: {
                        include: {
                          TR_B2_ItemMetric: true,
                        },
                      },
                      ReportFilter: true,
                    },
                  },
                },
                skip: (page - 1) * limit, // This will skip the items of previous pages
                take: limit, // This will limit the number of items returned
              });
            case "TR_B3_Item":
              return prisma.tR_B3_Item.findMany({
                where: whereClause,
                include: {
                  report: {
                    include: {
                      TR_B3_Item: {
                        include: {
                          TR_B3_ItemMetric: true,
                        },
                      },
                      ReportFilter: true,
                    },
                  },
                },
                skip: (page - 1) * limit, // This will skip the items of previous pages
                take: limit, // This will limit the number of items returned
              });
            case "TR_J1_Item":
              return prisma.tR_J1_Item.findMany({
                where: whereClause,
                include: {
                  report: {
                    include: {
                      TR_J1_Item: {
                        include: {
                          TR_J1_ItemMetric: true,
                        },
                      },
                      ReportFilter: true,
                    },
                  },
                },
                skip: (page - 1) * limit, // This will skip the items of previous pages
                take: limit, // This will limit the number of items returned
              });
            case "TR_J2_Item":
              return prisma.tR_J2_Item.findMany({
                where: whereClause,
                include: {
                  report: {
                    include: {
                      TR_J2_Item: {
                        include: {
                          TR_J2_ItemMetric: true,
                        },
                      },
                      ReportFilter: true,
                    },
                  },
                },
                skip: (page - 1) * limit, // This will skip the items of previous pages
                take: limit, // This will limit the number of items returned
              });
            case "TR_J3_Item":
              return prisma.tR_J3_Item.findMany({
                where: whereClause,
                include: {
                  report: {
                    include: {
                      TR_J3_Item: {
                        include: {
                          TR_J3_ItemMetric: true,
                        },
                      },
                      ReportFilter: true,
                    },
                  },
                },
                skip: (page - 1) * limit, // This will skip the items of previous pages
                take: limit, // This will limit the number of items returned
              });
            case "TR_J4_Item":
              return prisma.tR_J4_Item.findMany({
                where: whereClause,
                include: {
                  report: {
                    include: {
                      TR_J4_Item: {
                        include: {
                          TR_J4_ItemMetric: true,
                        },
                      },
                      ReportFilter: true,
                    },
                  },
                },
                skip: (page - 1) * limit, // This will skip the items of previous pages
                take: limit, // This will limit the number of items returned
              });
            default:
              return [];
          }
        }),
      );

      // Flatten the array and map each item to its parent report
      const reportItems = reportItemsOfAllModels.flat();
      const reports = reportItems.map((item: any) => item.report);

      // Deduplicate reports based on a unique property (like id)
      const uniqueReports: Report[] = [];
      const reportIds = new Set();

      for (const report of reports) {
        if (!reportIds.has(report.id)) {
          reportIds.add(report.id);
          uniqueReports.push(report);
        }
      }

      return uniqueReports;
    } catch (error) {
      console.error("Error searching reports:", error);
      throw error;
    }
  }

  /**
   * Converts a report object to a TSV (Tab-Separated Values) string format.
   * @param {any} report The report object to convert.
   * @return {Promise<string>} A promise that resolves with the TSV string.
   */
  async convertReportToTSV(report: any): Promise<string> {
    let tsv = "";

    // Headers
    tsv += `Report_Name\t${report.report_name}\n`;
    tsv += `Report_ID\t${report.report_id}\n`;
    tsv += `Release\t${report.release}\n`;
    tsv += `Institution_Name\t${report.institution_name}\n`;
    tsv += `Institution_ID\t${report.institution_id}\n`;

    // Report Filters
    const reportFilters = report.ReportFilter?.map(
      (filter: any) => `${filter.filter_type}=${filter.value}`,
    ).join(";");
    tsv += `Report_Filters\t${reportFilters}\n`;

    tsv += `Created\t${report.created}\n`;
    tsv += `Created_By\t${report.created_by}\n`;
    tsv += "\n";

    tsv += `Title\tPublisher\tPublisher_ID\tPlatform\tDOI\tYOP\tProprietary_ID\tISBN\tPrint_ISSN\tOnline_ISSN\tURI\tData_Type\tMetric_Type\tReporting_Period_Total\n`;

    if (report.report_id.includes("TR")) {
      if (report.report_id === "TR") {
        for (const item of report.TR_Item) {
          for (const metric of item.TR_ItemMetric) {
            tsv += `${item.title}\t${item.publisher}\t${item.publisherId}\t${item.platform}\t${item.doi}\t${item.yop}\t${item.proprietaryId}\t${item.isbn}\t${item.printIssn}\t${item.onlineIssn}\t${item.uri}\t${item.dataType}\t${metric.metricType}\t${item.reportingPeriodTotal}\n`;
          }
          tsv += "\n";
        }
      } else if (report.report_id === "TR_B1") {
        for (const item of report.TR_B1_Item) {
          for (const metric of item.TR_B1_ItemMetric) {
            tsv += `${item.title}\t${item.publisher}\t${item.publisherId}\t${item.platform}\t${item.doi}\t${item.yop}\t${item.proprietaryId}\t${item.isbn}\t${item.printIssn}\t${item.onlineIssn}\t${item.uri}\t${item.dataType}\t${metric.metricType}\t${item.reportingPeriodTotal}\n`;
          }
          tsv += "\n";
        }
      } else if (report.report_id === "TR_B2") {
        for (const item of report.TR_B2_Item) {
          for (const metric of item.TR_B2_ItemMetric) {
            tsv += `${item.title}\t${item.publisher}\t${item.publisherId}\t${item.platform}\t${item.doi}\t${item.yop}\t${item.proprietaryId}\t${item.isbn}\t${item.printIssn}\t${item.onlineIssn}\t${item.uri}\t${item.dataType}\t${metric.metricType}\t${item.reportingPeriodTotal}\n`;
          }
          tsv += "\n";
        }
      } else if (report.report_id === "TR_B3") {
        for (const item of report.TR_B3_Item) {
          for (const metric of item.TR_B3_ItemMetric) {
            tsv += `${item.title}\t${item.publisher}\t${item.publisherId}\t${item.platform}\t${item.doi}\t${item.yop}\t${item.proprietaryId}\t${item.isbn}\t${item.printIssn}\t${item.onlineIssn}\t${item.uri}\t${item.dataType}\t${metric.metricType}\t${item.reportingPeriodTotal}\n`;
          }
          tsv += "\n";
        }
      } else if (report.report_id === "TR_J1") {
        for (const item of report.TR_J1_Item) {
          for (const metric of item.TR_J1_ItemMetric) {
            tsv += `${item.title}\t${item.publisher}\t${item.publisherId}\t${item.platform}\t${item.doi}\t${item.yop}\t${item.proprietaryId}\t${item.isbn}\t${item.printIssn}\t${item.onlineIssn}\t${item.uri}\t${item.dataType}\t${metric.metricType}\t${item.reportingPeriodTotal}\n`;
          }
          tsv += "\n";
        }
      } else if (report.report_id === "TR_J2") {
        for (const item of report.TR_J2_Item) {
          for (const metric of item.TR_J2_ItemMetric) {
            tsv += `${item.title}\t${item.publisher}\t${item.publisherId}\t${item.platform}\t${item.doi}\t${item.yop}\t${item.proprietaryId}\t${item.isbn}\t${item.printIssn}\t${item.onlineIssn}\t${item.uri}\t${item.dataType}\t${metric.metricType}\t${item.reportingPeriodTotal}\n`;
          }
          tsv += "\n";
        }
      } else if (report.report_id === "TR_J3") {
        for (const item of report.TR_J3_Item) {
          for (const metric of item.TR_J3_ItemMetric) {
            tsv += `${item.title}\t${item.publisher}\t${item.publisherId}\t${item.platform}\t${item.doi}\t${item.yop}\t${item.proprietaryId}\t${item.isbn}\t${item.printIssn}\t${item.onlineIssn}\t${item.uri}\t${item.dataType}\t${metric.metricType}\t${item.reportingPeriodTotal}\n`;
          }
          tsv += "\n";
        }
      } else if (report.report_id === "TR_J4") {
        for (const item of report.TR_J4_Item) {
          for (const metric of item.TR_J4_ItemMetric) {
            tsv += `${item.title}\t${item.publisher}\t${item.publisherId}\t${item.platform}\t${item.doi}\t${item.yop}\t${item.proprietaryId}\t${item.isbn}\t${item.printIssn}\t${item.onlineIssn}\t${item.uri}\t${item.dataType}\t${metric.metricType}\t${item.reportingPeriodTotal}\n`;
          }
          tsv += "\n";
        }
      }
    }

    return tsv;
  }

  /**
   * Writes TSV (Tab-Separated Values) data to a file.
   *
   * @param {string} tsv - The TSV string to write to the file.
   * @param {string} fileName - The name of the file (without the file extension).
   * @return {Promise<void>} - A promise that resolves once the TSV data has been written to the file successfully.
   */
  async writeTSVToFile(tsv: string, fileName: string): Promise<void> {
    const dirService = new DirectorySettingService();
    const filePath = dirService.getPath("search", `${fileName}.tsv`);

    writeFile(filePath, tsv);
  }

  /**
   * Generates a search filename based on the given query and vendor name.
   *
   * @param {string} query - The search query.
   * @param {string} vendorName - The vendor name.
   * @returns {string} The generated search filename.
   */
  private generateSearchFilename(query: string, vendorName: string): string {
    let filename = query.replace(/ /g, "_") + "_";
    filename += vendorName.toLowerCase() + "_";
    filename += format(new Date(), "yyyyMMddHHmmss");

    return filename;
  }

  /**
   * Writes searched reports to a TSV file.
   * @param {string} [title] - The title of the report.
   * @param {string} [issn] - The ISSN of the report.
   * @param {string} [isbn] - The ISBN of the report.
   * @return {Promise<Report[]>} - A promise that resolves to an array of reports.
   */
  async writeSearchedReportsToTSV(
    title?: string,
    issn?: string,
    isbn?: string,
  ): Promise<Report[]> {
    const reports = await this.searchReport(1, 250, title, issn, isbn);

    let fileNumber = 1; // Counter variable for filename

    for (const report of reports) {
      const tsv = this.convertReportToTSV(report);
      const vendorName = report.institution_id.split(":")[0];

      const fileName =
        this.generateSearchFilename(title || issn || isbn || "", vendorName) +
        "_" +
        fileNumber; // Add the counter to the filename

      await this.writeTSVToFile(await tsv, fileName);
      fileNumber++; // Increment the counter
    }

    return reports;
  }

  /**
   * Rebuilds the database by deleting the existing database file, disconnecting from the current Prisma client,
   * and running the Prisma migration using the `prisma db push --force-reset` command.
   *
   * @returns {Promise<void>} A promise that resolves with no value upon successful completion.
   * @throws {Error} if there is an error while rebuilding the database.
   */
  async rebuildDatabase(): Promise<void> {
    const dbFile = path.join(
      __dirname,
      process.env.DATABASE_FILE || "../../prisma/search.db",
    );

    try {
      await prisma.$disconnect();
      if (fs.existsSync(dbFile)) {
        await fs.promises.unlink(dbFile);
        console.log("Previous database file deleted.");
      }

      const stdout = execSync("npx prisma db push --force-reset").toString();

      console.log("Prisma migrate output:", stdout);
    } catch (error) {
      console.error("Error while rebuilding the database:", error);
      throw error;
    }
  }

  /**
   * Method to export the database file.
   *
   * @param {string} exportPath - The path where the database file should be exported.
   *
   * @return {Promise<void>} - A promise that resolves when the database is exported successfully.
   */
  static async exportDatabase(exportPath: string): Promise<void> {
    const dbFile = process.env.DATABASE_FILE || "../../prisma/search.db";
    const dbPath = path.join(__dirname, dbFile);

    if (fs.existsSync(dbPath)) {
      try {
        const currentDate: Date = new Date();
        const formattedDate: string = format(currentDate, "dd-MM-yyyy");

        const exportFilePath = path.join(
          exportPath,
          `CH_SearchDB_Export_${formattedDate}.db`,
        );

        fs.copyFileSync(dbPath, exportFilePath);

        console.log(`Database exported successfully to: ${exportFilePath}`);
      } catch (error) {
        console.error("Error while exporting the database file:", error);
      }
    } else {
      console.error("Database file does not exist. ", dbPath);
    }
  }
}

export const prismaReportService = new PrismaReportService();
