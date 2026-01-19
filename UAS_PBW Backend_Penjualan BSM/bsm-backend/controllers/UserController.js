const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');

const prisma = new PrismaClient();

// optional helper: hanya ADMIN yang boleh pakai /api/admin/users/*
function ensureAdmin(req, res) {
  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ message: 'Forbidden: admin only' });
    return false;
  }
  return true;
}

exports.findUsers = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        alamat: true,
        no_hp: true,
      },
    });

    return res.json({
      message: 'OK',
      data: users,
    });
  } catch (err) {
    console.error('findUsers error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createUser = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { validationResult } = require('express-validator');
  const bcrypt = require('bcryptjs');

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
        role,
        alamat: alamat || null,
        no_hp: no_hp || null,
      },
    });

    const { password: _, ...userData } = user;

    return res.status(201).json({
      message: 'User created',
      data: userData,
    });
  } catch (err) {
    console.error('createUser error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.findUserById = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const id = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        alamat: true,
        no_hp: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    return res.json({
      message: 'OK',
      data: user,
    });
  } catch (err) {
    console.error('findUserById error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const id = Number(req.params.id);
  const { validationResult } = require('express-validator');
  const bcrypt = require('bcryptjs');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation error',
      errors: errors.array(),
    });
  }

  const { nama, username, password, role, alamat, no_hp } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        nama: nama ?? existing.nama,
        username: username ?? existing.username,
        role: role ?? existing.role,
        alamat: alamat !== undefined ? alamat : existing.alamat,
        no_hp: no_hp !== undefined ? no_hp : existing.no_hp,
        password: hashedPassword || existing.password,
      },
    });

    const { password: _, ...userData } = updated;

    return res.json({
      message: 'User updated',
      data: userData,
    });
  } catch (err) {
    console.error('updateUser error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        alamat: true,
        no_hp: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    return res.json({
      message: 'OK',
      data: user,
    });
  } catch (err) {
    console.error('getProfile error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
