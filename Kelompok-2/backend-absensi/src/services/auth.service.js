import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const register = async ({ name, email, password, npm, role }) => {
  if (!role) {
    throw new Error("Role wajib diisi");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      npm: role === "MAHASISWA" ? npm : null
    }
  });
};

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Email tidak ditemukan");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Password salah");
  }

  return user;
};
