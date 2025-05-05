// src/pages/ProductCatalogPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
    Container, Box, Typography, Button, Paper, CircularProgress, Alert, TextField, InputAdornment, IconButton
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit'; // Untuk aksi edit nanti
import DeleteIcon from '@mui/icons-material/Delete'; // Untuk aksi delete nanti
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import useDebounce from '../hooks/useDebounce'; // Hook debounce (buat nanti)

// --- Hook Debounce Sederhana (buat di src/hooks/useDebounce.js) ---
// import { useState, useEffect } from 'react';
// export default function useDebounce(value, delay) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => { clearTimeout(handler); };
//   }, [value, delay]);
//   return debouncedValue;
// }
// -------------------------------------------------------------


const ProductCatalogPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // State untuk Pagination Server-side
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [rowCount, setRowCount] = useState(0);

    // State untuk Pencarian
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // Tunggu 500ms setelah user berhenti ketik

    // Fungsi Fetch Produk
    const fetchProducts = async () => {
        if (authLoading || !token) return; // Jangan fetch jika auth loading atau tidak ada token

        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
            page: paginationModel.page + 1, // API pakai page 1-based
            limit: paginationModel.pageSize,
            search: debouncedSearchTerm, // Gunakan nilai debounce untuk search
        });

        try {
            const response = await fetch(`/api/products?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                let errorMessage = `Gagal mengambil data produk (Status: ${response.status})`;
                try { const errorData = await response.json(); errorMessage = errorData.message || errorMessage; }
                catch (e) { /* Abaikan jika body bukan JSON */ }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setProducts(data.products || []);
            setRowCount(data.totalCount || 0); // Set total row dari API

        } catch (err) {
            setError(err.message || "Terjadi kesalahan saat mengambil produk.");
            setProducts([]);
            setRowCount(0);
            console.error("Fetch Products Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Trigger fetch saat pagination atau search term (debounced) berubah
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, authLoading, paginationModel, debouncedSearchTerm]); // Tambahkan dependency

    // Handler untuk perubahan pagination
    const handlePaginationModelChange = (newModel) => {
        setPaginationModel(newModel); // Update state pagination
    };

    // Handler untuk input search
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
         // Reset ke halaman 1 saat search term berubah (opsional, tapi umum)
         // setPaginationModel(prev => ({ ...prev, page: 0 })); // Akan trigger fetch oleh useEffect
    };

    // Definisi Kolom DataGrid
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'sku', headerName: 'SKU', width: 150 },
        { field: 'name', headerName: 'Nama Produk', flex: 1, minWidth: 200 },
        {
            field: 'price', headerName: 'Harga', width: 130, type: 'number',
            renderCell: (params) => `Rp ${params.value.toLocaleString('id-ID')}`,
            align: 'right', headerAlign: 'right',
        },
        { field: 'stock', headerName: 'Stok', width: 90, type: 'number', align: 'center', headerAlign: 'center' },
        {
            field: 'createdAt', headerName: 'Dibuat', width: 160, type: 'dateTime',
            valueGetter: (value) => value ? new Date(value) : null,
            renderCell: (params) => params.value ? format(params.value, 'dd MMM yyyy HH:mm', { locale: id }) : '-',
        },
         {
            field: 'actions', headerName: 'Aksi', sortable: false, filterable: false, width: 100, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Box>
                    <IconButton size="small" onClick={() => alert(`Edit product ${params.row.id}`)} disabled={loading}> {/* TODO: Implement Edit */}
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => alert(`Delete product ${params.row.id}`)} disabled={loading} color="error"> {/* TODO: Implement Delete */}
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            ),
        },
    ];

    // Handle loading auth
    if (authLoading) {
        return ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 150px)' }}><CircularProgress /></Box>);
    }
    // Handle jika tidak ada token setelah loading auth
    if (!token) {
         return (<Container sx={{py: 4}}><Alert severity="error">Autentikasi dibutuhkan untuk melihat halaman ini.</Alert></Container>);
    }


    return (
        <Container maxWidth="xl" sx={{ py: 4 }}> {/* Gunakan Container */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Katalog Produk
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => navigate('/product/new')} // Arahkan ke halaman input produk
                >
                    Tambah Produk Baru
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

             {/* Input Pencarian */}
             <Paper sx={{ p: 2, mb: 3 }}>
                 <TextField
                     fullWidth
                     variant="outlined"
                     size="small"
                     placeholder="Cari berdasarkan Nama atau SKU..."
                     value={searchTerm}
                     onChange={handleSearchChange}
                     InputProps={{
                         startAdornment: (
                             <InputAdornment position="start">
                                 <SearchIcon />
                             </InputAdornment>
                         ),
                     }}
                 />
             </Paper>

            <Paper sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={products}
                    columns={columns}
                    loading={loading}
                    rowCount={rowCount} // Jumlah total baris dari server
                    pageSizeOptions={[5, 10, 25, 50]}
                    paginationModel={paginationModel}
                    paginationMode="server" // Pagination ditangani server
                    onPaginationModelChange={handlePaginationModelChange}
                    // Optional: Tambahkan sorting server-side jika perlu
                    // sortingMode="server"
                    // onSortModelChange={handleSortModelChange}
                />
            </Paper>
        </Container>
    );
};

export default ProductCatalogPage;