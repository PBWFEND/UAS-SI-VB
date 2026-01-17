const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const transaksiRoutes = require('./src/routes/transaksiRoutes');

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use('/api/auth', authRoutes);
app.use('/api/transaksi', transaksiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: "Aplikasi Keuangan Pribadi Aktif!",
    status: "Ready"
  });
});

module.exports = app;
