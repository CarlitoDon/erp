// src/pages/Warehouse.jsx
import React from "react";
import { Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

function Warehouse() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Warehouse Management
      </Typography>
      <Outlet />
    </Container>
  );
}

export default Warehouse;