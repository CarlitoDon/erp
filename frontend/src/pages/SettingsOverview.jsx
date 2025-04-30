// src/pages/SettingsOverview.jsx (Contoh Sangat Sederhana)
import React from 'react';
import { Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Untuk navigasi
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ApiIcon from '@mui/icons-material/Api';
import NotificationsIcon from '@mui/icons-material/Notifications';

function SettingsOverview() {
  return (
    <div>
      <Typography variant="h5" gutterBottom fontWeight="medium">
        Pengaturan Umum
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Kelola profil bisnis, pengguna, integrasi, dan notifikasi Anda.
      </Typography>

      <Grid container spacing={3}>
        {/* Kartu Navigasi Cepat */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea component={RouterLink} to="/settings/profile">
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <AccountBoxIcon color="primary" fontSize="large" />
                 <Typography variant="h6">Profil Bisnis</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
           <Card>
             <CardActionArea component={RouterLink} to="/settings/users">
               <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ManageAccountsIcon color="primary" fontSize="large" />
                  <Typography variant="h6">Manajemen Pengguna</Typography>
               </CardContent>
             </CardActionArea>
           </Card>
        </Grid>
         <Grid item xs={12} sm={6} md={4}>
           <Card>
             <CardActionArea component={RouterLink} to="/settings/api">
               <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ApiIcon color="primary" fontSize="large" />
                  <Typography variant="h6">Integrasi API</Typography>
               </CardContent>
             </CardActionArea>
           </Card>
        </Grid>
         <Grid item xs={12} sm={6} md={4}>
           <Card>
             <CardActionArea component={RouterLink} to="/settings/notifications">
               <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NotificationsIcon color="primary" fontSize="large" />
                  <Typography variant="h6">Notifikasi</Typography>
               </CardContent>
             </CardActionArea>
           </Card>
        </Grid>
        {/* Tambahkan kartu lain jika perlu */}
      </Grid>
    </div>
  );
}

export default SettingsOverview;