import { CheckCircle, Circle } from "@mui/icons-material";
import { FlexBetween } from "../flex";
import { Button, useTheme } from "@mui/material";
import TooltipBottom from "../Tooltip";

type Props = {
  label: string;
  hint?: string;
  size?: "small" | "large";
  isSelected: boolean;
  setSelected: (label: string, state: boolean) => void;
  isActive: boolean;
  setActiveTab: (label: string) => void;
};

const ToggleNav = ({
  label,
  hint,
  setSelected,
  setActiveTab,
  isSelected,
  isActive,
  size = "large",
}: Props) => {
  const { palette } = useTheme();
  const { primary, background } = palette;

  const rightSideStyle = {
    padding: size === "small" ? ("5px 10px" as const) : ("10px" as const),
    flexGrow: 1,
    height: "100%",
    borderRadius: "0",
    textTransform: "none" as const,
    color: isSelected ? primary.contrastText : background.contrastText,
    backgroundColor: isSelected
      ? isActive
        ? primary.hover
        : primary.main
      : background.main,
    "&:hover": {
      bgcolor: isSelected ? primary.hover : background.hover,
    },
  };

  const leftSideStyle = {
    borderRadius: "0",
    color: isSelected ? primary.contrastText : background.light,
    backgroundColor: isSelected
      ? isActive
        ? primary.hover
        : primary.main
      : background.main,
    padding: size === "small" ? ("5px" as const) : ("10px" as const),
    minWidth: "max-content" as const,
    height: "100%" as const,
    // textTransform: "none" as const,
    "&:hover": {
      bgcolor: isSelected ? primary.hover : background.hover,
    } as const,
  };

  const pillStyle = {
    color: isSelected ? primary.contrastText : background.contrastText,
    boxShadow: isActive ? `0px 5px 10px 0px ${primary.dark}` : "none",
    gap: "2px" as const,
    borderRadius: "25px" as const,
    overflow: "hidden" as const,
    transition: "background-color 0.3s ease-in-out" as const,
    width: "100%" as const,
    maxWidth: "120px" as const,
    minWidth: "max-content" as const,
  };

  const handleSelect = () => {
    setActiveTab(label);
    setSelected(label, true);
  };

  const handleUnSelect = () => {
    setActiveTab(isSelected ? "" : label);
    setSelected(label, isSelected ? false : true);
  };

  return hint ? (
    <TooltipBottom hint={hint}>
      <FlexBetween onClick={handleSelect} sx={pillStyle}>
        {/* Left side */}
        <Button
          sx={leftSideStyle}
          onClick={(e) => {
            e.stopPropagation();
            handleUnSelect();
          }}
        >
          {isSelected ? <CheckCircle /> : <Circle />}
        </Button>

        {/* Right Side */}
        <Button sx={rightSideStyle}>{label.replace(/_/g, " ")}</Button>
      </FlexBetween>
    </TooltipBottom>
  ) : (
    <FlexBetween onClick={handleSelect} sx={pillStyle}>
      {/* Left side */}
      <Button
        sx={leftSideStyle}
        onClick={(e) => {
          e.stopPropagation();
          handleUnSelect();
        }}
      >
        {isSelected ? <CheckCircle /> : <Circle />}
      </Button>

      {/* Right Side */}
      <Button sx={rightSideStyle}>{label.replace(/_/g, " ")}</Button>
    </FlexBetween>
  );
};

export default ToggleNav;
