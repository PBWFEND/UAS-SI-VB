import prisma from "../prisma/client.js";
import PDFDocument from "pdfkit";
import path from "path";

/* DASHBOARD MAHASISWA */
export const getDashboardMahasiswa = async (req, res) => {
  try {
    const userId = req.user.id;

    /* TOTAL MATA KULIAH */
    const totalMk = await prisma.enrollment.count({
      where: { userId },
    });

    /* SESI AKTIF (MK YANG DIA AMBIL) */
    const activeSessions = await prisma.absenceSession.findMany({
      where: {
        isOpen: true,
        course: {
          enrollments: {
            some: { userId },
          },
        },
      },
      include: {
        course: {
          select: { name: true, code: true },
        },
        teacher: {
          select: { name: true },
        },
      },
      orderBy: { startTime: "desc" },
    });

    /* HITUNG HADIR & ALFA (BERDASARKAN SESI AKTIF) */
    let hadir = 0;
    let alfa = 0;

    if (activeSessions.length > 0) {
      const activeSessionIds = activeSessions.map((s) => s.id);

      hadir = await prisma.attendance.count({
        where: {
          userId,
          sessionId: { in: activeSessionIds },
        },
      });

      alfa = activeSessionIds.length - hadir;
    }

    /* RESPONSE */
    res.json({
      totalMk,
      hadir,
      alfa: alfa < 0 ? 0 : alfa,

      activeSessions: activeSessions.map((s) => ({
        sessionId: s.id,
        kodeMk: s.course.code,
        mataKuliah: s.course.name,
        dosen: s.teacher.name,
        startTime: s.startTime,
        endTime: s.endTime,
        code: s.code,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil dashboard mahasiswa",
    });
  }
};


/* SESI AKTIF MAHASISWA (HANYA MK YANG DIA AMBIL) */
export const getActiveSessionMahasiswa = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await prisma.absenceSession.findMany({
      where: {
        isOpen: true,
        course: {
          enrollments: {
            some: { userId },
          },
        },
      },
      include: {
        course: {
          select: { name: true, code: true },
        },
        teacher: {
          select: { name: true },
        },
      },
      orderBy: { startTime: "desc" },
    });

    res.json(
      sessions.map((s) => ({
        sessionId: s.id,
        code: s.code,
        startTime: s.startTime,
        endTime: s.endTime,
        course: s.course.name,
        kodeMk: s.course.code,
        dosen: s.teacher.name,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil sesi aktif",
    });
  }
};

/* RIWAYAT ABSENSI MAHASISWA */
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await prisma.attendance.findMany({
      where: { userId },
      include: {
        session: {
          include: {
            course: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil riwayat absensi",
    });
  }
};

export const getStatistikPerMk = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil semua MK yang diambil mahasiswa
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            sessions: {
              include: {
                attendance: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });

    const result = enrollments.map((e) => {
      const sessions = e.course.sessions;
      const totalPertemuan = sessions.length;

      let hadir = 0;
      sessions.forEach((s) => {
        if (s.attendance.length > 0) hadir++;
      });

      const alfa = totalPertemuan - hadir;
      const persentase =
        totalPertemuan === 0
          ? 0
          : Math.round((hadir / totalPertemuan) * 100);

      return {
        courseId: e.course.id,
        kodeMk: e.course.code,
        namaMk: e.course.name,
        totalPertemuan,
        hadir,
        alfa,
        persentase,
        status: persentase >= 75 ? "AMAN" : "WARNING",
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Gagal mengambil statistik per mata kuliah",
    });
  }
};

export const getRiwayatAbsensiMahasiswa = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await prisma.absenceSession.findMany({
      where: {
        course: {
          enrollments: {
            some: { userId },
          },
        },
      },
      include: {
        course: {
          select: { name: true, code: true },
        },
        teacher: {
          select: { name: true },
        },
        attendance: { 
          where: { userId },
          select: { createdAt: true },
        },
      },
      orderBy: { startTime: "desc" },
    });

    const result = sessions.map((s) => ({
      mataKuliah: s.course.name,
      kodeMk: s.course.code,
      dosen: s.teacher?.name || "-", 
      tanggal: s.startTime.toISOString().split("T")[0],
      jam: `${s.startTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${s.endTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      status: s.attendance.length > 0 ? "HADIR" : "TIDAK HADIR",
    }));

    res.json(result);
  } catch (error) {
    console.error("RIWAYAT ABSENSI ERROR:", error);
    res.status(500).json({
      message: "Gagal mengambil riwayat absensi",
    });
  }
};

/* EXPORT PDF RIWAYAT ABSENSI */
export const exportRiwayatAbsensiPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mk } = req.query;
    const mahasiswa = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      npm: true,
    },
  });


    const sessions = await prisma.absenceSession.findMany({
      where: {
        course: {
          enrollments: {
            some: { userId },
          },
          ...(mk ? { name: mk } : {}),
        },
      },
      include: {
        course: { select: { name: true, code: true } },
        teacher: { select: { name: true } },
        attendance: {
          where: { userId },
        },
      },
      orderBy: { startTime: "desc" },
    });

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=riwayat-absensi.pdf"
    );

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const headerTop = 40;

    /* ================= LOGO ================= */
    const logoPath = path.resolve("src/assets/UNSAP.png");
    doc.image(logoPath, 40, headerTop, { width: 65 });

    /* ================= HEADER TEXT (CENTER) ================= */
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("UNIVERSITAS SEBELAS APRIL", 0, headerTop + 5, {
        align: "center",
        width: pageWidth,
      });

    doc
      .fontSize(13)
      .text("RIWAYAT ABSENSI MAHASISWA", 0, headerTop + 28, {
        align: "center",
        width: pageWidth,
      });

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`Mata Kuliah: ${mk || "Semua Mata Kuliah"}`, 0, headerTop + 48, {
        align: "center",
        width: pageWidth,
      });

    /* ================= IDENTITAS MAHASISWA ================= */
      const infoTop = headerTop + 105;
      const labelX = 40;
      const colonX = 155;
      const valueX = 165;

      doc.font("Helvetica").fontSize(11);

      doc.text("Nama Mahasiswa", labelX, infoTop);
      doc.text(":", colonX, infoTop);
      doc.text(mahasiswa.name, valueX, infoTop);

      doc.text("NPM", labelX, infoTop + 16);
      doc.text(":", colonX, infoTop + 16);
      doc.text(mahasiswa.npm, valueX, infoTop + 16);

      doc.text(
        "Mata Kuliah",
        labelX,
        infoTop + 32
      );
      doc.text(":", colonX, infoTop + 32);
      doc.text(mk || "Semua Mata Kuliah", valueX, infoTop + 32);

      /* ================= GARIS PEMISAH ================= */
      const lineY = infoTop + 55;
      doc.moveTo(40, lineY).lineTo(pageWidth - 40, lineY).stroke();

      /* ================= TABLE HEADER ================= */
      const tableTop = lineY + 15;


    const col = {
      no: 40,
      mk: 75,
      dosen: 270,
      tanggal: 395,
      status: 470,
    };

    doc.font("Helvetica-Bold").fontSize(10);

    doc.text("No", col.no, tableTop);
    doc.text("Mata Kuliah", col.mk, tableTop);
    doc.text("Dosen", col.dosen, tableTop);
    doc.text("Tanggal", col.tanggal, tableTop);
    doc.text("Status", col.status, tableTop);

    doc
      .moveTo(40, tableTop + 14)
      .lineTo(pageWidth - 40, tableTop + 14)
      .stroke();

    /* ================= TABLE BODY ================= */
    let y = tableTop + 22;
    doc.font("Helvetica").fontSize(9);

    sessions.forEach((s, i) => {
      const status = s.attendance.length > 0 ? "HADIR" : "TIDAK HADIR";

      doc.text(i + 1, col.no, y, { width: 30 });

      doc.text(
        `${s.course.name}\n(${s.course.code})`,
        col.mk,
        y,
        { width: 190 }
      );

      doc.text(s.teacher?.name || "-", col.dosen, y, { width: 120 });

      doc.text(
        s.startTime.toLocaleDateString("id-ID"),
        col.tanggal,
        y,
        { width: 70 }
      );

      doc.text(status, col.status, y, { width: 80 });

      y += 32;

      /* ===== PAGE BREAK ===== */
      if (y > 750) {
        doc.addPage();
        y = 60;
      }
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal export PDF" });
  }
};
