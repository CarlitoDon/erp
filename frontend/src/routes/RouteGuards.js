// src/routes/RouteGuards.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material"; // Contoh UI Loading

// Komponen UI Loading Sederhana
const AuthLoading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 64px)">
    <CircularProgress />
  </Box>
);

export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // <-- Ambil 'loading'

  if (loading) {
    console.log("PrivateRoute: Auth loading...");
    return <AuthLoading />; // <-- Tampilkan loading jika auth belum siap
  }

  console.log(`PrivateRoute: Auth loaded, isAuthenticated: ${isAuthenticated}`);
  if (!isAuthenticated) {
    console.log("PrivateRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />; // Redirect hanya jika loading selesai & tidak auth
  }

  console.log("PrivateRoute: Authenticated, rendering children");
  return children; // Render children jika loading selesai & auth
}

export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth(); // <-- Ambil 'loading'

  if (loading) {
     console.log("PublicRoute: Auth loading...");
    return <AuthLoading />; // <-- Tampilkan loading jika auth belum siap
  }

  console.log(`PublicRoute: Auth loaded, isAuthenticated: ${isAuthenticated}`);
  if (isAuthenticated) {
    console.log("PublicRoute: Authenticated, redirecting to /dashboard");
    return <Navigate to="/dashboard" replace />; // Redirect hanya jika loading selesai & auth
  }

   console.log("PublicRoute: Not authenticated, rendering children");
  return children; // Render children jika loading selesai & tidak auth
}