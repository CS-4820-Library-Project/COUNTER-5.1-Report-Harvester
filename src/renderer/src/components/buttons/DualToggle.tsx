import { FlexBetween } from "../flex";
import { Button, Typography, useTheme } from "@mui/material";

type Props = {
  option1: string;
  option2: string;
  value: string;
  setValue: (value: string) => void;
};

const DualToggle = ({ value, option1, option2, setValue }: Props) => {
  const { palette } = useTheme();

  return (
    <Button
      sx={{
        bgcolor: palette.background.main,
        borderRadius: "25px",
        padding: 0,
      }}
      onClick={() => setValue(value === option1 ? option2 : option1)}
    >
      <Typography
        variant='h5'
        padding='4px 20px'
        width='50%'
        borderRadius='25px'
        sx={{ cursor: "pointer" }}
        color={
          value === option2
            ? palette.text.disabled
            : palette.primary.contrastText
        }
        bgcolor={value === option2 ? "transparent" : palette.primary.main}
      >
        {option1}
      </Typography>

      <Typography
        variant='h5'
        padding='4px 20px'
        width='50%'
        borderRadius='25px'
        sx={{ cursor: "pointer" }}
        color={
          value === option2
            ? palette.primary.contrastText
            : palette.text.disabled
        }
        bgcolor={value === option2 ? palette.primary.main : "transparent"}
      >
        {option2}
      </Typography>
    </Button>
  );
};

export default DualToggle;
