import prisma from "../prisma/client.js";

export const getDashboardStats = async (req, res) => {
  try {
    const mahasiswa = await prisma.user.count({
      where: { role: "MAHASISWA" },
    });

    const dosen = await prisma.user.count({
      where: { role: "DOSEN" },
    });

    const admin = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    res.json({
      mahasiswa,
      dosen,
      admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
};
