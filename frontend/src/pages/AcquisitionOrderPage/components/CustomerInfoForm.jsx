// src/pages/AcquisitionOrderPage/components/CustomerInfoForm.jsx
import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel, // Tambahkan InputLabel
  Select, // Tambahkan Select
  MenuItem, // Tambahkan MenuItem
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

// --- URL Dasar API NusantaraKita ---
const BASE_API_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

const CustomerInfoForm = ({
  customerData,
  onCustomerChange,
  // --- Props Baru ---
  isPhoneNumberValid, // null, true, atau false
  phoneNumberError, // Pesan error jika isPhoneNumberValid false
  isPhoneNumberChecking, // Boolean untuk loading
  // --- Akhir Props Baru ---
}) => {
  // --- STATE BARU UNTUK DROPDOWN DINAMIS ---
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  // State untuk menyimpan ID yang dipilih
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedRegencyId, setSelectedRegencyId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");

  // State untuk loading
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  // --- AKHIR STATE BARU ---

  // --- SIDE EFFECTS UNTUK FETCH DATA API ---

  // Effect untuk mengambil daftar provinsi saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch(`${BASE_API_URL}/provinces.json`);
        const data = await response.json();
        setProvinces(data);
        setLoadingProvinces(false);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setLoadingProvinces(false);
        // Handle error (misalnya tampilkan pesan ke pengguna)
      }
    };
    fetchProvinces();
  }, []); // [] agar hanya dijalankan sekali saat mount

  // Effect untuk mengambil daftar kota/kabupaten saat provinsi dipilih
  useEffect(() => {
    if (selectedProvinceId) {
      setLoadingRegencies(true);
      const fetchRegencies = async () => {
        try {
          const response = await fetch(
            `${BASE_API_URL}/regencies/${selectedProvinceId}.json`
          );
          const data = await response.json();
          setRegencies(data);
          setLoadingRegencies(false);
          // Reset pilihan kota/kecamatan/desa jika provinsi berubah
          setSelectedRegencyId("");
          setSelectedDistrictId("");
          setSelectedVillageId("");
          setDistricts([]); // Kosongkan daftar kecamatan
          setVillages([]); // Kosongkan daftar desa
          onCustomerChange("city", ""); // Reset nama kota di customerData
          onCustomerChange("district", ""); // Reset nama kecamatan
          onCustomerChange("village", ""); // Reset nama desa
        } catch (error) {
          console.error("Error fetching regencies:", error);
          setLoadingRegencies(false);
        }
      };
      fetchRegencies();
    } else {
      setRegencies([]); // Kosongkan daftar kota jika tidak ada provinsi terpilih
      setSelectedRegencyId("");
      setSelectedDistrictId("");
      setSelectedVillageId("");
      setDistricts([]);
      setVillages([]);
      onCustomerChange("city", "");
      onCustomerChange("district", "");
      onCustomerChange("village", "");
    }
  }, [selectedProvinceId]); // Jalankan ulang saat selectedProvinceId berubah

  // Effect untuk mengambil daftar kecamatan saat kota/kabupaten dipilih
  useEffect(() => {
    if (selectedRegencyId) {
      setLoadingDistricts(true);
      const fetchDistricts = async () => {
        try {
          const response = await fetch(
            `${BASE_API_URL}/districts/${selectedRegencyId}.json`
          );
          const data = await response.json();
          setDistricts(data);
          setLoadingDistricts(false);
          // Reset pilihan kecamatan/desa jika kota berubah
          setSelectedDistrictId("");
          setSelectedVillageId("");
          setVillages([]);
          onCustomerChange("district", "");
          onCustomerChange("village", "");
        } catch (error) {
          console.error("Error fetching districts:", error);
          setLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setSelectedDistrictId("");
      setSelectedVillageId("");
      setVillages([]);
      onCustomerChange("district", "");
      onCustomerChange("village", "");
    }
  }, [selectedRegencyId]); // Jalankan ulang saat selectedRegencyId berubah

  // Effect untuk mengambil daftar desa/kelurahan saat kecamatan dipilih
  useEffect(() => {
    if (selectedDistrictId) {
      setLoadingVillages(true);
      const fetchVillages = async () => {
        try {
          const response = await fetch(
            `${BASE_API_URL}/villages/${selectedDistrictId}.json`
          );
          const data = await response.json();
          setVillages(data);
          setLoadingVillages(false);
          // Reset pilihan desa jika kecamatan berubah
          setSelectedVillageId("");
          onCustomerChange("village", "");
        } catch (error) {
          console.error("Error fetching villages:", error);
          setLoadingVillages(false);
        }
      };
      fetchVillages();
    } else {
      setVillages([]);
      setSelectedVillageId("");
      onCustomerChange("village", "");
    }
  }, [selectedDistrictId]); // Jalankan ulang saat selectedDistrictId berubah

  // --- HANDLER UNTUK PERUBAHAN DROPDOWN ---
  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvinceId(provinceId);
    // Cari nama provinsi dari daftar untuk disimpan ke customerData
    const selectedProvinceName =
      provinces.find((p) => p.id === provinceId)?.name || "";
    onCustomerChange("province", selectedProvinceName);
  };

  const handleRegencyChange = (event) => {
    const regencyId = event.target.value;
    setSelectedRegencyId(regencyId);
    const selectedRegencyName =
      regencies.find((r) => r.id === regencyId)?.name || "";
    onCustomerChange("city", selectedRegencyName); // "city" untuk kota/kabupaten
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    setSelectedDistrictId(districtId);
    const selectedDistrictName =
      districts.find((d) => d.id === districtId)?.name || "";
    onCustomerChange("district", selectedDistrictName);
  };

  const handleVillageChange = (event) => {
    const villageId = event.target.value;
    setSelectedVillageId(villageId);
    const selectedVillageName =
      villages.find((v) => v.id === villageId)?.name || "";
    onCustomerChange("village", selectedVillageName);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Validasi awalan '0'
    if (name === "phone") {
      if (value.startsWith("0") && value.length > 0) {
        return;
      }
    }
    onCustomerChange(name, value);
  };

  // Tentukan warna border berdasarkan status validasi
  const getPhoneNumberBorderColor = () => {
    if (isPhoneNumberChecking) {
      return "primary"; // Atau 'info' untuk warna biru muda
    }
    if (isPhoneNumberValid === true) {
      return "success"; // Hijau jika valid
    }
    if (isPhoneNumberValid === false) {
      return "error"; // Merah jika tidak valid
    }
    return undefined; // Default Material-UI jika belum divalidasi
  };

  // Tentukan pesan bantuan
  const getPhoneNumberHelperText = () => {
    if (isPhoneNumberChecking) {
      return "Memeriksa ketersediaan nomor...";
    }
    if (phoneNumberError) {
      return phoneNumberError;
    }
    if (isPhoneNumberValid === true) {
      return "Nomor telepon tersedia!";
    }
    return "Masukkan nomor telepon tanpa awalan 0"; // Pesan default
  };

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header Card */}
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

        {/* Konten Form */}
        <Box sx={{ p: 3 }}>
          {/* Nama Lengkap */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Nama Lengkap Customer"
              name="name"
              value={customerData.name || ""}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 1.5 } }}
            />
          </FormControl>

          {/* Telepon & Email */}
          <Grid container spacing={2}>
            {/* Telepon */}
            <Grid size={{ xs: 12, sm: 6 }}>
              {" "}
              {/* Gunakan 'item' dan 'xs', 'sm', 'md' */}
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Nomor Telepon Customer"
                  name="phone"
                  value={customerData.phone || ""}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="81234567890"
                  type="tel"
                  error={isPhoneNumberValid === false}
                  helperText={getPhoneNumberHelperText()}
                  color={getPhoneNumberBorderColor()}
                  InputProps={{
                    sx: { borderRadius: 1.5 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box sx={{ mr: 1, color: "text.secondary" }}>+62</Box>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {isPhoneNumberChecking && (
                          <CircularProgress size={20} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            </Grid>
            {/* Email */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Email Customer (Opsional)"
                  name="email"
                  type="email"
                  value={customerData.email || ""}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Alamat Lengkap */}
          <FormControl fullWidth margin="normal">
            <TextField
              label="Alamat Lengkap Customer *"
              name="address"
              multiline
              rows={3}
              value={customerData.address || ""}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 1.5 } }}
            />
          </FormControl>

          {/* Alamat Detail - DROPDOWN DINAMIS */}
          <Grid container spacing={2}>
            {/* Provinsi */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="province-label">Provinsi</InputLabel>
                <Select
                  labelId="province-label"
                  id="province-select"
                  value={selectedProvinceId}
                  label="Provinsi *"
                  onChange={handleProvinceChange}
                  sx={{ borderRadius: 1.5 }}
                  // Jika sedang memuat provinsi, disable dropdown
                  disabled={loadingProvinces}
                >
                  {loadingProvinces && (
                    <MenuItem disabled>Memuat provinsi...</MenuItem>
                  )}
                  {!loadingProvinces && provinces.length === 0 && (
                    <MenuItem disabled>Tidak ada provinsi ditemukan</MenuItem>
                  )}
                  {provinces.map((province) => (
                    <MenuItem key={province.id} value={province.id}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Kota/Kabupaten */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="regency-label">Kota/Kabupaten</InputLabel>
                <Select
                  labelId="regency-label"
                  id="regency-select"
                  value={selectedRegencyId}
                  label="Kota/Kabupaten *"
                  onChange={handleRegencyChange}
                  sx={{ borderRadius: 1.5 }}
                  // Disable jika belum ada provinsi terpilih atau sedang loading
                  disabled={!selectedProvinceId || loadingRegencies}
                >
                  {loadingRegencies && (
                    <MenuItem disabled>Memuat kota/kabupaten...</MenuItem>
                  )}
                  {!loadingRegencies && regencies.length === 0 && (
                    <MenuItem disabled>Pilih provinsi terlebih dahulu</MenuItem>
                  )}
                  {regencies.map((regency) => (
                    <MenuItem key={regency.id} value={regency.id}>
                      {regency.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Kecamatan */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="district-label">Kecamatan</InputLabel>
                <Select
                  labelId="district-label"
                  id="district-select"
                  value={selectedDistrictId}
                  label="Kecamatan *"
                  onChange={handleDistrictChange}
                  sx={{ borderRadius: 1.5 }}
                  // Disable jika belum ada kota terpilih atau sedang loading
                  disabled={!selectedRegencyId || loadingDistricts}
                >
                  {loadingDistricts && (
                    <MenuItem disabled>Memuat kecamatan...</MenuItem>
                  )}
                  {!loadingDistricts && districts.length === 0 && (
                    <MenuItem disabled>
                      Pilih kota/kabupaten terlebih dahulu
                    </MenuItem>
                  )}
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Desa/Kelurahan */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel id="village-label">Desa/Kelurahan</InputLabel>
                <Select
                  labelId="village-label"
                  id="village-select"
                  value={selectedVillageId}
                  label="Desa/Kelurahan *"
                  onChange={handleVillageChange}
                  sx={{ borderRadius: 1.5 }}
                  // Disable jika belum ada kecamatan terpilih atau sedang loading
                  disabled={!selectedDistrictId || loadingVillages}
                >
                  {loadingVillages && (
                    <MenuItem disabled>Memuat desa/kelurahan...</MenuItem>
                  )}
                  {!loadingVillages && villages.length === 0 && (
                    <MenuItem disabled>
                      Pilih kecamatan terlebih dahulu
                    </MenuItem>
                  )}
                  {villages.map((village) => (
                    <MenuItem key={village.id} value={village.id}>
                      {village.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Kode Pos */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label="Kode Pos (Opsional)"
                  name="postalCode"
                  value={customerData.postalCode || ""}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1.5 } }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoForm;
