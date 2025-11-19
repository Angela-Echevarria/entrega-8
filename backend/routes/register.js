const express = require('express');
const router = express.Router();
const { createUser, findUserByEmail } = require('../utils/users');

// Endpoint POST /register
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

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'El formato del email no es válido'
      });
    }

    // Validar longitud mínima de contraseña
    if (contrasena.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const newUser = await createUser(email, contrasena);

    // Retornar éxito (sin incluir la contraseña)
    res.status(201).json({
      status: 'ok',
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    // Si es un error conocido, devolver mensaje específico
    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({
        status: 'error',
        message: error.message
      });
    }

    // Error genérico
    res.status(500).json({
      status: 'error',
      message: 'Error al procesar el registro'
    });
  }
});

module.exports = router;

