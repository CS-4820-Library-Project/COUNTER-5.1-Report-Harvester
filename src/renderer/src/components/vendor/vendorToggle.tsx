import { FlexBetween, FlexCenter } from "../flex";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Check, Info } from "@mui/icons-material";
import SupportedReportsModal from "../../pages/vendors/SupportedReportsModal";
import { useState } from "react";
import TooltipBottom from "../Tooltip";
import { VendorRecord } from "src/types/vendors";

type Props = {
  vendor: VendorRecord;
  selected: boolean;
  setSelected: () => void;
};

const VendorToggle = ({ vendor, selected, setSelected }: Props) => {
  const { palette } = useTheme();

  const [isReportsModalOpen, setReportsModalOpen] = useState(false);

  const handleOpenReportsModal = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setReportsModalOpen(true);
  };

  const handleCloseReportsModal = () => setReportsModalOpen(false);
  const styles = {
    cursor: "pointer",
    width: "100%",
    padding: "0.1rem",
    pl: "1rem",
    borderRadius: "25px",
    color: selected ? palette.primary.contrastText : palette.text.light,
    bgcolor: selected ? palette.primary.main : palette.success.dark,
    "&:hover": {
      bgcolor: palette.primary.hover,
    },
  } as const;

  return (
    <TooltipBottom hint={vendor.name}>
      <FlexBetween sx={styles} onClick={setSelected} gap="10px">
        {/* Supported Reports Pop Up */}
        {isReportsModalOpen && (
          <SupportedReportsModal
            onClose={handleCloseReportsModal}
            isPopupOpen={isReportsModalOpen}
            vendor={vendor}
          />
        )}

        {/* Selection Icon */}
        <Box
          bgcolor={palette.background.light}
          color={palette.text.main}
          borderRadius={"7px"}
          width="20px"
          minWidth={"20px"}
          height="20px"
        >
          {selected && <Check />}
        </Box>

        {/* Label */}
        <Typography variant="h5" noWrap width="100%">
          {vendor ? vendor.name : "Loading..."}
        </Typography>

        {/* Tools */}
        <FlexCenter minWidth="max-content" gap="10px">
          {/* Versions Available */}
          {vendor.data5_0 && <Typography> 5.0 </Typography>}
          {vendor.data5_1 && <Typography> 5.1 </Typography>}

          {/* Supported Info */}
          <IconButton onClick={handleOpenReportsModal} color="inherit">
            <Info />
          </IconButton>
        </FlexCenter>
      </FlexBetween>
    </TooltipBottom>
  );
};

export default VendorToggle;
