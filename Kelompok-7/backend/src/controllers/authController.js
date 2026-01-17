const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { nama, email, password: hashedPassword }
        });

        res.status(201).json({ message: "Registrasi berhasil", user: { id: user.id, email: user.email, nama: user.nama } });
    } catch (error) {
        res.status(400).json({ message: "Email sudah digunakan" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Email atau password salah" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: "Login berhasil", token, nama: user.nama, user: { nama: user.nama } });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

module.exports = { register, login };