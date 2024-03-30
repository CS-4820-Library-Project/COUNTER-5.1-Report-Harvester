/**
 * This is the "AuthenticationTab" component.
 *
 * It serves as a user interface for authentication purposes, specifically designed to prompt the user for a root password before
 * allowing access to sensitive information or functionalities within the application, such as viewing or modifying a vendor list.
 * The component showcases a user-friendly design with a password visibility toggle feature, enhancing the interaction experience.
 *
 * Features include:
 * - A styled container that centralizes the authentication box on the screen.
 * - A toggle icon to show/hide the password input, improving usability and security.
 * - Styled action buttons for submitting the authentication form or canceling the operation.
 */
import { useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import {
  FlexBetween,
  FlexCenter,
  FlexColumn,
  FlexRowEnd,
} from "../../components/flex";
import PasswordInput from "../../components/form/PasswordInput";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function AuthenticationTab({ children }: Props) {
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleAuthenticate = async () => {
    if (!password) return setPasswordError("Password is required");

    const success = await window.vendors.read(password);
    if (success && setAuth) return setAuth({ password });

    setPasswordError("Invalid password");
  };

  return (
    <Box width='100%' height='100%' position='relative'>
      <FlexCenter
        position='absolute'
        bgcolor='rbga(0, 0, 0, 0.1)'
        zIndex={100}
        sx={{ backdropFilter: "blur(5px)" }}
        width='100%'
        height='100%'
      >
        <FlexColumn sx={styles().authenticationBox} width='100%'>
          <Typography variant='h2'>Authentication</Typography>

          <Typography fontSize={16}>
            Provide your password below to access your vendors and modify this
            information.
          </Typography>

          <PasswordInput
            label='Password'
            value={password}
            error={passwordError}
            handleChange={handleChange}
            showPassword={showPassword}
            handleShowPassword={handleShowPassword}
          />

          <FlexRowEnd width='100%'>
            <Button
              variant='text'
              onClick={() => navigate("/settings")}
              sx={{ borderRadius: "20px", padding: "0 10px" }}
            >
              Unset Password
            </Button>
          </FlexRowEnd>

          <FlexBetween width='100%' gap='2%'>
            <Button
              onClick={handleAuthenticate}
              variant='contained'
              color='success'
              sx={{ ...styles().button, ...styles().buttonAddVendor }}
            >
              Authenticate
            </Button>

            <Button sx={{ ...styles().button, ...styles().buttonCancel }}>
              Go Back
            </Button>
          </FlexBetween>
        </FlexColumn>
      </FlexCenter>
      {children}
    </Box>
  );
}

const styles = () => {
  const { palette } = useTheme();

  return {
    authenticationBox: {
      width: "700px",
      backgroundColor: palette.background.light,
      color: palette.text.main,
      borderRadius: "25px",
      boxShadow: "0px 0px 30px 10px rgba(0, 0, 0, 0.2)",
      padding: "3rem",
      gap: "1rem",
    },
    actionButtons: {
      display: "flex",
      justifyContent: "space-between",
    },
    button: {
      fontSize: "14px",
      width: "100%",
      fontWeight: "600",
      borderRadius: "50px",
      padding: "15px 0",
    },
    buttonAddVendor: {
      backgroundColor: palette.success.main,
    },
    buttonCancel: {
      backgroundColor: palette.background.main,
      color: palette.background.contrastText,
    },
  } as const;
};
