// backend/controllers/orderController.js
const { PrismaClient, OrderChannel } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Membuat Order baru dari sumber manual (WA Akuisisi/Retensi).
 * Memerlukan data customer (baru atau ID), item order, dan info pengiriman.
 * Diasumsikan dijalankan setelah middleware authenticateToken (req.user tersedia).
 */
const createManualOrder = async (req, res) => {
    // Ambil data dari body request DAN user yang login dari middleware
    const {
        // Customer bisa baru atau ID yg sudah ada (tergantung channel)
        newCustomer, // Objek customer baru { name, phone, email?, address?, ... }
        existingCustomerId, // ID customer jika dari retensi (belum kita pakai di sini)

        // Detail Order
        orderItems, // Array of objects: [{ productId: Int, quantity: Int, price: Float, note: String? }]
        buyerNote,
        sellerNote,
        shippingAddressSnapshot, // Objek alamat pengiriman { name, phone, address, ... }
        shippingProviderId,
        paymentMethod,
        // totalPayment, // <-- Sebaiknya tidak diterima dari frontend, hitung di backend
        orderChannel, // Harus dikirim dari frontend ('WHATSAPP_ACQUISITION' atau 'WHATSAPP_RETENTION')
        orderCreatedAt // Opsional: Frontend bisa kirim waktu input, atau default now() di backend
    } = req.body;

    const salesRepId = req.user?.id; // Ambil ID Sales Rep dari user yang terautentikasi

    // --- Validasi Input Dasar ---
    if (!salesRepId) {
        return res.status(401).json({ message: "User tidak terautentikasi." });
    }
    if (!orderChannel || !Object.values(OrderChannel).includes(orderChannel)) {
        return res.status(400).json({ message: "Channel order tidak valid." });
    }
    // Validasi krusial untuk Akuisisi
    if (orderChannel === OrderChannel.WHATSAPP_ACQUISITION && !newCustomer?.phone) {
        return res.status(400).json({ message: "Nomor telepon customer baru wajib diisi untuk akuisisi." });
    }
    // Validasi krusial untuk Retensi (belum diimplementasikan di form ini)
    // if (orderChannel === OrderChannel.WHATSAPP_RETENTION && !existingCustomerId) {
    //     return res.status(400).json({ message: "ID Customer wajib dipilih untuk retensi." });
    // }
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return res.status(400).json({ message: "Minimal satu item produk harus ditambahkan." });
    }
    if (!shippingProviderId) {
        return res.status(400).json({ message: "Jasa kirim wajib dipilih." });
    }
    // Validasi item order (productId, quantity, price)
    for (const item of orderItems) {
        if (!item.productId || typeof item.productId !== 'number' || item.productId <= 0) {
            return res.status(400).json({ message: `Produk ID tidak valid untuk item: ${JSON.stringify(item)}` });
        }
        if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
            return res.status(400).json({ message: `Kuantitas tidak valid untuk produk ID ${item.productId}` });
        }
        if (typeof item.price !== 'number' || item.price < 0) { // Harga boleh 0?
            return res.status(400).json({ message: `Harga tidak valid untuk produk ID ${item.productId}` });
        }
    }
     // Validasi alamat pengiriman
     if (!shippingAddressSnapshot?.name || !shippingAddressSnapshot?.phone || !shippingAddressSnapshot?.address) {
        return res.status(400).json({ message: "Nama, telepon, dan alamat pengiriman wajib diisi." });
     }


    // --- Mulai Transaksi Database ---
    try {
        const result = await prisma.$transaction(async (tx) => {
            let customerId;
            let customerDataForOrder;

            // 1. Handle Customer (Buat baru untuk Akuisisi)
            if (orderChannel === OrderChannel.WHATSAPP_ACQUISITION && newCustomer) {
                // Coba cari dulu berdasarkan telepon (jika Anda ingin merge/update)
                 let existingCustomerByPhone = await tx.customer.findUnique({
                     where: { phone: newCustomer.phone },
                 });

                 if (existingCustomerByPhone) {
                     console.warn(`Customer dengan telepon ${newCustomer.phone} sudah ada (ID: ${existingCustomerByPhone.id}). Menggunakan customer yang ada.`);
                     customerId = existingCustomerByPhone.id;
                     customerDataForOrder = existingCustomerByPhone; // Simpan data customer yg ada
                     // Opsional: Update data customer yang ada jika perlu
                     // await tx.customer.update({ where: { id: customerId }, data: { ... } });
                 } else {
                     console.log("Membuat customer baru untuk:", newCustomer.phone);
                     const createdCustomer = await tx.customer.create({
                         data: {
                             name: newCustomer.name || `Customer ${newCustomer.phone}`, // Default nama jika kosong
                             phone: newCustomer.phone,
                             email: newCustomer.email || null,
                             address: newCustomer.address || null,
                             province: newCustomer.province || null,
                             city: newCustomer.city || null,
                             district: newCustomer.district || null,
                             village: newCustomer.village || null,
                             postalCode: newCustomer.postalCode || null,
                             // createdById: salesRepId // Jika perlu melacak siapa yg create
                         },
                     });
                     customerId = createdCustomer.id;
                     customerDataForOrder = createdCustomer; // Simpan data customer yg baru dibuat
                 }
            }
            // TODO: Tambahkan else if untuk channel Retensi (cari by existingCustomerId)
            else {
                 throw new Error("Logika customer untuk channel ini belum diimplementasikan.");
            }

            if (!customerId) {
                 throw new Error("Gagal menentukan ID customer.");
            }

            // 2. Validasi Produk dan Hitung Total Item
            let totalItemValue = 0;
            const validOrderItemsData = [];

            for (const item of orderItems) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) {
                    throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
                }
                // Di sini Anda bisa menambahkan validasi stok jika perlu
                // if (product.stock < item.quantity) { ... }

                const unitPriceAfterDiscount = parseFloat(item.price) || 0; // Ambil harga dari form
                const unitOriginalPrice = unitPriceAfterDiscount; // Asumsi tidak ada diskon manual di form ini
                const itemSubtotal = unitPriceAfterDiscount * item.quantity;
                totalItemValue += itemSubtotal;

                validOrderItemsData.push({
                    productId: product.id,
                    quantity: item.quantity,
                    unitOriginalPrice: unitOriginalPrice,
                    unitPriceAfterDiscount: unitPriceAfterDiscount,
                    productNameAtOrder: product.name, // Ambil nama produk saat ini
                    note: item.note || null,
                    // Anda bisa tambahkan field lain jika ada
                });
            }

            // 3. Hitung Total Order Keseluruhan (Sederhana untuk sekarang)
            // TODO: Tambahkan logika ongkir, diskon/biaya level order jika ada
            const shippingFee = 0; // Placeholder, perlu dihitung/diambil dari input/API kurir
            const totalAmountPaid = totalItemValue + shippingFee;

            // 4. Generate Platform Order ID Internal
            const internalPlatformOrderId = `WA-AQ-${Date.now()}-${customerId}`; // Contoh ID unik

            // 5. Buat Order Utama
            console.log("Membuat order...");
            const newOrder = await tx.order.create({
                data: {
                    orderChannel: orderChannel,
                    salesRepId: salesRepId,
                    platformOrderId: internalPlatformOrderId,
                    customerId: customerId,
                    shippingAddressSnapshot: shippingAddressSnapshot, // Simpan snapshot alamat kirim
                    orderCreatedAt: orderCreatedAt ? new Date(orderCreatedAt) : new Date(),
                    erpOrderStatus: 'PENDING', // Status awal internal
                    platformOrderStatus: 'MANUAL_INPUT', // Status platform placeholder
                    totalAmountPaidByBuyer: totalAmountPaid,
                    shippingFeePaidByBuyer: shippingFee,
                    shippingProviderId: shippingProviderId,
                    paymentMethod: paymentMethod || null,
                    buyerNote: buyerNote || null,
                    sellerNote: sellerNote || null,
                    // Field lain bisa ditambahkan defaultnya
                    items: {
                        create: validOrderItemsData, // Buat order items terkait
                    },
                },
                include: { // Sertakan data yg ingin dikembalikan
                    items: true,
                    customer: true,
                    salesRep: { select: { id: true, username: true }} // Hanya username sales rep
                }
            });

            // TODO: Implementasi pengurangan stok jika diperlukan
            // for (const item of validOrderItemsData) {
            //    await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
            //    // Atau update WarehouseStock jika pakai itu
            // }

            console.log("Order berhasil dibuat:", newOrder.id);
            return newOrder; // Kembalikan order yang baru dibuat
        });

        // Jika transaksi sukses
        res.status(201).json({ message: "Order berhasil dibuat", order: result });

    } catch (error) {
        console.error("Error creating manual order:", error);
        // Kirim pesan error yang lebih spesifik jika memungkinkan
        if (error.message.includes("tidak ditemukan")) {
             res.status(404).json({ message: error.message });
        } else if (error.code === 'P2002' && error.meta?.target?.includes('phone')) { // Error unique constraint phone
             res.status(409).json({ message: "Nomor telepon customer sudah terdaftar di akun lain." });
        }
        else {
            res.status(500).json({ message: "Gagal membuat order: " + error.message });
        }
    }
};

module.exports = {
    createManualOrder,
    // Tambahkan fungsi controller order lain di sini (getOrderById, getAllOrders, updateOrder, etc.)
};