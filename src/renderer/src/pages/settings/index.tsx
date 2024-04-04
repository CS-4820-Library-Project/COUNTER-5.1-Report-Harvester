import React, { useState } from "react";
import SettingsTab from "./SettingsTab"; // Ensure the path to SettingsTab is correct
import ChangeReportSavingDirectories from "./ChangeReportSavingDirectories"; // Import the ChangeReportSavingDirectories component
import ChangeRequestSettings from "./ChangeRequestSettings";
import SetUpPasswordView from "./SetUpPassword";
import Page from "../../components/page/Page";
import PageColumn from "../../components/page/PageColumn";
import ReportDatabaseSettings from "./ReportDatabaseSettings";

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

  return (
    <Page>
      <PageColumn width="40%">
        <SettingsTab
          onOptionSelect={handleOptionSelect}
          selectedOption={selectedOption}
        />
      </PageColumn>

      <PageColumn padding={3} pr={6} width="60%">
        {selectedOption === "Set Up Root Password" && <SetUpPasswordView />}

        {selectedOption === "Change Report Saving Directories" && (
          <ChangeReportSavingDirectories />
        )}

        {selectedOption === "Change API Request Settings" && (
          <ChangeRequestSettings />
        )}

        {selectedOption === "Report Database Settings" && (
          <ReportDatabaseSettings />
        )}
      </PageColumn>
    </Page>
  );
};

export default SettingsPage;
