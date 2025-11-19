// Cargar variables de entorno desde .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');

const app = express();
const PORT = process.env.PORT;

// Validar que PORT esté definido
if (!PORT) {
  console.error('ERROR: PORT no está definido en el archivo .env');
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Error interno del servidor' 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

