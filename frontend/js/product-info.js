const productID = localStorage.getItem("productID");
const url = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

let comentariosAPI = [];
let comentariosUsuario = [];
let precioUnitario = 0;
let moneda = "";

window.addEventListener("DOMContentLoaded", () => {
  mostrarUsuarioLogueado("#userNav", false);
  cargarComentariosUsuario();
  cargarProducto();
  cargarComentariosAPI();
  configurarEventos();
  actualizarBadgeCarrito();
});

function cargarProducto() {
  fetch(url)
    .then(res => res.json())
    .then(producto => {
      precioUnitario = producto.cost;
      moneda = producto.currency;
      mostrarProducto(producto);
      mostrarRelacionados(producto.relatedProducts);
      actualizarSubtotal();

      const botonBuyNow = document.getElementById("btn-buyNow");
      botonBuyNow.addEventListener("click", () => {
        const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
        const productoCompra = {
          id: producto.id,
          name: producto.name,
          unitCost: producto.cost,
          currency: producto.currency,
          image: Array.isArray(producto.images) && producto.images.length ? producto.images[0] : "",
          count: cantidad
        };
        // Guardar producto para compra directa
        localStorage.setItem("compraDirect", JSON.stringify([productoCompra]));
        window.location.href = "buy-now.html";
      });

      const botonCart = document.getElementById("btn-cart");
      if (botonCart) {
        botonCart.addEventListener("click", () => agregarAlCarrito(producto));
      }
    })
    .catch(err => {
      document.querySelector(".container").innerHTML = `
        <div class="alert alert-danger text-center" role="alert">
          Error al cargar el producto: ${err}
        </div>`;
    });
}

function cargarComentariosAPI() {
  fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
    .then(res => res.json())
    .then(comments => {
      comentariosAPI = comments;
      mostrarComentarios([...comentariosAPI, ...comentariosUsuario]);
    })
    .catch(err => console.error("Error al cargar los comentarios:", err));
}

function cargarComentariosUsuario() {
  const guardados = localStorage.getItem(`userComments_${productID}`);
  comentariosUsuario = guardados ? JSON.parse(guardados) : [];
}

function guardarComentariosUsuario() {
  localStorage.setItem(`userComments_${productID}`, JSON.stringify(comentariosUsuario));
}

function configurarEventos() {
  const btnSend = document.getElementById("send-rating");
  if (btnSend) {
    btnSend.addEventListener("click", agregarComentario);
  }

  const btnBack = document.getElementById("back-to-category");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      const catID = localStorage.getItem("catID");
      window.location.href = catID ? "products.html" : "categories.html";
    });
  }

  const inputCantidad = document.getElementById("cantidad");
  if (inputCantidad) {
    inputCantidad.addEventListener("input", () => {
      let cantidad = parseInt(inputCantidad.value);
      if (isNaN(cantidad) || cantidad < 1) {
        inputCantidad.value = 1;
      }
      actualizarSubtotal();
    });
  }
}

function mostrarProducto(producto) {
  document.getElementById("product-name").textContent = producto.name;
  document.getElementById("product-category").textContent = ` ${producto.category}`;
  document.getElementById("product-sold").textContent = `Vendidos: ${producto.soldCount}`;
  document.getElementById("product-description").innerHTML = `
    <h5 class="fw-bold mb-2">Descripción del producto:</h5>
    <p>${producto.description}</p>
  `;
  document.getElementById("precio-unitario").textContent = `${moneda} ${precioUnitario.toLocaleString()}`;
  
  actualizarSubtotal();
  configurarCarrusel(producto);
}

function configurarCarrusel(producto) {
  const carouselInner = document.getElementById("carousel-inner");
  const thumbsContainer = document.getElementById("carousel-thumbs");

  if (!carouselInner || !thumbsContainer) return;

  carouselInner.innerHTML = "";
  thumbsContainer.innerHTML = "";

  producto.images.forEach((imgUrl, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item" + (index === 0 ? " active" : "");
    item.innerHTML = `<img src="${imgUrl}" class="d-block w-100" style="height: 500px; object-fit: contain; background-color: #f8f9fa;" alt="${producto.name}">`;
    carouselInner.appendChild(item);

    const thumbCol = document.createElement("div");
    thumbCol.className = "col-auto";
    thumbCol.innerHTML = `<img src="${imgUrl}" class="rounded border" style="cursor:pointer; height: 60px; width: 60px; object-fit: cover;" data-bs-target="#product-images" data-bs-slide-to="${index}" alt="Miniatura ${index + 1}">`;
    thumbsContainer.appendChild(thumbCol);
  });

  configurarMiniaturas(thumbsContainer);
}

function configurarMiniaturas(thumbsContainer) {
  const carouselElement = document.getElementById("product-images");
  const thumbs = thumbsContainer.querySelectorAll("img");

  if (thumbs.length > 0) {
    thumbs[0].classList.add("border-warning", "border-3");
  }

  if (carouselElement) {
    carouselElement.addEventListener("slide.bs.carousel", (e) => {
      thumbs.forEach(img => {
        img.classList.remove("border-warning", "border-3");
        img.classList.add("border-light");
      });
      if (thumbs[e.to]) {
        thumbs[e.to].classList.remove("border-light");
        thumbs[e.to].classList.add("border-warning", "border-3");
      }
    });
  }
}

