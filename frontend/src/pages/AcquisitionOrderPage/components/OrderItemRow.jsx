// src/pages/AcquisitionOrderPage/components/OrderItemRow.jsx
import React from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  CircularProgress,
  Paper,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const OrderItemRow = ({
  item,
  index,
  productOptions,
  productLoading,
  productSearchTerm,
  onItemChange,
  onRemoveItem,
  onProductInputChange,
  orderItemsCount,
}) => {
  // Menghitung total dari item ini
  const calculateItemTotal = () => {
    if (item.quantity > 0 && item.price > 0) {
      return parseFloat(item.price) * parseInt(item.quantity);
    }
    return 0;
  };

  // Format currency menggunakan Intl.NumberFormat untuk konsistensi
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  return (
    <Paper
      elevation={0}
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
      {/* Aksen visual di sisi kiri */}
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
        {/* Header dengan label produk dan tombol hapus */}
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
              onClick={() => onRemoveItem(index)} // Pastikan 'index' ini benar
              color="error"
              size="small"
              sx={{ ml: "auto" }}
              aria-label={`Hapus Produk ${index + 1}`}
            >
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </Box>

        {/* Form fields dalam Grid layout */}
        <Grid container spacing={2} alignItems="flex-start">
          {" "}
          <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} minWidth={"225px"}>
            <FormControl fullWidth>
              <Autocomplete
                fullWidth
                sx={{
                  "& .MuiInputBase-root": {
                    height: "56px",
                    boxSizing: "border-box",
                  },
                  "& .MuiAutocomplete-inputRoot": {
                    padding: 0,
                  },
                  "& input": {
                    padding: "10.5px 14px",
                  },
                }}
                options={productOptions || []}
                getOptionLabel={(option) =>
                  option ? `${option.sku} - ${option.name}` : ""
                }
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                value={item.product || null}
                onInputChange={onProductInputChange}
                onChange={(event, newValue) => {
                  onItemChange(index, "product", newValue);
                }}
                loading={productLoading}
                loadingText="Mencari produk..."
                noOptionsText={
                  productSearchTerm && productSearchTerm.length < 2
                    ? "Ketik min. 2 karakter"
                    : "Produk tidak ditemukan"
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cari Produk (SKU/Nama)"
                    variant="outlined"
                    size="medium"
                    required
                    error={false}
                    InputProps={{
                      ...params.InputProps,
                      sx: { borderRadius: 1.5 },
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
            </FormControl>
          </Grid>
          {/* Kolom Kuantitas */}
          <Grid
            size={{ xs: 12, sm: 3, md: 2 }}
            minWidth={"60px"}
            maxWidth={"120px"}
          >
            <FormControl fullWidth>
              <TextField
                label="Kuantitas"
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  onItemChange(index, e.target.name, e.target.value)
                }
                required
                variant="outlined"
                size="medium"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                  inputProps: { min: 1 },
                }}
              />
            </FormControl>
          </Grid>
          {/* Kolom Harga */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }} maxWidth={"120px"}>
            <FormControl fullWidth>
              <TextField
                label="Harga per Item (Rp)"
                name="price"
                type="number"
                value={item.price}
                onChange={(e) =>
                  onItemChange(index, e.target.name, e.target.value)
                }
                required
                variant="outlined"
                size="medium"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                  inputProps: { step: "any" },
                }}
              />
            </FormControl>
          </Grid>
          {/* Kolom Catatan */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }} minWidth={"320px"}>
            <FormControl fullWidth>
              <TextField
                label="Catatan Produk (Opsional)"
                name="note"
                value={item.note || ""}
                onChange={(e) =>
                  onItemChange(index, e.target.name, e.target.value)
                }
                variant="outlined"
                size="medium"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Subtotal jika item valid */}
        {item.quantity > 0 && item.price > 0 && (
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal: Rp {formatCurrency(calculateItemTotal())}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default OrderItemRow;
