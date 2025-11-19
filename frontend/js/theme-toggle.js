// Aplicar tema al cargar la página
const aplicarTema = () => {
  const tema = localStorage.getItem('tema') || 'light';
  document.documentElement.setAttribute('data-theme', tema);
  actualizarLogo(tema);
};

// Cambiar entre tema claro y oscuro
const cambiarTema = (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  const temaActual = localStorage.getItem('tema') || 'light';
  const nuevoTema = temaActual === 'light' ? 'dark' : 'light';
  
  document.documentElement.style.transition = 'none';
  localStorage.setItem('tema', nuevoTema);
  document.documentElement.setAttribute('data-theme', nuevoTema);
  
  setTimeout(() => {
    document.documentElement.style.transition = '';
  }, 50);
  
  actualizarBoton();
};

// Actualizar botón según el tema
const actualizarBoton = () => {
  const boton = document.getElementById('theme-toggle');
  if (!boton) return;

  const tema = localStorage.getItem('tema') || 'light';
  const icono = boton.querySelector('i');

  if (tema === 'light') {
    icono.className = 'fas fa-moon';
    boton.title = 'Cambiar a modo oscuro';
  } else {
    icono.className = 'fas fa-sun';
    boton.title = 'Cambiar a modo claro';
  }
  
  actualizarLogo(tema);
};

// Actualizar logo según el tema
const actualizarLogo = (tema) => {
  const logo = document.querySelector('.logo-nav');
  if (!logo) return;

  if (tema === 'dark') {
    logo.src = 'img/japLogoWhite.png';
    logo.alt = 'Logo JAP - Modo Oscuro';
  } else {
    logo.src = 'img/japLogo.png';
    logo.alt = 'Logo JAP - Modo Claro';
  }
};

aplicarTema();

document.addEventListener('DOMContentLoaded', () => {
  actualizarBoton();
});
