-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_id" TEXT NOT NULL,
    "report_name" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "metric_types" TEXT,
    "report_attributes" TEXT,
    "exceptions" TEXT,
    "reporting_period" TEXT,
    "institution_name" TEXT NOT NULL,
    "institution_id" TEXT,
    "created" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "registry_record" TEXT
);

-- CreateTable
CREATE TABLE "ReportFilter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "filter_type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "ReportFilter_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PR_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "periodTotal" INTEGER NOT NULL,
    CONSTRAINT "PR_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PR_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "PR_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "PR_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PR_P1_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "PR_P1_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PR_P1_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "PR_P1_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "PR_P1_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DR_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "database" TEXT NOT NULL,
    "proprietary" TEXT,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "DR_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DR_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "DR_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "DR_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DR_D1_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "database" TEXT NOT NULL,
    "proprietary" TEXT,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "DR_D1_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DR_D1_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "DR_D1_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "DR_D1_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DR_D2_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "database" TEXT NOT NULL,
    "proprietary" TEXT,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "DR_D2_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DR_D2_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "DR_D2_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "DR_D2_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "yop" TEXT,
    "proprietaryId" TEXT,
    "isbn" TEXT,
    "printIssn" TEXT,
    "onlineIssn" TEXT,
    "uri" TEXT,
    "dataType" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "TR_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "TR_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "TR_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_B1_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "yop" TEXT,
    "proprietaryId" TEXT,
    "isbn" TEXT,
    "printIssn" TEXT,
    "onlineIssn" TEXT,
    "uri" TEXT,
    "dataType" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "TR_B1_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_B1_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "TR_B1_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "TR_B1_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_B2_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "yop" TEXT,
    "proprietaryId" TEXT,
    "isbn" TEXT,
    "printIssn" TEXT,
    "onlineIssn" TEXT,
    "uri" TEXT,
    "dataType" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "TR_B2_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_B2_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "TR_B2_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "TR_B2_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_B3_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "yop" TEXT,
    "proprietaryId" TEXT,
    "isbn" TEXT,
    "printIssn" TEXT,
    "onlineIssn" TEXT,
    "uri" TEXT,
    "dataType" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "TR_B3_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_B3_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "TR_B3_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "TR_B3_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_J1_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "yop" TEXT,
    "proprietaryId" TEXT,
    "isbn" TEXT,
    "printIssn" TEXT,
    "onlineIssn" TEXT,
    "uri" TEXT,
    "dataType" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "TR_J1_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_J1_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "TR_J1_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "TR_J1_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_J2_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "yop" TEXT,
    "proprietaryId" TEXT,
    "isbn" TEXT,
    "printIssn" TEXT,
    "onlineIssn" TEXT,
    "uri" TEXT,
    "dataType" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "TR_J2_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_J2_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "TR_J2_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "TR_J2_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_J3_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "yop" TEXT,
    "proprietaryId" TEXT,
    "isbn" TEXT,
    "printIssn" TEXT,
    "onlineIssn" TEXT,
    "uri" TEXT,
    "dataType" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "TR_J3_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_J3_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "TR_J3_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "TR_J3_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_J4_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "yop" TEXT,
    "proprietaryId" TEXT,
    "isbn" TEXT,
    "printIssn" TEXT,
    "onlineIssn" TEXT,
    "uri" TEXT,
    "dataType" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "TR_J4_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TR_J4_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "TR_J4_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "TR_J4_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IR_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "item" TEXT,
    "yop" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "IR_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IR_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "IR_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "IR_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IR_A1_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "item" TEXT,
    "yop" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "IR_A1_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IR_A1_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "IR_A1_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "IR_A1_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IR_M1_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT,
    "publisher" TEXT NOT NULL,
    "publisherId" TEXT,
    "platform" TEXT NOT NULL,
    "doi" TEXT,
    "item" TEXT,
    "yop" TEXT,
    "metricType" TEXT NOT NULL,
    "reportingPeriodTotal" INTEGER NOT NULL,
    CONSTRAINT "IR_M1_Item_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IR_M1_ItemMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "IR_M1_ItemMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "IR_M1_Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
