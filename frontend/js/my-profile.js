document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");
  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido");
  const email = document.getElementById("email");
  const telefono = document.getElementById("telefono");
  const inputImagen = document.getElementById("imagenPerfil");
  const preview = document.getElementById("preview");
  const profileImageContainer = document.getElementById("profileImageContainer");
  const mensajeConfirmacion = document.getElementById("mensajeConfirmacion");
  
  let imagenTemporal = null;

  // Obtener usuario logueado
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");
  let emailUsuario = null;
  
  if (usuarioLogueado) {
    const usuario = JSON.parse(usuarioLogueado);
    emailUsuario = usuario.email;
  }

  // Precargar datos guardados
  if (emailUsuario) {
    const perfilGuardado = JSON.parse(localStorage.getItem(`perfilUsuario_${emailUsuario}`));
    if (perfilGuardado) {
      nombre.value = perfilGuardado.nombre || "";
      apellido.value = perfilGuardado.apellido || "";
      email.value = perfilGuardado.email || "";
      telefono.value = perfilGuardado.telefono || "";
    } else {
      email.value = emailUsuario;
    }
  }

  // Cargar imagen guardada
  if (emailUsuario) {
    const imagenGuardada = localStorage.getItem(`imagenPerfil_${emailUsuario}`);
    if (imagenGuardada) {
      preview.src = imagenGuardada;
    }
  }

  // Hacer clickeable el contenedor de la imagen
  profileImageContainer.addEventListener("click", () => {
    inputImagen.click();
  });

  // Guardar imagen temporalmente
  inputImagen.addEventListener("change", (event) => {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (e) => {
      const base64 = e.target.result;
      imagenTemporal = base64;
      preview.src = base64;
    };
    lector.readAsDataURL(archivo);
  });

  // Guardar datos del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const datos = {
      nombre: nombre.value,
      apellido: apellido.value,
      email: email.value,
      telefono: telefono.value
    };

    if (emailUsuario) {
      localStorage.setItem(`perfilUsuario_${emailUsuario}`, JSON.stringify(datos));
      
      if (imagenTemporal) {
        localStorage.setItem(`imagenPerfil_${emailUsuario}`, imagenTemporal);
        imagenTemporal = null;
      }
    }

    mensajeConfirmacion.classList.remove("d-none");
    
    setTimeout(() => {
      mensajeConfirmacion.classList.add("d-none");
    }, 3000);
  });
});
