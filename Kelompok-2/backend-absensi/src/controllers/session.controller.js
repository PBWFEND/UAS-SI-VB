import prisma from "../prisma/client.js";

export const openSession = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { classId, duration } = req.body; 
    // duration dalam menit (misal 10)

    // 1. Cek kelas milik dosen
    const kelas = await prisma.class.findFirst({
      where: {
        id: classId,
        dosenId: dosenId
      }
    });

    if (!kelas) {
      return res.status(403).json({
        message: "You are not allowed to open session for this class"
      });
    }

    // 2. Generate kode session
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();

    const now = new Date();
    const endTime = new Date(now.getTime() + (duration || 10) * 60000);

    // 3. Simpan session ke database
    const session = await prisma.absenceSession.create({
      data: {
        code,
        classId,
        dosenId,
        startTime: now,
        endTime,
        isOpen: true
      }
    });

    res.status(201).json({
      message: "Attendance session opened",
      data: {
        sessionId: session.id,
        code: session.code,
        endTime: session.endTime
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const closeSession = async (req, res) => {
  try {
    const dosenId = req.user.id;
    const { sessionId } = req.params;

    // 1. Cari session milik dosen
    const session = await prisma.absenceSession.findFirst({
      where: {
        id: sessionId,
        dosenId: dosenId
      }
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found or not authorized"
      });
    }

    // 2. Cek apakah session sudah ditutup
    if (!session.isOpen) {
      return res.status(400).json({
        message: "Session already closed"
      });
    }

    // 3. Tutup session
    const updatedSession = await prisma.absenceSession.update({
      where: { id: sessionId },
      data: {
        isOpen: false
      }
    });

    res.status(200).json({
      message: "Attendance session closed",
      data: updatedSession
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

