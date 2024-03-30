import { useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  label: string;
  minYear?: string;
};

const YearPicker = ({ value, onChange, label, minYear }: Props) => {
  const { palette } = useTheme();

  // Convert value and minYear from string to Day.js object
  const dateValue = value ? dayjs(value, "YYYY") : null;
  const minDate = minYear ? dayjs(minYear, "YYYY") : null;

  const handleValueChange = (value: any) => {
    if (value && value.$y) {
      onChange(value.$y.toString());
    } else {
      onChange(null);
    }
  };

  return (
    <DatePicker
      views={["year"]}
      label={label}
      value={dateValue}
      onChange={handleValueChange}
      minDate={minDate}
      sx={{
        bgcolor: "pink",
        color: "pink",
        fontSize: "14px",
      }}
      slotProps={{
        textField: {
          sx: {
            width: "120px",
            "& .MuiOutlinedInput-root": {
              fontSize: "14px",
              color: palette.primary.main,
              borderRadius: "25px", // Adjust border radius as needed
            },
          },
        },
        inputAdornment: {
          sx: {
            "& .MuiIconButton-root": {
              color: palette.primary.main,
            },
          },
        },
      }}
    />
  );
};

export default YearPicker;
