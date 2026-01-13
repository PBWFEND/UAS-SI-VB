const { body } = require('express-validator');

exports.createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
];

exports.updateTaskValidator = [
  body('title')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be boolean'),
];