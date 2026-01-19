const { body } = require('express-validator');

const validateRegister = [
  body('nama').notEmpty().withMessage('Nama wajib diisi'),
  body('username')
    .notEmpty()
    .withMessage('Username wajib diisi')
    .isLength({ min: 3 })
    .withMessage('Username minimal 3 karakter'),
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter'),
  body('role')
    .optional()
    .isIn(['KONSUMEN', 'ADMIN', 'KARYAWAN', 'OWNER'])
    .withMessage('Role tidak valid'),
];

const validateLogin = [
  body('username').notEmpty().withMessage('Username wajib diisi'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
];

module.exports = {
  validateRegister,
  validateLogin,
};
