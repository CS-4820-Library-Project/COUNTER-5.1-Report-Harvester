import { Box } from "@mui/material";
import { styled } from "@mui/system";

export const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const FlexBetweenColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
});

export const FlexCenter = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const FlexColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
});

export const FlexRowStart = styled(Box)({
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
});

export const FlexRowEnd = styled(Box)({
  display: "flex",
  justifyContent: "end",
  alignItems: "center",
});

export const FlexColumnStart = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",
  alignItems: "start",
});

export const FlexColumnEnd = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "end",
  alignItems: "center",
});
