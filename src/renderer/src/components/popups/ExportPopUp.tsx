import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import ActionButton from "../buttons/ActionButton";
import { CancelOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { FlexBetween, FlexColumn } from "../flex";
import VendorServiceInstance from "../../service/VendorService";
import { useNotification } from "../NotificationBadge";

interface ExportPopUpProps {
  open: boolean;
  onClose: () => void;
}

const ExportPopUp: React.FC<ExportPopUpProps> = ({ open, onClose }) => {
  const { palette } = useTheme();
  const [version, setVersion] = React.useState<string>("5.0");

  const setNotification = useNotification();

  const handleExport = async () => {
    const path = await window.settings.saveDirectory("export");

    if (path !== "") {
      await VendorServiceInstance.exportVendors(
        version === "5.0" ? "data5_0" : "data5_1",
        path
      );
      setNotification({ type: "success", message: "Exported!" });
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: palette.background.light,
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle
        style={{
          textAlign: "center",
          fontSize: "1.5rem",
          color: palette.primary.main,
        }}
      >
        Export Options
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ fontSize: "1rem", color: palette.primary.main }}
        >
          Choose vendor version of this file:
        </Typography>

        <FlexColumn gap="20px">
          <FlexBetween gap="10px">
            <ActionButton
              label="Vendors 5.0"
              padding="5px 20px"
              color="primary"
              selected={version === "5.0"}
              onClick={() => setVersion("5.0")}
            />
            <ActionButton
              label="Vendors 5.1"
              padding="5px 20px"
              color="primary"
              selected={version === "5.1"}
              onClick={() => setVersion("5.1")}
            />
          </FlexBetween>

          <FlexBetween gap="10px">
            <ActionButton
              label="Export"
              color="secondary"
              padding="5px 20px"
              width="50%"
              // sx={{ padding: "10px 12px" }}
              // labelSx={{ fontSize: "20px" }}
              onClick={handleExport}
              icon={<FileDownloadOutlined />}
            />

            <ActionButton
              label="Cancel"
              color="error"
              padding="5px 20px"
              width="50%"
              icon={<CancelOutlined fontSize="small" />}
              onClick={onClose}
            />
          </FlexBetween>
        </FlexColumn>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPopUp;
