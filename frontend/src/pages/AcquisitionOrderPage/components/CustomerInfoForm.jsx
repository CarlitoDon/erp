// src/pages/AcquisitionOrderPage/components/CustomerInfoForm.jsx
import React from "react";
import {
  TextField,
  FormControl,
  Grid, // Pastikan import Grid dari '@mui/material/Grid' (bukan GridLegacy)
  Typography,
  Box,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const CustomerInfoForm = ({
  customerData,
  onCustomerChange,
  // --- Props Baru ---
  isPhoneNumberValid, // null, true, atau false
  phoneNumberError, // Pesan error jika isPhoneNumberValid false
  isPhoneNumberChecking, // Boolean untuk loading
  // --- Akhir Props Baru ---
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Validasi awalan '0'
    if (name === "phone") {
      if (value.startsWith("0") && value.length > 0) {
        return;
      }
    }
    onCustomerChange(name, value);
  };

  // Tentukan warna border berdasarkan status validasi
  const getPhoneNumberBorderColor = () => {
    if (isPhoneNumberChecking) {
      return "primary"; // Atau 'info' untuk warna biru muda
    }
    if (isPhoneNumberValid === true) {
      return "success"; // Hijau jika valid
    }
    if (isPhoneNumberValid === false) {
      return "error"; // Merah jika tidak valid
    }
    return undefined; // Default Material-UI jika belum divalidasi
  };

  // Tentukan pesan bantuan
  const getPhoneNumberHelperText = () => {
    if (isPhoneNumberChecking) {
      return "Memeriksa ketersediaan nomor...";
    }
    if (phoneNumberError) {
      return phoneNumberError;
    }
    if (isPhoneNumberValid === true) {
      return "Nomor telepon tersedia!";
    }
    return "Masukkan nomor telepon tanpa awalan 0"; // Pesan default
  };

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header Card */}
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
          <PersonIcon sx={{ mr: 1.5, color: "#3f51b5" }} />
          <Typography variant="h6" fontWeight="600">
            Informasi Customer
          </Typography>
        </Box>

        {/* Konten Form */}
        <Box sx={{ p: 3 }}>
          {/* Nama Lengkap */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Nama Lengkap Customer"
              name="name"
              value={customerData.name || ""}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 1.5 } }}
            />
          </FormControl>

          {/* Telepon & Email */}
          <Grid container spacing={2}>
            {/* Telepon */}
            {/* Hapus 'item' prop, gunakan 'size' prop */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nomor Telepon Customer"
                  name="phone"
                  value={customerData.phone || ""}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="81234567890"
                  type="tel" // Pastikan tipe input adalah tel
                  // --- Props Modifikasi ---
                  error={isPhoneNumberValid === false} // Merah jika tidak valid
                  helperText={getPhoneNumberHelperText()} // Tampilkan pesan
                  color={getPhoneNumberBorderColor()} // Atur warna border
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ mr: 1, color: "text.secondary" }}>+62</Box>
                      </InputAdornment>
                    ),
                    endAdornment: ( // Tampilkan loading spinner
                      <InputAdornment position="end">
                        {isPhoneNumberChecking && (
                          <CircularProgress size={20} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            {/* Email */}
            {/* Hapus 'item' prop, gunakan 'size' prop */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Email Customer (Opsional)"
                  name="email"
                  type="email"
                  value={customerData.email || ""}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Alamat Lengkap */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Alamat Lengkap Customer *"
              name="address"
              multiline
              rows={3}
              value={customerData.address || ""}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 1.5 } }}
            />
          </FormControl>

          {/* Alamat Detail */}
          <Grid container spacing={2}>
            {/* Provinsi */}
            {/* Hapus 'item' prop, gunakan 'size' prop */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Provinsi"
                  name="province"
                  value={customerData.province || ""}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>
            </Grid>
            {/* Kota/Kabupaten */}
             {/* Hapus 'item' prop, gunakan 'size' prop */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Kota/Kabupaten *"
                  name="city"
                  value={customerData.city || ""}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>
            </Grid>
            {/* Kecamatan */}
             {/* Hapus 'item' prop, gunakan 'size' prop */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Kecamatan *"
                  name="district"
                  value={customerData.district || ""}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>
            </Grid>
            {/* Desa/Kelurahan */}
             {/* Hapus 'item' prop, gunakan 'size' prop */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Desa/Kelurahan *"
                  name="village"
                  value={customerData.village || ""}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>
            </Grid>
            {/* Kode Pos */}
             {/* Hapus 'item' prop, gunakan 'size' prop */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Kode Pos (Opsional)"
                  name="postalCode"
                  value={customerData.postalCode || ""}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
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