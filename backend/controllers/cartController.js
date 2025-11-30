const db = require('../config/db');

exports.checkout = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      departamento,
      calle,
      numerodepuerta,
      esquina,
      tipoEnvio,
      formaPago,
      datosPago,
      subtotal,
      costoEnvio,
      total,
      carrito,
      fecha
    } = req.body;

    // 1. Insertar o identificar usuario (Simplificado: asumimos que el usuario ya existe o usamos un ID fijo por ahora si no hay auth completa)
    // En un caso real, obtendríamos el ID del usuario del token JWT (req.user.id)
    // Por ahora, usaremos un ID de usuario dummy o lo tomaremos del body si se enviara (no se envía en el frontend actual)
    // Vamos a asumir ID 1 para pruebas si no hay auth
    const idUsuario = req.user ? req.user.id : 1;

    // 2. Insertar Pedido
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (idUsuario, subTotal, total, fecha) VALUES (?, ?, ?, ?)',
      [idUsuario, subtotal, total, new Date(fecha)]
    );
    const idPedido = orderResult.insertId;

    // 3. Insertar Items del Pedido
    for (const item of carrito) {
      // Asumimos que el producto ya existe. Si no, habría que insertarlo o manejar error.
      // item.id es el ID del producto
      await connection.execute(
        'INSERT INTO order_items (idPedido, idProducto, cantidad, precioUnitario, subTotal) VALUES (?, ?, ?, ?, ?)',
        [idPedido, item.id, item.count, item.unitCost, item.unitCost * item.count]
      );
    }

    // 4. Insertar Envío
    await connection.execute(
      'INSERT INTO shipments (idPedido, direccion, ciudad, departamento, codigoPostal, tipoEnvio, costoEnvio) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [idPedido, `${calle} ${numerodepuerta} esq. ${esquina}`, 'Montevideo', departamento, '', tipoEnvio, costoEnvio] // Ciudad hardcoded o debería venir del form
    );

    // 5. Insertar Pago
    await connection.execute(
      'INSERT INTO payments (idPedido, metodoPago, estado) VALUES (?, ?, ?)',
      [idPedido, formaPago, 'completado']
    );

    await connection.commit();

    res.status(200).json({
      message: 'Compra realizada con éxito',
      orderId: idPedido
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error en checkout:', error);
    res.status(500).json({ message: 'Error al procesar la compra', error: error.message });
  } finally {
    connection.release();
  }
};
