const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');
const authenticateToken = require('../middlewares/authMiddleware');

router.use(authenticateToken); // Lindungi semua rute task dengan token

router.post('/', createTask);
router.get('/', getTasks);

module.exports = router;