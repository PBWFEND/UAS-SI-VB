import prisma from "../prisma/client.js";
import PDFDocument from "pdfkit";

/* ===== DASHBOARD DOSEN ===== */
export const getDashboardDosen = async (req, res) => {
  try {
    const dosenId = req.user.id;

    /* ===== COURSE ===== */
    const courses = await prisma.course.findMany({
      where: { dosenId },
      include: {
        sessions: {
          where: { isOpen: true },
        },
        _count: {
          select: { sessions: true },
        },
      },
    });

    const totalCourses = courses.length;

    /* ===== ACTIVE SESSION ===== */
    const activeSession = await prisma.absenceSession.findFirst({
      where: {
        teacherId: dosenId,
        isOpen: true,
      },
      include: {
        attendance: true,
        course: true,
      },
    });

    const activeSessions = activeSession ? 1 : 0;

    /* ===== TOTAL SESSION ===== */
    const totalSessions = await prisma.absenceSession.count({
      where: { teacherId: dosenId },
    });

    /* ===== LOGIKA KHUSUS SESI AKTIF ===== */
   let activeMeeting = 0;
   let activeAttendance = 0;
   let progressPercentage = 0;


    if (activeSession) {
    activeMeeting = await prisma.absenceSession.count({
      where: {
        courseId: activeSession.courseId,
        teacherId: dosenId,
      },
    });

    activeAttendance = activeSession.attendance.length;

    // PROGRESS BAR
    progressPercentage = Math.round(
      (activeMeeting / 16) * 100
    );
  }


    /* ===== RESPONSE ===== */
    res.json({
      dosen: {
        name: req.user.name,
        email: req.user.email,
      },
      stats: {
        totalCourses,
        activeSessions,

        absensiHariIni: activeAttendance,
        activeMeeting,
        activeAttendance,

        // batas maksimal pertemuan (tetap)
        maxMeetings: 16,

        // info tambahan (tidak dipakai progress bar)
        totalSessions,
      },
      courses: courses.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        activeSession: c.sessions.length > 0,
        totalSessions: c._count.sessions,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memuat dashboard dosen" });
  }
};

/* ===== BUKA SESI ===== */
export const openSession = async (req, res) => {
  try {
    const { courseId } = req.body;

    const session = await prisma.absenceSession.create({
      data: {
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
        teacherId: req.user.id,
        courseId,
        isOpen: true,
      },
    });

    res.json({ message: "Sesi absensi dibuka", session });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuka sesi" });
  }
};

/* ===== TUTUP SESI ===== */
export const closeSession = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.absenceSession.update({
      where: { id: Number(id) },
      data: { isOpen: false },
    });

    res.json({ message: "Sesi absensi ditutup" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menutup sesi" });
  }
};

/* ===== REKAP ===== */
export const getRecapByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const recap = await prisma.attendance.findMany({
      where: {
        session: { courseId: Number(courseId) },
      },
      include: {
        user: true,
        session: true,
      },
    });

    res.json(recap);
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat rekap" });
  }
};

/* ===== GET ACTIVE SESSION DOSEN ===== */
export const getActiveSession = async (req, res) => {
  try {
    const session = await prisma.absenceSession.findFirst({
      where: {
        teacherId: req.user.id,
        isOpen: true,
      },
      include: {
        course: true,
      },
    });

    res.json(session); // null jika tidak ada
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil sesi aktif" });
  }
};

