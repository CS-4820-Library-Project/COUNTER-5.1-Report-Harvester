import { useContext, useDebugValue } from "react";
import AuthContext from "./AuthProvider";

/**
 * Custom hook that provides access to the authentication context.
 * @returns The authentication context.
 */
const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.password ? "Logged In" : "Logged Out"));
  return useContext(AuthContext);
};

export default useAuth;
