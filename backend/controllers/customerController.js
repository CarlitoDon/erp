// backend/controllers/customerController.js
const { PrismaClient } = require('@prisma/client'); // <--- UBAH INI

const prisma = new PrismaClient();

const checkPhoneNumberAvailability = async (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ message: 'Nomor telepon wajib disertakan sebagai query parameter.' });
  }

  let formattedPhone = phone;
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.substring(1);
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: {
        phone: formattedPhone,
      },
      select: {
        id: true,
        name: true,
      }
    });

    if (customer) {
      return res.status(200).json({
        exists: true,
        message: 'Nomor telepon sudah terdaftar pada customer ' + customer.name + '.',
        customer: {
            id: customer.id,
            name: customer.name
        }
      });
    } else {
      return res.status(200).json({
        exists: false,
        message: 'Nomor telepon tersedia.'
      });
    }
  } catch (error) {
    console.error('Error saat memeriksa ketersediaan nomor telepon:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server saat memeriksa nomor telepon.' });
  }
};

module.exports = { // <--- UBAH INI
    checkPhoneNumberAvailability
};