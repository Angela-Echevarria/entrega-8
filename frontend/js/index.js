document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("autos").addEventListener("click", () => {
    localStorage.setItem("catID", 101);
    window.location = "products.html";
  });
  
  document.getElementById("juguetes").addEventListener("click", () => {
    localStorage.setItem("catID", 102);
    window.location = "products.html";
  });
  
  document.getElementById("muebles").addEventListener("click", () => {
    localStorage.setItem("catID", 103);
    window.location = "products.html";
  });
  
  mostrarUsuarioLogueado("#userNav", false);
});
