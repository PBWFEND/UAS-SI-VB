const prisma = require('../prisma/client');

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json({
      message: 'User profile retrieved successfully',
      data: user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = { getProfile };