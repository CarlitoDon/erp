// src/pages/AcquisitionOrderPage/components/OrderItemsSection.jsx
import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid, // Import Grid
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// Import komponen baris item
import OrderItemRow from "./OrderItemRow";

const OrderItemsSection = ({
  orderItems,
  productOptions,
  productLoading,
  onItemChange,
  onRemoveItem,
  onAddItem,
  onProductInputChange,
  calculateTotal, // Menerima string total yang sudah diformat
}) => {
  return (
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
          {/* Mapping/Iterasi */}
          {orderItems.map((item, index) => (
            <OrderItemRow
              // Key dipindah ke Paper di dalam OrderItemRow
              item={item}
              index={index}
              orderItemsCount={orderItems.length}
              productOptions={productOptions}
              productLoading={productLoading}
              onItemChange={onItemChange}
              onRemoveItem={onRemoveItem}
              onProductInputChange={onProductInputChange}
            />
          ))}

          {/* Box untuk Tombol Tambah & Total (Mirip kode lama) */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2, // Sama seperti kode lama
              flexWrap: "wrap", // Responsif
              gap: 2, // Jarak jika wrap
            }}
          >
            {/* Tombol Tambah Produk (Styling dari kode lama) */}
            <Button
              onClick={onAddItem}
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                borderRadius: 6, // Dari kode lama
                bgcolor: "#e8eaf6", // Dari kode lama
                color: "#3f51b5", // Dari kode lama
                "&:hover": {
                  bgcolor: "#c5cae9", // Dari kode lama
                },
                px: 2, // Dari kode lama
                // Hapus textTransform: 'none' jika ingin uppercase seperti default Button
              }}
            >
              Tambah Produk {/* Ubah teks kembali */}
            </Button>

            {/* Tampilan Total Pesanan (Styling dari kode lama) */}
            <Box
              sx={{
                bgcolor: "#f5f5f5", // Dari kode lama
                p: 2, // <-- Ubah kembali ke p: 2
                borderRadius: 2, // Dari kode lama
                display: "inline-block", // <-- Tambahkan kembali dari kode lama
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Total Pesanan: Rp {calculateTotal}{" "}
                {/* Tampilkan string total */}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderItemsSection;
