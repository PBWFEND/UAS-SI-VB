const prisma = require('../prisma/client');
const { validationResult } = require('express-validator');

const createTask = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({
        message: 'Validation error',
        errors: errors.array()
    });
    }

    try {
    const { title, description } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.userId
      }
    });

    return res.status(201).json({
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      message: 'Tasks retrieved successfully',
      data: tasks
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const updateTask = async (req, res) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
      return res.status(400).json({
          message: 'Validation error',
          errors: errors.array()
  });
  }
  try {
    const taskId = Number(req.params.id);
    const { title, description, isCompleted } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    if (task.userId !== req.userId) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        isCompleted
      }
    });

    return res.status(200).json({
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    if (task.userId !== req.userId) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    return res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};