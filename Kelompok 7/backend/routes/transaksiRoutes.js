const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const authMiddleware = require('../middlewares/authMiddleware');

// Semua rute di bawah ini wajib pakai Token JWT
router.use(authMiddleware);

router.post('/', transaksiController.createTransaksi);
router.get('/', transaksiController.getTransaksi);
router.delete('/:id', transaksiController.deleteTransaksi);
router.get('/summary', transaksiController.getSummary);
router.put('/:id', transaksiController.updateTransaksi);

module.exports = router;