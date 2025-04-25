// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Penting!
import { Box } from '@mui/material';
import Navbar from '../components/Navbar/Navbar'; // Sesuaikan path jika perlu
import Sidebar from '../components/Sidebar/Sidebar'; // Sesuaikan path jika perlu

// Asumsi lebar default Sidebar (sesuaikan jika berbeda)
const SIDEBAR_WIDTH = 240;

function MainLayout() {
  // State untuk mengontrol visibilitas Sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default terbuka

  // Fungsi untuk membuka/menutup Sidebar (akan dipicu oleh Navbar)
  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Fungsi untuk menutup Sidebar (bisa digunakan oleh backdrop/swipe di mobile)
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}> {/* Pastikan layout flex */}
      {/* Navbar: Berikan fungsi untuk toggle sidebar */}
      <Navbar onMenuClick={handleSidebarToggle} /* mungkin perlu prop lain */ />

      {/* Sidebar: Berikan state open dan fungsi close */}
      <Sidebar
        open={isSidebarOpen}
        onClose={handleSidebarClose}
        width={SIDEBAR_WIDTH} // Mungkin perlu pass width jika dinamis
      />

      {/* Konten Utama Halaman */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Biarkan konten utama mengisi sisa ruang
          p: 3, // Beri padding dasar
          width: { sm: `calc(100% - ${isSidebarOpen ? SIDEBAR_WIDTH : 0}px)` }, // Sesuaikan lebar saat sidebar berubah
          // Penting: Atasi tumpang tindih dengan Navbar jika Navbar 'fixed'
          // Anda mungkin perlu menambahkan Toolbar kosong dari MUI di sini
          // import { Toolbar } from '@mui/material';
          // <Toolbar />
          mt: '64px', // Asumsi tinggi Navbar 64px, sesuaikan!
          transition: (theme) => theme.transitions.create('margin', { // Transisi halus saat sidebar muncul/hilang
             easing: theme.transitions.easing.sharp,
             duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: { // Geser konten ke kiri saat sidebar hilang
             xs: 0, // Di layar kecil mungkin sidebar overlay, bukan push content
             sm: `-${isSidebarOpen ? 0 : SIDEBAR_WIDTH}px` // Di layar besar, geser saat sidebar hilang
          },
           ...(isSidebarOpen && { // Saat sidebar terbuka
             transition: (theme) => theme.transitions.create('margin', {
               easing: theme.transitions.easing.easeOut,
               duration: theme.transitions.duration.enteringScreen,
             }),
             marginLeft: 0, // Kembali ke posisi normal
           }),
        }}
      >
        {/* Ini adalah placeholder di mana komponen halaman (Route) akan dirender */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;