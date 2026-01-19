const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const parts = authHeader.split(' ');

  if (!authHeader || parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // isi payload minimal: { id, username, role }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { verifyToken };
