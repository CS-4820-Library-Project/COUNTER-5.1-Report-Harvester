import ActionButton from "../../components/buttons/ActionButton";
import {
  BrowserUpdatedOutlined,
  Deselect,
  FilterList,
  SelectAll,
} from "@mui/icons-material";
import {
  FlexBetween,
  FlexCenter,
  FlexColumn,
  FlexColumnStart,
  FlexRowEnd,
} from "../../components/flex";
import PageTitle from "../../components/PageTitle";
import Page from "../../components/page/Page";
import PageColumn from "../../components/page/PageColumn";
import VendorList from "../../components/vendor/VendorList";
import SearchBar from "../../components/SearchBar";
import SectionTitle from "../../components/SectionTitle";
import { useMediaQuery, useTheme } from "@mui/material";
import ReportOptions from "./ReportOptions";
import { useEffect, useState } from "react";
import { Report } from "../../../../types/counter";
import Calendar from "../../components/calendar/Calendar";
import FetchProgress from "./fetch_progress/FetchProgress";
import { SortOptions, VendorRecord, VendorVersions } from "src/types/vendors";
import FiltersPopUp from "../vendors/FiltersPopUp";
import DualToggle from "../../components/buttons/DualToggle";
import { useNotification } from "../../components/NotificationBadge";
import { SideBadge } from "../../components/badge/SideBadge";
import { reports_5_1 } from "../../../../constants/Reports_5_1";
import { reports_5 } from "../../../../constants/Reports_5";
import { FetchResults } from "../../../../types/reports";
import { reportsIds } from "../../../../constants";

/**
 * This is the "FetchReportsPage" component.
 *
 * This component allows users to fetch reports for selected vendors within a specific date range. Users can select vendors, specify the type of reports they are interested in, and initiate the fetching process. The component demonstrates the use of React hooks for state management, useEffect for side effects, conditional rendering, and integration with custom services for data retrieval.
 *
 * The main elements of this component are:
 * - A search bar to filter through the list of vendors.
 * - A list of vendors from which the user can select.
 * - Options to select the types of reports to fetch.
 * - A calendar component for selecting the date range for the reports.
 * - Action buttons to initiate the fetching of reports based on selected criteria.
 */

