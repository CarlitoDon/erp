// src/pages/AcquisitionOrderPage.jsx
import React, { useState, useEffect } from "react"; // Import useEffect
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Checkbox, // Import Checkbox
  Paper, // Import Paper
  Card,
  CardContent,
  InputAdornment,
  Container,
  Chip,
  IconButton,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";

// Import Ikon yang Digunakan
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NoteIcon from "@mui/icons-material/Note";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const AcquisitionOrderPage = () => {
  // State untuk informasi customer (baru atau dipilih)
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [newCustomerProvince, setNewCustomerProvince] = useState("");
  const [newCustomerCity, setNewCustomerCity] = useState("");
  const [newCustomerDistrict, setNewCustomerDistrict] = useState("");
  const [newCustomerVillage, setNewCustomerVillage] = useState("");
  const [newCustomerPostalCode, setNewCustomerPostalCode] = useState("");

  // State untuk produk yang dipesan
  const [orderItems, setOrderItems] = useState([
    { productId: "", quantity: 1, note: "" },
  ]);

  // State untuk catatan order
  const [buyerNote, setBuyerNote] = useState("");
  const [sellerNote, setSellerNote] = useState("");

  // State untuk alamat pengiriman (jika beda)
  const [isDifferentShippingAddress, setIsDifferentShippingAddress] =
    useState(false);
  const [shippingAddress, setShippingAddress] = useState({
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

  // State untuk pembayaran
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalPayment, setTotalPayment] = useState("");

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: 1, note: "" }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    const newItems = [...orderItems];
    newItems[index][name] = value;
    setOrderItems(newItems);
  };

  const handleShippingAddressToggle = (event) => {
    setIsDifferentShippingAddress(event.target.checked);
    // Jika dicentang, isi default dengan data customer baru (jika ada)
    if (event.target.checked && isNewCustomer) {
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

  // Calculate total order value
  const calculateTotal = () => {
    return orderItems
      .reduce((total, item) => {
        return (
          total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
        );
      }, 0)
      .toLocaleString("id-ID");
  };

  // State untuk jasa kirim
  const [shippingProviderId, setShippingProviderId] = useState("");
  const [shippingProviders, setShippingProviders] = useState([]);

  // Efek untuk mengambil daftar jasa kirim dari backend (saat komponen mount)
  useEffect(() => {
    // TODO: Implementasikan pemanggilan API untuk mendapatkan daftar jasa kirim
    // Contoh data sementara:
    const fetchShippingProviders = async () => {
      try {
        // const response = await fetch('/api/shipping-providers');
        // const data = await response.json();
        const data = [
          { id: 1, name: "JNE" },
          { id: 2, name: "J&T Express" },
          { id: 3, name: "SiCepat" },
          { id: 4, name: "Pos Indonesia" },
          // ... tambahkan data lain sesuai kebutuhan
        ];
        setShippingProviders(data);
      } catch (error) {
        console.error("Gagal mengambil daftar jasa kirim:", error);
      }
    };

    fetchShippingProviders();
  }, []);

  const handleShippingProviderChange = (event) => {
    setShippingProviderId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      isNewCustomer,
      existingCustomer,
      newCustomer: isNewCustomer
        ? {
            name: newCustomerName,
            phone: newCustomerPhone,
            email: newCustomerEmail,
            address: newCustomerAddress,
            province: newCustomerProvince,
            city: newCustomerCity,
            district: newCustomerDistrict,
            village: newCustomerVillage,
            postalCode: newCustomerPostalCode,
          }
        : null,
      orderItems,
      buyerNote,
      sellerNote,
      isDifferentShippingAddress,
      shippingAddress: isDifferentShippingAddress ? shippingAddress : null,
      shippingProviderId,
      paymentMethod,
      totalPayment,
      // salesRepId akan diisi di backend berdasarkan user yang login
      orderChannel: "WHATSAPP_ACQUISITION", // Default untuk form akuisisi
      orderCreatedAt: new Date().toISOString(), // Waktu order dibuat
    };
    console.log("Data form yang akan dikirim:", formData);
    // TODO: Kirim data form ke backend API
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(90deg, #3f51b5 0%, #5c6bc0 100%)",
            color: "white",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="600" gutterBottom>
            Form Input Order Akuisisi
          </Typography>
          <Typography variant="subtitle1">
            Silakan lengkapi detail informasi di bawah ini
          </Typography>
        </Box>

        <Box sx={{ px: 4, pb: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* Informasi Customer */}
            <Card
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                overflow: "visible",
              }}
            >
              <CardContent sx={{ p: 0 }}>
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
                    <Grid item xs={12} md={6}>
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
                              <Box sx={{ mr: 1, color: "text.secondary" }}>
                                +62
                              </Box>
                            ),
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
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
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          label="Provinsi *"
                          value={newCustomerProvince}
                          onChange={(e) =>
                            setNewCustomerProvince(e.target.value)
                          }
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
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          label="Kecamatan *"
                          value={newCustomerDistrict}
                          onChange={(e) =>
                            setNewCustomerDistrict(e.target.value)
                          }
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
                          label="Desa/Kelurahan *"
                          value={newCustomerVillage}
                          onChange={(e) =>
                            setNewCustomerVillage(e.target.value)
                          }
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
                          label="Kode Pos (Opsional)"
                          value={newCustomerPostalCode}
                          onChange={(e) =>
                            setNewCustomerPostalCode(e.target.value)
                          }
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1.5 },
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* Produk yang Dipesan */}
            <Card
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: 0 }}>
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
                  <ShoppingCartIcon sx={{ mr: 1.5, color: "#3f51b5" }} />
                  <Typography variant="h6" fontWeight="600">
                    Produk yang Dipesan
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {orderItems.map((item, index) => (
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
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
                          {orderItems.length > 1 && (
                            <IconButton
                              onClick={() => handleRemoveItem(index)}
                              color="error"
                              size="small"
                              sx={{ ml: "auto" }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          )}
                        </Box>

                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                              <TextField
                                label="Nama Produk"
                                name="productId"
                                value={item.productId}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                variant="outlined"
                                InputProps={{
                                  sx: { borderRadius: 1.5 },
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6} sm={3} md={2}>
                            <FormControl fullWidth>
                              <TextField
                                label="Kuantitas"
                                name="quantity"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                variant="outlined"
                                InputProps={{
                                  sx: { borderRadius: 1.5 },
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6} sm={3} md={3}>
                            <FormControl fullWidth>
                              <TextField
                                label="Harga per Item (Rp)"
                                name="price"
                                type="number"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, e)}
                                required
                                variant="outlined"
                                InputProps={{
                                  sx: { borderRadius: 1.5 },
                                }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth>
                              <TextField
                                label="Catatan Produk (Opsional)"
                                name="note"
                                value={item.note}
                                onChange={(e) => handleItemChange(index, e)}
                                variant="outlined"
                                InputProps={{
                                  sx: { borderRadius: 1.5 },
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>

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
                  ))}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Button
                      onClick={handleAddItem}
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{
                        borderRadius: 6,
                        bgcolor: "#e8eaf6",
                        color: "#3f51b5",
                        "&:hover": {
                          bgcolor: "#c5cae9",
                        },
                        px: 2,
                      }}
                    >
                      Tambah Produk
                    </Button>

                    <Box
                      sx={{
                        bgcolor: "#f5f5f5",
                        p: 2,
                        borderRadius: 2,
                        display: "inline-block",
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total Pesanan: Rp {calculateTotal()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Catatan Order & Alamat Pengiriman */}
            <Card
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: 0 }}>
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
              </CardContent>
            </Card>

            {/* Jasa Kirim & Pembayaran */}
            <Card
              sx={{
                mb: 4,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: 0 }}>
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
                  <PaymentIcon sx={{ mr: 1.5, color: "#3f51b5" }} />
                  <Typography variant="h6" fontWeight="600">
                    Jasa Pengiriman & Pembayaran
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <LocalShippingIcon
                          sx={{ mr: 1.5, color: "#3f51b5", fontSize: 20 }}
                        />
                        <Typography variant="subtitle1" fontWeight="600">
                          Metode Pengiriman
                        </Typography>
                      </Box>

                      <FormControl fullWidth margin="normal" required>
                        <InputLabel id="shipping-provider-label">
                          Pilih Jasa Kirim
                        </InputLabel>
                        <Select
                          labelId="shipping-provider-label"
                          id="shipping-provider"
                          value={shippingProviderId}
                          label="Pilih Jasa Kirim"
                          onChange={handleShippingProviderChange}
                          sx={{ borderRadius: 1.5 }}
                        >
                          {shippingProviders.map((provider) => (
                            <MenuItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <PaymentIcon
                          sx={{ mr: 1.5, color: "#3f51b5", fontSize: 20 }}
                        />
                        <Typography variant="subtitle1" fontWeight="600">
                          Metode Pembayaran
                        </Typography>
                      </Box>

                      <FormControl fullWidth margin="normal">
                        <InputLabel id="payment-method-label">
                          Metode Pembayaran
                        </InputLabel>
                        <Select
                          labelId="payment-method-label"
                          id="payment-method"
                          value={paymentMethod}
                          label="Metode Pembayaran"
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          sx={{ borderRadius: 1.5 }}
                        >
                          <MenuItem value="transfer_bank">
                            Transfer Bank
                          </MenuItem>
                          <MenuItem value="cod">
                            Cash on Delivery (COD)
                          </MenuItem>
                          <MenuItem value="e-wallet">E-Wallet</MenuItem>
                          <MenuItem value="virtual_account">
                            Virtual Account
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <TextField
                          label="Total Pembayaran (Opsional)"
                          type="number"
                          value={totalPayment}
                          onChange={(e) => setTotalPayment(e.target.value)}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 1.5 },
                            startAdornment: (
                              <Box sx={{ mr: 1, color: "text.secondary" }}>
                                Rp
                              </Box>
                            ),
                          }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>

            {/* Summary */}
            <Box
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                bgcolor: "#f9fafe",
              }}
            >
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Ringkasan Order
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Jumlah Produk: {orderItems.length} jenis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Kuantitas:{" "}
                      {orderItems.reduce(
                        (sum, item) => sum + parseInt(item.quantity || 0),
                        0
                      )}{" "}
                      item
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pengiriman:{" "}
                      {shippingProviderId
                        ? shippingProviders.find(
                            (p) => p.id === shippingProviderId
                          )?.name
                        : "-"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Metode Pembayaran:{" "}
                      {paymentMethod
                        ? {
                            transfer_bank: "Transfer Bank",
                            cod: "Cash on Delivery (COD)",
                            "e-wallet": "E-Wallet",
                            virtual_account: "Virtual Account",
                          }[paymentMethod]
                        : "-"}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      Total Order: Rp {calculateTotal()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 8,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  boxShadow: (theme) =>
                    `0 4px 12px ${theme.palette.primary.main}4D`,
                }}
              >
                Simpan Order
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default AcquisitionOrderPage;
