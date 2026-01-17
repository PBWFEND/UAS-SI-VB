const isDosen = (req, res, next) => {
  if (req.user.role !== "DOSEN") {
    return res.status(403).json({ message: "Akses khusus dosen" });
  }
  next();
};

export default isDosen;
