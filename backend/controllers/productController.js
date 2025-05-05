// backend/controllers/productController.js (Contoh)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/products/search?q=...
const searchProducts = async (req, res) => {
  const query = req.query.q || ''; // Ambil query pencarian

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [ // Cari berdasarkan nama ATAU sku
          { name: { contains: query, mode: 'insensitive' } }, // Cari nama (case-insensitive)
          { sku: { contains: query, mode: 'insensitive' } }   // Cari SKU (case-insensitive)
        ]
      },
      select: { // Pilih hanya ID dan nama/SKU untuk dropdown
        id: true,
        name: true,
        sku: true,
        price: true // Kirim harga juga agar bisa tampil di frontend
      },
      take: 20 // Batasi jumlah hasil
    });
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchProducts /*, fungsi product lain */ };