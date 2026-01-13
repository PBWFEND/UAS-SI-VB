const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// Fungsi Daftar (Register)
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password biar aman

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        res.status(201).json({ message: "User berhasil dibuat!", user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(400).json({ message: "Email sudah digunakan atau data tidak lengkap" });
    }
};

// Fungsi Masuk (Login)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Email atau password salah" });
        }

        // Buat Token JWT (Syarat UAS No. 3)
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login berhasil", token });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

module.exports = { register, login };