import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

/* DOSEN MEMBUKA SESSION ABSENSI */
export const createSession = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { courseId, startTime, endTime } = req.body;

    if (!courseId || !startTime || !endTime) {
      return res.status(400).json({
        message: "courseId, startTime, dan endTime wajib diisi",
      });
    }

    // Pastikan mata kuliah milik dosen
    const course = await prisma.course.findFirst({
      where: {
        id: Number(courseId),
        dosenId: dosenId,
      },
    });

    if (!course) {
      return res.status(403).json({
        message: "Anda tidak berhak membuka absensi untuk mata kuliah ini",
      });
    }

    // Cegah dua session terbuka
    const activeSession = await prisma.absenceSession.findFirst({
      where: {
        courseId: Number(courseId),
        isOpen: true,
      },
    });

    if (activeSession) {
      return res.status(400).json({
        message: "Masih ada session absensi yang terbuka",
      });
    }

    const code = crypto.randomBytes(3).toString("hex").toUpperCase();

    const session = await prisma.absenceSession.create({
      data: {
        code,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        teacherId: dosenId,
        courseId: Number(courseId),
        isOpen: true,
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Session absensi berhasil dibuka",
      data: session,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Gagal membuka session absensi",
    });
  }
};

/* DOSEN MENUTUP SESSION ABSENSI */
export const closeSession = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const sessionId = Number(req.params.id);

    const session = await prisma.absenceSession.findFirst({
      where: {
        id: Number(sessionId),
        isOpen: true,
        endTime: { gte: new Date() },
      },
    });


    if (!session) {
      return res.status(404).json({
        message: "Session tidak ditemukan",
      });
    }

    if (session.teacherId !== dosenId) {
      return res.status(403).json({
        message: "Anda tidak berhak menutup session ini",
      });
    }

    if (!session.isOpen) {
      return res.status(400).json({
        message: "Session sudah ditutup",
      });
    }

    await prisma.absenceSession.update({
      where: { id: sessionId },
      data: {
        isOpen: false,
        endTime: new Date(),
      },
    });

    return res.json({
      message: "Session absensi berhasil ditutup",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Gagal menutup session absensi",
    });
  }
};

/* MAHASISWA MELAKUKAN ABSENSI */
export const attendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Kode absensi wajib diisi",
      });
    }

    // Cari session AKTIF berdasarkan kode
    const session = await prisma.absenceSession.findFirst({
      where: {
        code: code.toUpperCase(),
        isOpen: true,
      },
    });

    if (!session) {
      return res.status(400).json({
        message: "Sesi absensi tidak aktif atau kode salah",
      });
    }

    const now = new Date();
    if (now < session.startTime || now > session.endTime) {
      return res.status(403).json({
        message: "Absensi di luar waktu yang ditentukan",
      });
    }

    const alreadyAttend = await prisma.attendance.findFirst({
      where: {
        userId,
        sessionId: session.id,
      },
    });

    if (alreadyAttend) {
      return res.status(400).json({
        message: "Anda sudah melakukan absensi",
      });
    }

    const attend = await prisma.attendance.create({
      data: {
        userId,
        sessionId: session.id,
      },
    });

    return res.json({
      message: "Absensi berhasil",
      data: attend,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
};


/* DOSEN MELIHAT REKAP ABSENSI */
export const recapByCourse = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const courseId = Number(req.params.courseId);

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        dosenId: dosenId,
      },
    });

    if (!course) {
      return res.status(403).json({
        message: "Anda tidak berhak mengakses rekap mata kuliah ini",
      });
    }

    const sessions = await prisma.absenceSession.findMany({
      where: { courseId },
      include: {
        attendance: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    return res.json({
      course: {
        id: course.id,
        name: course.name,
      },
      totalSession: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Gagal mengambil rekap absensi",
    });
  }
};

export const getActiveSessionByCourse = async (req, res) => {
  const courseId = Number(req.params.courseId);

  const session = await prisma.absenceSession.findFirst({
    where: {
      courseId,
      isOpen: true,
    },
  });

  res.json(session);
};

