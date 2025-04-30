// src/pages/Settings.jsx (Versi Layout)
import React from "react";
import { Box, Container, Typography } from "@mui/material"; // Container mungkin lebih cocok di sini
import { Outlet } from "react-router-dom";

function Settings() {
  return (
    // Gunakan Container untuk konsistensi layout halaman utama
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Judul Bagian Settings (Persisten untuk semua sub-halaman) */}
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Pengaturan
      </Typography>

      {/* Outlet untuk merender SettingsOverview atau UserManagementPage, dll. */}
      <Box sx={{ mt: 3 }}> {/* Beri sedikit margin atas untuk konten */}
         <Outlet />
      </Box>
    </Container>
  );
}

export default Settings;