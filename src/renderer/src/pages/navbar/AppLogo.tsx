/**
 * This is the "AppLogo" component.
 *
 * It displays the application's logo along with its name, "COUNTER Harvesting App," when the navigation bar is open, 
 * and switches to a logo icon when the navbar is closed. This dynamic behavior helps optimize the use of screen 
 * real estate, especially on smaller screens. The component demonstrates conditional rendering based on the state 
 * of the navigation bar, the use of Material-UI for styling, and integration with a theme for consistent coloring.
 *
 * Props:
 * - toggleNavbar: A function to toggle the navigation bar's state.
 * - isNavbarOpen: A boolean indicating the current state of the navigation bar.
 */
import { FlexColumn } from "../../components/flex";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import appLogo from "../../assets/icons/app-logo.svg";

const AppLogo = ({ toggleNavbar, isNavbarOpen }) => {
  const { palette } = useTheme();
  return (
    <FlexColumn
      component="button"
      width="100%"
      padding="0 10px 20px 10px"
      onClick={toggleNavbar}
    >
      {isNavbarOpen ? (
        <>
          {/* When the navbar is open, display the full name of the app in styled text. */}
          <Typography
            variant="h1"
            fontSize={33}
            fontWeight={700}
            fontFamily={"Jost"}
            color={palette.primary.main}
          >
            COUNTER
          </Typography>
          <Typography
            variant="h2"
            fontSize={24}
            fontWeight={400}
            fontFamily={"Jost"}
            color={palette.primary.main}
          >
            Harvesting App
          </Typography>
        </>
      ) : (
        <Box>
          {/* When the navbar is closed, display only the app's logo icon. */}
          <img src={appLogo} alt="Logo" height="100%" width="50px" />
        </Box>
      )}
    </FlexColumn>
  );
};

export default AppLogo;
