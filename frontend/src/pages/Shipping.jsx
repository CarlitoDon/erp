// src/pages/Shipping.jsx
import React from "react";
import { Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

function Shipping() {
  return (
    <Container sx={{ mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Shipping Management
      </Typography>
      <Outlet />
    </Container>
  );
}

export default Shipping;