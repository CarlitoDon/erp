import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- TAMBAHKAN INI UNTUK PROXY API ---
  server: {
    proxy: {
      // String shorthand: '/api' -> 'http://localhost:5000/api'
      // '/api': 'http://localhost:5000', // Proxy request /api ke backend

      // Atau lebih detail jika perlu rewrite path atau konfigurasi lain
       '/api': {
         target: 'http://localhost:5000', // Target backend Anda
         changeOrigin: true, // Diperlukan untuk virtual hosted sites
         // secure: false, // Jika backend pakai https self-signed cert
         // rewrite: (path) => path.replace(/^\/api/, ''), // Hapus /api jika backend tidak mengharapkannya
       },
    },
    port: 3000, // Port untuk dev server frontend (opsional, default 5173)
  },
  // --- AKHIR PROXY ---
   // Opsional: Konfigurasi build
   build: {
     outDir: 'build', // Nama folder output build (default 'dist')
   },
});