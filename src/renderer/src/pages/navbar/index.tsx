import {
  ArticleOutlined,
  BrowserUpdatedOutlined,
  DarkMode,
  LocalLibraryOutlined,
  ManageSearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  FlexBetweenColumn,
  FlexCenter,
  FlexColumn,
} from "../../components/flex";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import { IconButton, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "../../theme";
import AppLogo from "./AppLogo";

/**
 * This is the "Navbar" component of the application.
 *
 * It serves as the primary navigation mechanism.
 * Allowing users to switch between different sections of the application like fetching reports, searching reports, managing vendors, and accessing settings.
 * The Navbar dynamically adjusts its content and appearance based on the state, such as whether it's fully expanded or collapsed, and supports toggling between light and dark modes.
 *
 * Key features of this component include:
 * - Dynamic links for navigating to different parts of the application.
 * - A custom AppLogo component that toggles the Navbar's expanded or collapsed state.
 * - Integration with the application's theming context to toggle between light and dark modes.
 * - Use of React Router for programmatically navigating based on the active tab state.
 * - Conditional rendering of navigation item labels based on the Navbar's open state, enhancing the UX in different viewport sizes.
 */
const Navbar = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("/");
  const colorMode = useContext(ColorModeContext);

  const location = useLocation().pathname;

  // Effect hook to navigate to the activeTab's route whenever it changes.
  useEffect(() => {
    navigate(activeTab);
  }, [activeTab]);

  return (
    <FlexBetweenColumn
      component="nav"
      height="100%"
      width="max-content"
      padding="30px 10px"
      gap="5px"
      borderRight={"2px solid " + palette.background.main}
    >
      {/* Top */}
      {/* Navbar top section for app logo and main navigation items */}
      <FlexColumn width="max-content" gap="5px">
        <AppLogo
          toggleNavbar={() => setIsNavbarOpen(!isNavbarOpen)}
          isNavbarOpen={isNavbarOpen}
        />
        {/* NavItem components for each main navigation link */}
        {/* Each NavItem changes the active tab and displays based on the navbar's open state */}
        <NavItem
          label="Vendors"
          to="/vendors"
          onClick={navigate}
          isActive={"/vendors" === location}
          setActive={setActiveTab}
          isNavbarOpen={isNavbarOpen}
          icon={<LocalLibraryOutlined />}
        />
        <NavItem
          label="Fetch Reports"
          to="/fetch"
          onClick={navigate}
          isActive={["/fetch", "/"].includes(location)}
          setActive={setActiveTab}
          isNavbarOpen={isNavbarOpen}
          icon={<BrowserUpdatedOutlined />}
        />
        <NavItem
          label="Search Reports"
          to="/search"
          onClick={navigate}
          isActive={"/search" === location}
          setActive={setActiveTab}
          isNavbarOpen={isNavbarOpen}
          icon={<ManageSearchOutlined />}
        />
        <NavItem
          label="Settings"
          to="/settings"
          onClick={navigate}
          isActive={"/settings" === location}
          setActive={setActiveTab}
          isNavbarOpen={isNavbarOpen}
          icon={<SettingsOutlined />}
        />
      </FlexColumn>

      {/* Bottom */}

      <FlexColumn gap="10px" color="info.dark">
        <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
          <DarkMode />
        </IconButton>

        {/* Link Documentation */}
        <Link to="">
          <FlexCenter
            borderRadius="50px"
            padding="15px 15px"
            bgcolor={palette.background.main}
            gap="5px"
            sx={{
              "&:hover": {
                backgroundColor: palette.background.hover,
                color: palette.primary.main,
              },
            }}
          >
            <ArticleOutlined />

            {isNavbarOpen ? "User Manual" : ""}
          </FlexCenter>
        </Link>
      </FlexColumn>
    </FlexBetweenColumn>
  );
};

export default Navbar;
