import * as authService from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";

// ==============================
// REGISTER ADMIN
// ==============================
export const registerAdmin = async (req, res) => {
  try {
    const user = await authService.register({
      ...req.body,
      role: "ADMIN",
    });

    res.status(201).json({
      message: "Registrasi admin berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ==============================
// REGISTER DOSEN
// ==============================
export const registerDosen = async (req, res) => {
  try {
    const user = await authService.register({
      ...req.body,
      role: "DOSEN",
    });

    res.status(201).json({
      message: "Registrasi dosen berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ==============================
// REGISTER MAHASISWA
// ==============================
export const registerMahasiswa = async (req, res) => {
  try {
    const user = await authService.register({
      ...req.body,
      role: "MAHASISWA",
    });

    res.status(201).json({
      message: "Registrasi mahasiswa berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        npm: user.npm,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ==============================
// LOGIN (FIXED)
// ==============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
