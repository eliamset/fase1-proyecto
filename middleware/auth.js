const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Leer token del header
  const token = req.header('x-auth-token');

  // Si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};
