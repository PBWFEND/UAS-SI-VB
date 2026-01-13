const express = require('express');
const router = express.Router();

const { login } = require('../controllers/LoginController');
const { register } = require('../controllers/RegisterController');
const {
  registerValidator,
  loginValidator
} = require('../utils/validators/auth');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

module.exports = router;