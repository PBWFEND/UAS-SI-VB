const { body } = require('express-validator');

const allowedStatusPembayaran = [
  'Menunggu Verifikasi',
  'Terverifikasi',
  'Ditolak',
];

const allowedStatusPengiriman = ['Belum Dikirim', 'Dikirim', 'Selesai'];

const allowedStatusArsip = ['AKTIF', 'ARSIP'];

const validateCreateTransaksi = [
  body('tanggal').optional().isISO8601().withMessage('Tanggal tidak valid'),
  body('total_harga')
    .isInt({ min: 0 })
    .withMessage('total_harga wajib dan harus bilangan bulat >= 0'),
  body('biaya_ongkir')
    .optional()
    .isInt({ min: 0 })
    .withMessage('biaya_ongkir harus bilangan bulat >= 0'),
  body('metode_pengiriman')
    .notEmpty()
    .withMessage('metode_pengiriman wajib diisi'),
  body('status_pembayaran')
    .optional()
    .isIn(allowedStatusPembayaran)
    .withMessage('status_pembayaran tidak valid'),
  body('status_pengiriman')
    .optional()
    .isIn(allowedStatusPengiriman)
    .withMessage('status_pengiriman tidak valid'),
  body('status_arsip')
    .optional()
    .isIn(allowedStatusArsip)
    .withMessage('status_arsip tidak valid'),
  body('nomor_resi')
    .optional()
    .isLength({ max: 100 })
    .withMessage('nomor_resi terlalu panjang'),
  body('bukti_pembayaran')
    .optional()
    .isString()
    .withMessage('bukti_pembayaran harus string'),
];

const validateUpdateTransaksi = [
  body('tanggal').optional().isISO8601().withMessage('Tanggal tidak valid'),
  body('total_harga')
    .optional()
    .isInt({ min: 0 })
    .withMessage('total_harga harus bilangan bulat >= 0'),
  body('biaya_ongkir')
    .optional()
    .isInt({ min: 0 })
    .withMessage('biaya_ongkir harus bilangan bulat >= 0'),
  body('metode_pengiriman')
    .optional()
    .notEmpty()
    .withMessage('metode_pengiriman tidak boleh kosong'),
  body('status_pembayaran')
    .optional()
    .isIn(allowedStatusPembayaran)
    .withMessage('status_pembayaran tidak valid'),
  body('status_pengiriman')
    .optional()
    .isIn(allowedStatusPengiriman)
    .withMessage('status_pengiriman tidak valid'),
  body('status_arsip')
    .optional()
    .isIn(allowedStatusArsip)
    .withMessage('status_arsip tidak valid'),
  body('nomor_resi')
    .optional()
    .isLength({ max: 100 })
    .withMessage('nomor_resi terlalu panjang'),
  body('bukti_pembayaran')
    .optional()
    .isString()
    .withMessage('bukti_pembayaran harus string'),
];

module.exports = {
  validateCreateTransaksi,
  validateUpdateTransaksi,
};
