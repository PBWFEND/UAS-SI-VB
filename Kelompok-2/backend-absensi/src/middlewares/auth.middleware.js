import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: "User tidak valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

export default authMiddleware;
