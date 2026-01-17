import express from "express";
import { getDashboardStats } from "../controllers/adminDashboard.controller.js";
import {
  getAllDosen,
  createDosen,
  updateDosen,
  deleteDosen,
} from "../controllers/dosen.controller.js";

import {
  getAllMahasiswa,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../controllers/mahasiswa.controller.js";

import {
  getAllAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminUser.controller.js";

import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.js";


const router = express.Router();

/* ===== DASHBOARD ===== */
router.get(
  "/dashboard/stats",
  authMiddleware,
  isAdmin,
  getDashboardStats
);


/* ===== DOSEN ===== */
router.get("/dosen", authMiddleware, isAdmin, getAllDosen);
router.post("/dosen", authMiddleware, isAdmin, createDosen);
router.put("/dosen/:id", authMiddleware, isAdmin, updateDosen);
router.delete("/dosen/:id", authMiddleware, isAdmin, deleteDosen);


/* ===== MAHASISWA ===== */
router.get("/mahasiswa", authMiddleware, isAdmin, getAllMahasiswa);
router.post("/mahasiswa", authMiddleware, isAdmin, createMahasiswa);
router.put("/mahasiswa/:id", authMiddleware, isAdmin, updateMahasiswa);
router.delete("/mahasiswa/:id", authMiddleware, isAdmin, deleteMahasiswa);

/* ===== ADMIN  ===== */
router.get("/", authMiddleware, isAdmin, getAllAdmin);
router.post("/", authMiddleware, isAdmin, createAdmin);
router.put("/:id", authMiddleware, isAdmin, updateAdmin);
router.delete("/:id", authMiddleware, isAdmin, deleteAdmin);

/* ===== MATA KULIAH ===== */
router.get("/courses", authMiddleware, isAdmin, getAllCourses);
router.post("/courses", authMiddleware, isAdmin, createCourse);
router.put("/courses/:id", authMiddleware, isAdmin, updateCourse);
router.delete("/courses/:id", authMiddleware, isAdmin, deleteCourse);

export default router;
