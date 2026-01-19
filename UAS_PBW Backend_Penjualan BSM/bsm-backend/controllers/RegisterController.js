const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation error',
      errors: errors.array(),
    });
  }

  const { nama, username, password, role, alamat, no_hp } = req.body;

  try {
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return res.status(400).json({
        message: 'Username sudah digunakan',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        role: role || 'KONSUMEN',
        alamat: alamat || null,
        no_hp: no_hp || null,
      },
    });

    const { password: _, ...userData } = user;

    return res.status(201).json({
      message: 'Register berhasil',
      data: userData,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
