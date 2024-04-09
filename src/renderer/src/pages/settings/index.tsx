import React, { useState } from "react";
import SettingsTab from "./SettingsTab"; // Ensure the path to SettingsTab is correct
import ChangeReportSavingDirectories from "./ChangeReportSavingDirectories"; // Import the ChangeReportSavingDirectories component
import ChangeRequestSettings from "./ChangeRequestSettings";
import SetUpPasswordView from "./SetUpPassword";
import Page from "../../components/page/Page";
import PageColumn from "../../components/page/PageColumn";
import RebuildSearchDatabase from "./DatabaseSettings";
import { Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ActionButton from "../../components/buttons/ActionButton";
import HelpMessages from "../../data/HelpMessages";
/**
 * This is the "SettingsPage" component.
 *
 * This component serves as the main interface for users to modify various settings within the application.
 * It dynamically displays different settings views based on user selection, including setting up a root
 * password, changing report saving directories, and modifying API request settings.
 *
 * The main elements of this component are:
 * - A tab component that lets users select which settings they want to adjust.
 * - Dynamic rendering of the selected setting component for users to interact with and modify settings.
 */

const SettingsPage: React.FC = () => {
  // State to track which settings option is currently selected. Default is "Set Up Root Password".
  const [selectedOption, setSelectedOption] = useState<string>(
    "Set Up Root Password"
  );

  // Handler function to update the selected settings option based on user interaction.
  const handleOptionSelect = (option: string): void => {
    setSelectedOption(option); // Update the selectedOption state with the new value.
  };
  const handleHelpClick = () => {
    const helpContent = HelpMessages.settingsPage.Help.url;
    if (helpContent) {
      window.open(helpContent, "_blank"); // Opens the URL in a new tab
    }
  };

  return (
    <Page>
      <PageColumn width="40%">
        <SettingsTab
          onOptionSelect={handleOptionSelect}
          selectedOption={selectedOption}
        />
      </PageColumn>

      <PageColumn padding={3} pr={6} width="60%" pt={6}>
        {selectedOption === "Set Up Root Password" && <SetUpPasswordView />}

        {selectedOption === "Change Report Saving Directories" && (
          <ChangeReportSavingDirectories />
        )}

        {selectedOption === "Change API Request Settings" && (
          <ChangeRequestSettings />
        )}

        {selectedOption === "Rebuild Search Database" && (
          <RebuildSearchDatabase />
        )}
      </PageColumn>
      {/* Help button positioned at top right corner */}
      <Box
        sx={{
          position: "absolute",
          top: 5,
          right: "4rem", // Adjusted the right position
          zIndex: 9, // Ensure it's above other elements
          padding: "1rem",
        }}
      >
        <ActionButton
          label="Help"
          color="background"
          icon={<HelpOutlineIcon fontSize="small" />}
          onClick={handleHelpClick}
        />
      </Box>
    </Page>
  );
};

export default SettingsPage;
