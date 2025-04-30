import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Menggunakan useNavigate untuk navigasi

function DashboardCard({ title, value, to }) {
  const navigate = useNavigate(); // Hook untuk navigasi

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6, // Efek hover dengan shadow lebih kuat
        },
      }}
      onClick={() => navigate(to)} // Navigasi langsung menggunakan 'to'
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
