const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/produk
exports.getProduks = async (req, res) => {
  try {
    const produk = await prisma.produk.findMany({
      orderBy: {
        id_produk: 'asc',
      },
    });

    return res.json({
      message: 'OK',
      data: produk,
    });
  } catch (err) {
    console.error('getProduks error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/produk/:id
exports.updateProduk = async (req, res) => {
  const role = req.user.role;
  const id_produk = Number(req.params.id);

  if (role !== 'ADMIN') {
    return res
      .status(403)
      .json({ message: 'Forbidden: hanya admin yang dapat mengubah produk' });
  }

  const { stok, nama_produk, jenis, satuan, harga, img } = req.body;

  try {
    const existing = await prisma.produk.findUnique({
      where: { id_produk },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    const dataUpdate = {};

    if (stok !== undefined) {
      const parsed = Number(stok);
      if (Number.isNaN(parsed) || parsed < 0) {
        return res.status(422).json({
          message: 'Validation error',
          errors: [
            {
              type: 'field',
              msg: 'stok harus bilangan bulat >= 0',
              path: 'stok',
              location: 'body',
            },
          ],
        });
      }
      dataUpdate.stok = parsed;
    }

    if (nama_produk !== undefined) dataUpdate.nama_produk = nama_produk;
    if (jenis !== undefined) dataUpdate.jenis = jenis;
    if (satuan !== undefined) dataUpdate.satuan = satuan;

    if (harga !== undefined) {
      const parsedHarga = Number(harga);
      if (Number.isNaN(parsedHarga) || parsedHarga < 0) {
        return res.status(422).json({
          message: 'Validation error',
          errors: [
            {
              type: 'field',
              msg: 'harga harus bilangan bulat >= 0',
              path: 'harga',
              location: 'body',
            },
          ],
        });
      }
      dataUpdate.harga = parsedHarga;
    }

    if (img !== undefined) dataUpdate.img = img;

    const updated = await prisma.produk.update({
      where: { id_produk },
      data: dataUpdate,
    });

    return res.json({
      message: 'Produk updated',
      data: updated,
    });
  } catch (err) {
    console.error('updateProduk error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/produk (ADMIN)
exports.createProduk = async (req, res) => {
  const role = req.user.role;
  if (role !== 'ADMIN') {
    return res
      .status(403)
      .json({ message: 'Forbidden: hanya admin yang dapat menambah produk' });
  }

  const { nama_produk, jenis, satuan, harga, stok } = req.body;

  const hargaNum = Number(harga);
  const stokNum = Number(stok);

  if (!nama_produk || !jenis || !satuan) {
    return res.status(422).json({
      message: 'Validation error',
      errors: [
        {
          msg: 'nama_produk, jenis, satuan wajib diisi',
          path: 'nama_produk',
          location: 'body',
        },
      ],
    });
  }

  if (!Number.isFinite(hargaNum) || hargaNum <= 0) {
    return res.status(422).json({
      message: 'Validation error',
      errors: [
        { msg: 'harga harus angka > 0', path: 'harga', location: 'body' },
      ],
    });
  }

  if (!Number.isFinite(stokNum) || stokNum < 0) {
    return res.status(422).json({
      message: 'Validation error',
      errors: [
        { msg: 'stok harus angka >= 0', path: 'stok', location: 'body' },
      ],
    });
  }

  // kalau create produk dikirim via multipart + image, simpan img otomatis
  const imgPath = req.file ? `/uploads/produk/${req.file.filename}` : null;

  try {
    const created = await prisma.produk.create({
      data: {
        nama_produk,
        jenis,
        satuan,
        harga: hargaNum,
        stok: stokNum,
        img: imgPath,
      },
    });

    return res.status(201).json({
      message: 'Produk berhasil ditambahkan',
      data: created,
    });
  } catch (err) {
    console.error('createProduk error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/produk/:id_produk/image (ADMIN)
exports.uploadImage = async (req, res) => {
  try {
    const id_produk = Number(req.params.id_produk);

    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'File gambar wajib diupload (field: image).' });
    }

    const imgPath = `/uploads/produk/${req.file.filename}`;

    const updated = await prisma.produk.update({
      where: { id_produk },
      data: { img: imgPath },
    });

    return res.json({
      message: 'Gambar produk berhasil diupload',
      data: updated,
    });
  } catch (err) {
    console.error('uploadImage error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
