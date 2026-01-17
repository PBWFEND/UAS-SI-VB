import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";

/* ===== GET ALL ADMIN ===== */
export const getAllAdmin = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: {
            id: true,
            name: true,
            email: true,
        },
        });


    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data admin" });
  }
};

/* ===== CREATE ADMIN ===== */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    res.status(201).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan admin" });
  }
};

/* ===== DELETE ADMIN ===== */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Admin berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus admin" });
  }
};

/* ===== UPDATE ADMIN ===== */
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });

    res.json({ message: "Admin berhasil diperbarui" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui admin" });
  }
};

