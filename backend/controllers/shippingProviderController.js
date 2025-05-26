// backend/controllers/shippingProviderController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mendapatkan semua shipping providers
const getAllShippingProviders = async (req, res) => {
  try {
    const shippingProviders = await prisma.shippingProvider.findMany();
    res.status(200).json(shippingProviders);
  } catch (error) {
    console.error('Gagal mendapatkan shipping providers:', error);
    res.status(500).json({ message: 'Gagal mendapatkan daftar shipping providers dari server.' });
  }
};

// Menambahkan shipping provider baru
const addShippingProvider = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Nama penyedia pengiriman tidak boleh kosong.' });
  }

  try {
    const newShippingProvider = await prisma.shippingProvider.create({
      data: {
        name: name,
      },
    });
    res.status(201).json(newShippingProvider);
  } catch (error) {
    console.error('Gagal menambahkan shipping provider:', error);
    res.status(500).json({ message: 'Gagal menambahkan penyedia pengiriman ke server.' });
  }
};

// Menghapus shipping provider berdasarkan ID
const deleteShippingProvider = async (req, res) => {
  const { id } = req.params;

  try {
    const shippingProvider = await prisma.shippingProvider.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!shippingProvider) {
      return res.status(404).json({ message: `Penyedia pengiriman dengan ID ${id} tidak ditemukan.` });
    }

    await prisma.shippingProvider.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: `Penyedia pengiriman dengan ID ${id} berhasil dihapus.` });
  } catch (error) {
    console.error(`Gagal menghapus shipping provider dengan ID ${id}:`, error);
    res.status(500).json({ message: `Gagal menghapus penyedia pengiriman dengan ID ${id} dari server.` });
  }
};

module.exports = {
  getAllShippingProviders,
  addShippingProvider,
  deleteShippingProvider, // <-- Export fungsi delete
};