import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { styled } from "@mui/system";
import { FlexCenter, FlexColumnStart } from "../../components/flex";
import { Save } from "@mui/icons-material";
import HelpMessages from "../../data/HelpMessages";
import { useNotification } from "../../components/NotificationBadge";
import { UserDirectories } from "src/types/settings";

/**
 * This is the "ChangeReportSavingDirectories" component.
 *
 * This component allows users to change the directories where their reports are saved.
 *
 * The main elements of this component are:
 * - A form that the users interact with to change the directory
 * - A submit button to confirm their changes
 */
const ChangeReportSavingDirectories: React.FC = () => {
  const { palette, spacing } = useTheme();
  const setNotification = useNotification();

  type Directories = "main" | "custom" | "search" | "vendors";

  // State hooks to manage the directory paths for different report types
  const [mainDirectory, setMainDirectory] = useState<string>("");
  const [customDirectory, setCustomDirectory] = useState<string>("");
  const [searchDirectory, setSearchDirectory] = useState<string>("");
  const [vendorsDirectory, setVendorsDirectory] = useState<string>("");

  const [invalidPaths, setInvalidPaths] = useState<Directories[]>([]);

  /**
   * Set the dictory state based on the directory type
   * @param dir - the directory type to set "main" | "custom" | "search" | "vendors"
   * @param path - the path to set
   */
  const setDirectory = (dir: Directories, path: string) => {
    switch (dir) {
      case "main":
        return setMainDirectory(path);
      case "custom":
        return setCustomDirectory(path);
      case "search":
        return setSearchDirectory(path);
      case "vendors":
        return setVendorsDirectory(path);
      default:
        break;
    }
  };

  /**
   * Implementation of directory change logic, including interaction with
   * the local filesystem via an API.
   * @prop dir - The directory type to change "main" | "custom" | "search" | "vendors"
   */
  const handleChangeDirectoryClick = async (dir: Directories) => {
    const path = await window.settings.saveDirectory(dir);
    path && setDirectory(dir, path);
  };

  /**
   *
   * @param dir - The directory type to validate. "main" | "custom" | "search" | "vendors"
   * @returns helperMesssage - "Invalid" or "" if the path is valid
   */
  const getPathMessage = (dir: Directories) =>
    invalidPaths.includes(dir)
      ? "This is an invalid path. Check spelling and / or use an absolute path"
      : "";

  /**
   * Handle change directory input and set the value to the corresponding state
   * @param dir
   * @returns
   */
  const handleChangeDirectoryInput =
    (dir: Directories) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setDirectory(dir, event.target.value);

  const saveChanges = async () => {
    const invalid = await window.settings.saveDirectories({
      main: mainDirectory,
      custom: customDirectory,
      search: searchDirectory,
      vendors: vendorsDirectory,
    });

    setInvalidPaths(invalid as Directories[]);
    invalid.length === 0 &&
      setNotification({
        type: "success",
        message: "Directories saved successfully",
      });
  };

  const getDirectories = async () => {
    const directories = await window.settings.getDirectories();

    for (const dir in directories) {
      setDirectory(
        dir as Directories,
        directories[dir as keyof UserDirectories]
      );
    }
  };

  useEffect(() => {
    getDirectories();
  }, []);

  /** Render the form UI with inputs for each directory type
   *  Event handlers manage the state based on user input and interactions
   *  Directory selection is facilitated by an IconButton with a FolderOpenIcon,
   *  invoking the directory change logic */
  return (
    <FlexColumnStart
      border={`1px solid ${palette.primary.main}`}
      borderRadius="25px"
      padding={spacing(5)}
      height="100%"
      overflow="auto"
    >
      <StyledTitle variant="h2">
        Change Your Report Saving Directories
      </StyledTitle>

      <StyledDescription>
        Make it easy to find your reports by changing the saving directories for
        your reports.
      </StyledDescription>

      <ScrollableContainer>
        <DirectorySection>
          <Typography
            variant="h3"
            sx={{ mb: 1, color: "primary.main", fontWeight: 500 }}
          >
            Main Reports Directory
          </Typography>

          <DirectoryBox>
            <StyledTextField
              fullWidth
              variant="standard"
              value={mainDirectory}
              onChange={handleChangeDirectoryInput("main")}
              error={invalidPaths.includes("main")}
              helperText={getPathMessage("main")}
              placeholder="/UserName/Desktop/main_reports"
            />

            <IconButton
              color="primary"
              component="span"
              onClick={() => handleChangeDirectoryClick("main")}
            >
              <FolderOpenIcon />
            </IconButton>
          </DirectoryBox>

          <Typography sx={{ fontSize: "0.875rem" }}>
            {HelpMessages.settings.directories.main}
          </Typography>
        </DirectorySection>

        <DirectorySection>
          <Typography
            variant="h3"
            sx={{ mb: 1, color: "primary.main", fontWeight: 500 }}
          >
            Custom Reports Directory
          </Typography>

          <DirectoryBox>
            <StyledTextField
              fullWidth
              variant="standard"
              value={customDirectory}
              onChange={handleChangeDirectoryInput("custom")}
              error={invalidPaths.includes("custom")}
              helperText={getPathMessage("custom")}
              placeholder="/UserName/Desktop/custom_reports"
            />

            <IconButton
              color="primary"
              onClick={() => handleChangeDirectoryClick("custom")}
            >
              <FolderOpenIcon />
            </IconButton>
          </DirectoryBox>

          <Typography sx={{ fontSize: "0.875rem" }}>
            {HelpMessages.settings.directories.custom}
          </Typography>
        </DirectorySection>

        {/* Search Directory */}
        <DirectorySection>
          <Typography
            variant="h3"
            sx={{ mb: 1, color: "primary.main", fontWeight: 500 }}
          >
            Search Results Directory
          </Typography>
          <DirectoryBox>
            <StyledTextField
              fullWidth
              variant="standard"
              value={searchDirectory}
              onChange={handleChangeDirectoryInput("search")}
              error={invalidPaths.includes("search")}
              helperText={getPathMessage("search")}
              placeholder="/UserName/Desktop/search_results"
            />
            <IconButton
              color="primary"
              onClick={() => handleChangeDirectoryClick("search")}
            >
              <FolderOpenIcon />
            </IconButton>
          </DirectoryBox>
          <Typography sx={{ fontSize: "0.875rem" }}>
            {HelpMessages.settings.directories.search}
          </Typography>
        </DirectorySection>

        {/* Vendors Files Directory */}
        <DirectorySection>
          <Typography
            variant="h3"
            sx={{ mb: 1, color: "primary.main", fontWeight: 500 }}
          >
            Vendors File Directory
          </Typography>
          <DirectoryBox>
            <StyledTextField
              fullWidth
              variant="standard"
              value={vendorsDirectory}
              onChange={handleChangeDirectoryInput("vendors")}
              placeholder="/UserName/Desktop/vendors.json"
              error={invalidPaths.includes("vendors")}
              helperText={getPathMessage("vendors")}
            />
            <IconButton
              color="primary"
              onClick={() => handleChangeDirectoryClick("vendors")}
            >
              <FolderOpenIcon />
            </IconButton>
          </DirectoryBox>
          <Typography sx={{ fontSize: "0.875rem" }}>
            {HelpMessages.settings.directories.vendorFile}
          </Typography>
        </DirectorySection>

        <FlexCenter width="100%">
          <SaveButton onClick={saveChanges}>
            Save Changes
            <Save />
          </SaveButton>
        </FlexCenter>
        {/*  */}
      </ScrollableContainer>
      {/* </StyledPaper> */}
    </FlexColumnStart>
  );
};

export default ChangeReportSavingDirectories;

// Styled components

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  fontSize: "24px",
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const DirectorySection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: "100%",
}));

const DirectoryBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: "50px",
  padding: "1rem 0rem",
  marginBottom: theme.spacing(1),
  width: "100%",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  borderRadius: "15px",
  "& .MuiInputBase-input": {
    fontSize: "0.875rem",
    color: theme.palette.background.contrastText,
  },
  "& .MuiInputBase-root": {
    disableUnderline: true,
  },
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  overflowY: "auto",
  maxHeight: "calc(100% - 160px)", // Adjust based on the fixed content size and container padding
  paddingRight: "2rem",
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.background.main,
    borderRadius: "10px",
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "50px",
  width: "30%",
  minWidth: "max-content",
  padding: "10px 20px",
  color: theme.palette.secondary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.secondary.hover,
  },
  marginTop: theme.spacing(2),
  alignSelf: "center",
}));
