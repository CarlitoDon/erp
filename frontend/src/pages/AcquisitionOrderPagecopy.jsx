// src/pages/AcquisitionOrderPage/AcquisitionOrderPage.jsx (File Utama Baru)
import React, { useState, useEffect, useCallback } from "react";
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
import { useAuth } from "../contexts/AuthContext"; // <-- Sesuaikan path jika perlu
import useDebounce from "../hooks/useDebounce"; // <-- Sesuaikan path jika perlu

// Import komponen-komponen yang sudah dipecah
import CustomerInfoForm from "./AcquisitionOrderPage/components/CustomerInfoForm";
import OrderItemsSection from "./AcquisitionOrderPage/components/OrderItemsSection";
// import OrderItemRow from "./AcquisitionOrderPage/components/OrderItemRow"; // Jika perlu
import NotesShippingSection from "./AcquisitionOrderPage/components/NotesShippingSection";
import ShippingPaymentSection from "./AcquisitionOrderPage/components/ShippingPaymentSection";
import OrderSummary from "./AcquisitionOrderPage/components/OrderSummary"; // Jika dibuat terpisah

// Impor Ikon hanya yang dibutuhkan di file ini (jika ada)
// ... ikon lain mungkin dipindahkan ke komponen anak

const AcquisitionOrderPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

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
  const [totalPayment, setTotalPayment] = useState(""); // Opsional
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

  // --- Fetch Product Options ---
  const fetchProductOptions = useCallback(
    async (searchTerm) => {
      // ... (logika fetch produk seperti sebelumnya)
      // Pastikan menggunakan 'token' dari scope ini
      if (!token || !searchTerm || searchTerm.length < 2) {
        /* ... */ return;
      }
      setProductLoading(true);
      try {
        const response = await fetch(/* ... */);
        // ... handle response ...
        setProductOptions(data || []);
      } catch (error) {
        /* ... */
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
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
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
    return totalValue.toLocaleString('id-ID');
  
  }, [orderItems]); // Dependensi sudah benar

  // --- Fetch Shipping Providers ---
  useEffect(() => {
    const fetchProviders = async () => {
      /* ... logika fetch ... */ setShippingProviders(/* data */);
    };
    fetchProviders();
  }, []); // Mungkin perlu token jika API butuh auth

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

  // --- Submit Handler ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    // Lakukan validasi di sini menggunakan state yang ada
    if (orderItems.some((item) => !item.product?.id)) {
      /* ... set error ... */ return;
    }
    if (!shippingProviderId) {
      /* ... set error ... */ return;
    }
    if (!customerDetails.name /* ... validasi customer lain ... */) {
      /* ... set error ... */ return;
    }
    if (
      isDifferentShippingAddress &&
      !shippingAddress.name /* ... validasi alamat kirim ... */
    ) {
      /* ... set error ... */ return;
    }

    // Siapkan payload
    const customerData = { ...customerDetails }; // dari state customerDetails
    const finalShippingAddress = isDifferentShippingAddress
      ? { ...shippingAddress }
      : customerData;

    const payload = {
      newCustomer: customerData,
      orderItems: orderItems.map((item) => ({
        /* ... data item ... */
      })),
      buyerNote: buyerNote || null,
      sellerNote: sellerNote || null,
      shippingAddressSnapshot: finalShippingAddress,
      shippingProviderId: parseInt(shippingProviderId) || null,
      paymentMethod: paymentMethod || null,
      orderChannel: "WHATSAPP_ACQUISITION",
      // Mungkin tambahkan totalPayment jika perlu dikirim ke backend
      // paymentTotal: totalPayment ? parseFloat(totalPayment) : null
    };

    console.log("Data form yang akan dikirim:", payload);

    try {
      const response = await fetch("/api/orders", {
        /* ... */
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
      // ... handle error ...
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // == Render Komponen Anak ==
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper /* ... props paper ... */>
        {/* Header */}
        <Box /* ... props header ... */>
          <Typography variant="h4">Form Input Order Akuisisi</Typography>
          {/* ... */}
        </Box>

        <Box sx={{ px: 4, pb: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* Alert */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
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
              totalPayment={totalPayment}
              onTotalPaymentChange={handleTotalPaymentChange}
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
