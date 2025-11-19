document.addEventListener("DOMContentLoaded", () => {
  mostrarUsuarioLogueado("#userNav", false);
  actualizarBadgeCarrito();
  cargarDetallesCompra();
});

function cargarDetallesCompra() {
  const datosEnvio = JSON.parse(localStorage.getItem("datosEnvio"));

  if (!datosEnvio) {
    alert("No se encontraron datos de la compra.");
    window.location.href = "cart.html";
    return;
  }

  // Generar número de pedido
  const numeroPedido = `PED-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  document.getElementById("numero-pedido").textContent = numeroPedido;

  // Formatear fecha
  const fecha = new Date(datosEnvio.fecha);
  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById("fecha-pedido").textContent = fechaFormateada;

  // Mostrar tipo de envío
  let tipoEnvioTexto = "";
  switch(datosEnvio.tipoEnvio) {
    case "premium":
      tipoEnvioTexto = "Premium (2 a 5 días)";
      break;
    case "express":
      tipoEnvioTexto = "Express (5 a 8 días)";
      break;
    case "standard":
      tipoEnvioTexto = "Standard (12 a 15 días)";
      break;
  }
  document.getElementById("tipo-envio").textContent = tipoEnvioTexto;

  // Mostrar forma de pago
  let formaPagoTexto = "";
  switch(datosEnvio.formaPago) {
    case "tarjeta":
      formaPagoTexto = "Tarjeta de crédito o débito";
      if (datosEnvio.datosPago && datosEnvio.datosPago.numeroTarjeta) {
        const ultimos4 = datosEnvio.datosPago.numeroTarjeta.replace(/\s/g, '').slice(-4);
        formaPagoTexto += ` (**** **** **** ${ultimos4})`;
      }
      break;
    case "transferencia":
      formaPagoTexto = "Transferencia bancaria";
      if (datosEnvio.datosPago && datosEnvio.datosPago.banco) {
        formaPagoTexto += ` - ${datosEnvio.datosPago.banco.toUpperCase()}`;
      }
      break;
  }
  document.getElementById("forma-pago").textContent = formaPagoTexto;

  // Mostrar dirección
  const direccion = `${datosEnvio.calle} ${datosEnvio.numerodepuerta}, esquina ${datosEnvio.esquina}, ${datosEnvio.departamento}`;
  document.getElementById("direccion-envio").textContent = direccion;

  // Mostrar total
  document.getElementById("total-pedido").textContent = `Total: $${datosEnvio.total.toFixed(2)}`;

  // Mostrar productos
  mostrarProductos(datosEnvio.carrito);
}

function mostrarProductos(productos) {
  const listaProductos = document.getElementById("lista-productos");
  
  if (!productos || productos.length === 0) {
    listaProductos.innerHTML = '<p class="text-muted">No hay productos en este pedido.</p>';
    return;
  }

  listaProductos.innerHTML = "";

  productos.forEach(producto => {
    const productoDiv = document.createElement("div");
    productoDiv.className = "producto-item d-flex align-items-center justify-content-between p-3 mb-2 border rounded";
    
    productoDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${producto.image}" alt="${producto.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" class="me-3">
        <div>
          <h6 class="mb-0">${producto.name}</h6>
          <small class="text-muted">Cantidad: ${producto.count}</small>
        </div>
      </div>
      <div class="text-end">
        <p class="mb-0 fw-bold">${producto.currency} ${(producto.unitCost * producto.count).toLocaleString()}</p>
      </div>
    `;
    
    listaProductos.appendChild(productoDiv);
  });
}

function actualizarBadgeCarrito() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const items = JSON.parse(localStorage.getItem("cartItems")) || [];
  const total = items.reduce((sum, item) => sum + (parseInt(item.count) || 0), 0);

  badge.textContent = total;
  badge.style.display = total > 0 ? "inline-block" : "none";
}
