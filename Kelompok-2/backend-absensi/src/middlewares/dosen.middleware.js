import prisma from "../prisma/client.js";

/**
 * Middleware: cek role dosen
 */
export const isDosen = (req, res, next) => {
  if (req.user.role !== "DOSEN") {
    return res.status(403).json({
      message: "Akses hanya untuk dosen"
    });
  }
  next();
};

/**
 * Middleware: cek dosen pemilik mata kuliah
 */
export const isDosenCourseOwner = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        message: "courseId tidak ditemukan"
      });
    }

    const course = await prisma.course.findFirst({
      where: {
        id: Number(courseId),
        lecturerId: req.user.id
      }
    });

    if (!course) {
      return res.status(403).json({
        message: "Anda bukan dosen pengampu mata kuliah ini"
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Authorization error"
    });
  }
};
