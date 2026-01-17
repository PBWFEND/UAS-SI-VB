import prisma from "../prisma/client.js";

export const submitAttendance = async (req, res) => {
  try {
    const { code } = req.body;

    // 1. Cari sesi berdasarkan kode
    const session = await prisma.absenceSession.findUnique({
      where: { code }
    });

    if (!session) {
      return res.status(404).json({ message: "Invalid absence code" });
    }

    // 2. Cek sesi masih dibuka
    if (!session.isOpen) {
      return res.status(400).json({ message: "Session is closed" });
    }

    const now = new Date();

    // 3. Cek waktu absensi
    if (now < session.startTime || now > session.endTime) {
      return res.status(400).json({ message: "Absence time expired" });
    }

    // 4. Cek apakah sudah absen
    const already = await prisma.attendance.findUnique({
      where: {
        userId_sessionId: {
          userId: req.user.id,
          sessionId: session.id
        }
      }
    });

    if (already) {
      return res.status(409).json({ message: "You already attended" });
    }

    // 5. Simpan absensi
    const attendance = await prisma.attendance.create({
      data: {
        userId: req.user.id,
        sessionId: session.id
      }
    });

    res.status(201).json({
      message: "Attendance recorded",
      data: attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
