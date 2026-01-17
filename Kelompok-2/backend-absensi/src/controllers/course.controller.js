import prisma from "../prisma/client.js";

export const getAllCourses = async (req, res) => {
  const courses = await prisma.course.findMany({
    include: { dosen: true },
  });
  res.json(courses);
};

export const createCourse = async (req, res) => {
  try {
    const { code, name, dosenId } = req.body;

    const course = await prisma.course.create({
      data: {
        code,
        name,
        dosenId: Number(dosenId), 
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal menyimpan mata kuliah",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, dosenId } = req.body;

    const course = await prisma.course.update({
      where: { id: Number(id) },
      data: {
        code,
        name,
        dosenId: Number(dosenId),
      },
    });

    res.json(course);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Kode mata kuliah sudah digunakan",
      });
    }

    res.status(500).json({
      message: "Gagal update mata kuliah",
    });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  await prisma.course.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Mata kuliah dihapus" });
};
