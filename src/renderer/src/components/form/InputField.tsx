import { FlexColumnStart } from "../flex";
import { ErrorMessage, Field } from "formik";
import { Box, Typography, useTheme } from "@mui/material";

type Props = {
  name: string;
  label: string;
  type: string;
  ratio: number;
};

const InputField = ({ name, label, type, ratio }: Props) => {
  const { palette } = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      pt="10px"
      minWidth="max-content"
    >
      <Typography
        width={ratio * 100 + "%"}
        flexGrow={ratio}
        component="label"
        htmlFor={name}
        fontWeight={500}
        color={palette.primary.main}
      >
        {label}
      </Typography>

      {/* Input */}
      <FlexColumnStart
        flexGrow={1 - ratio * 100 + "%"}
        width="100%"
        minWidth="50px"
      >
        <Field
          className="form-input"
          type={type}
          name={name}
          style={{
            color: palette.text.main,
            backgroundColor: palette.background.main,
          }}
        />
        <Typography color={palette.error.main} fontSize={12} pl="5px">
          <ErrorMessage name={name} />
        </Typography>
      </FlexColumnStart>
    </Box>
  );
};

export default InputField;
