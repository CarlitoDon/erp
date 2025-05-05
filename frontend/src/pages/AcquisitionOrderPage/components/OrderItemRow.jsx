// src/pages/AcquisitionOrderPage/components/OrderItemRow.jsx
import React from 'react';
import {
  Autocomplete,
  TextField,
  FormControl,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Komponen ini menerima semua data & handler yang dibutuhkan sebagai props
const OrderItemRow = ({
  item,
  index,
  orderItemsCount, // Untuk menentukan apakah tombol hapus ditampilkan
  productOptions,
  productLoading,
  onItemChange,
  onRemoveItem,
  onProductInputChange, // Handler saat input Autocomplete berubah
}) => {

  // Handler internal untuk menyederhanakan pemanggilan onItemChange
  const handleChange = (field, value) => {
    onItemChange(index, field, value);
  };

  // Handler untuk perubahan input textfield biasa (kuantitas, harga, note)
  const handleTextFieldChange = (event) => {
    const { name, value } = event.target;
    onItemChange(index, name, value); // name akan jadi 'quantity', 'price', atau 'note'
  };


  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        width: '100%',
        mb: 2,
        border: '1px solid #e8e8e8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Aksen visual di kiri */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '100%',
          bgcolor: '#3f51b5', // Sesuaikan warna jika perlu
        }}
      />

      <Box sx={{ pl: 1 }}>
        {/* Header Baris Item */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip
            label={`Produk ${index + 1}`}
            size="small"
            sx={{
              bgcolor: '#e8eaf6',
              color: '#3f51b5',
              fontWeight: 'bold',
              mr: 2,
            }}
          />
          {/* Tampilkan tombol hapus hanya jika ada lebih dari 1 item */}
          {orderItemsCount > 1 && (
            <IconButton
              onClick={() => onRemoveItem(index)}
              color="error"
              size="small"
              sx={{ ml: 'auto' }}
              aria-label={`Hapus Produk ${index + 1}`} // Tambahkan aria-label untuk aksesibilitas
            >
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </Box>

        {/* Grid Input Fields */}
        <Grid container spacing={2} alignItems="flex-start">
          {/* Kolom Autocomplete Produk */}
          <Grid item xs={12} sm={6} md={4} lg={4}> {/* Lebarkan sedikit */}
             <Autocomplete
                fullWidth
                // Atur styling Autocomplete agar konsisten
                sx={{
                    '& .MuiInputBase-root': { height: '56px', boxSizing: 'border-box' },
                    '& .MuiAutocomplete-inputRoot': { paddingRight: '39px !important' }, // Pastikan ada ruang untuk loading/clear
                    '& .MuiOutlinedInput-input': { padding: '16.5px 14px' }, // Sesuaikan padding input
                }}
                options={productOptions || []} // Pastikan options selalu array
                getOptionLabel={(option) => (option ? `${option.sku} - ${option.name}` : '')}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                value={item.product || null} // Pastikan value adalah objek atau null
                onInputChange={onProductInputChange} // Panggil handler dari parent saat user mengetik
                onChange={(event, newValue) => {
                    handleChange('product', newValue); // Handle saat user memilih produk
                }}
                loading={productLoading}
                loadingText="Mencari produk..."
                noOptionsText="Produk tidak ditemukan" // Sesuaikan teks jika perlu
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Cari Produk (SKU/Nama)"
                    variant="outlined"
                    // size="small" // Gunakan size default agar tinggi konsisten
                    required // Tetap tampilkan asterisk
                    InputProps={{
                        ...params.InputProps,
                        sx: { borderRadius: 1.5 },
                        endAdornment: (
                            <>
                            {productLoading ? (
                                <CircularProgress color="inherit" size={20} sx={{ marginRight: '9px' }}/> // Beri margin jika loading
                            ) : null}
                            {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
                )}
                // Filter options di sisi client (optional, bisa di-handle server)
                // filterOptions={(x) => x} // Jika search sepenuhnya di server
             />
          </Grid>

          {/* Kolom Kuantitas */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth>
              <TextField
                label="Kuantitas"
                name="quantity" // Penting untuk handleTextFieldChange
                type="number"
                value={item.quantity}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                  inputProps: { min: 1 } // Minimal kuantitas 1
                }}
              />
            </FormControl>
          </Grid>

          {/* Kolom Harga */}
          <Grid item xs={6} sm={3} md={3}>
            <FormControl fullWidth>
              <TextField
                label="Harga (Rp)"
                name="price" // Penting untuk handleTextFieldChange
                type="number"
                value={item.price}
                onChange={handleTextFieldChange}
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                  inputProps: { step: "any" } // Izinkan desimal jika perlu
                }}
              />
            </FormControl>
          </Grid>

          {/* Kolom Catatan Produk */}
          <Grid item xs={12} md={3}> {/* Sedikit lebih lebar */}
            <FormControl fullWidth>
              <TextField
                label="Catatan Item (Opsional)"
                name="note" // Penting untuk handleTextFieldChange
                value={item.note}
                onChange={handleTextFieldChange}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: 1.5 },
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Tampilkan Subtotal jika valid */}
        {item.quantity > 0 && item.price > 0 && (
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal: Rp{' '}
              {(
                parseFloat(item.price) * parseInt(item.quantity)
              ).toLocaleString('id-ID')}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default OrderItemRow;