// backend/controllers/productController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const searchProducts = async (req, res) => {
  const { q } = req.query; // Ambil parameter pencarian 'q'
  if (!q || q.length < 2) {
    return res.json([]); // Kembalikan array kosong jika query terlalu pendek
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
      },
      take: 10, // Batasi hasil maksimal 10 produk
    });

    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Gagal mencari produk." });
  }
};

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

const getAllProducts = async (req, res) => {
  // Ambil query params untuk pagination dan search
  const page = parseInt(req.query.page) || 1; // Halaman saat ini, default 1
  const limit = parseInt(req.query.limit) || 10; // Jumlah item per halaman, default 10
  const searchQuery = req.query.search || ""; // Query pencarian (opsional)

  const skip = (page - 1) * limit; // Hitung jumlah item yg dilewati

  try {
    // Siapkan kondisi where untuk pencarian
    const whereCondition = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { sku: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {}; // Kosong jika tidak ada query pencarian

    // Hitung total produk yg cocok (untuk pagination)
    const totalProducts = await prisma.product.count({
      where: whereCondition,
    });

    // Ambil data produk sesuai pagination dan pencarian
    const products = await prisma.product.findMany({
      where: whereCondition,
      select: {
        // Pilih field yang relevan untuk list
        id: true,
        name: true,
        sku: true,
        price: true,
        stock: true, // Stock global (mungkin perlu join WarehouseStock nanti)
        createdAt: true,
        updatedAt: true,
      },
      skip: skip, // Lewati item sejumlah 'skip'
      take: limit, // Ambil item sejumlah 'limit'
      orderBy: {
        createdAt: "desc", // Urutkan berdasarkan terbaru
      },
    });

    // Kirim respons dengan data produk dan info pagination
    res.json({
      products: products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalCount: totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Internal server error saat mengambil produk." });
  }
};

module.exports = {
  searchProducts, // Pastikan search tetap diekspor
  createProduct, // Ekspor fungsi baru
  getAllProducts, // Ekspor fungsi baru untuk mendapatkan semua produk
};
