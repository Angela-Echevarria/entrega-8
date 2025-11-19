function mostrarUsuarioLogueado(containerSelector, mostrarGoHome = false) {
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");
  if (!usuarioLogueado) return;
  
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const usuario = JSON.parse(usuarioLogueado);
  const email = usuario.email || 'Usuario';
  
  let html = `<div class="d-flex align-items-center h-100">`;
  
  // Botón Ir a inicio
  if (mostrarGoHome) {
    html += `<button id="goHome" class="btn me-2 no-focus" style="background-color:#212529; color:white;">Ir a inicio</button>`;
  }
  
  // Menú desplegable
  html += `
    <div class="dropdown">
      <button class="nav-link fw-semibold text-white dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="background: none; border: none;">
        <i class="fas fa-user me-1"></i>Mi Perfil
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li class="px-3 py-2 border-bottom">
          <small class="text-muted">Logueado como:</small><br>
          <strong>${email}</strong>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a class="dropdown-item" href="my-profile.html">
            <i class="fas fa-cog me-2"></i>Configuración
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="#" id="logout">
            <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
          </a>
        </li>
      </ul>
    </div>
  `;
  
  html += `</div>`;
  container.innerHTML = html;
  
  // Eventos
  if (mostrarGoHome) {
    document.getElementById("goHome").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  
  document.getElementById("logout").addEventListener("click", () => {
    // Eliminar token y datos de usuario
    localStorage.removeItem("usuarioLogueado");
    localStorage.removeItem("token");
    window.location.reload();
  });
}
