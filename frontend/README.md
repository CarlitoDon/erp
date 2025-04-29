# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# Dokumentasi Role Pengguna dan Hak Akses ERP

Dokumen ini mencatat berbagai role pengguna yang didefinisikan dalam sistem ERP ini beserta ringkasan tanggung jawab dan hak akses utama mereka. Ini berfungsi sebagai panduan tingkat tinggi untuk pengembangan dan pemeliharaan.

*(Catatan: Hak akses detail diimplementasikan di backend melalui pemeriksaan role pada setiap endpoint API dan di frontend untuk menyembunyikan/menampilkan elemen UI secara kondisional.)*

---

## 1. `ADMIN` / `SUPER_ADMIN` (Super Administrator)

*   **Tanggung Jawab:** Pengelolaan penuh dan konfigurasi sistem ERP.
*   **Hak Akses Utama:**
    *   Akses ke semua modul dan data tanpa batasan.
    *   Manajemen Pengguna (membuat, mengedit, menghapus, mengubah role).
    *   Manajemen semua Pengaturan (Koneksi Toko, Gudang, dll.).
    *   Melihat semua jenis Pesanan (Marketplace, Akuisisi, Retensi).
    *   Melihat semua Laporan dan Analitik.
    *   Konfigurasi sistem dasar.
*   **Batasan Utama:** Tidak ada batasan fungsional di dalam aplikasi.

## 2. `SALES_ACQUISITION` (Tim Akuisisi / CS WA Baru)

*   **Tanggung Jawab:** Menangani prospek baru dan menghasilkan penjualan awal melalui WhatsApp.
*   **Hak Akses Utama:**
    *   Mengelola Lead/Prospek (jika ada fiturnya).
    *   **Membuat data Customer baru.**
    *   **Membuat Pesanan** dengan channel `WHATSAPP_ACQUISITION`, menautkannya ke customer (baru/lama) dan ID Sales Rep sendiri.
    *   Melihat daftar pesanan yang dibuatnya sendiri atau semua pesanan akuisisi.
    *   Melihat detail Produk (harga, stok dasar).
*   **Batasan Utama:**
    *   Tidak bisa membuat pesanan dari channel lain (Marketplace, Retensi).
    *   Tidak bisa mengelola Koneksi Toko Marketplace.
    *   Tidak bisa mengelola Pengguna lain.
    *   Akses terbatas ke data Customer yang tidak terkait langsung.

## 3. `SALES_RETENTION` (Tim Retensi / CS WA Lama)

*   **Tanggung Jawab:** Menangani pelanggan yang sudah ada, menjaga hubungan, dan menghasilkan penjualan berulang melalui WhatsApp.
*   **Hak Akses Utama:**
    *   Mencari dan Melihat data **Customer yang sudah ada**.
    *   **Membuat Pesanan** dengan channel `WHATSAPP_RETENTION`, *harus* memilih Customer yang sudah ada, menautkannya ke ID Sales Rep sendiri.
    *   Melihat daftar pesanan yang dibuatnya sendiri atau semua pesanan retensi.
    *   Melihat riwayat pesanan Customer tertentu.
    *   Melihat detail Produk.
    *   Mengelola fitur Loyalitas/Feedback (jika ada).
*   **Batasan Utama:**
    *   **Tidak bisa membuat data Customer baru.**
    *   Tidak bisa membuat pesanan dari channel lain (Marketplace, Akuisisi).
    *   Tidak bisa mengelola Koneksi Toko Marketplace.
    *   Tidak bisa mengelola Pengguna lain.

## 4. `MARKETPLACE_MANAGER` (Pengelola Marketplace)

*   **Tanggung Jawab:** Mengelola integrasi dan operasional toko di platform marketplace.
*   **Hak Akses Utama:**
    *   Melihat Dashboard Marketplace.
    *   Mengelola **Koneksi Toko (`StoreConnection`)**: Menambah, mengedit (dengan batasan keamanan kredensial), menonaktifkan, menghapus.
    *   Melihat daftar Pesanan dari channel `MARKETPLACE`.
    *   Menggunakan fitur **Import Order Manual** untuk toko tipe `MANUAL`.
    *   Melihat status/log sinkronisasi API.
    *   Mengelola pengaturan Produk spesifik marketplace (jika ada).
*   **Batasan Utama:**
    *   Tidak bisa membuat pesanan WA (Akuisisi/Retensi).
    *   Akses terbatas ke manajemen Customer.
    *   Tidak bisa mengelola Pengguna lain.

## 5. `WAREHOUSE_STAFF` (Staf Gudang / Fulfillment)

*   **Tanggung Jawab:** Memproses pesanan untuk pengiriman dan mengelola inventaris fisik.
*   **Hak Akses Utama:**
    *   Melihat daftar Pesanan yang siap diproses/dikirim (berdasarkan status tertentu).
    *   Mengupdate status Pesanan (misal: menjadi 'Shipped', memasukkan nomor resi).
    *   Melihat dan Mengelola Stok Gudang (`WarehouseStock`).
    *   Melakukan penyesuaian stok (Stock Opname, Barang Masuk/Keluar).
*   **Batasan Utama:**
    *   Tidak bisa membuat Pesanan baru.
    *   Akses terbatas/tidak ada ke detail finansial pesanan (harga pokok, diskon detail?).
    *   Tidak bisa mengelola Customer, Koneksi Toko, atau Pengguna.

## 6. `FINANCE_STAFF` (Staf Keuangan - Opsional)

*   **Tanggung Jawab:** Memantau aspek keuangan, pembayaran, dan rekonsiliasi.
*   **Hak Akses Utama:**
    *   Melihat semua detail finansial Pesanan.
    *   Mengakses Laporan Penjualan dan Pembayaran.
    *   Menandai status pembayaran (jika diperlukan).
*   **Batasan Utama:** Akses terbatas ke fitur operasional non-keuangan (fulfillment, manajemen toko, dll.).

---

*Dokumentasi ini terakhir diperbarui pada: [Tanggal Hari Ini]*