const FetchReportsPage = () => {
  const { palette } = useTheme();
  const setNotification = useNotification();
  const isNonMobile = useMediaQuery("(min-width:1300px)");

  const [version, setVersion] = useState<string>("5.0");
  const [reports, setReports] = useState(reports_5);
  const [availableReports, setAvailableReports] =
    useState<string[]>(reportsIds);
  const [selectedReports, setSelectedReports] = useState<Report[]>([]);

  const [filtersPopUp, setFiltersPopUp] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOptions>("name");

  const [fetching, setFetching] = useState(false);
  const [selectAllVendors, setSelectAllVendors] = useState(false);

  const [selectedVendors, setSelectedVendors] = useState<VendorRecord[]>([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [fromDate, setFromDate] = useState<Date>(new Date(currentYear, 0));
  const [toDate, setToDate] = useState<Date>(
    new Date(currentYear, currentMonth - 1)
  );

  const [fetchResults, setFetchResults] = useState<FetchResults>();

  const handleSelectedVendor = (vendor: VendorRecord | VendorRecord[]) => {
    if (Array.isArray(vendor)) {
      setSelectedVendors([...vendor]);
      return;
    }

    setSelectedVendors((prev) => {
      const isSelected = prev.some((v) => v.id === vendor.id);
      return isSelected
        ? prev.filter((v) => v.id !== vendor.id)
        : [...prev, vendor];
    });
  };

  const cancelFetch = () => setFetching(false);

  const openFilters = () => setFiltersPopUp(!filtersPopUp);

  const handleFetchReports = async (all?: "all") => {
    if (selectedVendors.length < 1) {
      const message =
        selectedReports.length < 1 && !all
          ? "Please select at least one vendor and one report type."
          : "Please select at least one vendor.";

      return setNotification({
        type: "warning",
        message,
      });
    }

    setFetching(true);
    all && setSelectedReports(reports.all);

    const fetchReports = all ? reports.all : selectedReports;

    const allResults = await window.reports.fetch({
      fetchReports,
      selectedVendors,
      version,
      fromDate,
      toDate,
    });

    setFetchResults(allResults);
    setSelectedReports([]);
  };

  useEffect(() => {
    setSelectedReports([]);
    version === "5.1" ? setReports(reports_5_1) : setReports(reports_5);
  }, [version]);

  useEffect(() => {
    selectedVendors.length === 1
      ? window.reports.getSupported(selectedVendors[0]).then((reports) => {
          Array.isArray(reports) && setAvailableReports(reports);
        })
      : setAvailableReports(reportsIds);
  }, [selectedVendors]);

  return (
    <Page>
      <PageColumn component="main" width={isNonMobile ? "50%" : "40%"}>
        {/* Main Section */}
        {fetching && (
          <FlexCenter
            position="absolute"
            zIndex={9}
            top="0"
            left="0"
            width="100%"
            height="100%"
            bgcolor="rgba(0, 0, 0, 0.25)"
          >
            <FetchProgress
              close={cancelFetch}
              totalVendors={selectedVendors.length}
              fetchResults={fetchResults}
            />
          </FlexCenter>
        )}

        {/* Page Header */}
        <PageTitle>
          <FlexBetween width="100%">
            Fetch Reports
            <DualToggle
              option1="5.1"
              option2="5.0"
              value={version}
              setValue={setVersion}
            />
          </FlexBetween>
        </PageTitle>

        {/* Actions */}
        <FlexBetween gap="10px" width="100%">
          <SideBadge badgeContent={selectedVendors.length} color="primary">
            <SectionTitle>Select Vendors</SectionTitle>
          </SideBadge>

          {/* Buttons */}
          <FlexCenter gap="10px">
            <ActionButton
              label="Select All"
              color="secondary"
              icon={<SelectAll fontSize="small" />}
              onClick={() => setSelectAllVendors(true)}
            />
            <ActionButton
              label="Deselect All"
              color="secondary"
              icon={<Deselect fontSize="small" />}
              onClick={() => {
                setSelectAllVendors(false);
                setSelectedVendors([]);
              }}
            />
            <ActionButton
              onClick={openFilters}
              icon={<FilterList />}
              padding="1px 0"
              color="secondary"
            />
          </FlexCenter>
        </FlexBetween>

        <FlexRowEnd width="100%" position="relative">
          {filtersPopUp && (
            <FiltersPopUp setSortBy={setSortBy} sortby={sortBy} />
          )}
        </FlexRowEnd>

        <SearchBar
          onValueChange={(value) => {
            setQuery(value);
          }}
          placeholder="Search vendors"
        />

        <VendorList
          query={query}
          sortBy={sortBy}
          selectAll={selectAllVendors}
          selected={selectedVendors}
          setSelected={handleSelectedVendor}
          version={version as VendorVersions}
        />
      </PageColumn>

      {/* Side Section - Forms */}
      <PageColumn height="100%" width={isNonMobile ? "50%" : "60%"}>
        {/* Report Types */}

        <ReportOptions
          reports={reports}
          version={version as VendorVersions}
          setSelectedReports={setSelectedReports}
          selectedReports={selectedReports}
          availableReports={availableReports}
        />

        {/* Fetch Tools */}
        <FlexColumnStart
          height="50%"
          width="100%"
          minHeight="max-content"
          maxWidth="100%"
          borderRadius="25px"
          padding="20px"
          border={`1px solid ${palette.primary.main}`}
        >
          <FlexBetween gap="20px" maxWidth="max-content">
            {/* Date Picker */}
            <Calendar
              setFromDate={setFromDate}
              setToDate={setToDate}
              toDate={toDate}
              fromDate={fromDate}
            />

            {/* Buttons */}
            <FlexColumn gap="20px">
              <ActionButton
                width="100%"
                padding="0.5rem 1.5rem"
                icon={<BrowserUpdatedOutlined />}
                label="Fetch Selected Reports"
                hint="Will fetch only the reports selected above for the selected vendors."
                color="secondary"
                onClick={() => handleFetchReports()}
              />
              <ActionButton
                width="100%"
                padding="0.5rem 1.5rem"
                icon={<BrowserUpdatedOutlined />}
                hint="Will fetch all reports available for the selected vendors."
                label="Fetch All Available Reports"
                color="secondary"
                onClick={() => handleFetchReports("all")}
              />
            </FlexColumn>
          </FlexBetween>
        </FlexColumnStart>
      </PageColumn>
    </Page>
  );
};

export default FetchReportsPage;
