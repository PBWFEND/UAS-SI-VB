const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array(),
    });
  }

  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login success',
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = { login };