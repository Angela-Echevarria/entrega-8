// URL del backend (usar 127.0.0.1 para evitar problemas de CORS con Live Server)
const BACKEND_URL = "http://127.0.0.1:3000";
const LOGIN_URL = `${BACKEND_URL}/login`;

const formLogin = document.querySelector("form");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const contrasena = document.getElementById("contrasena").value;

  // Validar campos
  if (!email || !contrasena) {
    alert("Por favor, completa todos los campos");
    return;
  }

  // Mostrar indicador de carga
  const submitButton = formLogin.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Iniciando sesión...";

  try {
    // Hacer petición al backend
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        contrasena: contrasena
      })
    });

    const data = await response.json();

    if (response.ok && data.status === "ok") {
      // Guardar el token JWT
      localStorage.setItem("token", data.token);
      
      // Guardar información del usuario para compatibilidad con código existente
      localStorage.setItem("usuarioLogueado", JSON.stringify({ 
        email: data.user.email 
      }));

      // Redirigir a la página principal
      window.location.href = "index.html";
    } else {
      // Error en la autenticación
      alert(data.message || "Email o contraseña incorrectos");
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    
    // Verificar si es un error de conexión (backend no disponible)
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      alert("No se pudo conectar con el servidor. Por favor, asegúrate de que el backend esté corriendo en http://localhost:3000");
    } else {
      alert("Error al conectar con el servidor. Por favor, intenta nuevamente.");
    }
    
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  mostrarUsuarioLogueado(".loginContenedor", true);
});

// Toggle contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('contrasena');
const ojoAbierto = "./img/ojo abierto.png";
const ojoCerrado = "./img/ojo cerrado.png";

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.src = ojoCerrado;
  } else {
    passwordInput.type = "password";
    togglePassword.src = ojoAbierto;
  }
});
