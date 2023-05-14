import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ value, children }) {
  const [auth, setAuth] = useState(value?.auth);

  const getAuth = () => {
    return auth;
  };

  return (
    <AuthContext.Provider value={{ getAuth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
