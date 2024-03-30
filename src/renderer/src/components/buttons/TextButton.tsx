import { Button, ButtonProps } from "@mui/material";

const TextButton = ({ children, sx, ...props }: ButtonProps) => {
  return (
    <Button
      sx={{
        textTransform: "none",
        borderRadius: "25px",
        padding: "2px 10px",
        minWidth: "max-content",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default TextButton;
