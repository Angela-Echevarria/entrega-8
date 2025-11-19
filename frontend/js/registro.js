// URL del backend (usar 127.0.0.1 para evitar problemas de CORS con Live Server)
const BACKEND_URL = "http://127.0.0.1:3000";
const LOGIN_URL = `${BACKEND_URL}/login`;
const REGISTER_URL = `${BACKEND_URL}/register`;

const formRegistro = document.getElementById("registerForm");
const regMessage = document.getElementById("regMessage");
const emailError = document.getElementById("emailError");

const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación en tiempo real del email
document.getElementById("newEmail").addEventListener("input", function() {
  const email = this.value;
  if (email && !validarEmail(email)) {
    emailError.textContent = "Por favor, ingresa un email válido";
    emailError.classList.remove("d-none");
    this.classList.add("is-invalid");
  } else {
    emailError.classList.add("d-none");
    this.classList.remove("is-invalid");
  }
});

formRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("newEmail").value;
  const contrasena = document.getElementById("newPassword").value;
  const repetirContrasena = document.getElementById("repeatPassword").value;

  // Validar campos vacíos
  if (!email || !contrasena) {
    regMessage.textContent = "Por favor, completa todos los campos";
    regMessage.style.color = "red";
    return;
  }

  // Validar formato de email
  if (!validarEmail(email)) {
    regMessage.textContent = "Por favor, ingresa un email válido";
    regMessage.style.color = "red";
    emailError.textContent = "Por favor, ingresa un email válido";
    emailError.classList.remove("d-none");
    return;
  }

  // Validar contraseñas iguales
  if (contrasena !== repetirContrasena) {
    regMessage.textContent = "Las contraseñas no coinciden";
    regMessage.style.color = "red";
    return;
  }

  // Validar longitud mínima de contraseña
  if (contrasena.length < 6) {
    regMessage.textContent = "La contraseña debe tener al menos 6 caracteres";
    regMessage.style.color = "red";
    return;
  }

  // Mostrar indicador de carga
  const submitButton = formRegistro.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Registrando...";
  regMessage.textContent = "";
  regMessage.style.color = "";

  try {
    // Hacer petición al backend
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        contrasena: contrasena
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Error al parsear respuesta JSON:", jsonError);
      regMessage.textContent = `Error del servidor (${response.status}). El servidor no respondió correctamente.`;
      regMessage.style.color = "red";
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      return;
    }

    if (response.ok && data.status === "ok") {
      // Registro exitoso - hacer login automáticamente
      regMessage.textContent = "Registro exitoso. Iniciando sesión...";
      regMessage.style.color = "green";
      
      // Hacer login automático con las credenciales registradas
      try {
        const loginResponse = await fetch(LOGIN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            contrasena: contrasena
          })
        });

        let loginData;
        try {
          loginData = await loginResponse.json();
        } catch (jsonError) {
          regMessage.textContent = "Registro exitoso. Por favor, inicia sesión.";
          regMessage.style.color = "orange";
          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
          return;
        }

        if (loginResponse.ok && loginData.status === "ok") {
          // Guardar el token JWT
          localStorage.setItem("token", loginData.token);
          
          // Guardar información del usuario para compatibilidad con código existente
          localStorage.setItem("usuarioLogueado", JSON.stringify({ 
            email: loginData.user.email 
          }));

          // Redirigir a la página principal inmediatamente
          regMessage.textContent = "¡Bienvenido! Redirigiendo...";
          window.location.href = "index.html";
        } else {
          // Si el login automático falla, redirigir al login manual
          regMessage.textContent = "Registro exitoso. Por favor, inicia sesión.";
          regMessage.style.color = "orange";
          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
        }
      } catch (loginError) {
        // Si hay error en el login automático, redirigir al login manual
        regMessage.textContent = "Registro exitoso. Por favor, inicia sesión.";
        regMessage.style.color = "orange";
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      }
    } else {
      // Error en el registro
      regMessage.textContent = data.message || "Error al registrar el usuario";
      regMessage.style.color = "red";
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  } catch (error) {
    console.error("Error al registrar:", error);
    console.error("Detalles del error:", error.message);
    console.error("URL intentada:", REGISTER_URL);
    
    // Verificar si es un error de conexión
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
      regMessage.textContent = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000";
    } else {
      regMessage.textContent = `Error al conectar con el servidor: ${error.message}`;
    }
    
    regMessage.style.color = "red";
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  mostrarUsuarioLogueado(".loginContenedor", true);
});
