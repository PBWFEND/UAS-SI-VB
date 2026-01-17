import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import * as controller from "../controllers/attendance.controller.js";

const router = express.Router();

// Mahasiswa absen
router.post(
  "/",
  authenticate,
  authorizeRole("USER"),
  controller.submitAttendance
);

export default router;
