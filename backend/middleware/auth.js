const jwt = require('jsonwebtoken');

// Clave secreta para verificar los tokens (debe ser la misma que en login.js y estar definida en .env)
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware de autorización que verifica la presencia y validez del token JWT
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    // Formato esperado: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Token de autorización no proporcionado'
      });
    }

    // Verificar que el header tenga el formato correcto
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        status: 'error',
        message: 'Formato de token inválido. Use: Bearer <token>'
      });
    }

    const token = parts[1];

    // Verificar y decodificar el token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            status: 'error',
            message: 'Token expirado'
          });
        } else if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({
            status: 'error',
            message: 'Token inválido'
          });
        } else {
          return res.status(401).json({
            status: 'error',
            message: 'Error al verificar el token'
          });
        }
      }

      // Agregar la información del usuario decodificada al request
      req.user = decoded;
      next();
    });

  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al procesar la autenticación'
    });
  }
};

module.exports = authMiddleware;

