// index.js (Versi Refaktor Final)
require('dotenv').config(); // Pastikan ini di paling atas
const express = require("express");
const cors = require("cors");
const os = require('os'); // Untuk getLocalIP jika masih dipakai

// 1. HAPUS import rute spesifik dari sini
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require('./routes/userRoutes');

// 2. Impor SATU router utama dari folder ./routes
const apiRoutes = require('./routes'); // Node.js akan otomatis mencari index.js di dalam folder routes

// Opsional: Cek variabel environment penting saat startup
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}
if (!process.env.DATABASE_URL) {
     console.error("FATAL ERROR: DATABASE_URL is not defined in environment variables.");
     process.exit(1);
}

const app = express();

// Middleware dasar
app.use(cors()); // Izinkan CORS
app.use(express.json()); // Parsing body JSON

// 3. HAPUS mounting rute spesifik dari sini
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);

// 4. Mount SEMUA rute API di bawah /api menggunakan router utama dari routes/index.js
app.use("/api", apiRoutes);

// (Opsional tapi bagus) Tambahkan Error Handling Middleware di sini nanti
// app.use((err, req, res, next) => { ... });


// Fungsi getLocalIP (opsional)
const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (!interfaces[name]) continue;
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`); // Log lebih simpel
  // console.log(`Backend server running on http://${getLocalIP()}:${PORT}`); // Jika ingin pakai IP lokal
});