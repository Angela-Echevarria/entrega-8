document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("buy-form");
  const subtotalElem = document.getElementById("subtotal");
  const envioCostoElem = document.getElementById("envio-costo");
  const totalElem = document.getElementById("total");

  // Verificar si viene de "comprar ahora" o del carrito
  const compraDirectJSON = localStorage.getItem("compraDirect");
  let carrito = [];
  let esCompraDirecta = false;

  if (compraDirectJSON) {
    // Viene de "comprar ahora" - usar solo ese producto
    carrito = JSON.parse(compraDirectJSON);
    esCompraDirecta = true;
    localStorage.removeItem("compraDirect");
  } else {
    // Viene del carrito normal
    const carritoJSON = localStorage.getItem("cartItems");
    carrito = JSON.parse(carritoJSON) || [];
  }

  if (carrito.length === 0) {
    alert("No hay productos para comprar. Redirigiendo...");
    window.location.href = "cart.html";
    return;
  }

  // Convertir a pesos
  const convertirAPesos = (precio, moneda) => {
    if (!precio) return 0;
    return moneda === "USD" ? Number(precio) * 40 : Number(precio);
  };

  // Calcular subtotal
  const calcularSubtotal = () => {
    let subtotal = 0;
    carrito.forEach(item => {
      const precioEnPesos = convertirAPesos(item.unitCost, item.currency);
      const cantidad = Number(item.count) || 1;
      subtotal += precioEnPesos * cantidad;
    });
    return subtotal;
  };

  // Actualizar costos
  const actualizarCostos = () => {
    const subtotal = calcularSubtotal();

    if (subtotalElem) {
      subtotalElem.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    }

    const tipoEnvioSeleccionado = document.querySelector('input[name="envio"]:checked');
    let porcentaje = 0;

    if (tipoEnvioSeleccionado) {
      const valorEnvio = tipoEnvioSeleccionado.value;
      if (valorEnvio === "premium") porcentaje = 0.15;
      else if (valorEnvio === "express") porcentaje = 0.07;
      else if (valorEnvio === "standard") porcentaje = 0.05;
    }

    const costoEnvio = subtotal * porcentaje;

    if (envioCostoElem) {
      envioCostoElem.textContent = `Costo de envío: $${costoEnvio.toFixed(2)}`;
    }

    const total = subtotal + costoEnvio;
    if (totalElem) {
      totalElem.textContent = `Total: $${total.toFixed(2)}`;
    }
  };

  // Escuchar cambios en envío
  document.querySelectorAll('input[name="envio"]').forEach(radio => {
    radio.addEventListener("change", actualizarCostos);
  });

  // Mostrar/ocultar campos según método de pago
  document.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const camposTarjeta = document.getElementById("campos-tarjeta");
      const camposTransferencia = document.getElementById("campos-transferencia");

      if (radio.value === "tarjeta") {
        camposTarjeta.style.display = "block";
        camposTransferencia.style.display = "none";
      } else if (radio.value === "transferencia") {
        camposTarjeta.style.display = "none";
        camposTransferencia.style.display = "block";
      }
    });
  });

  // Formatear número de tarjeta automáticamente
  document.getElementById("numero-tarjeta").addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    let formatted = valor.match(/.{1,4}/g)?.join(' ') || valor;
    e.target.value = formatted;
  });

  // Solo números en CVV
  document.getElementById("cvv").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  // Formatear vencimiento MM/AA
  document.getElementById("vencimiento").addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length >= 2) {
      valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
    }
    e.target.value = valor;
  });

  actualizarCostos();

  // Validación del formulario
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const departamento = document.getElementById("departamento").value.trim();
      const calle = document.getElementById("calle").value.trim();
      const numerodepuerta = document.getElementById("numerodepuerta").value.trim();
      const esquina = document.getElementById("esquina").value.trim();
      const tipoEnvio = document.querySelector('input[name="envio"]:checked');
      const formaPago = document.querySelector('input[name="pago"]:checked');

      // Ocultar todos los mensajes de error
      document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');

      let hayErrores = false;

      if (!departamento) {
        document.getElementById("error-departamento").style.display = "block";
        hayErrores = true;
      }

      if (!calle) {
        document.getElementById("error-calle").style.display = "block";
        hayErrores = true;
      }

      if (!numerodepuerta) {
        document.getElementById("error-numerodepuerta").style.display = "block";
        hayErrores = true;
      }

      if (!esquina) {
        document.getElementById("error-esquina").style.display = "block";
        hayErrores = true;
      }

      if (!tipoEnvio) {
        document.getElementById("error-envio").style.display = "block";
        hayErrores = true;
      }

      if (!formaPago) {
        document.getElementById("error-pago").style.display = "block";
        hayErrores = true;
      }

      // Validar campos de pago específicos
      if (formaPago) {
        if (formaPago.value === "tarjeta") {
          const numeroTarjeta = document.getElementById("numero-tarjeta").value.trim();
          const titular = document.getElementById("titular-tarjeta").value.trim();
          const vencimiento = document.getElementById("vencimiento").value.trim();
          const cvv = document.getElementById("cvv").value.trim();

          if (!numeroTarjeta) {
            document.getElementById("error-numero-tarjeta").style.display = "block";
            hayErrores = true;
          }
          if (!titular) {
            document.getElementById("error-titular-tarjeta").style.display = "block";
            hayErrores = true;
          }
          if (!vencimiento) {
            document.getElementById("error-vencimiento").style.display = "block";
            hayErrores = true;
          }
          if (!cvv) {
            document.getElementById("error-cvv").style.display = "block";
            hayErrores = true;
          }
        } else if (formaPago.value === "transferencia") {
          const banco = document.getElementById("banco").value;
          if (!banco) {
            document.getElementById("error-banco").style.display = "block";
            hayErrores = true;
          }
        }
      }

      if (hayErrores) return;

      const subtotal = calcularSubtotal();
      const porcentajeEnvio = tipoEnvio.value === "premium" ? 0.15 :
        tipoEnvio.value === "express" ? 0.07 : 0.05;
      const costoEnvio = subtotal * porcentajeEnvio;
      const total = subtotal + costoEnvio;

      // Recopilar datos de pago adicionales
      let datosPago = {};
      if (formaPago.value === "tarjeta") {
        datosPago = {
          numeroTarjeta: document.getElementById("numero-tarjeta").value.trim(),
          titular: document.getElementById("titular-tarjeta").value.trim(),
          vencimiento: document.getElementById("vencimiento").value.trim(),
          cvv: document.getElementById("cvv").value.trim()
        };
      } else if (formaPago.value === "transferencia") {
        datosPago = {
          banco: document.getElementById("banco").value
        };
      }

      const datosEnvio = {
        departamento,
        calle,
        numerodepuerta,
        esquina,
        tipoEnvio: tipoEnvio.value,
        formaPago: formaPago.value,
        datosPago,
        subtotal,
        costoEnvio,
        total,
        carrito,
        fecha: new Date().toISOString()
      };

      // Enviar datos al backend
      fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEnvio)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
          }
          return response.json();
        })
        .then(data => {
          console.log('Compra exitosa:', data);

          // Guardar datos para mostrar en la página de éxito (opcional, si se mantiene la lógica actual)
          localStorage.setItem("datosEnvio", JSON.stringify(datosEnvio));

          // Solo vaciar carrito si vino del carrito (no de compra directa)
          if (!esCompraDirecta) {
            localStorage.removeItem("cartItems");
          }

          window.location.href = "compra-exitosa.html";
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Hubo un error al procesar su compra. Por favor, intente nuevamente.');
        });
    });
  }
});
