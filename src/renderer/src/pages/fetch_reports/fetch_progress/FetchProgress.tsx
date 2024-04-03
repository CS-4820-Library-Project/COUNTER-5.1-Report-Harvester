import { Close } from "@mui/icons-material";
import ProgressBar from "./ProgressBar";
import { useEffect, useState } from "react";
import { FlexColumn, FlexRowEnd } from "../../../components/flex";
import { IconButton, useTheme } from "@mui/material";
import ResultsHeader from "../../../components/text/ResultsHeader";
import { FetchResults } from "../../../../../types/reports";
import { UserDirectories } from "src/types/settings";

type Props = {
  close: () => void;
  totalVendors: number;
  fetchResults?: FetchResults;
};

/**
 * This is the "FetchProgress" component.
 *
 * Designed to provide feedback to the user during the report fetching process, this component visually represents the progress of the operation and displays the results upon completion.
 * It leverages a progress bar to indicate how far along the process is and shows success or failure messages for different categories of reports based on certain checkpoints.
 *
 * Props:
 * - close: A function that allows closing or exiting the progress display, typically resetting or hiding the component.
 */

const FetchProgress = ({ close, totalVendors, fetchResults }: Props) => {
  const { palette } = useTheme();

  const [directories, setDirectories] = useState<UserDirectories>();

  const [checkpoint, setCheckpoint] = useState(0); // Indicates process through predefined steps. In reality is async
  const [progress, setProgress] = useState(0); //  Percentage of vendors completion  - %100.

  const getDirectories = async () => {
    const directories = await window.settings.getDirectories();
    setDirectories(directories);
  };

  useEffect(() => {
    window.reports.onVendorCompleted(() => {
      setProgress((prevProgress) => prevProgress + 100 / totalVendors);
    });
    console.log("Vendor Completed Listener Added");

    // Cleanup
    return window.reports.removeVendorCompletedListeners;
  }, [totalVendors]);

  // Update Checkpoints a bit randomly for now
  useEffect(() => {
    if (progress >= 1) setCheckpoint(1); // Connection Works
    if (progress >= 5) setCheckpoint(3); // Fetching Reports if working so far
    if (progress >= 50) setCheckpoint(4); // Some reports might be written
    if (progress >= 99) setCheckpoint(5); // All reports are written

    // Cleanup
    return () => setCheckpoint(0);
  }, [progress]);

  useEffect(() => {
    getDirectories();
  }, []);

  useEffect(() => {
    console.log("Fetch Results", fetchResults);
  }, [fetchResults]);

  return (
    <FlexColumn
      gap="20px"
      width="40%"
      bgcolor={palette.background.light}
      padding="5px"
      borderRadius="25px"
    >
      {/* Close button to exit the progress view */}
      <FlexRowEnd width="100%">
        <IconButton onClick={close}>
          <Close fontSize="large" />
        </IconButton>
      </FlexRowEnd>

      <FlexColumn width="100%" padding="20px" pt="0" mt="-20px" gap="20px">
        <ProgressBar checkpoint={checkpoint} progress={progress} />

        {/* Conditional rendering based on the 'checkpoint' state */}
        {checkpoint === 5 && fetchResults && (
          <FlexColumn
            width="100%"
            borderRadius="20px"
            padding="10px"
            border={`1px solid ${palette.primary.main}`}
          >
            {/* Conditional content indicating the results of the fetch operation */}

            {fetchResults.main.succeeded > 0 && (
              <ResultsHeader
                message={
                  fetchResults.main.succeeded +
                  " standard reports were saved in **Main Reports** directory"
                }
                directory={directories?.main || "/"}
              />
            )}

            {fetchResults.custom.succeeded > 0 && (
              <ResultsHeader
                message={
                  fetchResults.custom.succeeded +
                  " custom reports were saved in **Custom Reports** directory"
                }
                directory={directories?.custom || "/"}
              />
            )}

            <ResultsHeader
              message={
                fetchResults.failed +
                " reports failed. See log file for more details"
              }
              file={fetchResults.log || "/"}
              color="error"
            />
          </FlexColumn>
        )}
      </FlexColumn>
    </FlexColumn>
  );
};

export default FetchProgress;
