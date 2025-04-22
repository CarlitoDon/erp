import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Untuk navigasi jika perlu

function DashboardCard({ title, value, to }) {
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
      onClick={() => to && window.location.replace(to)} // Jika ada 'to', pindah halaman
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
