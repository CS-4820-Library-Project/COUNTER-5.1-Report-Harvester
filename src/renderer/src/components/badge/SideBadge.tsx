import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

export const SideBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -10,
    top: 6,
    border: `2px solid ${theme.palette.background.light}`,
    padding: "0 4px",
  },
}));
