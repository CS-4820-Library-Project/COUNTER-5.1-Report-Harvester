import Button, { ButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { SxProps, Typography } from "@mui/material";
import { FlexBetween } from "../flex";
import TooltipBottom from "../Tooltip";
import React from "react";
import { hexToRgbStr } from "../../utils/Color";

type Props = {
  label?: string;
  color?: PaletteColorKey;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  submit?: boolean;
  selected?: boolean;
  hint?: string;
  width?: "100%" | "max-content" | string;
  padding?: string;
  labelSx?: SxProps;
};

const ActionButton = ({
  label,
  color = "background",
  icon,
  hint,
  onClick,
  disabled,
  selected,
  submit,
  width = "max-content",
  padding = "0.1rem 0.5rem",
  labelSx,
  sx,
  ...props
}: Props & Omit<ButtonProps, "color">) => {
  const { palette } = useTheme();

  const getButtonStyles = () => {
    // Set background if not selected or disabled
    const property =
      disabled || (selected !== undefined && !selected) ? "background" : color;

    const backgroundColor = palette[property].main;
    const textColor = palette[property].contrastText;
    const hoverColor = palette[property].hover;
    const boxShadow = selected
      ? `0 0 10px 0 ${hexToRgbStr(palette[color].hover || "", 0.3)}`
      : "";

    return {
      width,
      minWidth: width,
      backgroundColor,
      color: textColor,
      borderRadius: "50px",
      textTransform: "capitalize",
      // transition: "background-color 0.9s",
      boxShadow,
      "&:hover": {
        backgroundColor: hoverColor,
      },
      ...sx,
    } as const;
  };

  const MyButton = React.forwardRef(() => {
    return (
      <Button
        sx={getButtonStyles()}
        type={submit ? "submit" : "button"}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        <FlexBetween gap="8px" padding={padding}>
          {icon}
          {label && (
            <Typography variant="body1" sx={{ ...labelSx }}>
              {label}
            </Typography>
          )}
        </FlexBetween>
      </Button>
    );
  });

  return hint ? (
    <TooltipBottom hint={hint}>
      <MyButton />
    </TooltipBottom>
  ) : (
    <MyButton />
  );
};

export default ActionButton;
