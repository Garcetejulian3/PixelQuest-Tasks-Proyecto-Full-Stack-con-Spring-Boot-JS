


// FUNCIÓN HELPER GENERAL PARA PETICIONES API

async function apiRequest(url, method = "GET", body = null, requireAuth = false) {
    const headers = { "Content-Type": "application/json" };
    
    if (requireAuth) {
        const token = localStorage.getItem("token");
        if (token) headers["Authorization"] = "Bearer " + token;
    }

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        
        // Intentar parsear JSON, si falla devolver null
        let data = null;
        try {
            data = await response.json();
        } catch (e) {
            // Si no es JSON, obtener texto
            data = await response.text();
        }

        return { response, data };
    } catch (error) {
        console.error("Error en la petición:", error);
        return { 
            response: { ok: false, status: 0 }, 
            data: { message: "Error de conexión con el servidor" } 
        };
    }
}


// FUNCIÓN DE REGISTRO

async function register(event) {
    // Prevenir envío del formulario
    if (event) event.preventDefault();

    // Obtener valores de los campos
    const username = document.getElementById("Reemail").value.trim();
    const password = document.getElementById("Repassword").value.trim();
    const firstname = document.getElementById("Refirstname").value.trim();
    const lastname = document.getElementById("Relastname").value.trim();
    const country = document.getElementById("Recountry").value.trim();

    // Validar campos vacíos
    if (!username || !password || !firstname || !lastname || !country) {
        alert("Por favor completa todos los campos bobeta");
        return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 4) {
        alert("La contraseña debe tener al menos 4 caracteres gil");
        return;
    }

    console.log("Enviando datos de registro:", {
        username,
        firstname,
        lastname,
        country
    });

    // Realizar petición al backend
    const { response, data } = await apiRequest(
        API_URL + "/auth/register",
        "POST",
        {
            username: username,  
            password: password,
            firstname: firstname,
            lastname: lastname,
            country: country
        }
    );

    console.log("Respuesta del servidor:", response.status, data);

    // Manejar respuesta
    if (response.ok) {
        alert("Usuario registrado con éxito");

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userData", JSON.stringify({
                username,
                firstname,
                lastname,
                country
            }));
            
            alert("Sesión iniciada automáticamente");
            
            // Redireccionar después de 1 segundo
            setTimeout(() => {
                window.location.href = "listar_task.html";
            }, 1000);
        }
    } else {
        // Mostrar error específico
        const errorMessage = data?.message || data || "Error al registrar usuario";
        alert("x x x  " + errorMessage);
    }
}


// FUNCIÓN DE LOGIN

async function login(event) {
    // Prevenir envío del formulario
    if (event) event.preventDefault();

    // Obtener valores de los campos
    const username = document.getElementById("Loemail").value.trim();
    const password = document.getElementById("Lopassword").value.trim();

    // Validar campos vacíos
    if (!username || !password) {
        alert("Por favor completa todos los campos bobeta");
        return;
    }

    console.log("Intentando login con:", { username });

    // Realizar petición al backend
    const { response, data } = await apiRequest(
        API_URL + "/auth/login",
        "POST",
        {
            username: username,  
            password: password
        }
    );

    console.log("Respuesta del login:", response.status, data);

    // Manejar respuesta
    if (response.ok) {
        alert("Login exitoso");

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userData", JSON.stringify({
                username
            }));
            
            // Redireccionar después de 1 segundo
            setTimeout(() => {
                window.location.href = "listar_task.html";
            }, 1000);
        }
    } else {
        // Mostrar error específico
        let errorMessage = "Error al iniciar sesión";
        
        if (response.status === 401 || response.status === 403) {
            errorMessage = "Usuario o contraseña incorrectos";
        } else if (response.status === 0) {
            errorMessage = "No se puede conectar con el servidor. ¿Está corriendo en http://localhost:8080?";
        } else {
            errorMessage = data?.message || data || "Error desconocido";
        }
        
        alert("x x x " + errorMessage);
    }
}


// FUNCIÓN DE LOGOUT

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    alert(" Sesión cerrada correctamente");
    window.location.href = "login.html";
}


// FUNCIÓN PARA PROBAR RUTA PROTEGIDA

async function testProtectedRoute() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert(" No hay token disponible. Por favor inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    console.log("Probando ruta protegida con token:", token);

    const { response, data } = await apiRequest(
        API_URL + "/api/v1/demo",
        "POST",
        null,
        true
    );

    console.log("Respuesta de ruta protegida:", response.status, data);

    if (response.ok) {
        alert(" Ruta protegida accesible: " + data);
    } else {
        if (response.status === 401 || response.status === 403) {
            alert(" Token inválido o expirado. Por favor inicia sesión nuevamente.");
            logout();
        } else {
            alert(" Error al acceder a la ruta protegida");
        }
    }
}


// VERIFICAR AUTENTICACIÓN AL CARGAR PÁGINA

function checkAuth() {
    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname.split("/").pop();
    
    // Si está en login o register y tiene token, redirigir a lista
    if ((currentPage === "login.html" || currentPage === "register.html") && token) {
        window.location.href = "listar_task.html";
    }
    
    // Si está en página protegida y NO tiene token, redirigir a login
    if (currentPage === "listar_task.html" && !token) {
        window.location.href = "login.html";
    }
}

// Verificar autenticación al cargar cualquier página
window.addEventListener("DOMContentLoaded", checkAuth);


// FUNCIÓN PARA MOSTRAR INFO DEL USUARIO

function displayUserInfo() {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userInfoElement = document.getElementById("user-info");
    
    if (userInfoElement && userData.username) {
        userInfoElement.textContent = `Bienvenido, ${userData.firstname || userData.username}!`;
    }
}

// Mostrar info del usuario al cargar la página
window.addEventListener("DOMContentLoaded", displayUserInfo);