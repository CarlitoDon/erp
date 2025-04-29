// src/pages/MarketplaceOverview.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

// Anda perlu mengambil data ini dari state global atau API nantinya
const dashboardData = {
  totalOrdersToday: 25,
  totalRevenueToday: 5250000,
  pendingOrders: 15,
  activeConnections: 5,
};

function MarketplaceOverview() {
  return (
    <Grid container spacing={3}>
      {/* Widget Order Hari Ini */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Order Hari Ini</Typography>
            <Typography variant="h5">{dashboardData.totalOrdersToday}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Widget Penjualan Hari Ini */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Penjualan Hari Ini</Typography>
            <Typography variant="h5">Rp {dashboardData.totalRevenueToday.toLocaleString('id-ID')}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Widget Perlu Diproses */}
       <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Perlu Diproses</Typography>
            <Typography variant="h5">{dashboardData.pendingOrders}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Widget Koneksi Aktif */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>Koneksi Aktif</Typography>
            <Typography variant="h5">{dashboardData.activeConnections}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default MarketplaceOverview;