/**
 * @file Provides authentication context to its children components.
 * @module AuthProvider
 */

import { createContext, useState, ReactNode, useEffect } from "react";
import { Auth } from "src/types/settings";

interface AuthContextType {
  auth?: Auth;
  setAuth?: React.Dispatch<React.SetStateAction<Auth | undefined>>;
}

/* Inititialization of the context */
const AuthContext = createContext<AuthContextType>({});

type Props = {
  children: ReactNode;
};

/**
 * Provides authentication context to its children components.
 */
export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [auth, setAuth] = useState<Auth | undefined>();

  useEffect(() => {
    const checkPasswordSet = async () => {
      const isProtected = await window.settings.isPasswordSet();
      console.log(isProtected);

      isProtected ? setAuth(undefined) : setAuth({ password: "" });
    };

    checkPasswordSet();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
