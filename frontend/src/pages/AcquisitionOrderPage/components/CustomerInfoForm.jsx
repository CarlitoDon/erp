// src/pages/AcquisitionOrderPage/components/CustomerInfoForm.jsx
import React from 'react';
import {
  TextField,
  FormControl,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

// Komponen ini menerima data customer dan handler perubahan sebagai props
const CustomerInfoForm = ({ customerData, onCustomerChange }) => {

  // Handler generik untuk semua input field dalam form ini
  const handleChange = (event) => {
    const { name, value } = event.target;
    onCustomerChange(name, value); // Memanggil fungsi callback dari parent
  };

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'visible', // Atau 'hidden' jika tidak ada elemen yang keluar
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header Card */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            bgcolor: '#f9f9f9',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          <PersonIcon sx={{ mr: 1.5, color: '#3f51b5' }} />
          <Typography variant="h6" fontWeight="600">
            Informasi Customer
          </Typography>
        </Box>

        {/* Konten Form */}
        <Box sx={{ p: 3 }}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Nama Lengkap Customer"
              name="name" // <-- Nama field harus sesuai key di state parent
              value={customerData.name || ''} // Ambil value dari props
              onChange={handleChange} // Gunakan handler internal
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
            />
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nomor Telepon (+62)"
                  name="phone" // <-- Nama field
                  value={customerData.phone || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                    // startAdornment tidak perlu '+62' jika input diharapkan tanpa itu
                    // startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>+62</Box>,
                  }}
                  placeholder="Contoh: 81234567890" // Beri contoh format
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Email Customer (Opsional)"
                  name="email" // <-- Nama field
                  type="email" // Gunakan type email untuk validasi browser dasar
                  value={customerData.email || ''}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Alamat Lengkap Customer *"
              name="address" // <-- Nama field
              multiline
              rows={3}
              value={customerData.address || ''}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1.5 },
              }}
            />
          </FormControl>

          {/* Input Alamat Detail (Provinsi, Kota, dst.) */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Provinsi *"
                  name="province" // <-- Nama field
                  value={customerData.province || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Kota/Kabupaten *"
                  name="city" // <-- Nama field
                  value={customerData.city || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Kecamatan *"
                  name="district" // <-- Nama field
                  value={customerData.district || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Desa/Kelurahan *"
                  name="village" // <-- Nama field
                  value={customerData.village || ''}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Kode Pos (Opsional)"
                  name="postalCode" // <-- Nama field
                  value={customerData.postalCode || ''}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoForm;