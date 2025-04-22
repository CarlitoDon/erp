//src/pages/NotFound.jsx

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Ganti useHistory dengan useNavigate

function NotFound() {
  const navigate = useNavigate(); // Menggunakan useNavigate untuk navigasi

  const handleBackToDashboard = () => {
    navigate("/dashboard"); // Menggunakan navigate untuk berpindah ke halaman dashboard
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh", // Pastikan konten mengisi seluruh tinggi viewport
        //TODO: masih bisa scroll, coba dihapus
        flexDirection: "column",
        overflow: "hidden", // Mencegah scroll
        margin: 0, // Pastikan tidak ada margin yang menyebabkan scroll
      }}
    >
      <Typography variant="h4" color="textSecondary" sx={{ marginBottom: 2 }}>
        404 - Halaman Tidak Ditemukan
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToDashboard}
      >
        Kembali ke Dashboard
      </Button>
    </Box>
  );
}

export default NotFound;
