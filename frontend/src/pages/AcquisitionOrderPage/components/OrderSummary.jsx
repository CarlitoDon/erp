// src/pages/AcquisitionOrderPage/components/OrderSummary.jsx
import React from 'react';
import {
  Typography,
  Box,
  Grid,
} from '@mui/material';

// Helper function untuk mendapatkan nama jasa kirim dari ID
const getShippingProviderName = (id, providers) => {
  if (!id || !providers || providers.length === 0) return '-';
  // Pastikan ID dibandingkan sebagai tipe data yang sama (misal, number)
  const provider = providers.find((p) => p.id === parseInt(id, 10));
  return provider ? provider.name : 'Tidak Diketahui';
};

// Helper map untuk nama metode pembayaran
const getPaymentMethodName = (value) => {
  if (!value) return '-';
  const paymentMethodsMap = {
    transfer_bank: 'Transfer Bank',
    cod: 'Cash on Delivery (COD)',
    'e-wallet': 'E-Wallet',
    virtual_account: 'Virtual Account',
  };
  return paymentMethodsMap[value] || value; // Return value asli jika tidak ada di map
};

const OrderSummary = ({
  orderItems,             // Array item pesanan
  shippingProviderId,     // ID jasa kirim terpilih
  shippingProviders,      // Master data jasa kirim
  paymentMethod,          // Value metode pembayaran terpilih
  calculatedTotalString,  // String total harga yang sudah diformat
}) => {

  // Kalkulasi sederhana bisa di sini
  const totalItemTypes = orderItems.length;
  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + parseInt(item.quantity || 0),
    0
  );

  const shippingName = getShippingProviderName(shippingProviderId, shippingProviders);
  const paymentName = getPaymentMethodName(paymentMethod);

  return (
    <Box
      sx={{
        mt: 4, // Beri jarak dari komponen sebelumnya
        mb: 4, // Beri jarak ke tombol submit
        p: { xs: 2, sm: 3 }, // Padding responsif
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        bgcolor: '#f9fafe', // Warna latar sedikit beda
      }}
    >
      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Ringkasan Order
      </Typography>

      <Grid container spacing={{ xs: 1, sm: 2 }}> {/* Spasi antar grid */}
        {/* Kolom Kiri */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}> {/* Jarak antar teks */}
            <Typography variant="body2" color="text.secondary">
              Jumlah Jenis Produk: <Typography component="span" fontWeight="medium" color="text.primary">{totalItemTypes}</Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Kuantitas: <Typography component="span" fontWeight="medium" color="text.primary">{totalQuantity} item</Typography>
            </Typography>
             <Typography variant="body2" color="text.secondary">
              Jasa Pengiriman: <Typography component="span" fontWeight="medium" color="text.primary">{shippingName}</Typography>
            </Typography>
          </Box>
        </Grid>

        {/* Kolom Kanan */}
        <Grid item xs={12} sm={6}>
           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, alignItems: { xs: 'flex-start', sm: 'flex-end' } }}> {/* Rata kanan di sm */}
             <Typography variant="body2" color="text.secondary">
              Metode Pembayaran: <Typography component="span" fontWeight="medium" color="text.primary">{paymentName}</Typography>
            </Typography>
            {/* Total Order */}
            <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}> {/* Beri margin atas */}
              Total Order: <Typography component="span" sx={{ color: 'primary.main' }}>Rp {calculatedTotalString}</Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderSummary;