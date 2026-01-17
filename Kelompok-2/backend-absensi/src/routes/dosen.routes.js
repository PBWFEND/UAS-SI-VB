import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import isDosen from "../middlewares/isDosen.js";

import {
  getDashboardDosen,
  openSession,
  closeSession,
  getRecapByCourse,
  getActiveSession,
  exportRecapPdf,
  exportRecapByCoursePdf, 
} from "../controllers/dosenDashboard.controller.js";

const router = express.Router();

/* ===== DASHBOARD DOSEN ===== */
router.get("/dashboard", authMiddleware, isDosen, getDashboardDosen);

/* ===== ABSENSI ===== */
router.post("/session", authMiddleware, isDosen, openSession);
router.patch("/session/:id/close", authMiddleware, isDosen, closeSession);
router.get("/session/active", authMiddleware, isDosen, getActiveSession);

/* ===== REKAP (JSON) ===== */
router.get("/recap/:courseId", authMiddleware, isDosen, getRecapByCourse);

/* ===== REKAP PDF ===== */
// 1 SESI
router.get(
  "/recap/session/:sessionId/pdf",
  authMiddleware,
  isDosen,
  exportRecapPdf
);

// 1 MATA KULIAH (SEMUA PERTEMUAN)
router.get(
  "/recap/matakuliah/:courseId/pdf",
  authMiddleware,
  isDosen,
  exportRecapByCoursePdf
);

export default router;
