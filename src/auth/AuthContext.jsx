import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logged = localStorage.getItem("auth_logged") === "1";
    const u = localStorage.getItem("auth_user");
    setIsAuthenticated(logged);
    if (u) setUser(JSON.parse(u));
    setLoading(false);
  }, []);

  async function login({ email }) {
    // aqui você validaria de verdade
    setIsAuthenticated(true);
    const u = { email };
    setUser(u);
    localStorage.setItem("auth_logged", "1");
    localStorage.setItem("auth_user", JSON.stringify(u));
    return true;
  }

  function logout() {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("auth_logged");
    localStorage.removeItem("auth_user");
  }

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout, loading }),
    [isAuthenticated, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
