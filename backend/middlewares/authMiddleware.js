// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken"); // npm install jsonwebtoken
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Definisikan ROLES agar konsisten dengan Prisma Enum (jika perlu)
const UserRole = {
  ADMIN: "ADMIN",
  SALES_ACQUISITION: "SALES_ACQUISITION",
  SALES_RETENTION: "SALES_RETENTION",
  MARKETPLACE_MANAGER: "MARKETPLACE_MANAGER",
  WAREHOUSE_STAFF: "WAREHOUSE_STAFF",
  FINANCE_STAFF: "FINANCE_STAFF",
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // Jika tidak ada token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err.message);
      return res.sendStatus(403); // Jika token tidak valid/expired, forbidden
    }

    try {
      // Ambil data user terbaru dari DB berdasarkan ID di token
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }, // Asumsi payload token punya userId
        select: { id: true, username: true, role: true }, // Pilih field yg dibutuhkan
      });

      if (!user) {
        console.log(`User not found for token ID: ${decoded.userId}`);
        return res.sendStatus(403); // User tidak ditemukan
      }

      req.user = user; // Simpan data user (id, username, role) di request
      next(); // Lanjut ke middleware/handler berikutnya
    } catch (dbError) {
      console.error("DB Error in authenticateToken:", dbError);
      return res.sendStatus(500); // Internal server error
    }
  });
};

const authorizeAdmin = (req, res, next) => {
  // Middleware ini dijalankan SETELAH authenticateToken
  if (req.user && req.user.role === UserRole.ADMIN) {
    next(); // User adalah Admin, izinkan lanjut
  } else {
    res.status(403).json({ message: "Forbidden: Requires Admin role" }); // Bukan Admin, tolak akses
  }
};

// Middleware untuk otorisasi berdasarkan peran (menerima array peran)
const authorize = (roles = []) => {
  return (req, res, next) => {
    // Middleware ini dijalankan SETELAH authenticateToken
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (roles.length === 0) {
      return next(); // Jika tidak ada peran spesifik yang dibutuhkan, lanjutkan
    }

    if (roles.includes(req.user.role)) {
      next(); // Peran pengguna sesuai dengan salah satu peran yang diizinkan
    } else {
      res.status(403).json({
        message: `Forbidden: Requires one of the following roles: ${roles.join(
          ", "
        )}`,
      }); // Peran tidak sesuai, tolak akses
    }
  };
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
  authorize, // Ekspor fungsi authorize
};