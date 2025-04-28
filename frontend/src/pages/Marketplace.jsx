import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

function Marketplace() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Marketplace Page
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Welcome to the Marketplace page. This is a placeholder for future content.
        </Typography>

        {/* Area buat child route */}
        <Box sx={{ mt: 4 }}>
          <Outlet />
        </Box>
      </Paper>
    </Container>
  );
}

export default Marketplace;
