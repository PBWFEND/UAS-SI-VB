const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Akses admin saja" });
  }
  next();
};

export default isAdmin;
