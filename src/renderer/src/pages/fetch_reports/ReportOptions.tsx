import { useEffect, useState } from "react";
import ToggleNav from "../../components/buttons/ToggleNav";

import { Box, Typography, styled, useTheme } from "@mui/material";
import { FlexBetween, FlexColumnStart } from "../../components/flex";
import {
  Report,
  Report_Id,
  Report_Attributes,
  Report_Filters,
  Report_Name,
  ReportColumns,
  Period,
  Reports,
} from "../../../../types/counter";
import Toggle from "../../components/buttons/Toggle";
import TextButton from "../../components/buttons/TextButton";
import { VendorVersions } from "src/types/vendors";
import YopFilter from "./YopFilter";

type Props = {
  setSelectedReports: React.Dispatch<React.SetStateAction<Report[]>>;
  selectedReports: Report[];
  version: VendorVersions;
  reports: Reports;
  availableReports: string[]; // When there is one Selected Vendor
  resetOptions: boolean;
};

/**
 * The "ReportOptions" component allows users to select and customize reports based on predefined criteria.
 * It provides functionalities to select report types, customize reports by selecting specific attributes and filters,
 * and manage the selection state across a series of toggleable UI elements.
 *
 * Key functionalities include:
 * - Selection of main reports from a predefined list.
 * - Customization mode that allows users to modify the selected main reports by choosing specific attributes and filters.
 * - Ability to select standard views for quick access to predefined reports.
 * - Dynamic handling of UI state based on user interactions for a responsive and intuitive configuration experience.
 */

