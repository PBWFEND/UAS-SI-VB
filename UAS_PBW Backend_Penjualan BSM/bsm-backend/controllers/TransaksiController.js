const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

// Helper: generate nomor invoice dengan pola INV-YYYYMMDD-XXXX
async function generateInvoiceNumber(tanggal) {
  const date = tanggal instanceof Date ? tanggal : new Date(tanggal);
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');

  const count = await prisma.tmc.count();
  const seq = String(count + 1).padStart(4, '0');

  return `INV-${ymd}-${seq}`;
}

// Helper: format error 422 ala modul
function validationError(res, errors) {
  return res.status(422).json({
    message: 'Validation error',
    errors,
  });
}

// helper status pending
function isPendingStatus(statusPembayaran) {
  const s = String(statusPembayaran || '')
    .trim()
    .toLowerCase();
  return s === 'pending' || s === 'menunggu verifikasi';
}

// GET /api/transaksi
exports.getTransaksis = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;
  const { status_arsip } = req.query;

  const baseInclude = {
    detail_penjualan: true,
    konsumen: {
      select: {
        id: true,
        nama: true,
        username: true,
      },
    },
  };

  try {
    let where = {};
    if (status_arsip) {
      where.status_arsip = status_arsip;
    }

    let transaksis = [];

    if (role === 'ADMIN') {
      transaksis = await prisma.tmc.findMany({
        where,
        orderBy: { id_tmc: 'desc' },
        include: baseInclude,
      });
    } else if (role === 'OWNER') {
      transaksis = await prisma.tmc.findMany({
        where,
        orderBy: { id_tmc: 'desc' },
        include: baseInclude,
      });
    } else if (role === 'KARYAWAN') {
      transaksis = await prisma.tmc.findMany({
        where: {
          id_karyawan: userId,
          status_pembayaran: 'Terverifikasi',
          status_arsip: 'AKTIF',
        },
        orderBy: { id_tmc: 'desc' },
        include: baseInclude,
      });
    } else if (role === 'KONSUMEN') {
      transaksis = await prisma.tmc.findMany({
        where: {
          id_konsumen: userId,
          ...(status_arsip ? { status_arsip } : {}),
        },
        orderBy: { id_tmc: 'desc' },
        include: {
          detail_penjualan: true,
        },
      });
    } else {
      return res
        .status(403)
        .json({ message: 'Forbidden: role tidak dikenali' });
    }

    return res.json({
      message: 'OK',
      data: transaksis,
    });
  } catch (err) {
    console.error('getTransaksis error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/transaksi/:id
exports.getTransaksiById = async (req, res) => {
  const id_tmc = Number(req.params.id);
  const role = req.user.role;
  const userId = req.user.id;

  try {
    const transaksi = await prisma.tmc.findUnique({
      where: { id_tmc },
      include: {
        detail_penjualan: true,
        konsumen: {
          select: {
            id: true,
            nama: true,
            username: true,
          },
        },
      },
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    if (role === 'ADMIN' || role === 'OWNER') {
      // ok
    } else if (role === 'KARYAWAN') {
      if (
        transaksi.id_karyawan !== userId ||
        transaksi.status_pembayaran !== 'Terverifikasi' ||
        transaksi.status_arsip !== 'AKTIF'
      ) {
        return res
          .status(403)
          .json({ message: 'Forbidden: transaksi tidak ditugaskan ke Anda' });
      }
    } else if (role === 'KONSUMEN') {
      if (transaksi.id_konsumen !== userId) {
        return res
          .status(403)
          .json({ message: 'Forbidden: transaksi milik user lain' });
      }
    } else {
      return res
        .status(403)
        .json({ message: 'Forbidden: role tidak dikenali' });
    }

    return res.json({
      message: 'OK',
      data: transaksi,
    });
  } catch (err) {
    console.error('getTransaksiById error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/transaksi (checkout konsumen)
exports.createTransaksi = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.id;

  if (role !== 'KONSUMEN') {
    return res.status(403).json({
      message: 'Forbidden: hanya konsumen yang dapat membuat transaksi',
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const body = req.body || {};

  const tanggal = body.tanggal;
  const biaya_ongkir = Number(body.biaya_ongkir || 0);
  const metode_pengiriman = body.metode_pengiriman;
  const bukti_pembayaran = body.bukti_pembayaran || null;

  const status_pembayaran = body.status_pembayaran || 'Menunggu Verifikasi';
  const status_pengiriman = body.status_pengiriman || 'Belum Dikirim';
  const status_arsip = body.status_arsip || 'AKTIF';

  const items = Array.isArray(body.items) ? body.items : [];

  if (!metode_pengiriman) {
    return validationError(res, [
      {
        type: 'field',
        msg: 'metode_pengiriman wajib diisi',
        path: 'metode_pengiriman',
        location: 'body',
      },
    ]);
  }

  if (!Number.isFinite(biaya_ongkir) || biaya_ongkir < 0) {
    return validationError(res, [
      {
        type: 'field',
        msg: 'biaya_ongkir harus angka >= 0',
        path: 'biaya_ongkir',
        location: 'body',
      },
    ]);
  }

  if (!items.length) {
    return validationError(res, [
      {
        type: 'field',
        msg: 'items (keranjang) wajib diisi',
        path: 'items',
        location: 'body',
      },
    ]);
  }

  try {
    const tanggalDate = tanggal ? new Date(tanggal) : new Date();
    const nomor_invoice = await generateInvoiceNumber(tanggalDate);

    const created = await prisma.$transaction(async (tx) => {
      let subtotalTransaksi = 0;

      // validasi produk + stok + hitung subtotal
      for (const it of items) {
        const id_produk = Number(it.id_produk);
        const qty = Number(it.qty);

        if (!id_produk || Number.isNaN(id_produk)) {
          throw {
            _type: 'VALIDATION',
            errors: [
              {
                type: 'field',
                msg: 'id_produk tidak valid',
                path: 'items.id_produk',
                location: 'body',
              },
            ],
          };
        }

        if (!Number.isFinite(qty) || qty <= 0) {
          throw {
            _type: 'VALIDATION',
            errors: [
              {
                type: 'field',
                msg: 'qty harus > 0',
                path: 'items.qty',
                location: 'body',
              },
            ],
          };
        }

        const produk = await tx.produk.findUnique({ where: { id_produk } });
        if (!produk) {
          throw {
            _type: 'VALIDATION',
            errors: [
              {
                type: 'field',
                msg: `Produk id ${id_produk} tidak ditemukan`,
                path: 'items.id_produk',
                location: 'body',
              },
            ],
          };
        }

        if (produk.stok < qty) {
          throw {
            _type: 'VALIDATION',
            errors: [
              {
                type: 'field',
                msg: `Stok ${produk.nama_produk} tidak mencukupi`,
                path: 'items.qty',
                location: 'body',
              },
            ],
          };
        }

        subtotalTransaksi += Number(produk.harga) * qty;
      }

      const total_harga = subtotalTransaksi + biaya_ongkir;

      const transaksi = await tx.tmc.create({
        data: {
          id_konsumen: userId,
          id_karyawan: null,
          id_admin: null,
          tanggal: tanggalDate,
          total_harga: Number(total_harga),
          biaya_ongkir: Number(biaya_ongkir),
          metode_pengiriman,
          status_pembayaran,
          status_pengiriman,
          nomor_invoice,
          nomor_resi: null,
          status_arsip,
          bukti_pembayaran,
        },
      });

      // create detail + decrement stok
      for (const it of items) {
        const id_produk = Number(it.id_produk);
        const qty = Number(it.qty);

        const produk = await tx.produk.findUnique({ where: { id_produk } });

        const harga_satuan = Number(produk?.harga ?? 0);
        if (!harga_satuan || Number.isNaN(harga_satuan)) {
          throw {
            _type: 'VALIDATION',
            errors: [
              {
                type: 'field',
                msg: `Harga produk id ${id_produk} tidak valid`,
                path: 'items.harga_satuan',
                location: 'body',
              },
            ],
          };
        }

        const subtotal = harga_satuan * qty;

        await tx.detailPenjualan.create({
          data: {
            id_tmc: transaksi.id_tmc,
            id_produk,
            qty,
            harga_satuan,
            subtotal,
          },
        });

        await tx.produk.update({
          where: { id_produk },
          data: { stok: { decrement: qty } },
        });
      }

      return transaksi;
    });

    return res.status(201).json({
      message: 'Transaksi berhasil dibuat',
      data: created,
    });
  } catch (err) {
    if (err && err._type === 'VALIDATION') {
      return validationError(res, err.errors || []);
    }
    console.error('createTransaksi error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/transaksi/:id
exports.updateTransaksi = async (req, res) => {
  const id_tmc = Number(req.params.id);
  const role = req.user.role;
  const userId = req.user.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  const {
    tanggal,
    total_harga,
    biaya_ongkir,
    metode_pengiriman,
    status_pembayaran,
    status_pengiriman,
    nomor_resi,
    status_arsip,
    bukti_pembayaran,
    id_karyawan,
  } = req.body;

  try {
    const transaksi = await prisma.tmc.findUnique({ where: { id_tmc } });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    if (role === 'OWNER') {
      return res
        .status(403)
        .json({ message: 'Forbidden: owner tidak dapat mengubah transaksi' });
    }

    if (role === 'ADMIN') {
      const dataUpdate = {};

      if (tanggal) dataUpdate.tanggal = new Date(tanggal);
      if (total_harga !== undefined)
        dataUpdate.total_harga = Number(total_harga);
      if (biaya_ongkir !== undefined)
        dataUpdate.biaya_ongkir = Number(biaya_ongkir);
      if (metode_pengiriman) dataUpdate.metode_pengiriman = metode_pengiriman;
      if (status_pengiriman) dataUpdate.status_pengiriman = status_pengiriman;
      if (nomor_resi !== undefined) dataUpdate.nomor_resi = nomor_resi;
      if (bukti_pembayaran !== undefined)
        dataUpdate.bukti_pembayaran = bukti_pembayaran;

      if (status_pembayaran) {
        dataUpdate.status_pembayaran = status_pembayaran;
        dataUpdate.id_admin = userId;

        if (status_pembayaran === 'Terverifikasi') {
          const karyawanId = Number(id_karyawan);
          if (!karyawanId || Number.isNaN(karyawanId)) {
            return validationError(res, [
              {
                type: 'field',
                msg: 'id_karyawan wajib diisi saat verifikasi pembayaran',
                path: 'id_karyawan',
                location: 'body',
              },
            ]);
          }

          const karyawanUser = await prisma.user.findFirst({
            where: { id: karyawanId, role: 'KARYAWAN' },
          });

          if (!karyawanUser) {
            return validationError(res, [
              {
                type: 'field',
                msg: 'id_karyawan tidak valid atau bukan KARYAWAN',
                path: 'id_karyawan',
                location: 'body',
              },
            ]);
          }

          dataUpdate.id_karyawan = karyawanId;
        }
      }

      if (status_arsip) dataUpdate.status_arsip = status_arsip;

      const updated = await prisma.tmc.update({
        where: { id_tmc },
        data: dataUpdate,
      });

      return res.json({
        message: 'Transaksi berhasil diupdate',
        data: updated,
      });
    }

    if (role === 'KARYAWAN') {
      if (
        transaksi.id_karyawan !== userId ||
        transaksi.status_pembayaran !== 'Terverifikasi' ||
        transaksi.status_arsip !== 'AKTIF'
      ) {
        return res.status(403).json({
          message:
            'Forbidden: karyawan hanya dapat mengelola pengiriman transaksi yang ditugaskan dan sudah terverifikasi',
        });
      }

      if (status_pembayaran || id_karyawan || status_arsip) {
        return res.status(403).json({
          message:
            'Forbidden: karyawan tidak boleh mengubah status_pembayaran, id_karyawan, id_admin, atau status_arsip',
        });
      }

      const dataUpdate = {};
      if (status_pengiriman) dataUpdate.status_pengiriman = status_pengiriman;
      if (nomor_resi !== undefined) dataUpdate.nomor_resi = nomor_resi;

      if (
        status_pengiriman === 'Dikirim' &&
        !(nomor_resi || transaksi.nomor_resi)
      ) {
        return validationError(res, [
          {
            type: 'field',
            msg: 'nomor_resi wajib diisi saat status_pengiriman = Dikirim',
            path: 'nomor_resi',
            location: 'body',
          },
        ]);
      }

      const updated = await prisma.tmc.update({
        where: { id_tmc },
        data: dataUpdate,
      });

      return res.json({
        message: 'Transaksi berhasil diupdate',
        data: updated,
      });
    }

    if (role === 'KONSUMEN') {
      if (transaksi.id_konsumen !== userId) {
        return res
          .status(403)
          .json({ message: 'Forbidden: transaksi milik user lain' });
      }

      if (
        status_pembayaran ||
        status_pengiriman ||
        status_arsip ||
        id_karyawan
      ) {
        return res.status(403).json({
          message:
            'Forbidden: konsumen tidak boleh mengubah status pembayaran/pengiriman maupun admin/karyawan',
        });
      }

      if (bukti_pembayaran === undefined) {
        return res.json({ message: 'Tidak ada perubahan', data: transaksi });
      }

      const updated = await prisma.tmc.update({
        where: { id_tmc },
        data: { bukti_pembayaran },
      });

      return res.json({
        message: 'Transaksi berhasil diupdate',
        data: updated,
      });
    }

    return res.status(403).json({ message: 'Forbidden: role tidak dikenali' });
  } catch (err) {
    console.error('updateTransaksi error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/transaksi/:id
exports.deleteTransaksi = async (req, res) => {
  const id_tmc = Number(req.params.id);
  const role = req.user.role;
  const userId = req.user.id;

  if (role !== 'KONSUMEN') {
    return res.status(403).json({
      message: 'Forbidden: hanya konsumen yang dapat membatalkan pesanan',
    });
  }

  try {
    const transaksi = await prisma.tmc.findUnique({
      where: { id_tmc },
      include: { detail_penjualan: true },
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    if (transaksi.id_konsumen !== userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: transaksi milik user lain' });
    }

    if (!isPendingStatus(transaksi.status_pembayaran)) {
      return res.status(403).json({
        message:
          'Pesanan tidak bisa dibatalkan karena sudah dikonfirmasi admin.',
      });
    }

    if (transaksi.status_arsip && transaksi.status_arsip !== 'AKTIF') {
      return res.status(403).json({
        message: 'Pesanan tidak bisa dibatalkan karena status bukan AKTIF.',
      });
    }

    await prisma.$transaction(async (tx) => {
      for (const d of transaksi.detail_penjualan || []) {
        await tx.produk.update({
          where: { id_produk: d.id_produk },
          data: { stok: { increment: d.qty } },
        });
      }

      await tx.detailPenjualan.deleteMany({ where: { id_tmc } });
      await tx.tmc.delete({ where: { id_tmc } });
    });

    return res.json({
      message: 'Pesanan berhasil dibatalkan',
      data: { id_tmc },
    });
  } catch (err) {
    console.error('deleteTransaksi error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/admin/transaksi/:id
exports.deleteTransaksiAdmin = async (req, res) => {
  const id_tmc = Number(req.params.id);

  try {
    const transaksi = await prisma.tmc.findUnique({
      where: { id_tmc },
      include: { detail_penjualan: true },
    });

    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    await prisma.$transaction(async (tx) => {
      if (isPendingStatus(transaksi.status_pembayaran)) {
        for (const d of transaksi.detail_penjualan || []) {
          await tx.produk.update({
            where: { id_produk: d.id_produk },
            data: { stok: { increment: d.qty } },
          });
        }
      }

      await tx.detailPenjualan.deleteMany({ where: { id_tmc } });
      await tx.tmc.delete({ where: { id_tmc } });
    });

    return res.json({
      message: 'Transaksi berhasil dihapus permanen',
      data: { id_tmc },
    });
  } catch (err) {
    console.error('deleteTransaksiAdmin error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
