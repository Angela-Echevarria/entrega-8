const catID = localStorage.getItem("catID");
const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

const contenedor = document.getElementById("catalogo");
const tituloCategoria = document.getElementById("titulo-categoria");
const mensajeAlerta = document.getElementById("mensaje-alerta");
const searchInput = document.getElementById("searchInput");
const ordenarAsc = document.getElementById("sortAsc");
const ordenarDes = document.getElementById("sortDesc");
const ordenarRel = document.getElementById("sortByCount");
const filtrarBtn = document.getElementById("filtrarPrecio");
const limpiarBtn = document.getElementById("clearRangeFilter");
const inputMin = document.getElementById("precioMin");
const inputMax = document.getElementById("precioMax");

let productosOriginales = [];
let minPrice = undefined;
let maxPrice = undefined;
let searchQuery = "";

function mostrarProductos(productos) {
  const productosFiltrados = productos.filter(producto => {
    return (
      (minPrice === undefined || producto.cost >= minPrice) &&
      (maxPrice === undefined || producto.cost <= maxPrice) &&
      (producto.name.toLowerCase().includes(searchQuery) ||
        producto.description.toLowerCase().includes(searchQuery))
    );
  });

  if (productosFiltrados.length === 0) {
    mensajeAlerta.textContent = "Lo sentimos, no hay productos que coincidan con los filtros.";
    mensajeAlerta.classList.remove("d-none");
    contenedor.innerHTML = "";
    return;
  } else {
    mensajeAlerta.classList.add("d-none");
  }

  let htmlContent = "";
  productosFiltrados.forEach(producto => {
    htmlContent += `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 custom-shadow" onclick="guardarProductoID(${producto.id})" style="cursor:pointer;">
          <img src="${producto.image}" class="card-img-top" alt="${producto.name}">
          <div class="card-body">
            <h5 class="card-title fw-bold">${producto.name}</h5>
            <p class="card-text">${producto.description}</p>
          </div>
          <div class="card-footer d-flex justify-content-between align-items-center product-card-footer">
            <span class="fw-bold fs-4">${producto.cost}<small> ${producto.currency}</small></span>
            <small style="opacity: 0.54;">Cant. Vendidos: ${producto.soldCount}</small>
          </div>
        </div>
      </div>`;
  });

  contenedor.innerHTML = htmlContent;
}

function guardarProductoID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

// Fetch de productos
fetch(url)
  .then(res => res.json())
  .then(data => {
    tituloCategoria.textContent = data.catName;
    document.title = `eMercado - ${data.catName}`;
    productosOriginales = data.products;
    mostrarProductos(productosOriginales);
  })
  .catch(error => {
    contenedor.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        Error al cargar los productos: ${error}
      </div>`;
  });

// Validación inputs
[inputMin, inputMax].forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^\d.]/g, "");
    if (parseFloat(input.value) < 0) input.value = "";
  });
});

// Buscador
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.toLowerCase();
  mostrarProductos(productosOriginales);
});

// Ordenar
ordenarAsc.addEventListener("click", () => {
  const productosOrdenados = [...productosOriginales].sort((a, b) => a.cost - b.cost);
  mostrarProductos(productosOrdenados);
});

ordenarDes.addEventListener("click", () => {
  const productosOrdenados = [...productosOriginales].sort((a, b) => b.cost - a.cost);
  mostrarProductos(productosOrdenados);
});

ordenarRel.addEventListener("click", () => {
  const productosOrdenados = [...productosOriginales].sort((a, b) => b.soldCount - a.soldCount);
  mostrarProductos(productosOrdenados);
});

// Filtrar por precio
filtrarBtn.addEventListener("click", () => {
  minPrice = inputMin.value !== "" ? parseFloat(inputMin.value) : undefined;
  maxPrice = inputMax.value !== "" ? parseFloat(inputMax.value) : undefined;
  mostrarProductos(productosOriginales);
});

// Limpiar filtros
limpiarBtn.addEventListener("click", () => {
  inputMin.value = "";
  inputMax.value = "";
  searchInput.value = "";
  minPrice = undefined;
  maxPrice = undefined;
  searchQuery = "";
  mostrarProductos(productosOriginales);
});

window.addEventListener("DOMContentLoaded", () => {
  mostrarUsuarioLogueado("#userNav", false);
});
