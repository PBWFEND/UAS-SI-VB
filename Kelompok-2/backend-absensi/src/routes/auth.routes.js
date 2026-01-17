import express from "express";
import {
  registerDosen,
  registerMahasiswa,
  registerAdmin,
  login
} from "../controllers/auth.controller.js";

import { validateRegister } from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/register-admin", validateRegister, registerAdmin);
router.post("/register-dosen", validateRegister, registerDosen);
router.post("/register-mahasiswa", validateRegister, registerMahasiswa);
router.post("/login", login);

export default router;
