/**
 * This is the "FetchReportResults" component.
 *
 * Displays fetch results given an array of strings.
 *
 * Props:
 * - close: A function that allows closing or exiting the progress display, typically resetting or hiding the component.
 */

import { Close } from "@mui/icons-material";
import { FlexColumn, FlexRowEnd } from "../../../components/flex";
import { Box, IconButton, useTheme } from "@mui/material";
import Strong from "../../../components/text/Strong";

type Props = {
  close: () => void;
  messages: string[];
};

const FetchReportsResult = ({ close, messages }: Props) => {
  const { palette } = useTheme();

  const messageDisplay = messages.map((str, index) => {
    const words = str.split(" ");
    const firstWord = words.shift(); // Remove and store the first word
    const isFailed = str.includes("FAILED");
    const isSuccess = str.includes("SUCCESS");
    const color = isFailed ? "error" : isSuccess ? "success" : undefined;

    return (
      <Box key={index}>
        <Strong colored={color}>{firstWord}&nbsp;</Strong>
        {words.join(" ")} {/* Join the remaining words */}
      </Box>
    );
  });

  return (
    <FlexColumn
      gap="20px"
      width="30%"
      height="400px"
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

      <Box
        className="card-scroll"
        width="100%"
        padding="20px"
        pt="0"
        mt="-20px"
        gap="20px"
        overflow="auto"
        height="400px"
        maxHeight="400px"
      >
        {messageDisplay}
      </Box>
    </FlexColumn>
  );
};

export default FetchReportsResult;
