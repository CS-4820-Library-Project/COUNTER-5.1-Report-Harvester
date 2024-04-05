import ActionButton from "../../components/buttons/ActionButton";
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  FilterList,
  LocalLibraryOutlined,
} from "@mui/icons-material";
import { FlexBetween, FlexRowEnd } from "../../components/flex";
import PageTitle from "../../components/PageTitle";
import Page from "../../components/page/Page";
import PageColumn from "../../components/page/PageColumn";
import VendorForm from "./VendorForm";
import { useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import VendorList from "../../components/vendor/VendorList";

import { SortOptions, VendorRecord } from "src/types/vendors";
import FiltersPopUp from "./FiltersPopUp";
import ImportPopUp from "../../components/popups/ImportPopUp";
import ExportPopUp from "../../components/popups/ExportPopUp";
import HelpOutline from "@mui/icons-material/HelpOutline";
import HelpMessages from "../../data/HelpMessages";
/**
 * This is the "VendorsPage" component of the application.
 *
 * It serves as a central hub for managing vendor-related information, allowing users to add, import, and search for vendors.
 * The page is divided into a main section for listing and searching vendors and a side section dedicated to vendor form actions.
 * Additionally, it features a dialog for importing vendor data from a file, enhancing the user's ability to manage vendor records efficiently.
 *
 * Key Features:
 * - Dynamic vendor listing with search functionality.
 * - Form for adding new vendors or editing existing ones.
 * - Import dialog supporting file uploads for vendor data.
 * - Responsive design to accommodate various screen sizes.
 */
const VendorsPage = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:1300px)");

  const [filtersPopUp, setFiltersPopUp] = useState(false);
  const [sortBy, setSortBy] = useState<SortOptions>("updatedAt");
  const [query, setQuery] = useState<string | null>(null);

  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);

  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [reloadVendors, setReloadVendors] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorRecord | null>(
    null
  );

  const handleSelectedVendor = (vendor: VendorRecord | VendorRecord[]) => {
    if (Array.isArray(vendor)) {
      setSelectedVendor(vendor[0]);
      return;
    }

    selectedVendor && selectedVendor.id === vendor.id
      ? setSelectedVendor(null)
      : setSelectedVendor(vendor);
  };

  // Toggle state for adding a new vendor and clear any selected vendor.
  const handleAddVendor = () => {
    setIsAddingVendor(true);
    setSelectedVendor(null);
  };

  const handleReloadVendors = () => setReloadVendors(!reloadVendors);

  const openImportPopup = () => setOpenImportDialog(true);
  const closeImportPopup = () => setOpenImportDialog(false);

  const openExportPopup = () => setOpenExportDialog(true);
  const closeExportPopup = () => setOpenExportDialog(false);

  const openFilters = () => setFiltersPopUp(!filtersPopUp);
  const handleHelpClick = () => {
    const helpContent = HelpMessages.vendorsPage.Help.url;
    if (helpContent) {
      window.open(helpContent, "_blank"); // Opens the URL in a new tab
    }
  };
  return (
    <Page>
      <PageColumn component="main" width="50%">
        <PageTitle title="Manage Vendors" />

        {/* Actions */}
        <FlexBetween width="100%" color={palette.text.light}>
          <FlexBetween gap="5px" flexWrap="wrap">
            <ActionButton
              hint="Add a new vendor"
              label={isNonMobile ? "Add Vendor" : "Add"}
              color="secondary"
              icon={<LocalLibraryOutlined fontSize="small" />}
              onClick={handleAddVendor}
            />

            <ActionButton
              hint="Import vendors from a file"
              label={isNonMobile ? "Import Vendors" : "Import"}
              color="secondary"
              icon={<ArrowDownwardOutlined fontSize="small" />}
              onClick={openImportPopup}
            />

            <ActionButton
              hint="Export vendors to a TSV file"
              label={isNonMobile ? "Export Vendors" : "Export"}
              color="secondary"
              icon={<ArrowUpwardOutlined fontSize="small" />}
              onClick={openExportPopup}
            />
          </FlexBetween>

          <ActionButton
            onClick={openFilters}
            icon={<FilterList />}
            padding="1px 0"
            color="secondary"
          />
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
          version="All"
          sortBy={sortBy}
          query={query}
          selected={selectedVendor ? [selectedVendor] : []}
          setSelected={handleSelectedVendor}
          reload={reloadVendors}
        />
      </PageColumn>

      {/* Side Section - Forms */}
      <PageColumn width="50%">
        <VendorForm
          selectedVendor={selectedVendor}
          isAdding={isAddingVendor}
          refreshVendors={() => {
            handleReloadVendors();
            setIsAddingVendor(false);
            setSelectedVendor(null);
          }}
        />
      </PageColumn>
      <div
        style={{ position: "fixed", top: 0, right: "0.8rem", padding: "1rem" }}
      >
        <ActionButton
          label="Help"
          color="background"
          icon={<HelpOutline />}
          onClick={handleHelpClick}
        />
      </div>
      {/*  */}

      <ImportPopUp
        open={openImportDialog}
        onClose={closeImportPopup}
        reloadVendors={handleReloadVendors}
      />

      <ExportPopUp open={openExportDialog} onClose={closeExportPopup} />
    </Page>
  );
};

export default VendorsPage;
