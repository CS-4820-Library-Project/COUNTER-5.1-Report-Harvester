import { Outlet } from "react-router-dom";
import AuthenticationPage from "../pages/vendors/AuthenticationPage";
import useAuth from "./useAuth";

/**
 * A higher-order component that wraps the component and ensures that the user is authenticated.
 * If the user is authenticated, it renders the component wrapped by the `Outlet` component.
 * If the user is not authenticated, it renders the `AuthenticationPage` component wrapped by the `Outlet` component.
 */
const RequireAuth = () => {
  const { auth } = useAuth();

  return auth ? (
    <Outlet />
  ) : (
    <AuthenticationPage>
      <Outlet />
    </AuthenticationPage>
  );
};

export default RequireAuth;
