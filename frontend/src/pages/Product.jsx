import React from "react";
import { Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom"; // Untuk navigasi

function Product() {
  return (
    <Container>
      <Outlet>
      <Typography variant="h4" gutterBottom>
        Product Page
      </Typography>
      <Typography variant="body1">
        Welcome to the Product page. This is a placeholder for future content.
      </Typography>
      </Outlet>
    </Container>
  );
}

export default Product;