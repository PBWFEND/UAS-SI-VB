const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Tambah Transaksi
exports.createTransaksi = async (req, res) => {
    try {
        const { tipe, jumlah, kategori, catatan } = req.body;
        const baru = await prisma.transaksi.create({
            data: { 
                tipe, 
                jumlah: parseInt(jumlah), 
                kategori, 
                catatan, 
                userId: req.user.id 
            }
        });
        res.status(201).json(baru);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 2. Lihat Transaksi Milik Sendiri 
exports.getTransaksi = async (req, res) => {
    const data = await prisma.transaksi.findMany({
        where: { userId: req.user.id }
    });
    res.json(data);
};

// 3. Update Transaksi (TAMBAHKAN INI)
exports.updateTransaksi = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipe, jumlah, kategori, catatan } = req.body;

        // Cek apakah data ada dan milik user yang login
        const cek = await prisma.transaksi.findUnique({ where: { id: parseInt(id) } });
        
        if (!cek || cek.userId !== req.user.id) {
            return res.status(403).json({ error: "Data tidak ditemukan atau bukan milik anda!" });
        }

        // Lakukan Update
        const updated = await prisma.transaksi.update({
            where: { id: parseInt(id) },
            data: {
                tipe,
                jumlah: parseInt(jumlah),
                kategori,
                catatan
            }
        });

        res.json({ message: "Berhasil diperbarui", data: updated });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 4. Hapus Transaksi 
exports.deleteTransaksi = async (req, res) => {
    try {
        const { id } = req.params;
        const cek = await prisma.transaksi.findUnique({ where: { id: parseInt(id) } });
        
        if (!cek || cek.userId !== req.user.id) {
            return res.status(403).json({ error: "Data bukan milik anda!" });
        }

        await prisma.transaksi.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Berhasil dihapus" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// 5. Summary
exports.getSummary = async (req, res) => {
    try {
        const transaksi = await prisma.transaksi.findMany({
            where: { userId: req.user.id }
        });

        const totalPemasukan = transaksi
            .filter(t => t.tipe === 'pemasukan')
            .reduce((sum, t) => sum + t.jumlah, 0);

        const totalPengeluaran = transaksi
            .filter(t => t.tipe === 'pengeluaran')
            .reduce((sum, t) => sum + t.jumlah, 0);

        res.json({
            totalPemasukan,
            totalPengeluaran,
            saldo: totalPemasukan - totalPengeluaran
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};