/**
 * This is the "FetchProgress" component.
 *
 * Designed to provide feedback to the user during the report fetching process, this component visually represents the progress of the operation and displays the results upon completion.
 * It leverages a progress bar to indicate how far along the process is and shows success or failure messages for different categories of reports based on certain checkpoints.
 *
 * Props:
 * - close: A function that allows closing or exiting the progress display, typically resetting or hiding the component.
 */

import { Close } from "@mui/icons-material";
import ProgressBar from "./ProgressBar";
import { useState } from "react";
import { FlexColumn, FlexRowEnd } from "../../../components/flex";
import { CircularProgress, IconButton, useTheme } from "@mui/material";
import ResultsHeader from "../../../components/text/ResultsHeader";

type Props = {
  close: () => void;
  text: string;
};

const FetchProgress = ({ close, text }: Props) => {
  const { palette } = useTheme();

  const [checkpoint, setCheckpoint] = useState(4); // Example checkpoint, indicating progress through predefined steps.
  const [progress, setProgress] = useState(5); // Example progress value, perhaps representing percentage completion.

  return (
    <FlexColumn
      gap="20px"
      width="30%"
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
        <div>
          <CircularProgress />
        </div>
        <div>{text}</div>
        {/* Conditional rendering based on the 'checkpoint' state */}
        {checkpoint > 3 && false && (
          <FlexColumn
            width="100%"
            borderRadius="20px"
            padding="10px"
            border={`1px solid ${palette.primary.main}`}
          >
            {/* Conditional content indicating the results of the fetch operation */}

            <ResultsHeader
              message="standard reports were saved in **Main Reports** directory"
              directory="/"
            />

            <ResultsHeader
              message="custom reports were saved in **Custom Reports** directory"
              directory="/"
            />

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
