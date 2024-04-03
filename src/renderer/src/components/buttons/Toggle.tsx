import { Button, styled } from "@mui/material";
import TooltipBottom from "../Tooltip";

interface ButtonStyledProps {
  isSelected: boolean;
}

const ButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "size",
})<ButtonStyledProps>(({ theme, isSelected, size }) => {
  const { palette } = theme;
  const { primary, background } = palette;

  const hoverColor = isSelected ? primary.hover : background.hover;
  const backgroundColor = isSelected ? primary.main : background.main;
  const color = isSelected ? primary.contrastText : background.contrastText;

  return {
    borderRadius: "25px",
    padding: size === "small" ? "5px 20px" : "10px 50px",
    textTransform: "none",
    transition: "background-color 0.3s",
    color,
    backgroundColor,
    "&:hover": {
      backgroundColor: hoverColor,
    },
  };
});

type Props = {
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  hint: string;
  size?: "small" | "large";
};

const Toggle = ({
  isSelected,
  disabled,
  onClick,
  label,
  hint,
  size = "small",
}: Props) => {
  return (
    <TooltipBottom hint={hint}>
      <ButtonStyled
        isSelected={isSelected}
        size={size}
        onClick={onClick}
        disabled={disabled}
      >
        {label.replace(/_/g, " ")}
      </ButtonStyled>
    </TooltipBottom>
  );
};

export default Toggle;