function mostrarComentarios(comments) {
  const contenedor = document.getElementById("comentarios-container");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (comments.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center py-4">
        <i class="fas fa-comment-slash fa-3x text-muted mb-3"></i>
        <p class="text-muted">No hay comentarios aún. ¡Sé el primero en opinar!</p>
      </div>
    `;
    return;
  }

  comments.forEach(comment => {
    const comentarioDiv = document.createElement("div");
    comentarioDiv.className = "list-group-item border-0";
    comentarioDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="d-flex align-items-center">
          <div class="rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; background-color: var(--primary-color);">
            <i class="fas fa-user text-white"></i>
          </div>
          <div>
            <h6 class="mb-0 fw-bold">${comment.user}</h6>
            <div style="color: var(--primary-color);">${generarEstrellas(comment.score)}</div>
          </div>
        </div>
        <small class="text-muted">${comment.dateTime}</small>
      </div>
      <p class="mb-0 ms-5">${comment.description}</p>
    `;
    contenedor.appendChild(comentarioDiv);
  });
}

function generarEstrellas(score) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const clase = i <= score ? "checked" : "";
    const color = i <= score ? "style='color: var(--primary-color);'" : "style='color: #dee2e6;'";
    html += `<span class="fa fa-star ${clase}" ${color}></span>`;
  }
  return html;
}

function mostrarRelacionados(relacionados) {
  const container = document.getElementById("related-products");
  if (!container) return;

  container.innerHTML = "";

  if (relacionados.length === 0) {
    container.innerHTML = `
      <div class="text-center py-4">
        <i class="fas fa-box-open fa-2x text-muted mb-2"></i>
        <p class="text-muted small">No hay productos relacionados</p>
      </div>
    `;
    return;
  }

  relacionados.forEach(prod => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "list-group-item list-group-item-action border-0 p-3";
    tarjeta.style.cursor = "pointer";
    tarjeta.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${prod.image}" alt="${prod.name}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
        <div class="flex-grow-1">
          <h6 class="mb-1 fw-bold">${prod.name}</h6>
          <small class="text-muted">Ver detalles</small>
        </div>
        <i class="fas fa-chevron-right text-muted"></i>
      </div>
    `;

    tarjeta.addEventListener("click", () => {
      localStorage.setItem("productID", prod.id);
      window.location = "product-info.html";
    });

    container.appendChild(tarjeta);
  });
}

function agregarComentario(e) {
  e.preventDefault();

  const estrellasSeleccionadas = document.querySelector('input[name="rating"]:checked');
  const score = estrellasSeleccionadas ? parseInt(estrellasSeleccionadas.value) : 0;
  const texto = document.getElementById("comentario").value.trim();

  if (!texto) {
    alert("Por favor, escribe tu comentario.");
    return;
  }
  if (score === 0) {
    alert("Por favor, selecciona una calificación.");
    return;
  }

  const usuarioLogueado = localStorage.getItem("usuarioLogueado");
  let usuario = "Usuario";

  if (usuarioLogueado) {
    try {
      const usuarioObj = JSON.parse(usuarioLogueado);
      usuario = usuarioObj.email || "Usuario";
    } catch (e) {
      usuario = "Usuario";
    }
  }

  const nuevoComentario = {
    user: usuario,
    description: texto,
    score: score,
    dateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
  };

  comentariosUsuario.push(nuevoComentario);
  guardarComentariosUsuario();
  mostrarComentarios([...comentariosAPI, ...comentariosUsuario]);

  const form = document.querySelector("form.rating-form");
  if (form) form.reset();
}

function actualizarSubtotal() {
  const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
  const subtotal = precioUnitario * cantidad;
  document.getElementById("subtotal").textContent = `${moneda} ${subtotal.toLocaleString()}`;
}

function agregarAlCarrito(producto) {
  const cantidadInput = document.getElementById("cantidad");
  const cantidad = parseInt(cantidadInput.value);
  const clave = "cartItems";
  const guardado = localStorage.getItem(clave);
  const items = guardado ? JSON.parse(guardado) : [];

  const indexExistente = items.findIndex(item => item.id === producto.id);
  
  if (indexExistente !== -1) {
    items[indexExistente].count = parseInt(items[indexExistente].count) + cantidad;
  } else {
    items.push({
      id: producto.id,
      name: producto.name,
      unitCost: producto.cost,
      currency: producto.currency,
      image: Array.isArray(producto.images) && producto.images.length ? producto.images[0] : "",
      count: cantidad
    });
  }

  localStorage.setItem(clave, JSON.stringify(items));

  const btn = document.getElementById("btn-cart");
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check me-2"></i>Agregado';
    setTimeout(() => btn.innerHTML = originalText, 1200);
  }

  actualizarBadgeCarrito();
}

function actualizarBadgeCarrito() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  
  const guardado = localStorage.getItem("cartItems");
  const items = guardado ? JSON.parse(guardado) : [];
  const total = items.reduce((acc, it) => acc + (parseInt(it.count) || 0), 0);
  
  badge.textContent = total;
  badge.style.display = total > 0 ? "inline-block" : "none";
}
