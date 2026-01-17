const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/auth');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/TaskController');

const {
  createTaskValidator,
  updateTaskValidator
} = require('../utils/validators/task');

router.post('/', verifyToken, createTaskValidator, createTask);
router.get('/', verifyToken, getTasks);
router.put('/:id', verifyToken, updateTaskValidator, updateTask);
router.delete('/:id', verifyToken, deleteTask);

module.exports = router;