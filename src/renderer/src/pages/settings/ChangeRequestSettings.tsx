/**
 * This is the "ChangeRequestSettings" component.
 *
 * This component allows users to modify and save settings related to handling requests within an application.
 * It features a user interface for adjusting settings like report request intervals, request timeout durations, and concurrency limits for reports and vendors.
 *
 * The main elements of this component are:
 * - SettingsBox: A styled container for the entire settings form.
 * - Title: A heading that describes the purpose of the settings.
 * - Description: Provides information and warnings about changing settings.
 * - FieldLabel: Labels for each setting that can be adjusted.
 * - Counter: Reusable component for incrementing, decrementing, and directly inputting numeric values.
 * - SaveButton: A button for submitting the changed settings.
 *
 * The component leverages Material UI for styling and layout, demonstrating the use of custom hooks for state management, useCallback for memoizing handlers, and styled components for custom styling.
 */
import React, { useState, ChangeEvent, useCallback, useEffect } from "react";
import { Typography, Box, Button, IconButton, Theme } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import SaveIcon from "@mui/icons-material/Save";

// Defining styled components for styling various parts of our component. These are customized Material-UI components that are styled using the theme provided by MUI for consistency across the app.
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

const Title = styled(Typography)(({ theme }: { theme: Theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  fontSize: "24px",
}));

const Description = styled(Typography)(({ theme }: { theme: Theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 300,
  color: theme.palette.text.secondary,
  fontSize: "15px",
  marginBottom: "20px",
}));

const Warning = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.error.main,
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontWeight: 500,
  color: theme.palette.primary.main,
  fontSize: "18px",
  marginBottom: "10px",
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.primary.main,
  borderRadius: "10px",
  color: theme.palette.text.main,
  width: "40px",
  height: "40px",
  cursor: "pointer",
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

const Spacer = styled(Box)({
  flexGrow: 1,
});

// Custom hook for managing the state of a counter. Includes functionality to increase, decrease, and directly update the counter value.
const useCounter = (initialValue: number) => {
  const [value, setValue] = useState(initialValue);

  // useCallback is used to memoize callback functions. This prevents unnecessary re-renders of components
  // that depend on these functions, as the same function object is returned on subsequent renders unless dependencies change
  // Memoizing the increase, decrease, and input change handlers to prevent unnecessary re-renders.
  const handleIncrease = useCallback(() => {
    setValue((prevValue) => prevValue + 1);
  }, []);

  const handleDecrease = useCallback(() => {
    setValue((prevValue) => Math.max(prevValue - 1, 0));
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(parseInt(e.target.value, 10), 0);
    setValue(newValue);
  }, []);

  return { value, handleIncrease, handleDecrease, handleInputChange };
};

interface CounterProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Counter component illustrates how to handle state and events in a function component with props.
// The component demonstrates a common pattern for inputs that need to validate or process their data before updating state.
const Counter: React.FC<CounterProps> = ({
  value,
  onDecrease,
  onIncrease,
  onInputChange,
}) => {
  const theme = useTheme();

  const inputStyle = {
    width: "100px",
    textAlign: "center",
    margin: "0 10px",
    color: theme.palette.text.main,
    backgroundColor: theme.palette.background.main,
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
      <ButtonWrapper onClick={onDecrease}>
        <RemoveOutlinedIcon />
      </ButtonWrapper>
      <input
        type="number"
        value={value}
        onChange={onInputChange}
        style={inputStyle}
        min="0"
      />
      <ButtonWrapper onClick={onIncrease}>
        <AddOutlinedIcon />
      </ButtonWrapper>
    </Box>
  );
};

// Main component where the settings form is constructed. It makes use of the custom `useCounter` hook and
// demonstrates handling form state and events in a complex component.
const ChangeRequestSettings: React.FC = () => {
  const [reportRequestInterval, setReportRequestInterval] = useState(0);
  const [requestTimeout, setRequestTimeout] = useState(0);
  const [concurrentReports, setConcurrentReports] = useState(0);
  const [concurrentVendors, setConcurrentVendors] = useState(0);

  useEffect(() => {
    window.settings.readSettings().then((settings) => {
      setReportRequestInterval(settings.requestInterval);
      setRequestTimeout(settings.requestTimeout);
      setConcurrentReports(settings.concurrentReports);
      setConcurrentVendors(settings.concurrentVendors);
    });
  }, []);

  const saveChanges = async () => {
    const isSaved = await window.settings.saveSettings({
      requestInterval: reportRequestInterval,
      requestTimeout: requestTimeout,
      concurrentReports: concurrentReports,
      concurrentVendors: concurrentVendors,
    });

    if (isSaved) {
      // console.log("Settings saved successfully");
    } else {
      // console.error("Error saving the settings");
    }
  };

  return (
    <SettingsBox>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title>Change your Request Settings</Title>
        <IconButton aria-label="help" sx={{ color: "text.primary" }}>
          <HelpOutlineIcon />
        </IconButton>
      </Box>
      <Description>
        Improve the performance of your app and make it more reliable by
        changing the request settings.
        <br />
        <br />
        <Warning>Warning:</Warning> Changing these settings can severely affect
        the performance of the app.
      </Description>
      <FieldLabel>Request Interval (seconds)</FieldLabel>
      <Counter
        value={reportRequestInterval}
        onDecrease={() => setReportRequestInterval(reportRequestInterval - 1)}
        onIncrease={() => setReportRequestInterval(reportRequestInterval + 1)}
      />
      <FieldLabel>Request Timeout (seconds)</FieldLabel>
      <Counter
        value={requestTimeout}
        onDecrease={() => setRequestTimeout(requestTimeout - 1)}
        onIncrease={() => setRequestTimeout(requestTimeout + 1)}
      />
      {/*
      <FieldLabel>Concurrent Reports</FieldLabel>
      <Counter
        value={concurrentReports}
        onDecrease={() => setConcurrentReports(concurrentReports - 1)}
        onIncrease={() => setConcurrentReports(concurrentReports + 1)}
      />
      <FieldLabel>Concurrent Vendors</FieldLabel>
      <Counter
        value={concurrentVendors}
        onDecrease={() => setConcurrentVendors(concurrentVendors - 1)}
        onIncrease={() => setConcurrentVendors(concurrentVendors + 1)}
      />
      <Spacer />
      */}
      <SaveButton onClick={saveChanges}>
        Save Changes
        <SaveIcon />
      </SaveButton>
    </SettingsBox>
  );
};

export default ChangeRequestSettings;