const ReportOptions = ({
  setSelectedReports,
  availableReports,
  selectedReports,
  version,
  reports,
  resetOptions,
}: Props) => {
  const { palette } = useTheme();

  const arrayAttributes = [
    "Access_Method",
    "Access_Type",
    "Data_Type",
    "Metric_Type",
  ] as const;

  type arrayAttributes = (typeof arrayAttributes)[number];

  // State for managing customization mode, active and custom reports, and selected attributes.
  const [customize, setCustomize] = useState(false);

  const [activeReport, setActiveReport] = useState<Report>();
  const [customReport, setCustomReport] = useState<Report>();
  const [selectedAttribute, setSelectedAttribute] = useState<string>();

  const [yop, setYop] = useState<string>("All");

  // Replaces custom reports for defaults on version change
  const handleCustomize = () => {
    //Replace main reports
    const mainSelected = reports.main.filter((report) =>
      selectedReports.some((selectedReport) => selectedReport.id === report.id)
    );

    // Include standard reports from selected reports
    const standardSelected = selectedReports.filter((report) =>
      mainSelected.some((selectedReport) => selectedReport.id !== report.id)
    );

    setSelectedReports([...mainSelected, ...standardSelected]);
    setCustomReport(undefined);
    setActiveReport(undefined);
    setSelectedAttribute(undefined);
  };

  // Handler for selecting or deselecting reports.
  const handleSelectedReport = (reportId: string, selected: boolean) => {
    let selectedReport = selectedReports.find(
      (report) => report.id === reportId
    );

    const predefinedReport = reports.all.find(
      (report) => report.id === reportId
    );

    if (!selectedReport && predefinedReport) {
      selectedReport = { ...predefinedReport };
    }

    setSelectedReports((prev) => {
      const filtered = prev.filter((report) => report.id !== reportId);
      return selected && selectedReport
        ? [...filtered, selectedReport]
        : filtered;
    });

    // If not selected, reset
    if (!selected) {
      setActiveReport(undefined);
    }
  };

  // Handler for setting an active report for customization.
  const handleActiveReport = (reportId: string) => {
    const template = reports.templates.find((report) => report.id === reportId);
    const report = reports.main.find((report) => report.id === reportId);
    const selected = selectedReports.find((report) => report.id === reportId);

    if (report && template) {
      setSelectedAttribute(undefined);
      const newCustomReport = {
        ...report,
        name: ("Custom " + report.name) as Report_Name,
      };

      const customTemplate = {
        ...template,
        name: ("Custom " + report.name) as Report_Name,
      };

      if (customize) {
        setCustomReport(
          selected && selected.name.includes("Custom")
            ? selected
            : newCustomReport
        );
        setActiveReport(customTemplate);
      }
    }
  };

  /**
   * Handler for selecting or deselecting attributes and filters within a custom report.
   * @param property - The attribute or filter to be selected or deselected.
   * @param selected - A boolean value indicating whether the attribute or filter is selected.
   */
  const handleSelectedAttribute = (property: string, selected: boolean) => {
    if (activeReport) {
      const customReportId = activeReport.id as Report_Id;

      // Create or Copy Custom Report Attributes
      let customAttributes: Report_Attributes =
        (customReport && { ...customReport.attributes }) || {};

      // Add or Remove Attribute from Custom Report
      if (property in activeReport.attributes) {
        const attribute = property as keyof Report_Attributes;
        selected
          ? (customAttributes = {
              ...customAttributes,
              [attribute]: activeReport.attributes[attribute]
                ? customAttributes[attribute] || []
                : true,
            })
          : delete customAttributes[attribute as keyof Report_Attributes];
      }

      // Create or Copy Custom Report Filters
      let customFilters: Report_Filters =
        (customReport && { ...customReport.filters }) || {};

      // Add or Remove Filter from Custom Report
      if (property in activeReport.filters) {
        const filter = property as keyof Report_Filters;

        selected
          ? // Add filter if it doesn't exist
            (customFilters = {
              ...customFilters,
              [filter]: activeReport.filters[filter]
                ? customFilters[filter] || []
                : true,
            })
          : delete customFilters[filter as keyof Report_Filters];
      }

      // Create Custom Report
      const newCustomReport: Report = {
        id: customReportId,
        name: activeReport.name,
        attributes: customAttributes,
        filters: customFilters,
      };

      // Add or remove custom report from selected reports
      setSelectedReports((prev) => {
        const filtered = prev.filter((report) => report.id !== customReportId);
        return [...filtered, newCustomReport];
      });

      // Set Active Report to custom report for further customization
      setCustomReport(newCustomReport);
    } else {
      // Remove Custom Report
      customReport && handleSelectedReport(customReport.id, false);
      setCustomReport(undefined);
    }
  };

  // Handler for selecting a specific attribute within a custom report for further customization.
  const handleActiveAttribute = (attribute: string) => {
    // Attribute can be empty string
    setSelectedAttribute(attribute && activeReport ? attribute : undefined);
  };

  // Handler for selecting filters within the customization of a report.
  const handleFiltersSelection = (filter: string) => {
    type Filters = {
      Access_Method?: string[];
      Access_Type?: string[];
      Period?: Period;
      Data_Type?: string[];
      Metric_Type?: string[];
      YOP?: string;
    };

    if (selectedAttribute && customReport) {
      // Change to string
      const attribute = selectedAttribute as
        | keyof Report_Attributes
        | keyof Report_Filters;

      const attributes = { ...customReport.attributes };
      const filters = { ...customReport.filters } as Filters;

      // Update Attributes
      if (attribute in attributes) {
        //
        if (attribute === "Attributes_To_Show") {
          const oldValue = attributes[attribute];
          if (oldValue === undefined) return;

          if (Array.isArray(oldValue)) {
            if (oldValue.includes(filter as ReportColumns)) {
              const filtered = oldValue.filter((column) => column !== filter);
              attributes[attribute] = filtered;
            } else {
              attributes[attribute] = [...oldValue, filter] as ReportColumns[];
            }
          }
        }

        // Update Boolean Attributes
        type booleanAttributes =
          | "Exclude_Monthly_Details"
          | "Include_Component_Details"
          | "Include_Parent_Details";

        const booleanAttributes: booleanAttributes[] = [
          "Exclude_Monthly_Details",
          "Include_Component_Details",
          "Include_Parent_Details",
        ] as const;

        if (booleanAttributes.includes(attribute as booleanAttributes)) {
          const oldValue = attributes[attribute as keyof Report_Attributes];
          if (oldValue === undefined) return;

          if (typeof oldValue === "boolean") {
            attributes[attribute as booleanAttributes] = !oldValue;
          }
        }
      }

      // Update Filters
      if (arrayAttributes.includes(attribute as arrayAttributes)) {
        const oldValue = filters[attribute as arrayAttributes];
        if (oldValue === undefined) return;

        if (oldValue.includes(filter)) {
          const filtered = oldValue.filter((column) => column !== filter);
          filters[attribute as arrayAttributes] = filtered;
        } else {
          filters[attribute as arrayAttributes] = [...oldValue, filter];
        }
      }

      if (attribute === "YOP") filters.YOP = yop;

      const newCustomReport = { ...customReport };
      newCustomReport.attributes = attributes;
      newCustomReport.filters = filters as Report_Filters;

      setCustomReport(newCustomReport);

      // Update Selected Reports
      setSelectedReports((prev) => {
        const filtered = prev.filter((report) => report.id !== customReport.id);
        return [...filtered, newCustomReport];
      });
    }
  };

  // Handler to reset the options
  const handleResetOptions = () => {
    setSelectedReports([]);
    setSelectedAttribute(undefined);
    setCustomReport(undefined);
    setActiveReport(undefined);
  };

  useEffect(handleResetOptions, [resetOptions]);

  useEffect(handleResetOptions, [version]);

  useEffect(handleCustomize, [customize]);

  useEffect(() => handleFiltersSelection("YOP"), [yop]);

  // Clear not available options
  useEffect(() => {
    console.log("Available Reports", availableReports);
    if (!availableReports.includes(activeReport?.id || "")) {
      setCustomReport(undefined);
      setActiveReport(undefined);
    }
    setSelectedReports((currentReports) =>
      currentReports.filter((report) => availableReports.includes(report.id))
    );
  }, [availableReports]);

  /* Debugging Logs - Keep for peace of mind :) */

  useEffect(() => {
    console.log("Active Report", activeReport);
  }, [activeReport]);

  // useEffect(() => {
  //   console.log("Custom Report", customReport);
  // }, [customReport]);

  // useEffect(() => {
  //   console.log("Selected Reports", selectedReports);
  // }, [selectedReports]);

  // useEffect(() => {
  //   Object.keys(customReport.attributes)
  // }, [customReport]);

  // useEffect(() => {
  //   console.log("Selected Attribute", selectedAttribute);
  // }, [selectedAttribute]);

  return (
    <Box
      borderRadius="25px"
      padding="20px"
      border={`1px solid ${palette.primary.main}`}
      flexGrow={1}
      height={"55%"}
      width="100%"
    >
      {/* Main Reports */}
      <FlexBetween width="100%" mb="20px">
        <Typography variant="h4">Select your report types:</Typography>

        <TextButton onClick={() => setCustomize(!customize)}>
          {customize ? "Select Standard Report" : "Customize Main Reports"}
        </TextButton>
      </FlexBetween>

      <FlexColumnStart
        className="card-scroll"
        gap="20px"
        maxHeight="calc(100% - 50px)"
        // minHeight="max-content"
        sx={{
          "&::-webkit-scrollbar-thumb": {
            background: palette.background.main,
          },
          overflowX: "visible",
        }}
      >
        {/* Reports */}
        <FlexWrap justifyContent="space-between">
          {reports.main.map((report) =>
            customize ? (
              <ToggleNav
                key={report.id}
                label={report.id}
                hint={report.name}
                isSelected={selectedReports.some(
                  (selectedReport) => selectedReport.id === report.id
                )}
                setSelected={handleSelectedReport}
                isActive={activeReport?.id === report.id}
                setActiveTab={handleActiveReport}
                disabled={!availableReports.includes(report.id)}
              />
            ) : (
              <Toggle
                size="large"
                key={report.id}
                hint={report.name}
                label={report.id}
                isSelected={selectedReports.some(
                  (selectedReport) => selectedReport.id === report.id
                )}
                disabled={!availableReports.includes(report.id)}
                onClick={() =>
                  handleSelectedReport(
                    report.id,
                    !selectedReports.some(
                      (selectedReport) => selectedReport.id === report.id
                    )
                  )
                }
              />
            )
          )}
        </FlexWrap>

        {activeReport && customize && (
          <>
            {/* Options for active report */}
            <Typography
              position="sticky"
              zIndex={3}
              bgcolor={palette.background.light}
              top="0"
              variant="h5"
              width="100%"
              fontWeight={500}
              pb="10px"
            >
              Select Filters and Attributes for{" "}
              <Box
                component="span"
                color={palette.primary.main}
                fontWeight={700}
              >
                {activeReport?.name + ":"}
              </Box>
            </Typography>

            <FlexWrap>
              {/* Render Filters */}
              {Object.keys(activeReport.filters).map((attribute) => (
                <ToggleNav
                  key={attribute}
                  size="small"
                  label={attribute}
                  setSelected={handleSelectedAttribute}
                  setActiveTab={handleActiveAttribute}
                  isSelected={
                    customReport && activeReport.name === customReport.name
                      ? attribute in customReport.attributes ||
                        attribute in customReport.filters
                      : false
                  }
                  isActive={attribute === selectedAttribute}
                />
              ))}

              {/* Render Attributes */}
              {Object.entries(activeReport.attributes).map(
                ([attribute, value]) => {
                  return typeof value === "boolean" ? (
                    <Toggle
                      key={attribute}
                      hint={
                        attribute +
                        " - " +
                        // Attrtibute Value
                        (customReport?.attributes[
                          attribute as keyof Report_Attributes
                        ] || false)
                      }
                      label={attribute}
                      isSelected={
                        customReport && activeReport.name === customReport.name
                          ? customReport.attributes[
                              attribute as keyof Report_Attributes
                            ] === true
                          : false
                      }
                      onClick={() =>
                        handleSelectedAttribute(
                          attribute,
                          !customReport?.attributes[
                            attribute as keyof Report_Attributes
                          ]
                        )
                      }
                    />
                  ) : (
                    // Render Columns to Show
                    <ToggleNav
                      key={attribute}
                      size="small"
                      label={attribute}
                      isSelected={
                        customReport && activeReport.name === customReport.name
                          ? attribute in customReport.attributes ||
                            attribute in customReport.filters
                          : false
                      }
                      setSelected={handleSelectedAttribute}
                      setActiveTab={handleActiveAttribute}
                      isActive={attribute === selectedAttribute}
                    />
                  );
                }
              )}
            </FlexWrap>

            {/* Filters and Options */}

            {customReport && selectedAttribute && (
              <>
                {(() => {
                  const attribute = selectedAttribute.replace(/_/g, " ");
                  const label =
                    attribute === "YOP"
                      ? "Year of Publication"
                      : attribute === "Attributes to Show"
                        ? ""
                        : attribute;
                  return (
                    // Header
                    <Typography
                      position="sticky"
                      zIndex={3}
                      bgcolor={palette.background.light}
                      top="28px"
                      width="100%"
                      variant="h5"
                      fontWeight={600}
                      pb="10px"
                    >
                      <Box
                        component="span"
                        color={palette.primary.main}
                        fontWeight={700}
                      >
                        {label}
                      </Box>
                      {attribute === "YOP"
                        ? " Date Range Filter:"
                        : attribute === "Attributes to Show"
                          ? " Show the following attributes in the report:"
                          : " Filters:"}
                    </Typography>
                  );
                })()}

                <FlexWrap>
                  {(() => {
                    type StringArrayObject = {
                      [key: string]: string[];
                    };

                    const options =
                      activeReport.attributes[
                        selectedAttribute as keyof Report_Attributes
                      ] ||
                      activeReport.filters[
                        selectedAttribute as keyof Report_Filters
                      ];

                    if (Array.isArray(options) && customReport) {
                      const attributes =
                        customReport.attributes as StringArrayObject;

                      const filters = customReport.filters as StringArrayObject;

                      return options.map((value) => (
                        <Toggle
                          key={value}
                          hint={value}
                          label={value}
                          isSelected={
                            attributes[selectedAttribute]?.includes(value) ||
                            filters[selectedAttribute]?.includes(value)
                          }
                          onClick={() => handleFiltersSelection(value)}
                        />
                      ));
                    }

                    if (typeof options === "string")
                      return <YopFilter value={yop} onValueChange={setYop} />;
                  })()}
                </FlexWrap>
              </>
            )}
          </>
        )}

        {/* Standard Views */}

        <Typography
          position="sticky"
          zIndex={3}
          style={{ top: "50px" }}
          variant="h5"
          width="100%"
        >
          Select your Standard Views:
        </Typography>

        <Box display="flex" gap="10px" flexWrap="wrap" maxWidth="100%">
          {reports.standard.map((report) => {
            const isSelected = selectedReports.some((r) => r.id === report.id);
            return (
              <Toggle
                key={report.id}
                hint={report.name}
                label={report.id}
                isSelected={isSelected}
                disabled={!availableReports.includes(report.id)}
                onClick={() => handleSelectedReport(report.id, !isSelected)}
              />
            );
          })}
        </Box>
      </FlexColumnStart>
    </Box>
  );
};

export default ReportOptions;

const FlexWrap = styled(Box)({
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  maxWidth: "100%",
  width: "100%",
});
