import { FlexBetween, FlexColumnStart } from "../flex";
import { ErrorMessage, useField } from "formik";
import { Box, Typography, useTheme } from "@mui/material";

type Props = {
  name: string;
  label: string;
};

const ToggleInput = ({ name, label }: Props) => {
  const { palette } = useTheme();
  const [, { value }, { setValue }] = useField(name);

  return (
    <Box display='flex' justifyContent='space-between' width='100%' pt='10px'>
      <Typography
        component='label'
        htmlFor={name}
        fontWeight={500}
        color={palette.primary.main}
      >
        {label}
      </Typography>

      {/* Toggle Field */}
      <FlexColumnStart>
        <FlexBetween
          bgcolor={palette.background.main}
          width='150px'
          borderRadius='25px'
          onClick={() => setValue(!value)}
        >
          <Typography
            component='button'
            type='button'
            variant='h5'
            padding='4px 10px'
            width='50%'
            borderRadius='25px'
            color={value ? palette.text.disabled : palette.primary.contrastText}
            bgcolor={value ? "transparent" : palette.primary.dark}
          >
            No
          </Typography>

          <Typography
            component='button'
            type='button'
            variant='h5'
            padding='4px 10px'
            width='50%'
            borderRadius='25px'
            color={value ? palette.primary.contrastText : palette.text.disabled}
            bgcolor={value ? palette.primary.main : "transparent"}
          >
            Yes
          </Typography>
        </FlexBetween>

        <Typography color={palette.error.main} fontSize={12} pl='5px'>
          <ErrorMessage name={name} />
        </Typography>
      </FlexColumnStart>
    </Box>
  );
};

export default ToggleInput;
