export default function isMahasiswa(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "MAHASISWA") {
      return res.status(403).json({ message: "Akses khusus mahasiswa" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Middleware error" });
  }
}
