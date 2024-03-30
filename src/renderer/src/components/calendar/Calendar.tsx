import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AnotherButton from "../buttons/AnotherButton";
import { FlexBetween, FlexCenter } from "../flex";
import { CalendarYTD } from "../icons/YearToDateOutlined";

// JS Starts Months from 0
const months = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};
// type Months = keyof typeof months;

type Props = {
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  fromDate: Date;
  toDate: Date;
};

const Calendar = ({ setFromDate, setToDate, toDate, fromDate }: Props) => {
  const { palette } = useTheme();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [mode, setMode] = useState<"year" | "month">("month");
  const [selectionMode, setSelectionMode] = useState<"from" | "to">("from");

  // const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth - 1);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const [yearRange, setYearRange] = useState<number[]>([]);

  // Set the initial year range
  useEffect(() => {
    const recentYears = Array.from(
      { length: 12 },
      (_, index) => currentYear - 11 + index
    );

    setYearRange(recentYears);
  }, []);

  const handleToDateButtonClick = () => setSelectionMode("to");

  const handleFromDateButtonClick = () => setSelectionMode("from");

  const handleYearSelection = (year: number) => {
    setSelectedYear(year);
    setMode("month");
  };

  const handleYearButtonClick = () =>
    setMode(mode === "month" ? "year" : "month");

  const handleToday = () => {
    const currentDate = new Date();
    setFromDate(new Date(currentYear, currentMonth - 1));
    setToDate(new Date(currentYear, currentMonth - 1));
    setSelectedYear(currentDate.getFullYear());
    setMode("month");
  };

  const handleYearToDate = (year: number) => {
    setFromDate(new Date(year, 0));
    setToDate(new Date(year, currentYear === year ? currentMonth - 1 : 11));
    setMode("month");
  };

  const handleYearChange = (increment: 1 | -1) => {
    if (mode === "month") {
      if (selectedYear + increment <= currentYear)
        setSelectedYear((prevYear) => prevYear + increment);
    }

    // Change the year range
    else {
      const newYearRange = Array.from(
        { length: 12 },
        (_, index) => yearRange[0] + 12 * increment + index
      );
      setYearRange(newYearRange);
    }
  };

  const handleMonthRangeSelection = (month: number) => {
    // Swap From and To Date if new "From Date" is out of range
    if (selectionMode === "from") {
      toDate.getMonth() < month && toDate.getFullYear() === selectedYear
        ? (setFromDate(toDate), setToDate(new Date(selectedYear, month)))
        : (setFromDate(new Date(selectedYear, month)), setSelectionMode("to"));
    }

    // Swap From and To Date if new "To Date" is out of range
    if (selectionMode === "to") {
      fromDate.getMonth() > month && fromDate.getFullYear() === selectedYear
        ? (setFromDate(new Date(selectedYear, month)), setToDate(fromDate))
        : (setToDate(new Date(selectedYear, month)), setSelectionMode("from"));
    }
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" marginBottom={2}>
        {/* "From Button */}
        <FlexCenter gap="10px">
          <Typography variant="body1"> From:</Typography>

          <AnotherButton
            label={
              fromDate
                ? fromDate.toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })
                : "From"
            }
            color="background"
            isActive={selectionMode === "from"}
            icon={<CalendarMonthIcon />}
            onClick={handleFromDateButtonClick}
          />
        </FlexCenter>

        <FlexCenter gap="10px">
          <Typography variant="body1"> To:</Typography>
          <AnotherButton
            label={
              toDate
                ? toDate.toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })
                : "To"
            }
            color="background"
            isActive={selectionMode === "to"}
            icon={<CalendarMonthIcon />}
            onClick={handleToDateButtonClick}
          />
        </FlexCenter>
      </Grid>

      {/* Calendar */}
      <Box
        border={`1px solid ` + palette.background.dark}
        borderRadius="25px"
        width="350px"
        color={palette.text.light}
        sx={{ cursor: "pointer" }}
        overflow="hidden"
      >
        {/* Header tools */}
        <FlexBetween bgcolor={palette.success.dark} padding="0 20px">
          <IconButton
            color="inherit"
            onClick={() => handleYearToDate(selectedYear)}
          >
            <CalendarYTD fontSize="large" style={{ fontSize: "1.7rem" }} />
          </IconButton>

          {/* Year Navigation */}
          <FlexBetween>
            <IconButton onClick={() => handleYearChange(-1)} color="inherit">
              <KeyboardArrowLeftIcon fontSize="large" />
            </IconButton>

            <Button
              sx={{ color: "inherit", fontSize: "1rem", fontWeight: "bold" }}
              onClick={handleYearButtonClick}
            >
              {selectedYear}
            </Button>

            <IconButton
              onClick={() => handleYearChange(1)}
              color="inherit"
              disabled={
                mode === "month"
                  ? selectedYear === currentYear
                  : yearRange[11] >= currentYear
              }
            >
              <KeyboardArrowRightIcon fontSize="large" />
            </IconButton>
          </FlexBetween>

          <IconButton color="inherit" onClick={handleToday}>
            <TodayIcon style={{ fontSize: "1.7rem" }} />
          </IconButton>
        </FlexBetween>

        {/* Display recent years or months based on the mode */}
        <Grid container rowGap="8px" padding="10px">
          {mode === "month"
            ? Object.entries(months).map(([name, month]) => {
                const thisMonth = new Date(selectedYear, month);
                return (
                  <Grid item xs={4} key={month}>
                    <CalendarButton
                      onClick={() => handleMonthRangeSelection(month)}
                      isSelected={
                        thisMonth.getTime() === fromDate.getTime() ||
                        thisMonth.getTime() === toDate.getTime()
                      }
                      inRange={
                        thisMonth.getTime() > fromDate.getTime() &&
                        thisMonth.getTime() < toDate.getTime()
                      }
                      disabled={
                        month >= currentMonth && selectedYear === currentYear
                      }
                      text={name}
                    />
                  </Grid>
                );
              })
            : yearRange.map((year) => {
                return (
                  <Grid item xs={4} key={year}>
                    <CalendarButton
                      onClick={() => handleYearSelection(year)}
                      text={year.toString()}
                      disabled={year > currentYear}
                      isSelected={
                        fromDate.getFullYear() === year ||
                        toDate.getFullYear() === year
                      }
                      inRange={
                        year > fromDate.getFullYear() &&
                        year < toDate.getFullYear()
                      }
                    />
                  </Grid>
                );
              })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Calendar;

type ButtonProps = {
  onClick: () => void;
  text: string;
  isSelected: boolean;
  disabled?: boolean;
  inRange?: boolean;
};

const CalendarButton = ({
  onClick,
  text,
  isSelected,
  inRange,
  disabled,
}: ButtonProps) => {
  const { palette } = useTheme();
  const { primary, background } = palette;
  return (
    <Button
      fullWidth
      onClick={onClick}
      sx={{
        borderRadius: "0",
        backgroundColor: isSelected
          ? primary.main
          : inRange
            ? background.main
            : "transparent",
        color: isSelected ? primary.contrastText : palette.text.main,
        textTransform: "capitalize",
        ":hover": {
          backgroundColor: isSelected ? primary.hover : background.hover,
          color: isSelected ? primary.contrastText : background.contrastText,
        },
      }}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};
