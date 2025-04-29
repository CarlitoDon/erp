// src/pages/Marketplace.jsx
import React from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function Marketplace() {
  const location = useLocation();
  const navigate = useNavigate();

  let currentTab = '/sales/marketplace';
  if (location.pathname.startsWith('/sales/marketplace/input-order')) currentTab = '/sales/marketplace/input-order';
  else if (location.pathname.startsWith('/sales/marketplace/settings')) currentTab = '/sales/marketplace/settings';
  else if (location.pathname.startsWith('/sales/marketplace/products')) currentTab = '/sales/marketplace/products';
  else if (location.pathname.startsWith('/sales/marketplace/analytics')) currentTab = '/sales/marketplace/analytics';
  else if (location.pathname.startsWith('/sales/marketplace/integration')) currentTab = '/sales/marketplace/integration';
  else currentTab = '/sales/marketplace';


  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };


  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Manajemen Marketplace
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Pantau dan kelola semua aktivitas toko online Anda di berbagai marketplace.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Navigasi Marketplace">
          <Tab label="Overview" value="/sales/marketplace" />
          <Tab label="Input Order" value="/sales/marketplace/input-order" />
          <Tab label="Pengaturan Toko" value="/sales/marketplace/settings" />
          <Tab label="Produk" value="/sales/marketplace/products" />
          <Tab label="Analitik" value="/sales/marketplace/analytics" />
          <Tab label="Integrasi" value="/sales/marketplace/integration" />
        </Tabs>
      </Box>

      <Paper elevation={0} sx={{ p: 0 }}>
        <Outlet />
      </Paper>

    </Container>
  );
}

export default Marketplace;