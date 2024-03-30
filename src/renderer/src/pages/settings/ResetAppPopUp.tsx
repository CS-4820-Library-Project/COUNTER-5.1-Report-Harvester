import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import HelpMessages from "../../data/HelpMessages";

type Props = {
  open: boolean;
  onClose: () => void;
  confirmAction: () => void;
};

/**
 * This is the "ResetApp" component.
 *
 * It's designed to confirm the deletion of a vendor from the system.
 * The component uses a modal dialog to ask the user for confirmation before proceeding with the action.
 * It emphasizes the irreversible nature of this operation with a warning message and provides options to either proceed with or cancel the deletion.
 *
 * The dialog is styled to align with the application's theme and to highlight the seriousness of the action, particularly using colors to draw attention to the warning message.
 *
 * Props:
 * @prop open - A boolean to control the visibility of the dialog.
 * @prop onClose - A function to call when closing the dialog without deletion.
 * @prop confirmAction - A function to call when confirming the deletion.
 */

const ResetAppPopUp = ({ open, onClose, confirmAction }: Props) => {
  // Styled components for customizing the appearance of the dialog and its contents.

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>
        <Title variant="body1">Reset Counter Harverster</Title>
      </DialogTitle>

      <DialogContent>
        {/* Main content with the confirmation and warning messages */}
        <ConfirmationMessage variant="body1">
          {HelpMessages.settings.password.resetApp}
        </ConfirmationMessage>

        <WarningMessage>
          <WarningText variant="subtitle1">Warning</WarningText>

          <PermanentActionMessage variant="body1">
            {HelpMessages.settings.password.resetAppAlert}
          </PermanentActionMessage>
        </WarningMessage>
      </DialogContent>

      {/* actions */}
      <DialogActionsStyled>
        {/* Action buttons to either proceed with the deletion or cancel */}
        <DeleteButton onClick={confirmAction}>Yes, reset my app</DeleteButton>

        <CancelButton onClick={onClose}>No, Cancel</CancelButton>
      </DialogActionsStyled>
    </StyledDialog>
  );
};

export default ResetAppPopUp;

// STYLES

const StyledDialog = styled(Dialog)(({ theme }) => ({
  // Dialog customization to fit the application's design.
  "& .MuiPaper-root": {
    borderRadius: 25,
    padding: 20,
    backgroundColor: theme.palette.background.light,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundImage: "none",
  },
}));

// Title, messages, and buttons are styled to emphasize the seriousness of the action and integrate with the theme.
const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.main,
  textAlign: "center",
  fontWeight: 700,
  fontSize: "24px",
}));

const ConfirmationMessage = styled(Typography)(({ theme }) => ({
  marginBottom: 10,
  color: theme.palette.text.main,
  textAlign: "center",
  width: "100%",
  fontSize: "16px",
}));

const PermanentActionMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.main,
}));

const WarningMessage = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: "5px 20px",
  backgroundColor: theme.palette.error.light,
  "&::before": {
    content: '""',
    position: "absolute",
    width: 10,
    height: "100%",
    left: 0,
    top: 0,
    backgroundColor: theme.palette.error.main,
  },
}));

const WarningText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.error.main,
  fontSize: "16px",
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  borderRadius: 25,
  fontSize: "16px",
  padding: "0.7rem 2em",
  textTransform: "none",
  marginRight: "auto",
  fontWeight: 700,
  "&:hover": {
    backgroundColor: theme.palette.error.hover,
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.main,
  color: theme.palette.text.main,
  textTransform: "none",
  borderRadius: 25,
  fontSize: "16px",
  padding: "0.7rem 2em",
  fontWeight: 700,
  marginLeft: "auto",
  "&:hover": {
    backgroundColor: theme.palette.background.hover,
  },
}));

const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
  justifyContent: "flex-end",
  paddingTop: theme.spacing(1),
  "& > *": {
    margin: theme.spacing(1),
  },
  padding: "8px 24px",
}));