/* ===== EXPORT REKAP PDF ===== */
export const exportRecapPdf = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.absenceSession.findUnique({
      where: { id: Number(sessionId) },
      include: {
        course: true,
        teacher: true,
        attendance: {
          orderBy: {
            createdAt: "asc", 
          },
          include: {
            user: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ message: "Sesi tidak ditemukan" });
    }

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rekap-absensi-${session.course.code}.pdf`
    );

    doc.pipe(res);

    /* ================= HEADER ================= */
    doc.fontSize(16).font("Helvetica-Bold")
      .text("REKAP ABSENSI MAHASISWA", { align: "center" });

    doc.moveDown(1);

    doc.fontSize(11).font("Helvetica");

    const labelX = 50;
    const colonX = 140; // posisi ':' sejajar
    const valueX = 150;
    let infoY = doc.y;

    /* Mata Kuliah */
    doc.text("Mata Kuliah", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(session.course.name, valueX, infoY);

    /* Kode MK */
    infoY += 15;
    doc.text("Kode MK", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(session.course.code, valueX, infoY);

    /* Dosen */
    infoY += 15;
    doc.text("Dosen", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(session.teacher.name, valueX, infoY);

    /* Tanggal */
    infoY += 15;
    doc.text("Tanggal", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(
      new Date(session.startTime).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      valueX,
      infoY
    );

    /* Waktu */
    infoY += 15;
    doc.text("Waktu", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(
      `${new Date(session.startTime).toLocaleTimeString("id-ID")} - ${new Date(session.endTime).toLocaleTimeString("id-ID")}`,
      valueX,
      infoY
    );

    doc.moveDown(2);


    /* ================= TABLE SETUP ================= */
    const tableTop = doc.y;
    const rowHeight = 25;

    const colNo = 50;
    const colNpm = 90;
    const colNama = 170;
    const colJam = 430;
    const tableRight = 550;

    /* ================= TABLE HEADER ================= */
    doc.font("Helvetica-Bold");
    doc.text("No", colNo + 5, tableTop + 7);
    doc.text("NPM", colNpm + 5, tableTop + 7);
    doc.text("Nama Mahasiswa", colNama + 5, tableTop + 7);
    doc.text("Jam Absen", colJam + 5, tableTop + 7);

    /* Header border */
    doc
      .moveTo(colNo, tableTop)
      .lineTo(tableRight, tableTop)
      .stroke();

    doc
      .moveTo(colNo, tableTop + rowHeight)
      .lineTo(tableRight, tableTop + rowHeight)
      .stroke();

    doc
      .moveTo(colNo, tableTop)
      .lineTo(colNo, tableTop + rowHeight)
      .stroke();

    doc
      .moveTo(colNpm, tableTop)
      .lineTo(colNpm, tableTop + rowHeight)
      .stroke();

    doc
      .moveTo(colNama, tableTop)
      .lineTo(colNama, tableTop + rowHeight)
      .stroke();

    doc
      .moveTo(colJam, tableTop)
      .lineTo(colJam, tableTop + rowHeight)
      .stroke();

    doc
      .moveTo(tableRight, tableTop)
      .lineTo(tableRight, tableTop + rowHeight)
      .stroke();

    /* ================= TABLE CONTENT ================= */
    doc.font("Helvetica");

    let y = tableTop + rowHeight;

    session.attendance.forEach((a, index) => {
      doc.text(index + 1, colNo + 5, y + 7);
      doc.text(a.user.npm || "-", colNpm + 5, y + 7);
      doc.text(a.user.name, colNama + 5, y + 7);
      doc.text(
        new Date(a.createdAt).toLocaleTimeString("id-ID"),
        colJam + 5,
        y + 7
      );

      // horizontal line
      doc
        .moveTo(colNo, y + rowHeight)
        .lineTo(tableRight, y + rowHeight)
        .stroke();

      // vertical lines
      [colNo, colNpm, colNama, colJam, tableRight].forEach((x) => {
        doc.moveTo(x, y).lineTo(x, y + rowHeight).stroke();
      });

      y += rowHeight;
    });

    /* ================= TOTAL HADIR ================= */
    doc.moveDown(2);
    doc.font("Helvetica-Bold");
    doc.text(
      `Total Hadir : ${session.attendance.length} Mahasiswa`,
      50,
      y + 20
    );

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal export PDF" });
  }
};

/* ===== EXPORT REKAP ABSENSI PER MATA KULIAH (TABEL SEMUA PERTEMUAN) ===== */
export const exportRecapByCoursePdf = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        dosen: true,
        sessions: {
          orderBy: { startTime: "asc" },
          include: {
            attendance: {
              orderBy: { createdAt: "asc" },
              include: { user: true },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Mata kuliah tidak ditemukan" });
    }

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rekap-absensi-${course.code}.pdf`
    );

    doc.pipe(res);

    /* ================= HEADER ================= */
    doc.fontSize(16).font("Helvetica-Bold")
      .text("REKAP ABSENSI MAHASISWA", { align: "center" });

    doc.moveDown(1);
    doc.fontSize(11).font("Helvetica");

   const labelX = 50;
    const colonX = 170;
    const valueX = 180;
    let infoY = doc.y;

    doc.text("Mata Kuliah", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(course.name, valueX, infoY);

    infoY += 15;
    doc.text("Kode MK", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(course.code, valueX, infoY);

    infoY += 15;
    doc.text("Dosen", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(course.dosen.name, valueX, infoY);

    infoY += 15;
    doc.text("Total Pertemuan", labelX, infoY);
    doc.text(":", colonX, infoY);
    doc.text(course.sessions.length.toString(), valueX, infoY);

    doc.moveDown(2);

    /* ================= LOOP PERTEMUAN ================= */
    course.sessions.forEach((session, idx) => {
      /* JUDUL PERTEMUAN */
      doc.font("Helvetica-Bold")
        .text(`PERTEMUAN ${idx + 1}`, 50);

      doc.font("Helvetica")
        .text(
          `Tanggal : ${new Date(session.startTime).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`,
          50
        );

      doc.moveDown(0.5);

      /* ===== SETUP TABEL ===== */
      const tableTop = doc.y;
      const rowHeight = 25;

      const colNo = 50;
      const colNpm = 90;
      const colNama = 170;
      const colJam = 430;
      const tableRight = 550;

      /* HEADER TABEL */
      doc.font("Helvetica-Bold");
      doc.text("No", colNo + 5, tableTop + 7);
      doc.text("NPM", colNpm + 5, tableTop + 7);
      doc.text("Nama Mahasiswa", colNama + 5, tableTop + 7);
      doc.text("Jam Absen", colJam + 5, tableTop + 7);

      /* BORDER HEADER */
      doc.moveTo(colNo, tableTop).lineTo(tableRight, tableTop).stroke();
      doc.moveTo(colNo, tableTop + rowHeight).lineTo(tableRight, tableTop + rowHeight).stroke();

      [colNo, colNpm, colNama, colJam, tableRight].forEach(x => {
        doc.moveTo(x, tableTop).lineTo(x, tableTop + rowHeight).stroke();
      });

      /* ISI TABEL */
      doc.font("Helvetica");
      let y = tableTop + rowHeight;

      if (session.attendance.length === 0) {
        doc.text("Tidak ada mahasiswa hadir", colNo + 5, y + 7);
        y += rowHeight;
      } else {
        session.attendance.forEach((a, i) => {
          doc.text(i + 1, colNo + 5, y + 7);
          doc.text(a.user.npm || "-", colNpm + 5, y + 7);
          doc.text(a.user.name, colNama + 5, y + 7);
          doc.text(
            new Date(a.createdAt).toLocaleTimeString("id-ID"),
            colJam + 5,
            y + 7
          );

          doc.moveTo(colNo, y + rowHeight).lineTo(tableRight, y + rowHeight).stroke();
          [colNo, colNpm, colNama, colJam, tableRight].forEach(x => {
            doc.moveTo(x, y).lineTo(x, y + rowHeight).stroke();
          });

          y += rowHeight;
        });
      }

      doc.moveDown(1);
      doc.font("Helvetica-Bold")
      .text(
        `Total Hadir : ${session.attendance.length} Mahasiswa`,
        400,
        doc.y,
        { align: "right", width: 150 }
      );

      /* PAGE BREAK BIAR RAPI */
      if (doc.y > 700) doc.addPage();
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal export rekap mata kuliah" });
  }
};
