const express = require('express')
const router = express.Router()
const { body } = require('express-validator')

const authController = require('../controllers/auth.controller')

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Nama wajib diisi'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
  ],
  authController.register
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').notEmpty().withMessage('Password wajib diisi')
  ],
  authController.login
)

module.exports = router
