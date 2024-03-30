import { useState } from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { FlexBetween } from "../flex";
import { hexToRgb } from "../../utils/Color";

type Props = {
  label: string;
  color: "primary" | "secondary" | "error" | "success" | "info" | "background";
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
};

const AnotherButton = ({
  label,
  color,
  icon,
  onClick,
  isActive = false,
}: Props) => {
  const { palette } = useTheme();
  const [isHovered, setHovered] = useState(false);

  const getButtonStyles = () => {
    const rgb = palette[color].dark
      ? hexToRgb(palette[color].dark || "")
      : null;
    const shadowColor = rgb
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`
      : "rgba(0, 0, 0, 0.2)";

    return {
      backgroundColor:
        isHovered || isActive ? palette[color].hover : palette[color].main,
      color: palette.text.main,
      boxShadow: isActive ? `0px 5px 10px 3px ${shadowColor}` : "none",
      borderRadius: "25px",
      padding: "6px",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "3px 2px",
      textTransform: "capitalize", // Capitalize the first letter
      transition: "background-color 0.3s",
    } as const;
  };

  return (
    <Button
      sx={getButtonStyles()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <FlexBetween gap="5px" padding="0.3rem 0.5rem">
        {icon}
        <Typography variant="body1">{label}</Typography>
      </FlexBetween>
    </Button>
  );
};

export default AnotherButton;
