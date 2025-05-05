// src/pages/AcquisitionOrderPage/components/OrderItemRow.jsx
import React from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  Grid, // Pastikan import dari @mui/material/Grid
  Typography,
  Box,
  Paper, // Import Paper
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const OrderItemRow = ({
  item,
  index,
  orderItemsCount,
  productOptions,
  productLoading,
  onItemChange, // Menerima (index, field, value)
  onRemoveItem, // Menerima (index)
  onProductInputChange, // Menerima (event, newInputValue)
}) => {
  // Handler untuk Autocomplete selection
  const handleProductChange = (event, newValue) => {
    onItemChange(index, "product", newValue); // Kirim 'product' dan objek produk baru
  };

  // Handler untuk TextField biasa (Quantity, Price, Note)
  const handleTextFieldChange = (event) => {
    const { name, value } = event.target;
    onItemChange(index, name, value); // Kirim index, nama field, dan value baru
  };

  return (
    // Gunakan Paper sebagai root, tiru styling lama
    <Paper
      elevation={0}
      key={index}
      sx={{
        p: 2,
        borderRadius: 2,
        width: "100%",
        mb: 2,
        border: "1px solid #e8e8e8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Aksen visual kiri */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "6px",
          height: "100%",
          bgcolor: "#3f51b5",
        }}
      />

      <Box sx={{ pl: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Chip
            label={`Produk ${index + 1}`}
            size="small"
            sx={{
              bgcolor: "#e8eaf6",
              color: "#3f51b5",
              fontWeight: "bold",
              mr: 2,
            }}
          />
          {orderItemsCount > 1 && (
            <IconButton
              onClick={() => onRemoveItem(index)} // Panggil onRemoveItem dengan index
              color="error"
              size="small"
              sx={{ ml: "auto" }}
              aria-label={`Hapus Produk ${index + 1}`}
            >
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </Box>

        {/* Grid untuk input fields */}
        <Grid container spacing={2} alignItems="flex-start">
          {/* Kolom Autocomplete Produk */}
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
            {" "}
            {/* Ukuran dari kode lama (md/lg disamakan) */}
            <Autocomplete
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  height: "56px", // sesuaikan dengan TextField lain
                  boxSizing: "border-box",
                },
                "& .MuiAutocomplete-inputRoot": {
                  padding: 0, // hilangkan padding ekstra
                },
                "& input": {
                  padding: "10.5px 14px", // samakan padding TextField size small
                },
              }}
              options={productOptions || []}
              getOptionLabel={(option) =>
                option ? `${option.sku} - ${option.name}` : ""
              }
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              value={item.product || null} // Gunakan item.product
              onInputChange={onProductInputChange} // Teruskan handler input change
              onChange={handleProductChange} // Gunakan handler product change
              loading={productLoading}
              loadingText="Mencari produk..."
              noOptionsText={"Produk tidak ditemukan"} // Sederhanakan
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cari Produk (SKU/Nama)"
                  variant="outlined"
                  size="small" // <-- Tambahkan size small seperti di kode lama
                  required
                  // error={false} // Sebaiknya hapus logic error sementara
                  InputProps={{
                    ...params.InputProps,
                    sx: { borderRadius: 1.5 }, // Dari kode lama
                    endAdornment: (
                      <>
                        {productLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* Kolom Kuantitas */}
          <Grid size={{ xs: 12, sm: 3, md: 2 }}>
            <FormControl fullWidth>
              <TextField
                label="Kuantitas"
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={handleTextFieldChange} // Gunakan handler generik
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 }, // Dari kode lama
                  inputProps: { min: 1 }, // Tambahkan validasi min
                }}
              />
            </FormControl>
          </Grid>

          {/* Kolom Harga */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            {" "}
            {/* Ukuran dari kode lama */}
            <FormControl fullWidth>
              <TextField
                label="Harga per Item (Rp)"
                name="price" // Penting untuk handleTextFieldChange
                type="number"
                value={item.price}
                onChange={handleTextFieldChange} // Gunakan handler generik
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 }, // Dari kode lama
                  inputProps: { step: "any" }, // Izinkan desimal
                }}
              />
            </FormControl>
          </Grid>

          {/* Kolom Catatan Produk */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            {" "}
            {/* Ukuran dari kode lama */}
            <FormControl fullWidth>
              <TextField
                label="Catatan Produk (Opsional)"
                name="note" // Penting untuk handleTextFieldChange
                value={item.note}
                onChange={handleTextFieldChange} // Gunakan handler generik
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 }, // Dari kode lama
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Tampilkan Subtotal jika valid (sama seperti kode lama) */}
        {item.quantity > 0 && item.price > 0 && (
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal: Rp{" "}
              {(
                parseFloat(item.price) * parseInt(item.quantity)
              ).toLocaleString("id-ID")}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default OrderItemRow;
