import React from "react";
import { Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

function Sales() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Sales Page
      </Typography>
      <Typography variant="body1">
        Welcome to the Sales page. This is a placeholder for future content.
      </Typography>
      <Outlet /> {/* Render child routes here */}
    </Container>
  );
}

export default Sales;