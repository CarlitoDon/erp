// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

function AuthProviderComponent({ children }) { // Ganti nama komponen
  const [token, setTokenState] = useState(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Panggil hook di dalam komponen

  useEffect(() => {
    const currentToken = localStorage.getItem("auth_token");
    if (currentToken) {
      try {
         const decodedToken = jwtDecode(currentToken);
         const currentTime = Date.now() / 1000;

         if (decodedToken.exp < currentTime) {
             console.log("Auth Token Expired");
             handleLogout(null, false); // Panggil fungsi internal
         } else {
             setTokenState(currentToken);
             setUser({
                id: decodedToken.userId,
                role: decodedToken.role,
                username: localStorage.getItem("username") || "User"
             });
         }
      } catch (error) {
        console.error("Error decoding token or token invalid/expired:", error);
        handleLogout(null, false); // Panggil fungsi internal
      }
    } else {
      setTokenState(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const handleLogin = (newToken, userData) => { // Ganti nama fungsi
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("username", userData?.username || "");
    localStorage.removeItem("isAdmin");
    setTokenState(newToken);
    setUser({
        id: userData?.id,
        username: userData?.username,
        role: userData?.role
    });
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = (navigateFunc = navigate, performNavigation = true) => { // Ganti nama fungsi
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    setTokenState(null);
    setUser(null);
    if (performNavigation && navigateFunc) {
      navigateFunc("/login", { replace: true });
    } else if (performNavigation && !navigateFunc) {
       console.warn("Navigate function not provided to context logout for navigation");
    }
  };

  const contextValue = {
      user,
      token,
      loading,
      login: handleLogin, // Assign fungsi internal ke value
      logout: handleLogout // Assign fungsi internal ke value
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Wrapper component untuk memanggil hook di tempat yg benar
export function AuthProvider({ children }) {
    // BrowserRouter atau Router harus sudah ada di atas komponen ini di App.js
    return <AuthProviderComponent>{children}</AuthProviderComponent>;
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}