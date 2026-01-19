const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation error',
      errors: errors.array(),
    });
  }

  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Username atau password salah',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: 'Username atau password salah',
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // sesuai soal UAS
    });

    return res.json({
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          nama: user.nama,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
