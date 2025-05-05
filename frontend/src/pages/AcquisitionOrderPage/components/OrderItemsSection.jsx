// src/pages/AcquisitionOrderPage/components/OrderItemsSection.jsx
import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Import komponen baris item
import OrderItemRow from './OrderItemRow';

const OrderItemsSection = ({
  orderItems,             // Array state item pesanan
  productOptions,         // Opsi produk untuk Autocomplete
  productLoading,         // Status loading produk
  onItemChange,           // Handler perubahan field item (diteruskan ke OrderItemRow)
  onRemoveItem,           // Handler hapus item (diteruskan ke OrderItemRow)
  onAddItem,              // Handler tambah item baru
  onProductInputChange,   // Handler input Autocomplete (diteruskan ke OrderItemRow)
  calculateTotal,         // String hasil kalkulasi total (dari parent)
}) => {
  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header Card */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            bgcolor: '#f9f9f9',
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          <ShoppingCartIcon sx={{ mr: 1.5, color: '#3f51b5' }} />
          <Typography variant="h6" fontWeight="600">
            Produk yang Dipesan
          </Typography>
        </Box>

        {/* Konten - Daftar Item */}
        <Box sx={{ p: 3 }}>
          {/* Mapping/Iterasi untuk setiap item pesanan */}
          {orderItems.map((item, index) => (
            <OrderItemRow
              key={index} // Gunakan index sebagai key jika tidak ada ID unik sementara
                          // Idealnya gunakan ID unik jika item bisa di-reorder
              item={item}
              index={index}
              orderItemsCount={orderItems.length} // Kirim jumlah item untuk logic tombol hapus
              productOptions={productOptions}
              productLoading={productLoading}
              onItemChange={onItemChange}
              onRemoveItem={onRemoveItem}
              onProductInputChange={onProductInputChange} // Teruskan handler ini
            />
          ))}

          {/* Tombol Tambah Item & Total */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2, // Margin atas setelah item terakhir
              flexWrap: 'wrap', // Agar responsif jika layar sempit
              gap: 2 // Jarak antar elemen jika wrap
            }}
          >
            {/* Tombol Tambah Produk */}
            <Button
              onClick={onAddItem} // Panggil handler dari parent
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                borderRadius: 6,
                bgcolor: '#e8eaf6',
                color: '#3f51b5',
                '&:hover': {
                  bgcolor: '#c5cae9',
                },
                px: 2,
                textTransform: 'none' // Agar teks tidak uppercase
              }}
            >
              Tambah Produk Lain
            </Button>

            {/* Tampilan Total Pesanan */}
            <Box
              sx={{
                bgcolor: '#f5f5f5',
                p: 1.5, // Padding disesuaikan
                borderRadius: 2,
                // display: 'inline-block', // Tidak perlu jika flex parent
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Total Pesanan: Rp {calculateTotal} {/* Tampilkan string total dari props */}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderItemsSection;