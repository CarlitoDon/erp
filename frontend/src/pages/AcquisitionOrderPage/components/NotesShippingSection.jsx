// src/pages/AcquisitionOrderPage/components/NotesShippingSection.jsx
import React from 'react';
import {
  TextField,
  FormControl,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Checkbox,
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import HomeIcon from '@mui/icons-material/Home'; // Untuk ikon alamat pengiriman

// Komponen ini menerima state dan handler terkait catatan & alamat kirim
const NotesShippingSection = ({
  buyerNote,
  sellerNote,
  onNoteChange, // Fungsi callback (noteType: 'buyer'|'seller', value: string)
  isDifferentShippingAddress,
  onToggleDifferentAddress, // Fungsi callback untuk perubahan checkbox
  shippingAddress, // Objek state alamat pengiriman
  onShippingAddressChange, // Fungsi callback untuk perubahan field alamat kirim
}) => {

  // Handler khusus untuk perubahan field alamat pengiriman
  const handleShippingAddressFieldChange = (event) => {
    const { name, value } = event.target;
    onShippingAddressChange(event); // Teruskan event asli atau (name, value)
                                     // Tergantung implementasi di parent
                                     // Jika parent mengharapkan event: onShippingAddressChange(event)
                                     // Jika parent mengharapkan name, value: onShippingAddressChange(name, value)
                                     // Kita asumsikan parent mengharapkan event (sesuai contoh awal)
  };

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
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
          <NoteIcon sx={{ mr: 1.5, color: '#3f51b5' }} />
          <Typography variant="h6" fontWeight="600">
            Catatan Order & Pengiriman
          </Typography>
        </Box>

        {/* Konten */}
        <Box sx={{ p: 3 }}>
          {/* Grid untuk Catatan Pembeli dan Penjual */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}> {/* Lebar sama di layar medium ke atas */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Catatan Pembeli (Opsional)"
                  multiline
                  rows={3}
                  value={buyerNote}
                  onChange={(e) => onNoteChange('buyer', e.target.value)} // Kirim type 'buyer'
                  variant="outlined"
                  placeholder="Masukkan catatan khusus dari pembeli..."
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}> {/* Lebar sama di layar medium ke atas */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Catatan Penjual (Internal, Opsional)"
                  multiline
                  rows={3}
                  value={sellerNote}
                  onChange={(e) => onNoteChange('seller', e.target.value)} // Kirim type 'seller'
                  variant="outlined"
                  placeholder="Catatan internal untuk tim Anda..."
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Checkbox Alamat Pengiriman Berbeda */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 3, // Beri jarak dari field catatan
              p: 1.5, // Padding lebih kecil
              bgcolor: '#f5f5f5',
              borderRadius: 2,
            }}
          >
            <Checkbox
              checked={isDifferentShippingAddress}
              onChange={onToggleDifferentAddress} // Panggil handler dari parent
              sx={{
                color: '#3f51b5',
                '&.Mui-checked': {
                  color: '#3f51b5',
                },
                padding: '4px' // Kecilkan padding checkbox
              }}
              id="different-shipping-address-checkbox" // Tambah ID untuk label
            />
            <Typography component="label" htmlFor="different-shipping-address-checkbox" sx={{ cursor: 'pointer' }}>
              Alamat Pengiriman Berbeda dari Alamat Customer?
            </Typography>
          </Box>

          {/* Form Alamat Pengiriman (Conditional Rendering) */}
          {isDifferentShippingAddress && (
            <Box
              sx={{
                mt: 3,
                p: { xs: 2, sm: 3 }, // Responsive padding
                border: '1px dashed #3f51b5',
                borderRadius: 2,
                bgcolor: '#f5f7ff', // Warna latar sedikit beda
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HomeIcon sx={{ mr: 1.5, color: '#3f51b5' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Detail Alamat Pengiriman
                </Typography>
              </Box>

              {/* Input Nama Penerima */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nama Penerima"
                  name="name" // <-- Nama field harus sesuai key di state shippingAddress
                  value={shippingAddress.name || ''}
                  onChange={handleShippingAddressFieldChange}
                  required // Alamat kirim wajib jika dicentang
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>

              {/* Input Telepon Penerima */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nomor Telepon Penerima (+62)"
                  name="phone" // <-- Nama field
                  value={shippingAddress.phone || ''}
                  onChange={handleShippingAddressFieldChange}
                  required
                  variant="outlined"
                  placeholder="Contoh: 81234567890"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>

              {/* Input Alamat Pengiriman */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Alamat Pengiriman Lengkap"
                  name="address" // <-- Nama field
                  multiline
                  rows={3}
                  value={shippingAddress.address || ''}
                  onChange={handleShippingAddressFieldChange}
                  required
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>

              {/* Grid Alamat Detail Pengiriman */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Provinsi"
                      name="province" // <-- Nama field
                      value={shippingAddress.province || ''}
                      onChange={handleShippingAddressFieldChange}
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Kota/Kabupaten"
                      name="city" // <-- Nama field
                      value={shippingAddress.city || ''}
                      onChange={handleShippingAddressFieldChange}
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Kecamatan"
                      name="district" // <-- Nama field
                      value={shippingAddress.district || ''}
                      onChange={handleShippingAddressFieldChange}
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Desa/Kelurahan"
                      name="village" // <-- Nama field
                      value={shippingAddress.village || ''}
                      onChange={handleShippingAddressFieldChange}
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Kode Pos (Opsional)"
                      name="postalCode" // <-- Nama field
                      value={shippingAddress.postalCode || ''}
                      onChange={handleShippingAddressFieldChange}
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 1.5 } }}
                    />
                  </FormControl>
                </Grid>
              </Grid> {/* End Grid Alamat Detail Pengiriman */}
            </Box>
          )} {/* End Conditional Rendering Form Alamat */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotesShippingSection;