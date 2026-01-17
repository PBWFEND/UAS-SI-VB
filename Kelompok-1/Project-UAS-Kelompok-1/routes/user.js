const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth');
const { getProfile } = require('../controllers/UserController');

router.get('/profile', verifyToken, getProfile);

module.exports = router;