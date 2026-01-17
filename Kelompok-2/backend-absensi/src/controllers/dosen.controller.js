import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";

/* ===== GET ALL DOSEN ===== */
export const getAllDosen = async (req, res) => {
  try {
    const dosen = await prisma.user.findMany({
      where: { role: "DOSEN" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    res.json(dosen);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data dosen" });
  }
};

/* ===== CREATE DOSEN ===== */
export const createDosen = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const dosen = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "DOSEN",
      },
    });

    res.status(201).json(dosen);
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan dosen" });
  }
};

/* ===== UPDATE DOSEN ===== */
export const updateDosen = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });

    res.json({ message: "Data dosen berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui dosen" });
  }
};

/* ===== DELETE DOSEN ===== */
export const deleteDosen = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Dosen berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus dosen" });
  }
};
