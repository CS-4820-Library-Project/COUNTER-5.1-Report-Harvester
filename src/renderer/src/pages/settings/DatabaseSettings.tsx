/**
 * This is the "RebuildSearchDatabase" component.
 *
 * This component allows users to change the directories where their reports are saved.
 *
 * The main elements of this component are:
 * - A form that the users interact with to change the directory
 * - A submit button to confirm their changes
 */
import { Box, Typography, useTheme, Button } from "@mui/material";
import { styled } from "@mui/system";
import { FlexColumnStart } from "../../components/flex";
import { RefreshOutlined } from "@mui/icons-material";

const handleRebuildButtonClicked = () => {};

const RebuildSearchDatabase: React.FC = () => {
  const { palette, spacing } = useTheme();

  return (
    <FlexColumnStart
      border={`1px solid ${palette.primary.main}`}
      borderRadius="25px"
      padding={spacing(5)}
      height="100%"
      overflow="auto"
    >
      <StyledTitle variant="h2">Rebuild Search Database</StyledTitle>

      <StyledDescription>
        Rebuild the search database in the case that it becomes corrupted.
      </StyledDescription>

      <ScrollableContainer>
        <DirectorySection>
          <DirectoryBox>
            <CustomButton
              fullWidth
              variant="contained"
              startIcon={<RefreshOutlined />}
              onClick={handleRebuildButtonClicked}
              color="secondary"
            >
              Rebuild
            </CustomButton>
          </DirectoryBox>
        </DirectorySection>
      </ScrollableContainer>
    </FlexColumnStart>
  );
};

// Styled components

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  fontSize: "24px",
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const DirectorySection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: "100%",
}));

const DirectoryBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.main,
  borderRadius: "50px",
  padding: "0.5rem 2rem",
  marginBottom: theme.spacing(1),
  width: "100%",
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  overflowY: "auto",
  maxHeight: "calc(100% - 160px)", // Adjust based on the fixed content size and container padding
  paddingRight: "2rem",
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.background.main,
    borderRadius: "10px",
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: "50px",
  width: "90%", // Adjusted to ensure the button is not positioned absolutely
  minWidth: "max-content",
  minHeight: "50px",
  height: "50px",
  color: theme.palette.secondary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.secondary.hover,
  },
  alignSelf: "center",
}));

export default RebuildSearchDatabase;
