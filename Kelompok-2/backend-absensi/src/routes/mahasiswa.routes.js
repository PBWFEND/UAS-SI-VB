import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import isMahasiswa from "../middlewares/isMahasiswa.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

import {
  getDashboardMahasiswa,
  getActiveSessionMahasiswa,
  getMyAttendance,
  getStatistikPerMk,
  getRiwayatAbsensiMahasiswa,
  exportRiwayatAbsensiPDF,
} from "../controllers/akses-mahasiswa.controller.js";

const router = express.Router();

/* DASHBOARD MAHASISWA */
router.get("/dashboard",authMiddleware, authorizeRole("MAHASISWA"), getDashboardMahasiswa );
router.get("/session/active", authMiddleware, isMahasiswa, getActiveSessionMahasiswa);
router.get("/attendance", authMiddleware, isMahasiswa, getMyAttendance);
router.get("/statistik-mk", authMiddleware, authorizeRole("MAHASISWA"), getStatistikPerMk);
router.get("/riwayat-absensi", authMiddleware, authorizeRole("MAHASISWA"), getRiwayatAbsensiMahasiswa);
router.get("/riwayat-absensi/pdf", authMiddleware, authorizeRole("MAHASISWA"), exportRiwayatAbsensiPDF);
export default router;
