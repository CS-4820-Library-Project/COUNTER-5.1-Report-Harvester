import websiteLogo from "../app-logo.png"; // Import the logo image
import React, { useState } from "react";
import { Typography, useTheme, Dialog, DialogContent } from "@mui/material";

interface HelpPopupProps {
  open: boolean;
  onClose: () => void;
  helpMessage: string;
}

const HelpPopup: React.FC<HelpPopupProps> = ({
  open,
  onClose,
  helpMessage,
}) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(2),
        }}
      >
        <img
          src={websiteLogo} // Use the logo image directly
          alt="Website Logo"
          style={{ width: 50, height: 50, marginBottom: 16 }}
        />
        <Typography sx={{ textAlign: "center" }}>{helpMessage}</Typography>
      </DialogContent>
    </Dialog>
  );
};
