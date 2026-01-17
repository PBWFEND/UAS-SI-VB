import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("dosen123", 10);

  // =====================
  // DOSEN
  // =====================
  const dosen = await prisma.user.upsert({
    where: { email: "dosen@unsap.ac.id" },
    update: {},
    create: {
      name: "Dosen Asep",
      email: "dosen@unsap.ac.id",
      password: hashedPassword,
      role: "DOSEN",
    },
  });

  // =====================
  // MAHASISWA
  // =====================
  const mahasiswa = await prisma.user.upsert({
    where: { email: "intan@student.unsap.ac.id" },
    update: {},
    create: {
      name: "Intan",
      email: "intan@student.unsap.ac.id",
      password: hashedPassword,
      role: "MAHASISWA",
      npm: "202300123456",
    },
  });

  // =====================
  // MATA KULIAH
  // =====================
  const course = await prisma.course.upsert({
    where: { code: "SI101" },
    update: {},
    create: {
      code: "SI101",
      name: "Sistem Informasi",
      dosenId: dosen.id,
    },
  });

  // =====================
  // ENROLLMENT (KRS)
  // =====================
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: mahasiswa.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      userId: mahasiswa.id,
      courseId: course.id,
    },
  });

  console.log("✅ Seed DOSEN, MAHASISWA, COURSE, & ENROLLMENT BERHASIL");
}

main()
  .catch((error) => {
    console.error("❌ Seed gagal:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
