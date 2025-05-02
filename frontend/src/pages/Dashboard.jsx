//scr/pages/Dashboard.jsx

import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import DashboardCard from "../components/DashboardCard/DashboardCard";

function Dashboard() {
  const data = {
    orderProduk: [
      { title: "Total Produk Aktif", value: "150 Produk", to: "/produk" },
      { title: "Stok Hampir Habis", value: "12 SKU", to: "/produk" },
      { title: "Total Order Hari Ini", value: "32 Order", to: "/order" },
      { title: "Order Belum Diproses", value: "8 Order", to: "/order" },
    ],
    penjualanKeuangan: [
      { title: "Omzet Bulan Ini", value: "Rp 45.000.000", to: "/keuangan" },
      { title: "Pendapatan Bersih", value: "Rp 21.000.000", to: "/keuangan" },
      { title: "Rata-rata Order per Hari", value: "27 Order", to: "/keuangan" },
      { title: "Top Produk Terjual", value: "FiberPlus 250gr", to: "/produk" },
    ],
    customer: [
      { title: "Customer Baru Bulan Ini", value: "93 Orang", to: "/customer" },
      { title: "Repeat Order", value: "58 Order", to: "/customer" },
      { title: "Customer Aktif", value: "124 Orang", to: "/customer" },
    ],
    marketing: [
      { title: "CTR Iklan (Meta Ads)", value: "3.5%", to: "/marketing" },
      { title: "Total Leads Masuk", value: "412 Leads", to: "/marketing" },
      {
        title: "Biaya Per Akuisisi (CPA)",
        value: "Rp 35.000",
        to: "/marketing",
      },
    ],
    operasional: [
      { title: "Pengiriman Hari Ini", value: "27 Paket", to: "/operasional" },
      { title: "Retur Barang", value: "3 Produk", to: "/operasional" },
      { title: "Keluhan Pelanggan", value: "5 Tiket", to: "/operasional" },
    ],
  };

  const renderSection = (title, items) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {items.map((item, idx) => (
          <Grid
            columns={12}
            key={idx}
            sx={{
              gridColumn: {
                xs: "span 12", // full width di layar kecil
                sm: "span 6", // setengah layar di layar sedang
                md: "span 3", // 1/4 layar di layar besar
              },
            }}
          >
            <DashboardCard
              title={item.title}
              value={item.value}
              to={item.to} // Menambahkan props to untuk menavigasi
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard Utama
      </Typography>

      {renderSection("📦 Data Order & Produk", data.orderProduk)}
      {renderSection("💰 Penjualan & Keuangan", data.penjualanKeuangan)}
      {renderSection("👥 Customer", data.customer)}
      {renderSection("📈 Marketing & Performa", data.marketing)}
      {renderSection("🚚 Operasional", data.operasional)}
    </Box>
  );
}

export default Dashboard;
