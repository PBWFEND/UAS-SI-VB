const multer = require('multer');
const path = require('path');
const fs = require('fs');

const produkDir = path.join(__dirname, '..', 'uploads', 'produk');

try {
  if (fs.existsSync(produkDir)) {
    const stat = fs.statSync(produkDir);
    if (!stat.isDirectory()) {
      throw new Error(
        `Path "${produkDir}" sudah ada tetapi BUKAN folder. Hapus/rename file itu dulu lalu jalankan ulang backend.`
      );
    }
  } else {
    fs.mkdirSync(produkDir, { recursive: true });
  }
} catch (e) {
  console.error('[UPLOADS] Gagal menyiapkan folder upload:', e.message);
  throw e;
}

const storageProduk = multer.diskStorage({
  destination: (req, file, cb) => cb(null, produkDir),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '').toLowerCase();
    const safeExt = ext || '.png';
    cb(null, `produk-${Date.now()}${safeExt}`);
  },
});

function fileFilter(req, file, cb) {
  const ok = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
    file.mimetype
  );
  if (!ok) return cb(new Error('File harus berupa gambar (png/jpg/jpeg/webp)'));
  cb(null, true);
}

const uploadProduk = multer({
  storage: storageProduk,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = { uploadProduk };
