import { useEffect, useState } from "react";
import { Typography, Box, useTheme, Button } from "@mui/material";
import {
  FlexBetween,
  FlexColumnStart,
  FlexRowStart,
} from "../../components/flex";
import SearchBar from "../../components/SearchBar";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ActionButton from "../../components/buttons/ActionButton";
import HelpMessages from "../../data/HelpMessages";
import Strong from "../../components/text/Strong";
import { useNotification } from "../../components/NotificationBadge";
import Page from "../../components/page/Page";
import PageColumn from "../../components/page/PageColumn";
import { ImportExportOutlined } from "@mui/icons-material";
import { RefreshOutlined } from "@mui/icons-material";

const SearchReportsPage = () => {
  const theme = useTheme();
  const setNotification = useNotification();

  const [activeButton, setActiveButton] = useState<string | null>("Title");

  // Add states for search results and vendors
  const [searchResults, setSearchResults] = useState<number | null>(null);
  const [vendorsCount, setVendorsCount] = useState<number>(0); //TODO: Add vendors count if possible
  const [searchDuration, setSearchDuration] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        document.getElementById("hiddenButton")?.click(); // Implemented like this to avoid dealing with state issues
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleButtonClick = (label: string) => {
    setActiveButton(label === activeButton ? null : label);
  };

  // Modify the handleSearch function to only store the search value
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  // Add a new function to perform the search when the button is clicked
  const handleSearchButtonClick = async () => {
    if (!activeButton || !searchValue) return;
    const startTime = Date.now();

    try {
      const results = await window.database.writeSearchedReportsToTSV(
        activeButton === "Title" ? searchValue : "",
        activeButton === "ISSN" ? searchValue : "",
        activeButton === "ISBN" ? searchValue : ""
      );

      console.log(results);

      if (results.length > 0) {
        setNotification({
          type: "success",
          message: "Search Results Exported to your search folder",
        });
      } else {
        setNotification({
          type: "info",
          message: "Search returned no results.",
        });
      }

      setSearchResults(results.length);
      setVendorsCount(new Set(results.map((r: any) => r.vendor)).size);

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      setSearchDuration(duration);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Could not search reports. Please try again.",
      });
      console.error("Error searching report: ", error);
    }
  };

  const getButtonStyles = (isActive: boolean) =>
    ({
      backgroundColor: isActive
        ? theme.palette.success.dark
        : theme.palette.background.main,
      color: isActive
        ? theme.palette.success.contrastText
        : theme.palette.background.contrastText,
      borderRadius: "25px",
      padding: "6px",
      cursor: "pointer",
      textAlign: "center",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "3px 2px",
      textTransform: "capitalize",
      transition: "background-color 0.3s",
    }) as const;

  const handleOpenResults = async () => {
    const searchPath = await window.settings.getDirectory("search");
    await window.settings.openPath(searchPath);
  };
  const handleHelpClick = () => {
    const helpContent = HelpMessages.searchReportsPage.Help.url;
    if (helpContent) {
      window.open(helpContent, "_blank"); // Opens the URL in a new tab
    }
  };

  const handleExportDatabaseClick = async () => {
    await window.database.exportDatabase();
  };

  const handleRebuildDatabaseClick = async () => {
    await window.database.rebuildDatabase();
  };

  return (
    <Page>
      <PageColumn width="100%" gap="70px">
        <FlexBetween width="100%" mb="20px">
          <Typography variant="h1" color="primary">
            Search Reports in Database
          </Typography>
          <div>
            <ActionButton
              label="Rebuild Database"
              color="secondary"
              icon={<RefreshOutlined fontSize="small" />}
              onClick={handleRebuildDatabaseClick}
              style={{ marginRight: "20px" }}
            />
            <ActionButton
              label="Export Database"
              color="primary"
              icon={<ImportExportOutlined fontSize="small" />}
              onClick={handleExportDatabaseClick}
              style={{ marginRight: "20px" }}
            />
            <ActionButton
              label="Help"
              color="background"
              icon={<HelpOutlineIcon fontSize="small" />}
              onClick={handleHelpClick}
            />
          </div>
        </FlexBetween>

        <FlexColumnStart
          width="100%"
          sx={{
            padding: 2, // Set padding
            border: `1px solid ${theme.palette.primary.main}`, // Set border
            borderRadius: theme.shape.borderRadius, // Set border radius
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            position: "relative", // Add position relative to the box
          }}
        >
          <Typography variant="h5">
            Retrieve Title Reports from Database
          </Typography>

          <Typography color="text.main" sx={{ fontSize: "12px" }}>
            Search and export for title reports you previously fetched. You can
            search by Title, ISSN, ISBN.
          </Typography>

          <Typography variant="h5" color="text.primary" sx={{ mt: 2, ml: 1 }}>
            Search By:
          </Typography>

          <Box mt={1}>
            <FlexRowStart gap="20px">
              <Button
                variant="contained"
                style={getButtonStyles(activeButton === "Title")}
                onClick={() => handleButtonClick("Title")}
              >
                Title
              </Button>
              <Button
                variant="contained"
                style={getButtonStyles(activeButton === "ISBN")}
                onClick={() => handleButtonClick("ISBN")}
              >
                ISBN
              </Button>
              <Button
                variant="contained"
                style={getButtonStyles(activeButton === "ISSN")}
                onClick={() => handleButtonClick("ISSN")}
              >
                ISSN
              </Button>
            </FlexRowStart>
          </Box>

          {/* Search Bar */}
          <Box mt={2} display="flex" alignItems="center" width="100%">
            <SearchBar
              onValueChange={handleSearch}
              placeholder={`Search for a ${activeButton?.toLowerCase()}`}
            />
            <Box ml={2}>
              <ActionButton
                label="Run Search"
                color="secondary"
                onClick={handleSearchButtonClick}
              />
              {/* Used to handle Enter key press, implemented in such a way to avoid issues with state */}
              <button
                id="hiddenButton"
                onClick={handleSearchButtonClick}
                hidden
              ></button>
            </Box>
          </Box>

          {searchResults !== null && (
            <FlexColumnStart mt="30px" gap="20px" width="100%">
              <Typography variant="h5" color="text" width="max-content">
                Search Results:{" "}
                <Strong colored="primary">{searchResults}</Strong> results found
              </Typography>

              <Typography variant="body2" color="text">
                Search completed in{" "}
                <Strong colored="primary">{searchDuration.toFixed(2)}</Strong>{" "}
                seconds.
              </Typography>

              <Button onClick={handleOpenResults}>
                Open Results Directory
              </Button>
            </FlexColumnStart>
          )}
        </FlexColumnStart>
      </PageColumn>
    </Page>
  );
};

export default SearchReportsPage;
