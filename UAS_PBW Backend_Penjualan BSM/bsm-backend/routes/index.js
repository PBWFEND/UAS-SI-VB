const express = require('express');
const router = express.Router();

const { uploadProduk } = require('../middlewares/uploads');
const { requireRole } = require('../middlewares/role');
const { verifyToken } = require('../middlewares/auth');

const RegisterController = require('../controllers/RegisterController');
const LoginController = require('../controllers/LoginController');
const UserController = require('../controllers/UserController');
const TransaksiController = require('../controllers/TransaksiController');
const ProdukController = require('../controllers/ProdukController');

const authValidator = require('../utils/validators/auth');
const userValidator = require('../utils/validators/user');
const transaksiValidator = require('../utils/validators/transaksi');

// AUTH

router.post(
  '/api/register',
  authValidator.validateRegister,
  RegisterController.register
);

router.post('/api/login', authValidator.validateLogin, LoginController.login);

// USER

router.get('/api/admin/users', verifyToken, UserController.findUsers);

router.post(
  '/api/admin/users',
  verifyToken,
  userValidator.validateCreateUser,
  UserController.createUser
);

router.get('/api/admin/users/:id', verifyToken, UserController.findUserById);

router.put(
  '/api/admin/users/:id',
  verifyToken,
  userValidator.validateUpdateUser,
  UserController.updateUser
);

// PROFIL USER

router.get('/api/users/profile', verifyToken, UserController.getProfile);

// PRODUK

router.get('/api/produk', verifyToken, ProdukController.getProduks);

// update stok / field produk
router.put('/api/produk/:id', verifyToken, ProdukController.updateProduk);

// create produk (ADMIN)
router.post(
  '/api/produk',
  verifyToken,
  requireRole('ADMIN'),
  uploadProduk.single('image'),
  ProdukController.createProduk
);

// upload gambar produk khusus (ADMIN)
router.put(
  '/api/produk/:id_produk/image',
  verifyToken,
  requireRole('ADMIN'),
  uploadProduk.single('image'),
  ProdukController.uploadImage
);

// TRANSAKSI

router.get('/api/transaksi', verifyToken, TransaksiController.getTransaksis);

router.get(
  '/api/transaksi/:id',
  verifyToken,
  TransaksiController.getTransaksiById
);

router.post(
  '/api/transaksi',
  verifyToken,
  transaksiValidator.validateCreateTransaksi,
  TransaksiController.createTransaksi
);

router.put(
  '/api/transaksi/:id',
  verifyToken,
  transaksiValidator.validateUpdateTransaksi,
  TransaksiController.updateTransaksi
);

router.delete(
  '/api/transaksi/:id',
  verifyToken,
  TransaksiController.deleteTransaksi
);

// ADMIN hard delete transaksi
router.delete(
  '/api/admin/transaksi/:id',
  verifyToken,
  requireRole('ADMIN'),
  TransaksiController.deleteTransaksiAdmin
);

module.exports = router;
