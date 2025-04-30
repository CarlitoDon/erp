// backend/controllers/authController.js
const { PrismaClient, UserRole } = require("@prisma/client"); // Import Enum UserRole
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET
const saltRounds = 10; // Pindahkan ke atas agar konsisten

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validasi input dasar
  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Username tidak ditemukan" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Buat token dengan id dan role
    const tokenPayload = {
        userId: user.id, // Ganti nama field agar lebih jelas
        role: user.role // Masukkan role ke token
    };
    const token = jwt.sign(tokenPayload, SECRET_KEY, {
      expiresIn: "1d", // Sesuaikan expiry time sesuai kebutuhan
    });

    // Kembalikan token, username, dan role
    res.json({
        token,
        user: { // Kelompokkan info user
            id: user.id,
            username: user.username,
            role: user.role
        }
     });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;

   // Validasi input dasar
   if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }
   if (password.length < 6) { // Contoh validasi panjang password
       return res.status(400).json({ message: "Password minimal 6 karakter" });
   }


  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ message: "Username sudah terdaftar" }); // Gunakan 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds); // Gunakan saltRounds

    // Buat user baru dengan DEFAULT ROLE (misal: SALES_ACQUISITION)
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: UserRole.SALES_ACQUISITION, // <-- Tetapkan default role di sini
      },
      select: { // Pilih data yang dikembalikan
          id: true,
          username: true,
          role: true,
          createdAt: true
      }
    });

    // Jangan otomatis login setelah register, biarkan user login manual
    res.status(201).json({ message: "User berhasil terdaftar", user: newUser });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// HAPUS FUNGSI addStore DARI SINI
// exports.addStore = async (req, res) => { ... };