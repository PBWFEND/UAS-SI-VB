export const validateRegister = (req, res, next) => {
  const { email, npm } = req.body;

  // Email wajib
  if (!email) {
    return res.status(400).json({
      message: "Email wajib diisi",
    });
  }

  // MAHASISWA
  if (email.endsWith("@student.unsap.ac.id")) {
    if (!npm) {
      return res.status(400).json({
        message: "NPM wajib diisi untuk mahasiswa",
      });
    }

    if (!/^\d{12,13}$/.test(npm)) {
      return res.status(400).json({
        message: "NPM harus berupa 12–13 digit angka",
      });
    }

    // TIDAK set role di sini
    return next();
  }

  // DOSEN
  if (email.endsWith("@unsap.ac.id")) {
    if (npm) {
      return res.status(400).json({
        message: "Dosen tidak memiliki NPM",
      });
    }

    return next();
  }

  // DOMAIN TIDAK VALID
  return res.status(400).json({
    message: "Email harus menggunakan domain resmi UNSAP",
  });
};
