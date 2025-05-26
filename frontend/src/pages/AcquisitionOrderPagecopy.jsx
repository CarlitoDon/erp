// src/pages/AcquisitionOrderPage/AcquisitionOrderPage.jsx (File Utama Baru)
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useDebounce from "../hooks/useDebounce";

// Import komponen-komponen yang sudah dipecah
import CustomerInfoForm from "./AcquisitionOrderPage/components/CustomerInfoForm";
import OrderItemsSection from "./AcquisitionOrderPage/components/OrderItemsSection";
import NotesShippingSection from "./AcquisitionOrderPage/components/NotesShippingSection";
import ShippingPaymentSection from "./AcquisitionOrderPage/components/ShippingPaymentSection";
import OrderSummary from "./AcquisitionOrderPage/components/OrderSummary"; // Jika dibuat terpisah

const AcquisitionOrderPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const errorAlertRef = useRef(null); // <--- Tambahkan ini

  // == State Management Tetap di Sini ==
  // Customer
  const [customerDetails, setCustomerDetails] = useState({
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

  // == State Baru untuk Validasi Telepon ==
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(null); // null: belum divalidasi, true: valid, false: tidak valid
  const [phoneNumberValidationError, setPhoneNumberValidationError] =
    useState("");
  const [isPhoneNumberChecking, setIsPhoneNumberChecking] = useState(false);

  // Debounce nomor telepon untuk validasi API
  const debouncedPhoneNumber = useDebounce(customerDetails.phone, 800); // Debounce lebih lama untuk API call

  // Order Items
  const [orderItems, setOrderItems] = useState([
    { product: null, quantity: 1, price: 0, note: "" },
  ]);
  // Notes
  const [buyerNote, setBuyerNote] = useState("");
  const [sellerNote, setSellerNote] = useState("");
  // Shipping Address
  const [isDifferentShippingAddress, setIsDifferentShippingAddress] =
    useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    /* ... initial state */
  });
  // Shipping & Payment
  const [shippingProviderId, setShippingProviderId] = useState("");
  const [shippingProviders, setShippingProviders] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  // Product Search
  const [productOptions, setProductOptions] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(productSearchTerm, 500);
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // == Handlers & Logic Tetap di Sini (atau dipindah ke custom hooks) ==

  const handleCustomerChange = useCallback((field, value) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  }, []);

  // --- Fungsi Validasi Nomor Telepon ke Backend ---
  const checkPhoneNumberAvailability = useCallback(
    async (phone) => {
      // Hanya cek jika nomor telepon memiliki panjang yang masuk akal dan tidak diawali 0
      if (!phone || phone.length < 11 || phone.startsWith("0")) {
        setIsPhoneNumberValid(null);
        setPhoneNumberValidationError("");
        setIsPhoneNumberChecking(false);
        return;
      }

      setIsPhoneNumberChecking(true);
      setPhoneNumberValidationError(""); // Reset error sebelumnya
      setIsPhoneNumberValid(null); // Reset status validasi

      try {
        const response = await fetch(
          `/api/customers/check-phone?phone=${phone}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Asumsi backend mengembalikan 200 jika nomor tersedia atau valid
          const data = await response.json();
          if (data.exists) {
            setIsPhoneNumberValid(false);
            setPhoneNumberValidationError("Nomor telepon sudah terdaftar!");
          } else {
            setIsPhoneNumberValid(true);
            setPhoneNumberValidationError("");
          }
        } else if (response.status === 409) {
          // Contoh: Konflik jika nomor sudah ada
          setIsPhoneNumberValid(false);
          const errorData = await response.json();
          setPhoneNumberValidationError(
            errorData.message || "Nomor telepon sudah terdaftar!"
          );
        } else {
          // Tangani error lain dari server
          const errorData = await response.json();
          console.error("Error checking phone number:", errorData);
          setIsPhoneNumberValid(false); // Anggap tidak valid jika ada error
          setPhoneNumberValidationError(
            errorData.message || "Gagal memvalidasi nomor telepon."
          );
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat memeriksa nomor telepon:", error);
        setIsPhoneNumberValid(false); // Anggap tidak valid jika ada error jaringan
        setPhoneNumberValidationError(
          "Gagal menghubungi server untuk validasi nomor telepon."
        );
      } finally {
        setIsPhoneNumberChecking(false);
      }
    },
    [token]
  );

  // Panggil fungsi validasi setiap kali debouncedPhoneNumber berubah
  useEffect(() => {
    checkPhoneNumberAvailability(debouncedPhoneNumber);
  }, [debouncedPhoneNumber, checkPhoneNumberAvailability]);

  // --- Fetch Product Options ---
  const fetchProductOptions = useCallback(
    async (searchTerm) => {
      console.log("fetchProductOptions terpanggil dengan:", searchTerm);
      if (!token || !searchTerm || searchTerm.length < 2) {
        setProductOptions([]); // Reset opsi jika tidak ada token atau searchTerm terlalu pendek
        setProductLoading(false);
        return;
      }

      setProductLoading(true);
      try {
        const response = await fetch(`/api/products/search?q=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Sertakan token di header
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Gagal mengambil opsi produk:", errorData);
          setSubmitError("Gagal mengambil opsi produk dari server.");
          setProductOptions([]);
          return;
        }

        const data = await response.json();
        console.log("Data produk dari API:", data);
        setProductOptions(data || []);
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil opsi produk:", error);
        setSubmitError("Terjadi kesalahan saat menghubungi server.");
        setProductOptions([]);
      } finally {
        setProductLoading(false);
      }
    },
    [token]
  ); // dependensi token

  useEffect(() => {
    fetchProductOptions(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchProductOptions]);

  const handleProductInputChange = useCallback((event, newInputValue) => {
    setProductSearchTerm(newInputValue);
  }, []);

  const handleAddItem = useCallback(() => {
    setOrderItems((prev) => [
      ...prev,
      { product: null, quantity: 1, price: 0, note: "" },
    ]);
  }, []);

  const handleRemoveItem = useCallback((index) => {
    const newItems = orderItems.filter((_, i) => i !== index); // Cara immutable
    setOrderItems(newItems);
  }, []);

  const handleItemChange = useCallback((index, field, value) => {
    setOrderItems((prevItems) =>
      prevItems.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item };
          if (field === "product") {
            updatedItem.product = value; // value adalah objek produk atau null
            updatedItem.price = value?.price || 0; // Auto-fill harga
          } else if (field === "quantity") {
            updatedItem.quantity = parseInt(value) || 0;
          } else if (field === "price") {
            updatedItem.price = parseFloat(value) || 0;
          } else {
            // Untuk 'note' atau name dari event
            updatedItem[field] = value;
          }
          return updatedItem;
        }
        return item;
      })
    );
  }, []);

  const calculateTotal = useCallback(() => {
    // Lakukan kalkulasi di dalam variabel agar lebih mudah dibaca
    const totalValue = orderItems.reduce(
      // Argumen 1: Fungsi Callback
      (totalAccumulator, currentItem) => {
        // Ambil harga dan kuantitas, pastikan berupa angka
        const price = parseFloat(currentItem.price) || 0;
        const quantity = parseInt(currentItem.quantity) || 0;

        // Hitung subtotal item ini
        const subtotal = price * quantity;

        // Kembalikan akumulator + subtotal untuk iterasi selanjutnya
        return totalAccumulator + subtotal;
      },
      // Argumen 2: Nilai Awal untuk Akumulator
      0
    );

    // Format hasil akhir sebagai string mata uang Indonesia
    return totalValue.toLocaleString("id-ID");
  }, [orderItems]); // Dependensi sudah benar

  // --- Fetch Shipping Providers ---
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/warehouse/shipping-providers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const text = await response.text();
          console.error("Gagal mengambil daftar shipping provider:", text);
          setSubmitError(text || "Gagal mengambil daftar shipping provider.");
          return;
        }
        const data = await response.json();
        setShippingProviders(data || []);
      } catch (fetchError) {
        console.error(
          "Terjadi kesalahan saat mengambil daftar shipping provider:",
          fetchError
        );
        setSubmitError("Terjadi kesalahan saat menghubungi server.");
      }
    };

    fetchProviders();
  }, [token]); // Perlu token sebagai dependency jika API memerlukan otentikasi

  const handleShippingProviderChange = useCallback((event) => {
    setShippingProviderId(event.target.value);
  }, []);

  const handleShippingAddressToggle = useCallback(
    (event) => {
      const checked = event.target.checked;
      setIsDifferentShippingAddress(checked);
      if (checked) {
        // Copy dari customer jika baru dicentang
        setShippingAddress({
          name: customerDetails.name,
          phone: customerDetails.phone,
          // email tidak wajib di alamat kirim biasanya
          address: customerDetails.address,
          province: customerDetails.province,
          city: customerDetails.city,
          district: customerDetails.district,
          village: customerDetails.village,
          postalCode: customerDetails.postalCode,
        });
      } else {
        // Reset jika tidak dicentang
        setShippingAddress({
          name: "",
          phone: "",
          address: "",
          province: "",
          city: "",
          district: "",
          village: "",
          postalCode: "",
        });
      }
    },
    [customerDetails]
  ); // Dependensi pada customerDetails

  const handleShippingAddressChange = useCallback((event) => {
    const { name, value } = event.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePaymentMethodChange = useCallback((event) => {
    setPaymentMethod(event.target.value);
  }, []);

  const handleTotalPaymentChange = useCallback((event) => {
    setTotalPayment(event.target.value);
  }, []);

  const handleNoteChange = useCallback((noteType, value) => {
    if (noteType === "buyer") {
      setBuyerNote(value);
    } else if (noteType === "seller") {
      setSellerNote(value);
    }
  }, []);

  // --- Efek untuk Menggulir ke Notifikasi Error ---
  useEffect(() => {
    if (submitError && errorAlertRef.current) {
      errorAlertRef.current.scrollIntoView({
        behavior: "smooth", // Untuk animasi gulir yang mulus
        block: "start", // Gulir hingga bagian atas elemen terlihat
      });
    }
  }, [submitError]); // Efek ini akan berjalan setiap kali submitError berubah

  // --- Submit Handler ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    // --- Validasi Tambahan untuk Nomor Telepon ---
    if (!isPhoneNumberValid) {
      setSubmitError(
        phoneNumberValidationError ||
          "Nomor telepon pelanggan tidak valid atau sudah terdaftar."
      );
      setIsSubmitting(false);
      return;
    }
    if (isPhoneNumberChecking) {
      setSubmitError(
        "Mohon tunggu, validasi nomor telepon sedang berlangsung."
      );
      setIsSubmitting(false);
      return;
    }
    // --- Akhir Validasi Tambahan ---

    // Lakukan validasi di sini menggunakan state yang ada
    // Contoh implementasi:
    if (orderItems.some((item) => !item.product?.id || item.quantity <= 0)) {
      setSubmitError(
        "Pastikan semua item produk telah dipilih dan kuantitas lebih dari 0."
      );
      setIsSubmitting(false); // Pastikan isSubmitting kembali false
      return;
    }
    if (!shippingProviderId) {
      setSubmitError("Silakan pilih penyedia pengiriman.");
      setIsSubmitting(false);
      return;
    }
    if (
      !customerDetails.name ||
      !customerDetails.phone ||
      !customerDetails.address
    ) {
      // Tambahkan validasi lain yang relevan
      setSubmitError(
        "Informasi pelanggan (Nama, Telepon, Alamat) wajib diisi."
      );
      setIsSubmitting(false);
      return;
    }
    if (
      isDifferentShippingAddress &&
      (!shippingAddress.name ||
        !shippingAddress.address) /* ... validasi alamat kirim lain ... */
    ) {
      setSubmitError(
        "Alamat pengiriman (Nama Penerima, Alamat) wajib diisi jika berbeda."
      );
      setIsSubmitting(false);
      return;
    }
    // Pastikan tidak ada produk yang dipilih dengan harga 0 jika itu tidak valid
    if (
      orderItems.some(
        (item) => item.product && item.price <= 0 && item.quantity > 0
      )
    ) {
      setSubmitError(
        "Harga produk tidak boleh nol untuk item yang dipesan. Harap periksa kembali item pesanan."
      );
      setIsSubmitting(false);
      return;
    }

    // Siapkan payload
    const customerData = { ...customerDetails }; // dari state customerDetails
    const finalShippingAddress = isDifferentShippingAddress
      ? { ...shippingAddress }
      : customerData;

    const payload = {
      newCustomer: customerData, // Asumsi customerData sudah disiapkan dengan benar
      orderItems: orderItems
        .filter(
          (item) =>
            item.product && item.product.id && parseInt(item.quantity, 10) > 0
        ) // Langkah 1: Filter item yang tidak valid
        .map((item) => {
          // Langkah 2: Petakan item yang valid ke format payload
          const productDetails = item.product; // Ini adalah objek produk dari Autocomplete

          return {
            productId: productDetails.id, // ID unik dari produk. Pastikan ini ada.
            productName: productDetails.name, // Nama produk. Berguna untuk referensi di backend atau rekap.
            sku: productDetails.sku || null, // SKU produk. Kirim null jika tidak ada atau tidak relevan.
            quantity: parseInt(item.quantity, 10), // Kuantitas produk, pastikan berupa integer.
            price: parseFloat(item.price), // Harga per unit SAAT transaksi. Ini adalah harga yang mungkin telah diubah pengguna.
            note: item.note || null, // Catatan spesifik untuk item ini. Kirim null jika kosong.
            // Tambahan (opsional, tergantung kebutuhan backend):
            // originalPrice: parseFloat(productDetails.price), // Jika backend perlu tahu harga asli produk sebelum diubah.
            // imageUrl: productDetails.imageUrl || null,       // Jika URL gambar produk relevan.
          };
        }),
      buyerNote: buyerNote || null,
      sellerNote: sellerNote || null,
      shippingAddressSnapshot: finalShippingAddress, // Asumsi finalShippingAddress sudah disiapkan
      shippingProviderId: parseInt(shippingProviderId, 10), // Pastikan integer
      paymentMethod: paymentMethod,
      orderChannel: "WHATSAPP_ACQUISITION", // paymentTotal: ... (seperti yang dibahas sebelumnya, biasanya dihitung backend)
    };

    console.log(
      "Data form yang akan dikirim (setelah pembenahan orderItems):",
      payload
    );

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- Ini yang penting!
        },
        body: JSON.stringify(payload),
      });
      // ... handle response sukses ...
      setSubmitSuccess("Order berhasil dibuat!");
      // Reset form (reset semua state ke nilai awal)
      setCustomerDetails({
        /* initial */
      });
      setOrderItems([
        {
          /* initial */
        },
      ]);
      setBuyerNote(""); // etc.
      // ... navigate ...
    } catch (err) {
      console.error("Error saat submit order:", err);
      if (err.response) {
        // Jika error berasal dari respons server (misalnya, status 4xx atau 5xx)
        try {
          const errorData = await err.response.json();
          setSubmitError(
            errorData.message ||
              errorData.error ||
              "Terjadi kesalahan pada server."
          );
        } catch (parseError) {
          setSubmitError("Gagal memproses respons error dari server.");
        }
      } else if (err.request) {
        // Jika permintaan dibuat tapi tidak ada respons
        setSubmitError(
          "Tidak ada respons dari server. Cek koneksi internet Anda."
        );
      } else {
        // Kesalahan lain saat menyiapkan permintaan
        setSubmitError(
          err.message || "Terjadi kesalahan saat mengirim permintaan."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // == Render Komponen Anak ==
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
          <Typography variant="h4" fontWeight="600" gutterBottom color="white">
            Form Input Order Akuisisi
          </Typography>
          <Typography variant="subtitle1">
            Silakan lengkapi detail informasi di bawah ini
          </Typography>
        </Box>

        <Box sx={{ px: 4, pb: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* Alert */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }} ref={errorAlertRef}>
                {" "}
                {/* <--- Tambahkan ref di sini */}
                {submitError}
              </Alert>
            )}
            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {submitSuccess}
              </Alert>
            )}

            {/* Customer Info */}
            <CustomerInfoForm
              customerData={customerDetails}
              onCustomerChange={handleCustomerChange}
              // --- Props Baru untuk Validasi Telepon ---
              isPhoneNumberValid={isPhoneNumberValid}
              phoneNumberError={phoneNumberValidationError}
              isPhoneNumberChecking={isPhoneNumberChecking}
              // --- Akhir Props Baru ---
            />

            {/* Order Items */}
            <OrderItemsSection
              orderItems={orderItems} // Array item
              productOptions={productOptions} // Opsi autocomplete
              productLoading={productLoading} // Status loading autocomplete
              onItemChange={handleItemChange} // Handler ubah item
              onRemoveItem={handleRemoveItem} // Handler hapus item
              onAddItem={handleAddItem} // Handler tambah item
              onProductInputChange={handleProductInputChange} // Handler input autocomplete
              calculateTotal={calculateTotal()} // Panggil fungsi kalkulasi & kirim hasilnya
            />

            {/* Notes & Shipping */}
            <NotesShippingSection
              buyerNote={buyerNote}
              sellerNote={sellerNote}
              onNoteChange={handleNoteChange} // Kirim handler catatan
              isDifferentShippingAddress={isDifferentShippingAddress}
              onToggleDifferentAddress={handleShippingAddressToggle} // Kirim handler toggle
              shippingAddress={shippingAddress} // Kirim state alamat kirim
              onShippingAddressChange={handleShippingAddressChange} // Kirim handler perubahan alamat kirim
            />

            {/* Shipping & Payment */}
            <ShippingPaymentSection
              shippingProviderId={shippingProviderId}
              shippingProviders={shippingProviders}
              onShippingProviderChange={handleShippingProviderChange}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={handlePaymentMethodChange}
            />

            {/* Order Summary (Contoh) */}
            <OrderSummary
              orderItems={orderItems}
              shippingProviderId={shippingProviderId}
              shippingProviders={shippingProviders}
              paymentMethod={paymentMethod}
              calculatedTotalString={calculateTotal()} // Kirim string total
            />

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting} /* ... other props ... */
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Simpan Order"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default AcquisitionOrderPage;
