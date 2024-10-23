//authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Acceso denegado. No hay token.' });

  // Verificar si el token tiene el formato 'Bearer <token>'
  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(400).json({ message: 'Formato de token inválido' });
  }

  try {
    const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = verified; // Guardar la información decodificada en la solicitud
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido' });
  }
};

module.exports = authMiddleware;


