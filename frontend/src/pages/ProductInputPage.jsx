// src/pages/ProductInputPage.jsx
import React, { useState, useContext } from 'react';
import {
    Box, Container, Typography, TextField, Button, Paper, Grid,
    CircularProgress, Alert, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Untuk token
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Contoh ikon

const ProductInputPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '', // Stok awal opsional
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        // Untuk price dan stock, coba konversi ke angka jika bukan string kosong
        const isNumericField = name === 'price' || name === 'stock';
        setFormData(prev => ({
            ...prev,
            [name]: isNumericField ? (value === '' ? '' : value) : value // Biarkan string kosong jika user hapus
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        if (!token) {
            setError("Autentikasi dibutuhkan.");
            setIsLoading(false);
            return;
        }

        // Konversi price dan stock ke angka sebelum kirim, tangani string kosong
        const priceValue = formData.price === '' ? null : parseFloat(formData.price);
        const stockValue = formData.stock === '' ? null : parseInt(formData.stock, 10);

        // Validasi Frontend
        if (!formData.name.trim() || !formData.sku.trim() || priceValue === null || priceValue < 0) {
            setError("Nama Produk, SKU, dan Harga (positif) wajib diisi.");
            setIsLoading(false);
            return;
        }
         if (stockValue !== null && (isNaN(stockValue) || stockValue < 0)) {
            setError("Stok harus berupa angka positif jika diisi.");
            setIsLoading(false);
            return;
        }

        const payload = {
            name: formData.name.trim(),
            sku: formData.sku.trim(),
            price: priceValue,
            stock: stockValue, // Kirim null jika kosong
        };

        try {
            const response = await fetch('/api/products', { // Target endpoint POST produk
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Gagal menambahkan produk (Status: ${response.status})`);
            }

            setSuccess(`Produk "${responseData.product?.name || ''}" berhasil ditambahkan!`);
            // Reset form
            setFormData({ name: '', sku: '', price: '', stock: '' });
            // Opsional: navigasi ke katalog produk setelah sukses
            // setTimeout(() => navigate('/product/catalog'), 1500);

        } catch (err) {
            console.error("Submit Product Error:", err);
            setError(err.message || "Terjadi kesalahan saat menambahkan produk.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}> {/* Batasi lebar container */}
             <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
                    Tambah Produk Baru
                </Typography>
                 <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Masukkan detail untuk produk baru yang akan ditambahkan ke katalog.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nama Produk"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="SKU (Stock Keeping Unit)"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                fullWidth
                                helperText="Harus unik untuk setiap produk"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Harga Jual"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                                    inputProps: { min: 0, step: "any" } // Izinkan desimal
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Stok Awal (Opsional)"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                fullWidth
                                helperText="Stok fisik akan dikelola per gudang"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                         {/* Tambahkan field lain jika perlu (misal: kategori, berat, deskripsi) */}

                        <Grid item xs={12} sx={{ textAlign: 'right' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />}
                                sx={{ px: 3, py: 1.2 }}
                            >
                                {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
             </Paper>
        </Container>
    );
};

export default ProductInputPage;