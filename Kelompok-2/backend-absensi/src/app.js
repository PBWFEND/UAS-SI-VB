import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import absenceRoutes from "./routes/absence.routes.js";
import adminRoutes from "./routes/admin.routes.js"; 
import dosenRoutes from "./routes/dosen.routes.js";
import mahasiswaRoutes from "./routes/mahasiswa.routes.js";

dotenv.config();

const app = express();

// global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/absence", absenceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dosen", dosenRoutes);
app.use("/api/mahasiswa", mahasiswaRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ message: "API Absensi berjalan" });
});

export default app;

