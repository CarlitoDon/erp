// backend/controllers/productController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi searchProducts dari sebelumnya (jika sudah ada)
const searchProducts = async (req, res) => {
  // ... (kode searchProducts) ...
};

// --- FUNGSI BARU: Create Product ---
const createProduct = async (req, res) => {
  const { name, sku, price, stock } = req.body; // Ambil data dari body

  // Validasi Input Dasar
  if (!name || !sku || price === undefined || price === null) {
    return res
      .status(400)
      .json({ message: "Nama produk, SKU, dan Harga wajib diisi." });
  }
  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ message: "Harga harus angka positif." });
  }
  // Validasi stock (jika dikirim, harus angka positif)
  if (
    stock !== undefined &&
    stock !== null &&
    (typeof stock !== "number" || stock < 0)
  ) {
    return res.status(400).json({ message: "Stok harus angka positif." });
  }

  try {
    // Cek keunikan SKU
    const existingProduct = await prisma.product.findUnique({
      where: { sku: sku },
    });
    if (existingProduct) {
      return res.status(409).json({ message: `SKU '${sku}' sudah terdaftar.` }); // 409 Conflict
    }

    // Buat produk baru
    const newProduct = await prisma.product.create({
      data: {
        name: name,
        sku: sku,
        price: price,
        // Hati-hati dengan 'stock' ini, ini stock global.
        // Mungkin lebih baik dikelola via WarehouseStock.
        // Untuk simple, kita set di sini dulu.
        stock: stock || 0, // Default 0 jika tidak dikirim
      },
      select: {
        // Pilih data yang dikembalikan
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true,
        createdAt: true,
      },
    });

    res
      .status(201)
      .json({ message: "Produk berhasil ditambahkan", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    // Tangani error lain jika perlu
    res
      .status(500)
      .json({ message: "Internal server error saat membuat produk." });
  }
};

module.exports = {
  searchProducts, // Pastikan search tetap diekspor
  createProduct, // Ekspor fungsi baru
};
