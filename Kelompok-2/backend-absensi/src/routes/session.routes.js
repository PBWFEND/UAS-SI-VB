import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { openSession } from "../controllers/session.controller.js";
import { closeSession } from "../controllers/session.controller.js";


const router = express.Router();

// Dosen buka sesi absensi
router.post(
  "/open",
  authenticate,
  authorizeRole("ADMIN"), // atau "DOSEN" 
  openSession
);
router.post(
  "/close/:sessionId",
  authenticate,
  authorizeRole("ADMIN"), // atau "DOSEN"
  closeSession
);

export default router;
