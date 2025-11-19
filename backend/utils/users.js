const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Cargar usuarios desde el archivo JSON
async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Si el archivo no existe, retornar array vacío
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Guardar usuarios en el archivo JSON
async function saveUsers(users) {
  // Asegurar que el directorio existe
  const dataDir = path.dirname(USERS_FILE);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Buscar usuario por email
async function findUserByEmail(email) {
  const users = await loadUsers();
  return users.find(user => user.email === email);
}

// Crear nuevo usuario
async function createUser(email, contrasena) {
  const users = await loadUsers();
  
  // Verificar si el usuario ya existe
  if (users.find(user => user.email === email)) {
    throw new Error('El email ya está registrado');
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: Date.now().toString(),
    email: email,
    contrasena: contrasena,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  await saveUsers(users);
  
  return newUser;
}

// Validar credenciales de usuario
async function validateCredentials(email, contrasena) {
  const user = await findUserByEmail(email);
  
  if (!user || user.contrasena !== contrasena) {
    return null;
  }
  
  // Retornar usuario sin la contraseña
  const { contrasena: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = {
  findUserByEmail,
  createUser,
  validateCredentials
};

