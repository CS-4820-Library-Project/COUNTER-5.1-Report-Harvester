/**
 * This is the "ReportDatabaseSettings" component.
 *
 * This component allows users to manage their report database settings.
 *
 * The main elements of this component are:
 * - Sections to rebuild the search database in case it becomes corrupted and to export the report database for backup or migration.
 * - Custom styled buttons to initiate each action.
 */
import React from 'react';
import { Box, Button, Divider, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import ArrowUpwardOutlined from "@mui/icons-material/ArrowUpwardOutlined"; 

const handleRebuildButtonClicked = () => {};
const handleExportButtonClicked = () => {};

const ReportDatabaseSettings: React.FC = () => {
  const theme = useTheme();

  // Styled components adjustments
  const SettingsBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(5),
    width: "100%",
    borderRadius: "25px",
    border: `1px solid ${theme.palette.primary.main}`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  }));

  const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    fontSize: "24px",
  }));

  const Description = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    color: theme.palette.text.secondary,
  }));

  // Updated CustomButton style
  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "50px",
    color: theme.palette.secondary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.secondary.hover,
    },
    width: "10%", 
    minWidth: "max-content",
    minHeight: "50px",
    height: "50px",
    alignSelf: "center",
    margin: theme.spacing(2, 0),
  }));

  // DirectoryBox to encapsulate the button, similar to the DirectoryBox style
  const DirectoryBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50px",
    padding: "0.5rem 1rem",
    backgroundColor: theme.palette.background.main,
    marginBottom: theme.spacing(1),
    width: "auto", 
    alignSelf: "center",
  }));

  return (
    <SettingsBox>
      <Title>Rebuild Search Database</Title>
      <Description>
        Rebuild the search database in case it becomes corrupted.
      </Description>
      <DirectoryBox>
        <CustomButton
          startIcon={<RefreshOutlinedIcon />}
          onClick={handleRebuildButtonClicked}
          variant="contained"
          color="secondary"
        >
          Rebuild
        </CustomButton>
      </DirectoryBox>

      {/* Divider for visual separation */}
      <Divider style={{ margin: theme.spacing(3, 0) }} />

      {/* Export Report Database section */}
      <Title>Export Report Database</Title>
      <Description>
        Export the report database to back up or migrate your data.
      </Description>
      <DirectoryBox>
        <CustomButton
          startIcon={<ArrowUpwardOutlined />}
          onClick={handleExportButtonClicked}
          variant="contained"
          color="secondary"
        >
          Export
        </CustomButton>
      </DirectoryBox>
    </SettingsBox>
  );
};

export default ReportDatabaseSettings;
