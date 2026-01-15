import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { nama, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { nama, email, password: hashedPassword }
    });
    return res.status(201).json({ message: 'Berhasil daftar!', data: user });
  } catch (e) {
    return res.status(400).json({ error: 'Email dan Password sudah terdaftar' });
  }
}
