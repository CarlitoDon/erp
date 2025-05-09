// src/components/AcquisitionOrder/CustomerInfo.jsx
import React from "react";
import { TextField, FormControl, Grid, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const CustomerInfo = ({
  newCustomerName,
  setNewCustomerName,
  newCustomerPhone,
  setNewCustomerPhone,
  newCustomerEmail,
  setNewCustomerEmail,
  newCustomerAddress,
  setNewCustomerAddress,
  newCustomerProvince,
  setNewCustomerProvince,
  newCustomerCity,
  setNewCustomerCity,
  newCustomerDistrict,
  setNewCustomerDistrict,
  newCustomerVillage,
  setNewCustomerVillage,
  newCustomerPostalCode,
  setNewCustomerPostalCode,
}) => {
  return (
    <React.Fragment>
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

      <Box sx={{ p: 3 }}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nama Lengkap Customer"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            required
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 1.5 },
            }}
          />
        </FormControl>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }} >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Nomor Telepon Customer"
                name="newCustomerPhone"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                  startAdornment: (
                    <Box sx={{ mr: 1, color: "text.secondary" }}>+62</Box>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Email Customer (Opsional)"
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
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
            label="Alamat Customer *"
            multiline
            rows={3}
            value={newCustomerAddress}
            onChange={(e) => setNewCustomerAddress(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 1.5 },
            }}
          />
        </FormControl>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }} >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Provinsi"
                value={newCustomerProvince}
                onChange={(e) => setNewCustomerProvince(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }} >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Kota/Kabupaten *"
                value={newCustomerCity}
                onChange={(e) => setNewCustomerCity(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }} >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Kecamatan *"
                value={newCustomerDistrict}
                onChange={(e) => setNewCustomerDistrict(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }} >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Desa/Kelurahan *"
                value={newCustomerVillage}
                onChange={(e) => setNewCustomerVillage(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }} >
            <FormControl fullWidth margin="normal">
              <TextField
                label="Kode Pos (Opsional)"
                value={newCustomerPostalCode}
                onChange={(e) => setNewCustomerPostalCode(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default CustomerInfo;
