// src/pages/ProductInputPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormHelperText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";

const ProductInputPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const isNumericField = name === "price" || name === "stock";
    setFormData((prev) => ({
      ...prev,
      [name]: isNumericField ? (value === "" ? "" : value) : value,
    }));
  };

  const handleClear = () => {
    setFormData({ name: "", sku: "", price: "", stock: "" });
    setError(null);
    setSuccess(null);
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

    const priceValue =
      formData.price === "" ? null : parseFloat(formData.price);
    const stockValue =
      formData.stock === "" ? null : parseInt(formData.stock, 10);

    if (
      !formData.name.trim() ||
      !formData.sku.trim() ||
      priceValue === null ||
      priceValue < 0
    ) {
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
      stock: stockValue,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
            `Gagal menambahkan produk (Status: ${response.status})`
        );
      }

      setSuccess(
        `Produk "${responseData.product?.name || ""}" berhasil ditambahkan!`
      );
      setFormData({ name: "", sku: "", price: "", stock: "" });
      // setTimeout(() => navigate('/product/catalog'), 1500);
    } catch (err) {
      console.error("Submit Product Error:", err);
      setError(err.message || "Terjadi kesalahan saat menambahkan produk.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #f0f4f8 0%, #e8f1fd 100%)",
        py: { xs: 2, md: 5 },
        px: { xs: 1, md: 2 },
      }}
    >
      <Container maxWidth="md">
        {/* Header with back button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            onClick={() => navigate("/product/catalog")}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "text.primary",
              fontWeight: 500,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            Kembali ke Katalog
          </Button>
        </Box>

        {/* Main Card */}
        <Card
          elevation={10}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
          }}
        >
          {/* Card Header */}
          <Box
            sx={{
              background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
              py: 2,
              px: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <ShoppingBagIcon sx={{ color: "#2563eb" }} />
              </Box>
              <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
                Manajemen Produk
              </Typography>
            </Box>

            <Chip
              label="Tambah Baru"
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 500,
                "& .MuiChip-label": {
                  px: 2,
                },
              }}
              icon={<LabelOutlinedIcon style={{ color: "white" }} />}
            />
          </Box>

          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            {/* Title Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "#1e3a8a",
                  mb: 1,
                }}
              >
                Tambah Produk Baru
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: "600px", mx: "auto" }}
              >
                Lengkapi detail produk yang akan ditambahkan ke katalog
                inventaris Anda
              </Typography>
            </Box>

            {/* Alert Messages */}
            <Fade in={error !== null}>
              <Box sx={{ mb: error ? 3 : 0 }}>
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      borderRadius: "10px",
                      border: "1px solid rgba(211, 47, 47, 0.2)",
                      "& .MuiAlert-icon": { alignItems: "center" },
                    }}
                    onClose={() => setError(null)}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {error}
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Fade>

            <Fade in={success !== null}>
              <Box sx={{ mb: success ? 3 : 0 }}>
                {success && (
                  <Alert
                    severity="success"
                    sx={{
                      borderRadius: "10px",
                      border: "1px solid rgba(46, 125, 50, 0.2)",
                      "& .MuiAlert-icon": { alignItems: "center" },
                    }}
                    onClose={() => setSuccess(null)}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {success}
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Fade>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                "& .MuiTextField-root": {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "2px",
                    },
                  },
                },
              }}
            >
              {/* Form Section Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  pb: 1,
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <InfoOutlinedIcon
                  sx={{
                    color: "#3b82f6",
                    mr: 1.5,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "1.1rem",
                  }}
                >
                  Informasi Dasar
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {/* Product Name Field */}
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label="Nama Produk"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Misalnya: Kemeja Pria Premium"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShoppingBagIcon sx={{ color: "#6b7280" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>

                {/* SKU Field */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label="SKU (Stock Keeping Unit)"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      placeholder="PRD-2023-001"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <QrCodeIcon sx={{ color: "#6b7280" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText>
                      Gunakan kode unik untuk setiap produk
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {/* Price Field */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label="Harga Jual"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="150000"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon sx={{ color: "#6b7280" }} />
                            <Typography sx={{ ml: -0.5 }}>Rp</Typography>
                          </InputAdornment>
                        ),
                        inputProps: { min: 0, step: "any" },
                      }}
                    />
                  </FormControl>
                </Grid>

                {/* Stock Field */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <TextField
                      label="Stok Awal"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="10"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WarehouseIcon sx={{ color: "#6b7280" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="body2" color="text.secondary">
                              unit
                            </Typography>
                          </InputAdornment>
                        ),
                        inputProps: { min: 0 },
                      }}
                    />
                    <FormHelperText>
                      Opsional - Stok fisik akan dikelola per gudang
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 5,
                  pt: 3,
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  startIcon={<ClearIcon />}
                  sx={{
                    borderRadius: "10px",
                    borderColor: "#d1d5db",
                    color: "#4b5563",
                    textTransform: "none",
                    py: 1.2,
                    px: 3,
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#9ca3af",
                      backgroundColor: "rgba(0,0,0,0.02)",
                    },
                  }}
                >
                  Batal
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{
                    borderRadius: "10px",
                    background:
                      "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                    textTransform: "none",
                    py: 1.2,
                    px: 4,
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(37, 99, 235, 0.4)",
                      background:
                        "linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)",
                    },
                    "&:disabled": {
                      background: "#94a3b8",
                    },
                  }}
                >
                  {isLoading ? "Menyimpan..." : "Simpan Produk"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ProductInputPage;
