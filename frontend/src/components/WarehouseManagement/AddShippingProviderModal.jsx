// src/pages/WarehouseManagement/components/AddShippingProviderModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext'; // Asumsi path ke AuthContext

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddShippingProviderModal = ({ open, onClose, onAddSuccess }) => {
  const { token } = useAuth(); // Ambil token autentikasi
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setError('Nama penyedia pengiriman wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/warehouse/shipping-providers', { // Ganti dengan endpoint yang benar
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sertakan token
        },
        body: JSON.stringify({ name }), // Kirim nama (dan field lain jika ada)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gagal menambahkan penyedia pengiriman:', errorData);
        setError(errorData?.message || 'Gagal menambahkan penyedia pengiriman ke server.');
        return;
      }

      const data = await response.json();
      console.log('Penyedia pengiriman berhasil ditambahkan:', data);
      setSuccessMessage('Penyedia pengiriman berhasil ditambahkan.');
      onAddSuccess(data); // Kirim data provider yang baru ditambahkan
      onClose();
      setName(''); // Reset form
    } catch (error) {
      console.error('Terjadi kesalahan saat menambahkan penyedia pengiriman:', error);
      setError('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-shipping-provider-modal"
      aria-describedby="form-untuk-menambahkan-shipping-provider-baru"
    >
      <Box sx={style}>
        <Typography id="add-shipping-provider-modal" variant="h6" component="h2" gutterBottom>
          Tambah Penyedia Pengiriman Baru
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="Nama Penyedia Pengiriman"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            required
            error={!!error}
            helperText={error}
          />
        </FormControl>
        {/* Tambahkan TextField atau FormControl lain sesuai kebutuhan */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose} disabled={loading}>Batal</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Simpan'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddShippingProviderModal;