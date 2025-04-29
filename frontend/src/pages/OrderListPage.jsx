// src/pages/OrderListPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; // 1. Import DataGrid
import { format } from "date-fns"; // Untuk format tanggal (install: npm install date-fns)
import { id } from "date-fns/locale"; // Locale Indonesia

// Import filter jika sudah dibuat
// import OrderFilters from '../components/Orders/OrderFilters';

function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);

  const fetchOrders = async (currentFilters, currentPage, currentPageSize) => {
    setLoading(true);
    setError(null);
    console.log(
      "TODO: Fetch orders from API with filters:",
      currentFilters,
      "page:",
      currentPage,
      "pageSize:",
      currentPageSize
    );
    try {
      // --- Pastikan API Anda mengembalikan data termasuk relasi storeConnection ---
      // Contoh: /api/orders?page=1&limit=10&... (include storeConnection)
      // const response = await fetch(...);
      // const data = await response.json();
      // setOrders(data.orders); // data.orders harus array objek Order
      // setTotalRows(data.totalCount);

      // --- Data Dummy (Pastikan strukturnya mirip hasil join) ---
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const dummyData = [
        {
          id: 101,
          platformOrderId: "TIKTOK-123",
          storeConnection: {
            erpStoreName: "TikTok Fun",
            platform: "TiktokShop",
          },
          orderCreatedAt: new Date().toISOString(),
          customerName: "Budi S.",
          totalAmountPaidByBuyer: 150000,
          platformOrderStatus: "To Ship",
        },
        {
          id: 102,
          platformOrderId: "SHOPEE-456",
          storeConnection: {
            erpStoreName: "Toko Shopee Utama",
            platform: "Shopee",
          },
          orderCreatedAt: new Date().toISOString(),
          customerName: "Ani L.",
          totalAmountPaidByBuyer: 85000,
          platformOrderStatus: "Completed",
        },
        {
          id: 103,
          platformOrderId: "TOKOPEDIA-789",
          storeConnection: {
            erpStoreName: "Toko Coba Tokped",
            platform: "Tokopedia",
          },
          orderCreatedAt: "2025-04-28T10:00:00Z",
          customerName: "Citra D.",
          totalAmountPaidByBuyer: 210000,
          platformOrderStatus: "Delivered",
        },
      ];
      // Mapping sederhana untuk data dummy agar sesuai dengan 'field' di columns
      const mappedOrders = dummyData.map((o) => ({
        ...o,
        erpStoreName: o.storeConnection.erpStoreName, // Ambil dari nested object
        platform: o.storeConnection.platform, // Ambil dari nested object
      }));
      setOrders(mappedOrders);
      setTotalRows(dummyData.length);
      // --- Akhir Data Dummy ---
    } catch (err) {
      setError(err.message || "Failed to fetch orders.");
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(filters, paginationModel.page, paginationModel.pageSize);
  }, [filters, paginationModel]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  // 2. Definisikan Kolom untuk DataGrid
  const columns = [
    {
      field: "platformOrderId",
      headerName: "Order ID Platform",
      width: 180,
    },
    {
      field: "erpStoreName",
      headerName: "Nama Toko (ERP)",
      width: 180,
    },
    {
      field: "platform",
      headerName: "Platform",
      width: 110,
    },
    {
      field: "orderCreatedAt",
      headerName: "Tgl Order",
      width: 160,
      renderCell: (params) =>
        format(new Date(params.value), "dd MMM yyyy HH:mm", { locale: id }),
    },
    {
      field: "customerName",
      headerName: "Nama Pelanggan",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "totalAmountPaidByBuyer",
      headerName: "Total Bayar",
      width: 130,
      type: "number",
      renderCell: (params) => `Rp ${params.value.toLocaleString("id-ID")}`,
      align: "right", // Rata kanan untuk angka/mata uang
      headerAlign: "right",
    },
    {
      field: "platformOrderStatus",
      headerName: "Status",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Aksi",
      sortable: false,
      filterable: false,
      // --- PERUBAHAN DI SINI ---
      width: 120, // 1. Tambah lebar kolom sedikit
      align: "center", // 2. Pusatkan konten sel
      headerAlign: "center", // 2. Pusatkan header juga
      renderCell: (params) => (
        <Button
          variant="outlined" // 3. Ubah varian menjadi outlined
          color="primary" // Pastikan warna sesuai tema
          size="small"
          onClick={() => {
            console.log("View order:", params.row.id);
            // TODO: Implementasi navigasi ke detail atau buka modal
            // navigate(`/sales/orders/${params.row.id}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <Box>
      {/* ... Judul, Filter Placeholder ... */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={orders}
          columns={columns} // Gunakan definisi kolom yang diperbarui
          loading={loading}
          rowCount={totalRows}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={handlePaginationModelChange}
        />
      </Paper>
    </Box>
  );
}

export default OrderListPage;
