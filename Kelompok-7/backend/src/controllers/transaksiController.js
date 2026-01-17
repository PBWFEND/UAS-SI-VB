const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTransaksi = async (req, res) => {
    try {
        const { tipe, kategori, jumlah, catatan } = req.body;
        const transaksi = await prisma.transaksi.create({
            data: { 
                tipe, 
                kategori, 
                jumlah: parseFloat(jumlah),
                catatan,
                userId: req.user.userId 
            }
        });
        res.status(201).json(transaksi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTransaksi = async (req, res) => {
    try {
        const transaksi = await prisma.transaksi.findMany({
            where: { userId: req.user.userId },
            orderBy: { tanggal: 'desc' }
        });
        res.json(transaksi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSummary = async (req, res) => {
    try {
        const transaksi = await prisma.transaksi.findMany({
            where: { userId: req.user.userId }
        });
        
        const totalPemasukan = transaksi
            .filter(t => t.tipe === 'pemasukan')
            .reduce((sum, t) => sum + parseFloat(t.jumlah), 0);
            
        const totalPengeluaran = transaksi
            .filter(t => t.tipe === 'pengeluaran')
            .reduce((sum, t) => sum + parseFloat(t.jumlah), 0);
            
        const saldo = totalPemasukan - totalPengeluaran;
        
        res.json({ totalPemasukan, totalPengeluaran, saldo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTransaksi = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipe, kategori, jumlah, catatan } = req.body;
        
        const transaksi = await prisma.transaksi.updateMany({
            where: { 
                id: parseInt(id),
                userId: req.user.userId 
            },
            data: { tipe, kategori, jumlah: parseFloat(jumlah), catatan }
        });
        
        res.json({ message: "Transaksi berhasil diupdate" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTransaksi = async (req, res) => {
    try {
        const { id } = req.params;
        
        await prisma.transaksi.deleteMany({
            where: { 
                id: parseInt(id),
                userId: req.user.userId 
            }
        });
        
        res.json({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTransaksi, getTransaksi, getSummary, updateTransaksi, deleteTransaksi };