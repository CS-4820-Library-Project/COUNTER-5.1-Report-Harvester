-- CreateTable
CREATE TABLE "Vendor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "VendorRecord_5_1" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendorId" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "requestorId" TEXT,
    "baseURL" TEXT NOT NULL,
    "apiKey" TEXT,
    "platform" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "requireTwoAttempsPerReport" TEXT NOT NULL,
    "requireIpChecking" TEXT NOT NULL,
    "requrieRequestsThrottled" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VendorRecord_5_1_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VendorRecord_5_0" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vendorId" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "requestorId" TEXT,
    "baseURL" TEXT NOT NULL,
    "apiKey" TEXT,
    "platform" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "nonSUSHI" BOOLEAN NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VendorRecord_5_0_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_id" TEXT NOT NULL,
    "report_name" TEXT NOT NULL,
    "release" TEXT NOT NULL,
    "institution_name" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "created" TEXT NOT NULL,
    "created_by" TEXT NOT NULL
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
CREATE TABLE "ReportItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportId" INTEGER NOT NULL,
    "title" TEXT,
    "publisher" TEXT,
    "publisher_id" TEXT,
    "platform" TEXT,
    "doi" TEXT,
    "proprietary_id" TEXT,
    "isbn" TEXT,
    "print_issn" TEXT,
    "online_issn" TEXT,
    "uri" TEXT,
    "data_type" TEXT,
    "metric_type" TEXT,
    CONSTRAINT "ReportItem_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportItemId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "metricType" TEXT NOT NULL,
    CONSTRAINT "ReportMetric_reportItemId_fkey" FOREIGN KEY ("reportItemId") REFERENCES "ReportItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VendorRecord_5_1_vendorId_key" ON "VendorRecord_5_1"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorRecord_5_0_vendorId_key" ON "VendorRecord_5_0"("vendorId");
