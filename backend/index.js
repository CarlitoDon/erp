// index.js
require('dotenv').config(); // Pastikan ini di paling atas
const express = require("express");
const cors = require("cors");
const os = require('os'); // Untuk getLocalIP jika masih dipakai

const apiRoutes = require('./routes');

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

app.use("/api", apiRoutes);

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
  console.log(`Backend server running on http://localhost:${PORT}`);
});