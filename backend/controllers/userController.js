// controllers/userController.js
const { PrismaClient, UserRole } = require('@prisma/client'); // Import Enum jika diperlukan
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Tingkat kesulitan hashing

// GET /api/users - Mendapatkan semua user (ADMIN only)
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { // Jangan kirim password hash!
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc', // Urutkan dari yg terbaru
      }
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/users - Membuat user baru (ADMIN only)
const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  // Validasi input dasar
  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required" });
  }

  // Validasi role (pastikan role ada di Enum)
  if (!Object.values(UserRole).includes(role)) {
     return res.status(400).json({ message: "Invalid role specified" });
  }

  try {
    // Cek jika username sudah ada
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" }); // Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role, // Role dari request body
      },
      select: { // Pilih data yg dikembalikan (tanpa password)
        id: true,
        username: true,
        role: true,
        createdAt: true,
      }
    });

    res.status(201).json(newUser); // Created
  } catch (error) {
    console.error("Error creating user:", error);
    // Tangani potensi error constraint lain jika ada
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/users/:id - Mengupdate user (ADMIN only)
const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { role } = req.body; // Hanya izinkan update role untuk contoh ini

  if (isNaN(userId)) {
     return res.status(400).json({ message: "Invalid user ID" });
  }

  // Validasi role jika ada di body
  if (role && !Object.values(UserRole).includes(role)) {
     return res.status(400).json({ message: "Invalid role specified" });
  }

  // Jangan izinkan update password di sini, buat endpoint terpisah/reset
  // Jangan izinkan update username (karena unique)

  try {
     // Cek jika user ada
     const userToUpdate = await prisma.user.findUnique({ where: { id: userId } });
     if (!userToUpdate) {
         return res.status(404).json({ message: "User not found" });
     }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role || userToUpdate.role, // Update role jika diberikan, jika tidak pakai yg lama
        // updatedAt akan otomatis diupdate oleh Prisma
      },
       select: { // Pilih data yg dikembalikan
        id: true,
        username: true,
        role: true,
        updatedAt: true,
      }
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/users/:id - Menghapus user (ADMIN only)
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);

   if (isNaN(userId)) {
     return res.status(400).json({ message: "Invalid user ID" });
  }

  // Jangan biarkan admin menghapus dirinya sendiri
  if (req.user && req.user.id === userId) {
     return res.status(400).json({ message: "Cannot delete your own account" });
  }

  try {
     // Cek jika user ada
     const userToDelete = await prisma.user.findUnique({ where: { id: userId } });
     if (!userToDelete) {
         return res.status(404).json({ message: "User not found" });
     }

    // Hapus user
    await prisma.user.delete({
      where: { id: userId },
    });
    // Mungkin perlu menangani relasi (misal: set ordersCreated.salesRepId jadi null?)
    // tergantung onDelete rule di schema Anda

    res.status(204).send(); // No Content
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    // Tangani error jika user masih punya relasi yg mencegah delete
    if (error.code === 'P2003') { // Foreign key constraint failed
        return res.status(409).json({ message: "Cannot delete user: User is still referenced by other records (e.g., orders, connections)." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};