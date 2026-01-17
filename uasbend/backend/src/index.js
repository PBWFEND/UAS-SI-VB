import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import flightRoutes from "./routes/flight.route.js";

// routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";

// load env
dotenv.config();

const app = express(); // ⚠️ APP HARUS DIBUAT DI SINI

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());


// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/flights", flightRoutes);

// ================= TEST SERVER =================
app.get("/", (req, res) => {
  res.send("API Jadwal Penerbangan is running 🚀");
});

// ================= RUN SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
