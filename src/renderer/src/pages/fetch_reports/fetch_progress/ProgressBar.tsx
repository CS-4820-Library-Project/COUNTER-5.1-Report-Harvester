import { Box, Typography, useTheme } from "@mui/material";
import { FlexCenter, FlexColumn } from "../../../components/flex";

type Props = {
  checkpoint: number; // The current checkpoint the process has reached.
  progress: number; // The current progress percentage of the process.
};

/**
 * ProgressBar component displays a progress bar with checkpoints.
 * It takes in the following props:
 * @prop {checkpoint}: The current checkpoint number 0 - n.
 * @prop {progress}: The progress percentage 1-100.
 */

const ProgressBar = ({ checkpoint, progress }: Props) => {
  const { palette } = useTheme();

  return (
    <FlexColumn width="100%" gap="15px">
      {/* Sequentially render checkpoints, indicating the task's progress through its stages. */}
      <Box width="100%" display="flex" alignContent="start">
        <CheckPoint tag={1} status={checkpoint} label="Connecting Providers" />
        <CheckPoint tag={2} status={checkpoint} label="Processing Data" />
        <CheckPoint tag={3} status={checkpoint} label="Writing Files" />
        <CheckPoint tag={4} status={checkpoint} label="Storing Reports" />
      </Box>

      {/* The progress bar itself, filled to indicate the percentage of the task completed. */}
      <Box borderRadius="50px" width="96%" bgcolor={palette.background.main}>
        <Box
          width={progress + "%"}
          borderRadius="50px"
          bgcolor={palette.primary.dark}
          //   boxShadow={`0px 0px 3px 0px ${palette.primary.light}`}
          height="10px"
        ></Box>
      </Box>
    </FlexColumn>
  );
};

export default ProgressBar;

type CheckPointProps = {
  tag: number; // Numeric label for the checkpoint, typically indicating its order.
  status: number; // The current status of the process, used to determine the checkpoint's visual state.
  label: string; // Text label describing the checkpoint.
};

/**
 * The CheckPoint component represents an individual stage or step in the process.
 * It changes appearance based on whether the process has reached this stage, providing immediate visual feedback.
 *
 * @prop tag: A numeric identifier for the checkpoint.
 * @prop status: The overall process status, used to visually differentiate completed from pending checkpoints.
 * @prop label: A descriptive label for the checkpoint, clarifying its role in the process.
 */
const CheckPoint = ({ tag, status, label }: CheckPointProps) => {
  const { primary, background } = useTheme().palette;
  // Determine styling based on whether the checkpoint is completed.
  const color = status > tag ? primary.contrastText : background.contrastText;
  const bgcolor = status > tag ? primary.dark : background.light;

  return (
    <FlexColumn width="100%" gap="10px" height="max-content">
      {/* Visually distinct circle indicating the checkpoint number, styled based on its completion status. */}
      <FlexCenter
        borderRadius="100px"
        width="50px"
        height="50px"
        bgcolor={bgcolor}
        color={color}
        border={`1px solid ${primary.dark}`}
        fontSize="1.5rem"
      >
        {tag} {/* Display the checkpoint number. */}
      </FlexCenter>
      {/* Label describing the checkpoint. */}
      <Typography textAlign="center">{label}</Typography>
    </FlexColumn>
  );
};
