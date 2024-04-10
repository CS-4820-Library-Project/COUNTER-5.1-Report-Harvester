import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import ActionButton from "../buttons/ActionButton";
import { AddCircleOutlined, CancelOutlined, Repeat } from "@mui/icons-material";
import VendorServiceInstance from "../../service/VendorService";
import { VendorTsvError, VendorVersions } from "src/types/vendors";
import { FlexBetween } from "../flex";
import { useNotification } from "../NotificationBadge";

interface ImportPopUpProps {
  open: boolean;
  onClose: () => void;
  reloadVendors: (reload: boolean) => void;
}

const ImportPopUp: React.FC<ImportPopUpProps> = ({
  open,
  onClose,
  reloadVendors,
}) => {
  const { palette } = useTheme();
  const setNotification = useNotification();
  const [file, setFile] = useState<File | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<VendorTsvError[]>();

  const [version, setVersion] = useState<VendorVersions>("5.0");

  const handleFileSelectEvent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSubmitted(false);
    setErrors(undefined);
    if (event.target.files) setFile(event.target.files[0]);
  };

  const handleFileInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    input.value = "";
  };

  const handleImportVendors = (action: "add" | "replace") => async () => {
    setSubmitted(true);
    if (file) {
      const imported = await VendorServiceInstance.importVendors(
        version,
        file,
        action
      );

      if (typeof imported === "boolean" && imported === true) {
        handleClose();
        setNotification({ type: "success", message: "Imported Correctly" });
      } else setErrors(imported as VendorTsvError[]);

      reloadVendors(true);
    }
  };

  const handleClose = () => {
    setFile(null);
    setErrors(undefined);
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          color: palette.primary.dark,
        }}
      >
        Import Options
      </DialogTitle>

      {/* Select File Button */}

      <DialogContent>
        <Grid item>
          <input
            type="file"
            accept=".tsv"
            onClick={handleFileInputClick}
            onChange={handleFileSelectEvent}
            id="fileInput"
            hidden
          />
          <label htmlFor="fileInput">
            <Button
              variant="contained"
              component="span"
              color="secondary"
              style={{
                backgroundColor: file ? palette.secondary.dark : undefined,

                // Add other styles as needed
                marginTop: "3px",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              {file ? file.name : "Choose File"}
            </Button>
          </label>
        </Grid>

        {/* Vendor Version Selection */}
        {!submitted && (
          <>
            <Grid
              container
              direction="column"
              style={{ marginBottom: "15px", marginTop: "10px" }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ fontSize: "1rem", color: palette.primary.main }}
              >
                Choose vendor version of this file:
              </Typography>

              <FlexBetween gap="10px">
                <ActionButton
                  label="Vendors 5.0"
                  color="primary"
                  width="48%"
                  onClick={() => setVersion("5.0")}
                  selected={version === "5.0"}
                />

                <ActionButton
                  label="Vendors 5.1"
                  color="primary"
                  width="48%"
                  onClick={() => setVersion("5.1")}
                  selected={version === "5.1"}
                />
              </FlexBetween>
            </Grid>

            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ fontSize: "1rem", color: palette.primary.main }}
            >
              Choose an action:
            </Typography>

            <Grid container justifyContent="space-around" gap="10px">
              <ActionButton
                label="Add & Update Existing"
                color="secondary"
                icon={<AddCircleOutlined fontSize="small" />}
                onClick={handleImportVendors("add")}
                disabled={!file}
              />

              <ActionButton
                label="Replace all vendors"
                color="secondary"
                icon={<Repeat fontSize="small" />}
                onClick={handleImportVendors("replace")}
                disabled={!file}
              />
            </Grid>
          </>
        )}

        {submitted && (
          <>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ fontSize: "1rem", color: palette.primary.main }}
            >
              {errors ? "Something Went Wrong:" : "Importing vendors..."}
            </Typography>

            {/* Display Errors */}
            {
              errors &&
                errors.map((vendorError, index) => {
                  // Break Lines in the error message
                  return (
                    <>
                      <Typography
                        sx={{
                          color: palette.error.main,
                          fontSize: "1rem",
                          marginBottom: "5px",
                        }}
                      >
                        {index + 1}. {vendorError.vendor}:
                      </Typography>

                      {/*  Render errors Found */}
                      {vendorError.errors.map((error) => (
                        <Typography
                          sx={{
                            paddingLeft: "10px",
                            color: palette.text.main,
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          - {error}
                        </Typography>
                      ))}
                    </>
                  );
                })

              //
            }
          </>
        )}
      </DialogContent>

      <DialogActions>
        <ActionButton
          label="Cancel"
          color="error"
          icon={<CancelOutlined fontSize="small" />}
          onClick={handleClose}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ImportPopUp;
