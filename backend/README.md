# Backend eMercado

Backend para el eCommerce eMercado con autenticación JWT y gestión de usuarios.

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (opcional):
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

## Uso

### Iniciar el servidor:
```bash
npm start
```

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

## Estructura del Proyecto

```
backend/
├── server.js              # Servidor principal
├── middleware/
│   └── auth.js           # Middleware de autorización JWT
├── routes/
│   ├── login.js          # Endpoint POST /login
│   ├── register.js       # Endpoint POST /register
│   └── protected.js      # Rutas protegidas del eCommerce
├── utils/
│   └── users.js          # Gestión de usuarios (almacenamiento en JSON)
└── data/
    └── users.json         # Archivo de almacenamiento de usuarios (se crea automáticamente)
```

## Endpoints Públicos

### POST /register
Registra un nuevo usuario en el sistema.

**Body:**
```json
{
  "email": "user@example.com",
  "contrasena": "password123"
}
```

**Validaciones:**
- Email debe tener formato válido
- Contraseña debe tener al menos 6 caracteres
- El email no debe estar ya registrado

**Respuesta exitosa (201):**
```json
{
  "status": "ok",
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "1234567890",
    "email": "user@example.com"
  }
}
```

**Errores:**
- `400` - Campos faltantes o formato inválido
- `409` - Email ya registrado
- `500` - Error interno del servidor

### POST /login
Autentica un usuario y devuelve un token JWT.

**Body:**
```json
{
  "email": "user@example.com",
  "contrasena": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "status": "ok",
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "id": "1234567890"
  }
}
```

**Errores:**
- `400` - Campos faltantes
- `401` - Credenciales incorrectas
- `500` - Error interno del servidor

## Rutas Protegidas (requieren token JWT)

Todas las rutas bajo `/api` requieren autenticación. El token debe enviarse en el header:

```
Authorization: Bearer <token>
```

**Ejemplos de rutas protegidas:**
- `GET /api/user` - Información del usuario autenticado
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/add` - Agregar producto al carrito
- `POST /api/purchase` - Realizar compra
- `GET /api/purchases` - Historial de compras
- `POST /api/sell` - Publicar producto

## Almacenamiento de Usuarios

Los usuarios se almacenan en `data/users.json`. Este archivo se crea automáticamente cuando se registra el primer usuario.

**Estructura del archivo:**
```json
[
  {
    "id": "1234567890",
    "email": "user@example.com",
    "contrasena": "password123",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Nota de seguridad:** En producción, las contraseñas deben estar hasheadas (usando bcrypt o similar). La implementación actual almacena las contraseñas en texto plano solo para fines educativos.

## Middleware de Autenticación

El middleware `auth.js` verifica:
- Presencia del token en el header `Authorization`
- Formato correcto: `Bearer <token>`
- Validez del token (firma y expiración)

Si el token es inválido o no está presente, devuelve un error 401.

## Integración con Frontend

El backend está diseñado para trabajar con el frontend que realiza peticiones desde `http://localhost:5501` (o el puerto configurado en Live Server). El CORS está habilitado para permitir estas peticiones.

