import { Box, BoxProps, useTheme } from "@mui/material";

type Props = BoxProps & {
  colored?: "primary" | "secondary" | "error" | "success" | "info";
};

const Strong = ({ colored, children, ...props }: Props) => {
  const { palette } = useTheme();
  return (
    <Box
      {...props}
      fontWeight={600}
      component="span"
      display="inline"
      color={colored ? palette[colored].main : "inherit"}
    >
      {children}
    </Box>
  );
};

export default Strong;
