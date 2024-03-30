import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { VendorData, VendorRecord } from "src/types/vendors";
import { useEffect, useState } from "react";
import { useNotification } from "../../components/NotificationBadge";
import { REPORTS } from "../../../../constants";

type Props = {
  onClose: () => void;
  isPopupOpen: boolean;
  vendor: VendorRecord | VendorData;
};

/**
 * This is the "SupportedReportsModal" component.
 *
 * It serves as an informational modal that dynamically displays a list of report types supported by a selected vendor.
 * When activated, this modal provides users with a clear, focused view of the capabilities associated with a particular vendor, enhancing the user's understanding and interaction within the application.
 *
 * The modal utilizes the application's theming for consistency in appearance and employs a close button for user control over its visibility.
 * It is designed to be an integral part of the user interface, offering both functionality and aesthetic appeal.
 *
 * Props:
 * - onClose: A function to close the modal.
 * - isPopupOpen: A boolean indicating whether the modal is currently open.
 * - vendor: An object representing the selected vendor, including its name and other pertinent information.
 */

function SupportedReportsModal({ onClose, isPopupOpen, vendor }: Props) {
  const { palette } = useTheme();

  const setNotification = useNotification();

  const [reports, setReports] = useState<string[]>([]);
  const [fetchResults, setFetchResults] = useState(false);

  useEffect(() => {
    window.reports.getSupported(vendor).then((reportIds) => {
      if (Array.isArray(reportIds)) {
        setReports(reportIds);
        setFetchResults(true);
      } else {
        setNotification({
          message: "Failed to fetch supported reports",
          type: "error",
        });
        setFetchResults(false);
        onClose();
      }
    });
  }, []);

  return (
    isPopupOpen &&
    fetchResults && (
      <Box
        onClick={onClose} // Close the modal if the user clicks outside the modal content.
        sx={{
          zIndex: 9,
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          top: 0,
          left: 0,
          color: palette.background.contrastText,
          backgroundColor: "rgba(0, 0, 0, 0.25)",
        }}
      >
        <Box
          onClick={(e) => e.stopPropagation()} // Prevent the modal close action when clicking inside the modal content.
          sx={{
            position: "relative",
            backgroundColor: palette.background.light,
            borderRadius: "25px",
            boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
            width: 700,
            padding: "40px",
            boxSizing: "border-box",
          }}
        >
          <IconButton
            onClick={onClose} // Button to explicitly close the modal.
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
            }}
            aria-label="close"
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Supported Reports
          </Typography>
          <Typography sx={{ textAlign: "center", marginBottom: "20px" }}>
            <strong>{vendor.name}</strong> supports the following reports:
          </Typography>
          <Box
            sx={{
              backgroundColor: palette.secondary.light,
              borderRadius: "10px",
              padding: "20px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                backgroundColor: palette.success.main,
                width: "10px",
                borderRadius: "10px 0 0 10px",
              }}
            />
            <List sx={{ position: "relative" }}>
              {reports.map((reportId, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    "&:before": {
                      content: '"•"',
                      position: "absolute",
                      left: 0,
                      fontWeight: "bold",
                      fontSize: "25px",
                      lineHeight: "20px",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "16px",
                      paddingLeft: "20px",
                    }}
                  >
                    {`${reportId.toUpperCase()} - ${REPORTS[reportId.toUpperCase() as keyof typeof REPORTS]} `}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    )
  );
}

export default SupportedReportsModal;
