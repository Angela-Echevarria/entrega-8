CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

CREATE TABLE IF NOT EXISTS users (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS categories (
  idCategoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS products (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imagen VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'USD',
  idCategoria INT,
  FOREIGN KEY (idCategoria) REFERENCES categories(idCategoria)
);

CREATE TABLE IF NOT EXISTS orders (
  idPedido INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  subTotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES users(idUsuario)
);

CREATE TABLE IF NOT EXISTS order_items (
  idItem INT AUTO_INCREMENT PRIMARY KEY,
  idPedido INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  precioUnitario DECIMAL(10, 2) NOT NULL,
  subTotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (idPedido) REFERENCES orders(idPedido),
  FOREIGN KEY (idProducto) REFERENCES products(idProducto)
);

CREATE TABLE IF NOT EXISTS shipments (
  idEnvio INT AUTO_INCREMENT PRIMARY KEY,
  idPedido INT NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  departamento VARCHAR(100) NOT NULL,
  codigoPostal VARCHAR(20),
  tipoEnvio VARCHAR(50) NOT NULL,
  costoEnvio DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (idPedido) REFERENCES orders(idPedido)
);

CREATE TABLE IF NOT EXISTS payments (
  idPago INT AUTO_INCREMENT PRIMARY KEY,
  idPedido INT NOT NULL,
  metodoPago VARCHAR(50) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente',
  fechaPago DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idPedido) REFERENCES orders(idPedido)
);
