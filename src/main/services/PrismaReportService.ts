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
  Prisma,
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

const prisma = new PrismaClient();

export class PrismaReportService {
  async createReport({
    report_id,
    report_name,
    release,
    institution_name,
    institution_id,
    created,
    created_by,
  }: Omit<Report, "id">): Promise<Report> {
    try {
      return await prisma.report.create({
        data: {
          report_id,
          report_name,
          release,
          institution_name,
          institution_id,
          created,
          created_by,
        },
      });
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

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

  async createPRItemMetric(details: Omit<PR_ItemMetric, "id">) {
    return prisma.pR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createPRP1ItemMetric(details: Omit<PR_P1_ItemMetric, "id">) {
    return prisma.pR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createTRItemMetric(details: Omit<TR_ItemMetric, "id">) {
    return prisma.tR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createTRB1ItemMetric(details: Omit<TR_B1_ItemMetric, "id">) {
    return prisma.tR_B1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createTRB2ItemMetric(details: Omit<TR_B2_ItemMetric, "id">) {
    return prisma.tR_B2_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createTRB3ItemMetric(details: Omit<TR_B3_ItemMetric, "id">) {
    return prisma.tR_B3_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createTRJ1ItemMetric(details: Omit<TR_J1_ItemMetric, "id">) {
    return prisma.tR_J1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createTRJ2ItemMetric(details: Omit<TR_B1_ItemMetric, "id">) {
    return prisma.tR_J2_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createTRJ3ItemMetric(details: Omit<TR_J3_ItemMetric, "id">) {
    return prisma.tR_J3_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createTRJ4ItemMetric(details: Omit<TR_J4_ItemMetric, "id">) {
    return prisma.tR_J4_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createIRItemMetric(details: Omit<IR_ItemMetric, "id">) {
    return prisma.iR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createIRA1ItemMetric(details: Omit<IR_A1_ItemMetric, "id">) {
    return prisma.iR_A1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createIRM1ItemMetric(details: Omit<IR_M1_ItemMetric, "id">) {
    return prisma.iR_M1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createDRItemMetric(details: Omit<DR_ItemMetric, "id">) {
    return prisma.dR_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createDRD1ItemMetric(details: Omit<DR_D1_ItemMetric, "id">) {
    return prisma.dR_D1_ItemMetric.create({
      data: {
        reportItemId: details.reportItemId,
        period: details.period,
        value: details.value,
        metricType: details.metricType,
      },
    });
  }

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

  async createDRD2ItemMetric(details: Omit<DR_D2_ItemMetric, "id">) {
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
        institution_name: report.Report_Header.Institution_Name || "undefined",
        institution_id:
          report.Report_Header.Institution_ID[0].Type +
          ":" +
          report.Report_Header.Institution_ID[0].Value,
        created: report.Report_Header.Created,
        created_by: report.Report_Header.Created_By,
      });

      for (const filter of report.Report_Header.Report_Filters) {
        if (typeof filter === "string") return;
        await this.createReportFilter({
          reportId: savedReport.id,
          filter_type: filter.Name,
          value: filter.Value,
        });
      }

      if (report.Report_Header.Report_ID.includes("PR")) {
        for (const rawItem of report.Report_Items) {
          const reportItemDetails: any = {
            reportId: savedReport.id,
            platform: rawItem.Platform,
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

          for (const [metricType, periodTotal] of metricCounts.entries()) {
            const reportId = reportItemDetails.reportId;
            const platform = rawItem.Platform;

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

      if (report.Report_Header.Report_ID.includes("DR")) {
        for (const rawItem of report.Report_Items) {
          const drItem = rawItem as IDRReportItem;
          let reportItemDetails: any = {
            reportId: savedReport.id,
            database: drItem.Database,
            proprietary:
              drItem.Item_ID.find((id) => id.Type === "Proprietary")?.Value ||
              null,
            publisher: drItem.Publisher,
            publisherId: drItem.Publisher_ID.map(
              (id) => `${id.Type}:${id.Value}`,
            ).join(";"),
            platform: drItem.Platform,
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

      if (report.Report_Header.Report_ID.includes("IR")) {
        for (const rawItem of report.Report_Items) {
          const irItem = rawItem as ITRIRReportItem;
          let reportItemDetails: any = {
            reportId: savedReport.id,
            title: irItem.Title,
            publisher: irItem.Publisher,
            publisherId: irItem.Publisher_ID.map(
              (id) => `${id.Type}:${id.Value}`,
            ).join(";"),
            platform: irItem.Platform,
            doi: irItem.Item_ID.find((id) => id.Type === "DOI")?.Value || null,
            yop: irItem.Item_ID.find((id) => id.Type === "YOP")?.Value || null,
            item: irItem.Item,
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

      if (report.Report_Header.Report_ID.includes("TR")) {
        for (const rawItem of report.Report_Items) {
          const trItem = rawItem as ITRIRReportItem;
          let reportItemDetails: any = {
            reportId: savedReport.id,
            title: trItem.Title,
            publisher: trItem.Publisher,
            publisherId: trItem.Publisher_ID.map(
              (id) => `${id.Type}:${id.Value}`,
            ).join(";"),
            platform: trItem.Platform,
            doi: trItem.Item_ID.find((id) => id.Type === "DOI")?.Value || null,
            yop: trItem.Item_ID.find((id) => id.Type === "YOP")?.Value || null,
            proprietaryId:
              trItem.Item_ID.find((id) => id.Type === "Proprietary")?.Type +
                ":" +
                trItem.Item_ID.find((id) => id.Type === "Proprietary")?.Value ||
              null,
            isbn:
              trItem.Item_ID.find((id) => id.Type === "ISBN")?.Value || null,
            printIssn:
              trItem.Item_ID.find((id) => id.Type === "Print_ISSN")?.Value ||
              null,
            onlineIssn:
              trItem.Item_ID.find((id) => id.Type === "Online_ISSN")?.Value ||
              null,
            uri: trItem.Item_ID.find((id) => id.Type === "URI")?.Value || null,
            dataType:
              trItem.Item_ID.find((id) => id.Type === "Data_Type")?.Value ||
              null,
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
}

export const prismaReportService = new PrismaReportService();
