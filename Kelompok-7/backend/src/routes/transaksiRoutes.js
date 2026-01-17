const express = require('express');
const router = express.Router();
const { createTransaksi, getTransaksi, getSummary, updateTransaksi, deleteTransaksi } = require('../controllers/transaksiController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/summary', authenticateToken, getSummary);
router.post('/', authenticateToken, createTransaksi);
router.get('/', authenticateToken, getTransaksi);
router.put('/:id', authenticateToken, updateTransaksi);
router.delete('/:id', authenticateToken, deleteTransaksi);

module.exports = router;