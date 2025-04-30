// src/routes/RouteGuards.js
import React from "react";
import {
  Navigate /* Hapus Outlet jika tidak dipakai */,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const AuthLoading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="calc(100vh - 64px)"
  >
    <CircularProgress />
  </Box>
);

// Komponen PrivateRoute SEKARANG MERENDER CHILDREN
export function PrivateRoute({ children, requiredRoles }) {
  // Ambil token, loading, dan user (untuk cek role)
  const { token, loading, user } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  const isAuth = !!token;

  if (!isAuth) {
    // Redirect ke login jika loading selesai & tidak ada token
    return <Navigate to="/login" replace />;
  }

  // --- (Opsional) Pengecekan Role ---
  // if (requiredRoles && requiredRoles.length > 0) {
  //   const userRole = user?.role;
  //   if (!userRole || !requiredRoles.includes(userRole)) {
  //     // Redirect ke halaman Unauthorized
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }
  // --- Akhir Pengecekan Role ---

  // Jika lolos semua cek, render komponen anak yang dibungkusnya
  return children;
}

// Komponen PublicRoute SEKARANG MERENDER CHILDREN
export function PublicRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <AuthLoading />;
  }

  const isAuth = !!token;

  if (isAuth) {
    // Redirect ke dashboard jika loading selesai & ada token
    return <Navigate to="/dashboard" replace />;
  }

  // Jika lolos semua cek (tidak loading, tidak auth), render komponen anak
  return children;
}
