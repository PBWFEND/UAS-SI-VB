const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');

const app = express();

// PENTING: Wajib ada ini supaya server bisa baca data JSON dari frontend
app.use(express.json());

// Konfigurasi CORS yang lebih fleksibel untuk Vercel
app.use(cors({
  origin: 'https://uas-si-vb-83km.vercel.app', // Hanya izinkan domain Vercel spesifik
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Daftar Endpoint API
app.use('/api/auth', authRoutes);
app.use('/api/transaksi', transaksiRoutes);

// Cek Status Server
app.get('/', (req, res) => {
    res.json({
        message: "Aplikasi Keuangan Pribadi Aktif!",
        status: "Ready"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Tambahkan ini untuk Vercel