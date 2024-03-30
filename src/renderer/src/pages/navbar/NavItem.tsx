/**
 * This is the "NavItem" component.
 *
 * It represents a navigational item within the application's navbar. 
 * This component is designed to work in tandem with a router, such as React Router, for navigating between different views of the application. 
 * It dynamically adjusts its appearance based on whether the navbar is expanded or collapsed and indicates the currently active navigation item.
 *
 * The component demonstrates the use of conditional rendering, custom styling based on theme and state, and integration with navigation and state management patterns in React applications.
 *
 * Props:
 * - label: The text label of the navigation item.
 * - to: The path to which the application should navigate when this item is clicked.
 * - icon: An icon to display alongside the label.
 * - isActive: A boolean indicating whether this navigation item is currently active.
 * - setActive: A function to set the current active navigation path.
 * - onClick: A function to handle navigation (typically provided by the useNavigate hook from React Router).
 * - isNavbarOpen: A boolean indicating whether the navbar is in its expanded state.
 */
import { Link } from "react-router-dom";
import { Typography, useTheme } from "@mui/material";
import { FlexRowStart } from "../../components/flex";

const NavItem = ({
  label,
  to,
  icon,
  isActive,
  setActive,
  onClick,
  isNavbarOpen,
}) => {

  // Custom link styling to adjust based on the navbar's open/closed state.
  const linkStyle = {
    width: isNavbarOpen ? "100%" : "max-content",
  };
  const { palette } = useTheme();
  // Handles clicking on the nav item, triggering navigation and updating the active state.
  const handleRoute = () => {
    onClick(to); // Triggers navigation to the specified path.
    setActive(to); // Sets this nav item as the active one.
  };

  return (
    <Link to={to} onClick={handleRoute} style={linkStyle}>
      <FlexRowStart
        component="button"
        borderRadius="15px"
        gap="10px"
        width={isNavbarOpen ? "100%" : "max-content"}
        padding="15px 15px"
        color={isActive ? palette.text.primary : palette.text.disabled}
        bgcolor={isActive ? palette.background.main : palette.background.light}
        sx={{
          "&:hover": {
            color: palette.text.primary,
            backgroundColor: palette.background.hover,
          },
        }}
      >
        {icon}
        {isNavbarOpen && <Typography>{label}</Typography>}
      </FlexRowStart>
    </Link>
  );
};

export default NavItem;
