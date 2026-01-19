const { body } = require('express-validator');

const validateCreateUser = [
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
    .notEmpty()
    .withMessage('Role wajib diisi')
    .isIn(['KONSUMEN', 'ADMIN', 'KARYAWAN', 'OWNER'])
    .withMessage('Role tidak valid'),
  body('no_hp')
    .optional()
    .isLength({ min: 8 })
    .withMessage('No HP minimal 8 karakter'),
];

const validateUpdateUser = [
  body('nama').optional().notEmpty().withMessage('Nama tidak boleh kosong'),
  body('username')
    .optional()
    .notEmpty()
    .withMessage('Username tidak boleh kosong')
    .isLength({ min: 3 })
    .withMessage('Username minimal 3 karakter'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter'),
  body('role')
    .optional()
    .isIn(['KONSUMEN', 'ADMIN', 'KARYAWAN', 'OWNER'])
    .withMessage('Role tidak valid'),
  body('no_hp')
    .optional()
    .isLength({ min: 8 })
    .withMessage('No HP minimal 8 karakter'),
];

module.exports = {
  validateCreateUser,
  validateUpdateUser,
};
