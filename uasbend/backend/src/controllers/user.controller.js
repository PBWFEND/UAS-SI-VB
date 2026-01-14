import prisma from "../prisma/client.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
