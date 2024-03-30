import { Button, Typography, useTheme } from "@mui/material";

type Props = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

const TabButton = ({ isActive, label, onClick }: Props) => {
  const { palette } = useTheme();

  return (
    <Button
      onClick={onClick}
      style={{
        backgroundColor: isActive
          ? palette.primary.main
          : palette.background.main,
        color: isActive ? palette.primary.contrastText : palette.text.primary,
        borderRadius: "25px 25px 0 0",
        padding: "15px 20px 5px 20px",
        textTransform: "capitalize",
        transition: "background-color 0.3s",
      }}
    >
      <Typography variant="h5">{label}</Typography>
    </Button>
  );
};

export default TabButton;
