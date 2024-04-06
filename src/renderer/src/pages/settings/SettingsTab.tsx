/**
 * This is the "SettingsTab" component.
 *
 * This component renders a navigational tab interface for selecting different settings categories like Security, Reports, and Advanced Settings.
 * Each category expands into specific settings options that the user can choose from.
 * The main elements of this component are:
 * - A title displaying "Settings" at the top.
 * - Dynamically generated sections for each category of settings, based on the options array.
 * - Buttons for each setting within the categories, which highlight when active and trigger a change in the parent component's state to display the relevant settings view.
 */
import React from "react";
import { Button, styled, Theme, Typography, useTheme } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { FlexColumnStart } from "../../components/flex";

// Interface to describe the structure of each option in the settings tab.
interface Option {
  title: string; // The category title
  settings: string[]; // An array of setting names within the category.
}

// Predefined options for the settings tab
const options: Option[] = [
  { title: "Security", settings: ["Set Up Root Password"] },
  { title: "Reports", settings: ["Change Report Saving Directories"] },

  { title: "Advanced Settings", settings: ["Change API Request Settings"] },
  { title: "Database Settings", settings: ["Report Database Settings"]},

];

// Styled component for the main title of the settings page.
const TitlePage = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontWeight: 500,
  color: theme.palette.primary.main,
  fontSize: "30px",
  marginBottom: theme.spacing(3),
}));

// Styled component for section titles within the settings tab.
const TitleSection = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
  fontSize: "20px",
  margin: theme.spacing(2, 0),
}));

// Styled button component for each setting option. The 'isActive' prop controls the background color.
const TabButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>(({ isActive }) => {
  const theme = useTheme();
  const { palette } = theme;

  return {
    color: isActive ? palette.primary.contrastText : palette.text.light,
    backgroundColor: isActive ? palette.primary.main : palette.success.dark,
    "&:hover": {
      backgroundColor: palette.primary.main,
    },
    borderRadius: "25px",
    width: "100%",
    textTransform: "none",
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1),
  };
});

// Styled component for the setting option text.
const TextOption = styled(Typography)(({ theme }: { theme: Theme }) => ({
  color: "inherit",
  fontSize: "18px",
}));

const ArrowIcon = styled(KeyboardArrowRightIcon)(() => ({
  color: "inherit",
}));

// Props structure for the SettingsTab component.
interface SettingsTabProps {
  onOptionSelect: (option: string) => void; // Callback for when an option is selected.
  selectedOption: string; // The currently selected option.
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  onOptionSelect,
  selectedOption,
}) => {
  return (
    <FlexColumnStart padding="20px" width="100%" height="100%">
      {/* <SettingsBox> */}
      <TitlePage>Settings</TitlePage>

      {options.map((section) => (
        <React.Fragment key={section.title}>
          <TitleSection>{section.title}</TitleSection>

          {section.settings.map((setting) => (
            <TabButton
              key={setting}
              onClick={() => onOptionSelect(setting)}
              isActive={selectedOption === setting}
            >
              <TextOption>{setting}</TextOption>
              <ArrowIcon />
            </TabButton>
          ))}
        </React.Fragment>
      ))}
      {/* </SettingsBox> */}
    </FlexColumnStart>
  );
};

export default SettingsTab;
