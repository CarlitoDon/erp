// src/pages/AcquisitionOrderPage/components/ShippingPaymentSection.jsx
import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  InputAdornment, // Jika masih digunakan untuk Rp
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Definisikan opsi metode pembayaran di sini agar mudah dikelola
const paymentMethodOptions = [
  { value: 'transfer_bank', label: 'Transfer Bank' },
  { value: 'cod', label: 'Cash on Delivery (COD)' },
  { value: 'e-wallet', label: 'E-Wallet' },
  { value: 'virtual_account', label: 'Virtual Account' },
  // Tambahkan opsi lain jika perlu
];

const ShippingPaymentSection = ({
  shippingProviderId,
  shippingProviders,       // Array of { id, name }
  onShippingProviderChange, // Handler untuk event change Select jasa kirim
  paymentMethod,
  onPaymentMethodChange,   // Handler untuk event change Select metode bayar
  totalPayment,            // Nilai input total bayar
  onTotalPaymentChange,    // Handler untuk event change input total bayar
}) => {
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
          {/* Gunakan ikon yang lebih relevan jika perlu */}
          <LocalShippingIcon sx={{ mr: 1.5, color: '#3f51b5' }} />
          <Typography variant="h6" fontWeight="600">
            Jasa Pengiriman & Pembayaran
          </Typography>
        </Box>

        {/* Konten */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Kolom Jasa Pengiriman */}
            <Grid item xs={12} md={6}> {/* Setengah lebar di layar medium */}
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {/* Icon kecil di judul bagian */}
                    <LocalShippingIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight="600">
                    Metode Pengiriman
                    </Typography>
               </Box>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="shipping-provider-label">
                  Pilih Jasa Kirim *
                </InputLabel>
                <Select
                  labelId="shipping-provider-label"
                  id="shipping-provider-select"
                  value={shippingProviderId || ''} // Pastikan ada nilai default string kosong
                  label="Pilih Jasa Kirim *" // Label harus cocok dengan InputLabel
                  onChange={onShippingProviderChange} // Panggil handler dari parent
                  sx={{ borderRadius: 1.5 }}
                >
                  {/* Tambahkan MenuItem default jika diperlukan */}
                  {/* <MenuItem value="" disabled><em>Pilih Jasa Kirim</em></MenuItem> */}
                  {(shippingProviders || []).map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </MenuItem>
                  ))}
                  {/* Tampilkan pesan jika provider kosong */}
                  {(!shippingProviders || shippingProviders.length === 0) && (
                      <MenuItem disabled>Memuat jasa kirim...</MenuItem>
                      // Atau tampilkan pesan error jika fetch gagal
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Kolom Pembayaran */}
            <Grid item xs={12} md={6}> {/* Setengah lebar di layar medium */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PaymentIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight="600">
                    Metode Pembayaran
                    </Typography>
                </Box>

              {/* Dropdown Metode Pembayaran */}
              <FormControl fullWidth margin="normal">
                {/* Label ID harus unik */}
                <InputLabel id="payment-method-label">
                  Metode Pembayaran (Opsional)
                </InputLabel>
                <Select
                  labelId="payment-method-label"
                  id="payment-method-select"
                  value={paymentMethod || ''} // Pastikan ada nilai default string kosong
                  label="Metode Pembayaran (Opsional)" // Sesuaikan label
                  onChange={onPaymentMethodChange} // Panggil handler dari parent
                  sx={{ borderRadius: 1.5 }}
                >
                  {/* Tambahkan MenuItem default */}
                   <MenuItem value=""><em>Tidak Ditentukan</em></MenuItem>
                  {paymentMethodOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Input Total Pembayaran (Opsional) */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nominal Pembayaran (Opsional)"
                  id="total-payment-input"
                  type="number"
                  value={totalPayment}
                  onChange={onTotalPaymentChange} // Panggil handler dari parent
                  variant="outlined"
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                    startAdornment: (
                      // Tampilkan 'Rp' jika diperlukan
                      <InputAdornment position="start">Rp</InputAdornment>
                    ),
                     inputProps: { step: "any" } // Izinkan desimal
                  }}
                   placeholder='Contoh: 50000'
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ShippingPaymentSection;