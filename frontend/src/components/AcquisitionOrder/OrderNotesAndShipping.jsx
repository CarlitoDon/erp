// src/components/AcquisitionOrder/OrderNotesAndShipping.jsx
import React from 'react';
import { TextField, FormControl, Grid, Typography, Box, Checkbox } from "@mui/material";
import NoteIcon from "@mui/icons-material/Note";
import HomeIcon from "@mui/icons-material/Home";

const OrderNotesAndShipping = ({
    buyerNote,
    setBuyerNote,
    sellerNote,
    setSellerNote,
    isDifferentShippingAddress,
    setIsDifferentShippingAddress,
    shippingAddress,
    setShippingAddress,
    newCustomerName,
    newCustomerPhone,
    newCustomerEmail,
    newCustomerAddress,
    newCustomerProvince,
    newCustomerCity,
    newCustomerDistrict,
    newCustomerVillage,
    newCustomerPostalCode
}) => {
    const handleShippingAddressToggle = (event) => {
        setIsDifferentShippingAddress(event.target.checked);
        // Jika dicentang, isi default dengan data customer baru (jika ada)
        if (event.target.checked) {
            setShippingAddress({
                name: newCustomerName,
                phone: newCustomerPhone,
                email: newCustomerEmail,
                address: newCustomerAddress,
                province: newCustomerProvince,
                city: newCustomerCity,
                district: newCustomerDistrict,
                village: newCustomerVillage,
                postalCode: newCustomerPostalCode,
            });
        } else {
            setShippingAddress({
                name: "",
                phone: "",
                email: "",
                address: "",
                province: "",
                city: "",
                district: "",
                village: "",
                postalCode: "",
            });
        }
    };

    const handleShippingAddressChange = (event) => {
        const { name, value } = event.target;
        setShippingAddress({ ...shippingAddress, [name]: value });
    };

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
                <NoteIcon sx={{ mr: 1.5, color: "#3f51b5" }} />
                <Typography variant="h6" fontWeight="600">
                    Catatan Order & Pengiriman
                </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Catatan Pembeli (Opsional)"
                                multiline
                                rows={3}
                                value={buyerNote}
                                onChange={(e) => setBuyerNote(e.target.value)}
                                variant="outlined"
                                placeholder="Masukkan catatan khusus dari pembeli..."
                                InputProps={{
                                    sx: { borderRadius: 1.5 },
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Catatan Penjual (Internal, Opsional)"
                                multiline
                                rows={3}
                                value={sellerNote}
                                onChange={(e) => setSellerNote(e.target.value)}
                                variant="outlined"
                                placeholder="Catatan internal untuk tim Anda..."
                                InputProps={{
                                    sx: { borderRadius: 1.5 },
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 3,
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: 2,
                    }}
                >
                    <Checkbox
                        checked={isDifferentShippingAddress}
                        onChange={handleShippingAddressToggle}
                        sx={{
                            color: "#3f51b5",
                            "&.Mui-checked": {
                                color: "#3f51b5",
                            },
                        }}
                    />
                    <Typography>
                        Alamat Pengiriman Berbeda dari Alamat Customer?
                    </Typography>
                </Box>

                {isDifferentShippingAddress && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 3,
                            border: "1px dashed #3f51b5",
                            borderRadius: 2,
                            bgcolor: "#f5f7ff",
                        }}
                    >
                        <Box
                            sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                            <HomeIcon sx={{ mr: 1.5, color: "#3f51b5" }} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                Detail Alamat Pengiriman
                            </Typography>
                        </Box>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Nama Penerima"
                                name="name"
                                value={shippingAddress.name}
                                onChange={handleShippingAddressChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    sx: { borderRadius: 1.5 },
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Nomor Telepon Penerima"
                                name="phone"
                                value={shippingAddress.phone}
                                onChange={handleShippingAddressChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    sx: { borderRadius: 1.5 },
                                    startAdornment: (
                                        <Box sx={{ mr: 1, color: "text.secondary" }}>
                                            +62
                                        </Box>
                                    ),
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Alamat Pengiriman"
                                name="address"
                                multiline
                                rows={3}
                                value={shippingAddress.address}
                                onChange={handleShippingAddressChange}
                                required
                                variant="outlined"
                                InputProps={{
                                    sx: { borderRadius: 1.5 },
                                }}
                            />
                        </FormControl>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Provinsi"
                                        name="province"
                                        value={shippingAddress.province}
                                        onChange={handleShippingAddressChange}
                                        variant="outlined"
                                        InputProps={{
                                            sx: { borderRadius: 1.5 },
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Kota/Kabupaten"
                                        name="city"
                                        value={shippingAddress.city}
                                        onChange={handleShippingAddressChange}
                                        variant="outlined"
                                        InputProps={{
                                            sx: { borderRadius: 1.5 },
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Kecamatan"
                                        name="district"
                                        value={shippingAddress.district}
                                        onChange={handleShippingAddressChange}
                                        variant="outlined"
                                        InputProps={{
                                            sx: { borderRadius: 1.5 },
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Desa/Kelurahan"
                                        name="village"
                                        value={shippingAddress.village}
                                        onChange={handleShippingAddressChange}
                                        variant="outlined"
                                        InputProps={{
                                            sx: { borderRadius: 1.5 },
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Kode Pos"
                                        name="postalCode"
                                        value={shippingAddress.postalCode}
                                        onChange={handleShippingAddressChange}
                                        variant="outlined"
                                        InputProps={{
                                            sx: { borderRadius: 1.5 },
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
        </React.Fragment>
    );
};

export default OrderNotesAndShipping;
