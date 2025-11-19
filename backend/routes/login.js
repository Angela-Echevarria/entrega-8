const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { validateCredentials } = require('../utils/users');

// Clave secreta para firmar los tokens (debe estar definida en .env)
const JWT_SECRET = process.env.JWT_SECRET;

// Endpoint POST /login
router.post('/', async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Validar que se recibieron los campos necesarios
    if (!email || !contrasena) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y contraseña son requeridos'
      });
    }

    // Validar credenciales usando el sistema de usuarios del backend
    const usuarioValido = await validateCredentials(email, contrasena);

    if (!usuarioValido) {
      return res.status(401).json({
        status: 'error',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        email: usuarioValido.email,
        userId: usuarioValido.id || usuarioValido.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' } // El token expira en 24 horas
    );

    // Devolver el token
    res.json({
      status: 'ok',
      message: 'Login exitoso',
      token: token,
      user: {
        email: usuarioValido.email,
        id: usuarioValido.id
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al procesar el login'
    });
  }
});

module.exports = router;

