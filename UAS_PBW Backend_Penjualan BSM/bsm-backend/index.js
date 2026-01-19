const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware dasar
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static folder untuk akses gambar: http://localhost:3000/uploads/produk/xxx.png
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import routes SEKALI saja (jangan double declare)
const routes = require('./routes/index');
app.use(routes);

// Default root
app.get('/', (req, res) => {
  res.json({ message: 'BSM Backend API' });
});

// 404 handler sederhana
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BSM API running on port ${PORT}`);
});
