import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Icon, IconButton, TextField, styled } from "@mui/material";

type Props = {
  label: string;
  value: string;
  showPassword: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleShowPassword: () => void;
  error?: string;
  helperText?: string;
};

const PasswordInput = ({
  label,
  value,
  error,
  helperText,
  handleChange,
  showPassword,
  handleShowPassword,
}: Props) => {
  return (
    <PasswordField
      variant='outlined'
      label={label}
      value={value}
      type={showPassword ? "text" : "password"}
      onChange={handleChange}
      error={error ? true : false}
      helperText={error || helperText}
      InputProps={{
        endAdornment: (
          <IconButton onClick={handleShowPassword}>
            {showPassword ? (
              <VisibilityOff color='primary' />
            ) : (
              <Visibility color='primary' />
            )}
          </IconButton>
        ),
      }}
    />
  );
};

const PasswordField = styled(TextField)(({ theme }) => {
  const { palette, typography } = theme;
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
      backgroundColor: palette.background.main,
      borderColor: palette.primary.main,
      "& fieldset": {
        borderColor: palette.primary.main,
      },
      "&:hover fieldset": {
        borderColor: palette.primary.dark,
      },
      "&.Mui-focused fieldset": {
        borderColor: palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      color: palette.text.primary,
    },
    "& .Mui-error": {
      "& .MuiOutlinedInput-root": {
        borderColor: palette.error.main,
      },
      "& .MuiInputLabel-root": {
        color: palette.error.main,
      },
    },
    fontFamily: typography.fontFamily,
    fontWeight: 300,
    color: palette.text.secondary,
    fontSize: "15px",
    width: "100%",
  };
});

export default PasswordInput;
