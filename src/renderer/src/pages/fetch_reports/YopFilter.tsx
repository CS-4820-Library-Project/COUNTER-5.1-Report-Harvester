import { LocalizationProvider } from "@mui/x-date-pickers";
import Toggle from "../../components/buttons/Toggle";
import { FlexRowStart } from "../../components/flex";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import YearPicker from "../../components/calendar/YearPicker";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

const YopFilter = ({ value, onValueChange }: Props) => {
  const [startYear, setStartYear] = useState<string | null>(null);
  const [endYear, setEndYear] = useState<string | null>(null);

  const handleYearChange = () => {
    if (startYear && endYear) onValueChange(`${startYear}-${endYear}`);
    if (!startYear && !endYear) onValueChange("All");
    if (startYear && !endYear) onValueChange(`${startYear}`);
  };

  const setAllYears = () => {
    onValueChange("All");
    setStartYear(null);
    setEndYear(null);
  };

  useEffect(handleYearChange, [startYear, endYear]);

  return (
    <FlexRowStart gap="20px">
      <Toggle
        label="All Years"
        hint="Show all available years"
        isSelected={value === "All"}
        onClick={setAllYears}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <YearPicker value={startYear} onChange={setStartYear} label={"From:"} />
        {startYear && (
          <YearPicker
            value={endYear}
            onChange={setEndYear}
            label={"To:"}
            minYear={startYear}
          />
        )}
      </LocalizationProvider>
    </FlexRowStart>
  );
};

export default YopFilter;
