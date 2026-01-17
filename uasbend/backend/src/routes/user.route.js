import express from "express";
import prisma from "../../prisma/client.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });

  res.json(user);
});

export default router;
