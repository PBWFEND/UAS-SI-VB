import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";

import {
  createSession,
  attendance,
  recapByCourse,
  closeSession,
} from "../controllers/absence.controller.js";

const router = express.Router();

/**
 * ======================
 * DOSEN
 * ======================
 */

// Dosen membuka sesi absensi
router.post(
  "/session",
  authMiddleware,
  authorizeRole("DOSEN"),
  createSession
);

// Dosen menutup sesi absensi
router.patch(
  "/session/:id/close",
  authMiddleware,
  authorizeRole("DOSEN"),
  closeSession
);

// Rekap absensi per mata kuliah
router.get(
  "/recap/:courseId",
  authMiddleware,
  authorizeRole("DOSEN"),
  recapByCourse
);

/**
 * ======================
 * MAHASISWA
 * ======================
 */

// Mahasiswa melakukan absensi
router.post(
  "/attendance",
  authMiddleware,
  authorizeRole("MAHASISWA"),
  attendance
);

export default router;
