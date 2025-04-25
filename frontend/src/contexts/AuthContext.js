// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- 1. Tambahkan state loading, default true

  useEffect(() => {
    console.log("AuthProvider useEffect running...");
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        console.log("Token found, setting authenticated");
        // Di aplikasi nyata, validasi token ke backend di sini
        setIsAuthenticated(true);
        setUser({
          name: localStorage.getItem("username") || "User",
          isAdmin: localStorage.getItem("isAdmin") === "true",
        });
      } else {
        console.log("No token found, setting not authenticated");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
       console.error("Error reading auth token from localStorage:", error);
       setIsAuthenticated(false);
       setUser(null);
    } finally {
       console.log("Auth check finished, setting loading to false");
       setLoading(false); // <-- 2. Set loading false SETELAH pengecekan selesai
    }
  }, []); // Dependensi kosong agar hanya jalan sekali saat mount

  const login = (token, userData) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("username", userData?.name || "");
    localStorage.setItem("isAdmin", userData?.isAdmin || false);
    setIsAuthenticated(true);
    setUser(userData);
    // Tidak perlu setLoading(false) di sini karena login terjadi setelah load awal
  };

  const logout = (navigate) => {
    console.log("Logging out from context...");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    setUser(null);
    if (navigate) {
      console.log("Navigating to /login");
      navigate("/login", { replace: true });
    } else {
      console.warn("Navigate function not provided to context logout");
    }
     // Tidak perlu setLoading(false) di sini
  };

  // 3. Sertakan 'loading' dalam value context
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {/* Tampilkan children hanya jika loading selesai, atau biarkan guard menanganinya */}
      {/* {!loading ? children : <div>Loading Authentication...</div>} */}
      {/* Atau cara yang lebih baik: biarkan guard yang handle loading */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}