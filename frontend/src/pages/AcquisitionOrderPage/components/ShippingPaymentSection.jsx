// src/pages/AcquisitionOrderPage/components/ShippingPaymentSection.jsx
import React from "react";
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
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

// Definisikan opsi metode pembayaran di sini agar mudah dikelola
const paymentMethodOptions = [
  { value: "transfer_bank", label: "Transfer Bank" },
  { value: "cod", label: "Cash on Delivery (COD)" },
  { value: "e-wallet", label: "E-Wallet" },
  { value: "virtual_account", label: "Virtual Account" },
  // Tambahkan opsi lain jika perlu
];

const ShippingPaymentSection = ({
  shippingProviderId,
  shippingProviders, // Array of { id, name }
  onShippingProviderChange, // Handler untuk event change Select jasa kirim
  paymentMethod,
  onPaymentMethodChange, // Handler untuk event change Select metode bayar
}) => {
  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
            bgcolor: "#f9f9f9",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          {/* Gunakan ikon yang lebih relevan jika perlu */}
          <LocalShippingIcon sx={{ mr: 1.5, color: "#3f51b5" }} />
          <Typography variant="h6" fontWeight="600">
            Jasa Pengiriman & Pembayaran
          </Typography>
        </Box>

        {/* Konten */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <LocalShippingIcon
                  sx={{ mr: 1.5, color: "#3f51b5", fontSize: 20 }}
                />
                <Typography variant="subtitle1" fontWeight="600">
                  Metode Pengiriman
                </Typography>
              </Box>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="shipping-provider-label">
                  Pilih Jasa Kirim
                </InputLabel>
                <Select
                  labelId="shipping-provider-label"
                  id="shipping-provider-select"
                  value={shippingProviderId || ""} // Pastikan ada nilai default string kosong
                  label="Pilih Jasa Kirim *" // Label harus cocok dengan InputLabel
                  onChange={onShippingProviderChange} // Panggil handler dari parent
                  sx={{ borderRadius: 1.5 }}
                >
                  {(shippingProviders || []).map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </MenuItem>
                  ))}
                  {(!shippingProviders || shippingProviders.length === 0) && (
                    <MenuItem disabled>Memuat jasa kirim...</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Kolom Pembayaran */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {/* Setengah lebar di layar medium */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PaymentIcon
                  sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                />
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
                  value={paymentMethod || ""} // Pastikan ada nilai default string kosong
                  label="Metode Pembayaran (Opsional)" // Sesuaikan label
                  onChange={onPaymentMethodChange} // Panggil handler dari parent
                  sx={{ borderRadius: 1.5 }}
                >
                  {/* Tambahkan MenuItem default */}
                  <MenuItem value="">
                    <em>Tidak Ditentukan</em>
                  </MenuItem>
                  {paymentMethodOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ShippingPaymentSection;
