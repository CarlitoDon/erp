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
  ListItemText, // Import ListItemText
} from "@mui/material";

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Form Input Order Akuisisi
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Informasi Customer */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Informasi Customer</Typography>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Nama Lengkap Customer"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              required
            />
          </FormControl>
          <Box sx={{ display: "flex", gap: 2, "& > *": { flexGrow: 12 } }}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Nomor Telepon Customer"
                name="newCustomerPhone"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <Box sx={{ mr: 1, color: "text.secondary" }}>+62</Box>
                    ),
                  },
                }}
              />
            </FormControl>
            <FormControl margin="normal">
              <TextField
                label="Email Customer (Opsional)"
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
              />
            </FormControl>
          </Box>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Alamat Customer *"
              multiline
              rows={3}
              value={newCustomerAddress}
              onChange={(e) => setNewCustomerAddress(e.target.value)}
            />
          </FormControl>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <FormControl
              sx={{ flexGrow: 1, minWidth: "150px" }}
              margin="normal"
            >
              <TextField
                label="Provinsi *"
                value={newCustomerProvince}
                onChange={(e) => setNewCustomerProvince(e.target.value)}
              />
            </FormControl>
            <FormControl
              sx={{ flexGrow: 1, minWidth: "150px" }}
              margin="normal"
            >
              <TextField
                label="Kota/Kabupaten *"
                value={newCustomerCity}
                onChange={(e) => setNewCustomerCity(e.target.value)}
              />
            </FormControl>
            <FormControl
              sx={{ flexGrow: 1, minWidth: "150px" }}
              margin="normal"
            >
              <TextField
                label="Kecamatan *"
                value={newCustomerDistrict}
                onChange={(e) => setNewCustomerDistrict(e.target.value)}
              />
            </FormControl>
            <FormControl
              sx={{ flexGrow: 1, minWidth: "150px" }}
              margin="normal"
            >
              <TextField
                label="Desa/Kelurahan *"
                value={newCustomerVillage}
                onChange={(e) => setNewCustomerVillage(e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ minWidth: "100px" }} margin="normal">
              <TextField
                label="Kode Pos (Opsional)"
                value={newCustomerPostalCode}
                onChange={(e) => setNewCustomerPostalCode(e.target.value)}
              />
            </FormControl>
          </Box>
        </Box>

        {/* Produk yang Dipesan */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Produk yang Dipesan</Typography>
          {orderItems.map((item, index) => (
            // Ganti Box dengan Grid container
            <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
              {/* Bungkus setiap elemen dengan Grid item */}
              <Grid item xs={12} sm={6} md={3}> {/* Ambil full width di xs, setengah di sm, seperempat di md */}
                <FormControl fullWidth>
                  <TextField
                    label={`Produk ${index + 1}`}
                    name="productId"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3} md={2}> {/* Setengah di xs, seperempat di sm, dst */}
                 <FormControl fullWidth>
                  <TextField
                    label="Kuantitas"
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </FormControl>
              </Grid>
               <Grid item xs={6} sm={3} md={2}>
                 <FormControl fullWidth>
                  <TextField
                    label="Harga per Item"
                    name="price"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <TextField
                    label="Catatan Produk (Opsional)"
                    name="note"
                    value={item.note}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </FormControl>
              </Grid>
              {/* Tombol Hapus */}
              {orderItems.length > 1 && (
                 <Grid item xs={12} sm={'auto'}> {/* Ambil lebar otomatis di sm ke atas, full di xs */}
                   <Button onClick={() => handleRemoveItem(index)} color="error">
                     Hapus
                   </Button>
                 </Grid>
              )}
            </Grid> // Akhir Grid container per item
          ))}
          <Button onClick={handleAddItem}>Tambah Produk</Button>
        </Box>

        {/* Catatan Order & Alamat Pengiriman */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Catatan Order & Pengiriman</Typography>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Catatan Pembeli (Opsional)"
              multiline
              rows={2}
              value={buyerNote}
              onChange={(e) => setBuyerNote(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Catatan Penjual (Internal, Opsional)"
              multiline
              rows={2}
              value={sellerNote}
              onChange={(e) => setSellerNote(e.target.value)}
            />
          </FormControl>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Checkbox
              checked={isDifferentShippingAddress}
              onChange={handleShippingAddressToggle}
            />
            <Typography>Alamat Pengiriman Berbeda?</Typography>
          </Box>
          {isDifferentShippingAddress && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Alamat Pengiriman
              </Typography>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nama Penerima"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleShippingAddressChange}
                  required
                />
              </FormControl>
              <Box sx={{ display: "flex", gap: 2, "& > *": { flexGrow: 1 } }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Nomor Telepon Customer"
                      name="newCustomerPhone"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      required
                      slotProps={{
                        input: {
                          startAdornment: (
                            <Box sx={{ mr: 1, color: "text.secondary" }}>
                              +62
                            </Box>
                          ),
                        },
                      }}
                    />
                  </FormControl>
                </Grid>
              </Box>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Alamat Pengiriman"
                  name="address"
                  multiline
                  rows={3}
                  value={shippingAddress.address}
                  onChange={handleShippingAddressChange}
                  required
                />
              </FormControl>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <FormControl
                  sx={{ flexGrow: 1, minWidth: "150px" }}
                  margin="normal"
                >
                  <TextField
                    label="Provinsi"
                    name="province"
                    value={shippingAddress.province}
                    onChange={handleShippingAddressChange}
                  />
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1, minWidth: "150px" }}
                  margin="normal"
                >
                  <TextField
                    label="Kota/Kabupaten"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShippingAddressChange}
                  />
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1, minWidth: "150px" }}
                  margin="normal"
                >
                  <TextField
                    label="Kecamatan"
                    name="district"
                    value={shippingAddress.district}
                    onChange={handleShippingAddressChange}
                  />
                </FormControl>
                <FormControl
                  sx={{ flexGrow: 1, minWidth: "150px" }}
                  margin="normal"
                >
                  <TextField
                    label="Desa/Kelurahan"
                    name="village"
                    value={shippingAddress.village}
                    onChange={handleShippingAddressChange}
                  />
                </FormControl>
                <FormControl sx={{ minWidth: "100px" }} margin="normal">
                  <TextField
                    label="Kode Pos"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleShippingAddressChange}
                  />
                </FormControl>
              </Box>
            </Box>
          )}
        </Box>

        {/* Jasa Kirim & Pembayaran */}
        <Box sx={{ mb: 3 }}>
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
            >
              {shippingProviders.map((provider) => (
                <MenuItem key={provider.id} value={provider.id}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              Informasi Pembayaran (Opsional)
            </Typography>
            <FormControl fullWidth margin="normal">
              {/* Terapkan props langsung ke InputLabel */}
              <InputLabel
                id="payment-method-label"
                className="custom-label-position" // Terapkan className langsung
              >
                Metode Pembayaran
              </InputLabel>
              <Select
                labelId="payment-method-label"
                id="payment-method"
                value={paymentMethod}
                label="Metode Pembayaran"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="transfer_bank">Transfer Bank</MenuItem>
                <MenuItem value="cod">Cash on Delivery (COD)</MenuItem>
                {/* TODO: Tambahkan opsi pembayaran lain sesuai kebutuhan */}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Total Pembayaran (Opsional)"
                type="number"
                value={totalPayment}
                onChange={(e) => setTotalPayment(e.target.value)}
              />
            </FormControl>
          </Box>
        </Box>

        {/* Tombol Submit */}
        <Button type="submit" variant="contained" color="primary">
          Simpan Order
        </Button>
      </form>
    </Box>
  );
};

export default AcquisitionOrderPage;
