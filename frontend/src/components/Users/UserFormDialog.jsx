// src/components/Users/UserFormDialog.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Stack, // Untuk layout form yang lebih baik
    Box
} from '@mui/material';

// Terima props dari UserManagementPage
const UserFormDialog = ({ open, onClose, onSubmit, initialData, isLoading, availableRoles }) => {
    // State untuk data form
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: '', // Role awal kosong
    });
    // State untuk error spesifik form
    const [formError, setFormError] = useState('');

    // Tentukan apakah ini mode Edit berdasarkan adanya initialData
    const isEditing = !!initialData;

    // useEffect untuk mengisi form saat mode Edit atau reset saat mode Add
    useEffect(() => {
        if (open) { // Hanya jalankan jika dialog terbuka
            if (isEditing && initialData) {
                setFormData({
                    username: initialData.username || '',
                    role: initialData.role || '',
                    password: '', // Kosongkan password saat edit
                    confirmPassword: '',
                });
            } else {
                // Reset form untuk mode Add
                setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    role: '',
                });
            }
            setFormError(''); // Reset error setiap kali dialog dibuka/mode berubah
        }
    }, [open, initialData, isEditing]); // Jalankan saat open, initialData, atau isEditing berubah

    // Handler untuk perubahan input
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler untuk submit form
    const handleSubmit = (event) => {
        event.preventDefault(); // Mencegah submit HTML default
        setFormError(''); // Reset error sebelum validasi

        // --- Validasi Sederhana ---
        if (!formData.username.trim()) {
            setFormError('Username wajib diisi.');
            return;
        }
        if (!isEditing) { // Validasi password hanya saat Add
            if (!formData.password) {
                setFormError('Password wajib diisi.');
                return;
            }
            if (formData.password.length < 6) {
                setFormError('Password minimal 6 karakter.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setFormError('Konfirmasi password tidak cocok.');
                return;
            }
        }
        if (!formData.role) {
            setFormError('Role wajib dipilih.');
            return;
        }
        // --- Akhir Validasi ---

        // Persiapkan data yang akan dikirim ke API
        const dataToSubmit = {
            username: formData.username.trim(),
            role: formData.role,
        };
        // Hanya sertakan password jika dalam mode Add
        if (!isEditing) {
            dataToSubmit.password = formData.password;
        }

        // Panggil fungsi onSubmit dari parent (UserManagementPage)
        onSubmit(dataToSubmit);
        // State loading & error utama ditangani oleh parent
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
            {/* Gunakan Box dengan form agar onSubmit bekerja */}
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {/* Tampilkan error spesifik form di sini */}
                    {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

                    {/* Gunakan Stack untuk mengatur jarak antar field */}
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            fullWidth
                            disabled={isLoading || isEditing} // Username tidak bisa diedit
                            helperText={isEditing ? "Username tidak dapat diubah" : ""}
                        />

                        {/* Hanya tampilkan field password saat Add */}
                        {!isEditing && (
                            <>
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    disabled={isLoading}
                                    helperText="Minimal 6 karakter"
                                />
                                <TextField
                                    label="Konfirmasi Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    disabled={isLoading}
                                    error={!!formData.password && !!formData.confirmPassword && formData.password !== formData.confirmPassword} // Error jika tidak cocok
                                />
                            </>
                        )}

                        <FormControl fullWidth required disabled={isLoading}>
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                {/* Loop melalui availableRoles (diasumsikan object UserRole) */}
                                {Object.entries(availableRoles).map(([key, value]) => (
                                    <MenuItem key={key} value={value}>
                                        {value} {/* Tampilkan nama role */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    {/* Tombol Cancel memanggil onClose dari props */}
                    <Button onClick={onClose} disabled={isLoading}>
                        Batal
                    </Button>
                    {/* Tombol Submit */}
                    <Button type="submit" variant="contained" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : (isEditing ? 'Simpan Perubahan' : 'Tambah Pengguna')}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default UserFormDialog;