import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";

/* GET */
export const getAllMahasiswa = async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      where: { role: "MAHASISWA" },
      select: {
        id: true,
        name: true,
        email: true,
        npm: true,
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal memuat data mahasiswa" });
  }
};

/* CREATE */
export const createMahasiswa = async (req, res) => {
  try {
    const { name, email, npm, password } = req.body;

    const exist = await prisma.user.findFirst({
      where: { OR: [{ email }, { npm }] },
    });

    if (exist)
      return res.status(400).json({ message: "Email / NPM sudah terdaftar" });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        npm,
        password: hashed,
        role: "MAHASISWA",
      },
    });

    res.status(201).json({ message: "Mahasiswa berhasil ditambahkan" });
  } catch {
    res.status(500).json({ message: "Gagal menambahkan mahasiswa" });
  }
};

/* UPDATE */
export const updateMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, npm } = req.body;

    await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, npm },
    });

    res.json({ message: "Data mahasiswa berhasil diperbarui" });
  } catch {
    res.status(500).json({ message: "Gagal memperbarui mahasiswa" });
  }
};

/* DELETE */
export const deleteMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch {
    res.status(500).json({ message: "Gagal menghapus mahasiswa" });
  }
};
