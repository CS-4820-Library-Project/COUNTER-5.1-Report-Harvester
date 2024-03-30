import { useState, ChangeEvent, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import LockIcon from "@mui/icons-material/Lock";
import HelpMessages from "../../data/HelpMessages";
import { useNotification } from "../../components/NotificationBadge";
import PasswordInput from "../../components/form/PasswordInput";
import { LockOpen } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import TextButton from "../../components/buttons/TextButton";
import { FlexColumnEnd } from "../../components/flex";
import ResetAppPopUp from "./ResetAppPopUp";
import { useNavigate } from "react-router-dom";

/**
 * This is the "SetUpPasswordView" component.
 *
 * It allows users to set up a new password for their account in the application. The component emphasizes the creation of a strong password through specific requirements and provides users with the ability to toggle password visibility.
 *
 * The main elements of this component are:
 * - Instructions and criteria for creating a strong password.
 * - Text fields for entering and confirming the new password, with visibility toggle icons.
 * - A submit button to save the new password.
 *
 * It demonstrates the use of conditional rendering, event handling, and the use of the `useState` hook for form state management. Styled components are used extensively for custom styling.
 */

export default function SetUpPasswordView() {
  const { password: passwordHelp } = HelpMessages.settings;

  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const setNotification = useNotification();

  // State for form values and password protection status. In the same object to keep them sync
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [isProtected, setIsProtected] = useState(false);
  const [resetPopUP, setResetPopUP] = useState(false);

  /**
   * Handles the change in the input and set the values accordingly
   * @param inputLabel - The input to update (password or confirmPassword)
   */
  const handleChange =
    (inputLabel: "password" | "confirmPassword") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [inputLabel]: event.target.value });
    };

  /** Confirms password are equal */
  const passwordsMatch = values.password === values.confirmPassword;

  /**
   * Toggles the visibility of the password input
   * @param prop - The property to toggle (showPassword or showConfirmPassword)
   */
  const handleClickShowPassword = (
    prop: "showPassword" | "showConfirmPassword"
  ) => {
    setValues({ ...values, [prop]: !values[prop] });
  };

  /** Opens or closes reset app pop up */
  const handleResetPopUp = () => setResetPopUP(!resetPopUP);

  const handleResetApp = async () => {
    const result = await window.settings.resetApp();

    setAuth && setAuth({ password: "" });
    setNotification({
      type: result ? "success" : "error",
      message: result ? "App reset successfully" : "App reset failed",
    });

    navigate("/fetch");
  };

  /** Creates a notification based on the result of the password setting */
  const createPasswordNotification = (result: boolean, isProtected: boolean) =>
    ({
      type: result ? "success" : "error",
      message: `Password ${isProtected ? "un" : ""}set ${result ? "successfully" : "failed"}`,
    }) as const;

  /** Sets up the password based on the current state of the app. and creates a notification with the result */
  const setUpPassword = async () => {
    const { password } = values;
    if (passwordsMatch && password) {
      const { setPassword, unsetPassword } = window.settings;

      const result = isProtected
        ? await unsetPassword(password)
        : await setPassword(password);

      setNotification(createPasswordNotification(result, isProtected));

      setValues({
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
      });

      if (!result) return;
      setIsProtected(!isProtected);
      setAuth && (isProtected ? setAuth({ password: "" }) : setAuth(undefined));
    }
  };

  /** Checks password is set in the system and set flag variable to keep
   * track of changes in the component */
  useEffect(() => {
    const checkPasswordSet = async () => {
      const isPasswordSet = await window.settings.isPasswordSet();
      setIsProtected(isPasswordSet);
    };

    checkPasswordSet();
  }, []);

  return (
    <LayoutBox>
      <CustomBox className="card-scroll">
        <CustomTypography variant="h4">
          {isProtected ? "Unset Password" : "Set Up Password"}
        </CustomTypography>

        <Typography>
          {!isProtected ? passwordHelp.set : passwordHelp.unset}
        </Typography>

        {!isProtected && (
          <>
            <Box color="error" pl={2}>
              {passwordHelp.permanentAction}
            </Box>
            <CustomTypography>A Strong Password Should:</CustomTypography>
            <CustomList>{passwordHelp.strongPassword}</CustomList>{" "}
          </>
        )}

        <PasswordInput
          label={isProtected ? "Type your Password" : "Type new password"}
          value={values.password}
          handleChange={handleChange("password")}
          showPassword={values.showPassword}
          handleShowPassword={() => handleClickShowPassword("showPassword")}
        />

        <PasswordInput
          label="Confirm your password"
          handleChange={handleChange("confirmPassword")}
          value={values.confirmPassword}
          showPassword={values.showConfirmPassword}
          handleShowPassword={() =>
            handleClickShowPassword("showConfirmPassword")
          }
          error={!passwordsMatch ? "Passwords don't match" : ""}
        />

        <CustomButton
          fullWidth
          variant="contained"
          startIcon={isProtected ? <LockOpen /> : <LockIcon />}
          onClick={setUpPassword}
        >
          {isProtected ? "Unset Password" : "Set Up Password"}
        </CustomButton>

        {isProtected && (
          <FlexColumnEnd height="100%">
            <TextButton fullWidth onClick={handleResetPopUp}>
              Forgot Your Password?
            </TextButton>
          </FlexColumnEnd>
        )}

        <ResetAppPopUp
          open={resetPopUP}
          onClose={handleResetPopUp}
          confirmAction={handleResetApp}
        />
      </CustomBox>
    </LayoutBox>
  );
}

const LayoutBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  padding: theme.spacing(5),
  borderRadius: "25px",
  border: `1px solid ${theme.palette.primary.main}`,
}));

const CustomBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
  padding: "0 30px 0 0",
  gap: "20px",
  height: "100%",
}));

const CustomList = styled("ul")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(4),
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "24px",
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "50px",
  width: "50%", // Adjusted to ensure the button is not positioned absolutely
  minWidth: "max-content",
  minHeight: "50px",
  height: "50px",
  color: theme.palette.secondary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.secondary.hover,
  },
  alignSelf: "center",
}));
