
// FUNCIÓN HELPER GENERAL PARA PETICIONES API
async function apiRequest(url, method = "GET", body = null, requireAuth = false) {
    const headers = { "Content-Type": "application/json" };
    
    if (requireAuth) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert(" No hay token. Por favor inicia sesión.");
            window.location.href = "login.html";
            return;
        }
        headers["Authorization"] = "Bearer " + token;
        console.log(" Token enviado:", token.substring(0, 20) + "...");
    }
    
    const options = {
        method,
        headers,
        credentials: 'include'
    };
    
    if (body) {
        options.body = JSON.stringify(body);
        console.log("Body enviado:", body);
    }

    try {
        console.log(`${method} ${url}`);
        const response = await fetch(url, options);
        console.log(" Response status:", response.status);
        
        // Primero obtener el texto completo
        const responseText = await response.text();
        console.log(" Response raw text:", responseText);
        
        // Intentar parsearlo como JSON
        let data = null;
        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                // Si no es JSON válido, usar el texto tal cual
                data = responseText;
            }
        }

        console.log(" data:", data);
        return { response, data };
    } catch (error) {
        console.error("Error en fetch:", error);
        return { 
            response: { ok: false, status: 0 }, 
            data: { message: "Error de conexión con el servidor" } 
        };
    }
}

// FUNCION PARA CREAR LA TAREA
async function crearTarea() {
    console.log("Función crearTarea() iniciada");
    
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No estás autenticado. Redirigiendo al login...");
        window.location.href = "login.html";
        return;
    }

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fechaLimite = document.getElementById("fechaLimite").value;

    console.log("Datos del formulario:", { titulo, descripcion, fechaLimite });

    if (!titulo) {
        alert("El título es obligatorio");
        return;
    }

    if (!fechaLimite) {
        alert("La fecha límite es obligatoria");
        return;
    }

    const fechaCompleta = fechaLimite + "T23:59:59";
    console.log("Fecha completa:", fechaCompleta);

    const nuevaTarea = {
        titulo: titulo,
        descripcion: descripcion || "",
        fechaLimite: fechaCompleta
    };

    const {response, data} = await apiRequest(
        API_URL + "/task/crear",
        "POST",
        nuevaTarea,
        true
    );

    if (response.ok) {
        alert("Tarea creada con éxito");
        window.location.href = "listar_task.html";
    } else {
        console.log("DEBUG ERROR:", response.status, data);
        
        if (response.status === 403) {
            alert("Error de autenticación. Tu sesión puede haber expirado.");
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else if (response.status === 400) {
            alert("Datos inválidos: " + (typeof data === 'string' ? data : JSON.stringify(data)));
        } else if (response.status === 0) {
            alert("No se puede conectar con el servidor. Verifica que esté corriendo en http://localhost:8080");
        } else {
            alert("Error: " + (typeof data === 'string' ? data : JSON.stringify(data)));
        }
    }
}

// FUNCIÓN PARA CARGAR UNA TAREA Y EDITARLA
async function cargarTareaParaEditar() {
    console.log("Cargando tarea para editar...");
    
    // Obtener el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
    console.log("ID de la tarea:", taskId);
    
    if (!taskId) {
        alert(" No se especificó una tarea para editar");
        window.location.href = "listar_task.html";
        return;
    }
    
    // Guardar el ID en un campo oculto
    const taskIdInput = document.getElementById("taskId");
    if (taskIdInput) {
        taskIdInput.value = taskId;
    }
    
    // Obtener los datos de la tarea desde el backend
    const {response, data} = await apiRequest(
        API_URL + `/task/${taskId}`,
        "GET",
        null,
        true
    );
    
    if (response.ok && data) {
        console.log("Tarea cargada:", data);
        
        // Llenar el formulario con los datos
        document.getElementById("titulo").value = data.titulo || "";
        document.getElementById("descripcion").value = data.descripcion || "";
        
        // Convertir la fecha de "2025-12-03T23:59:59" a "2025-12-03"
        if (data.fechaLimite) {
            const fecha = data.fechaLimite.split("T")[0];
            document.getElementById("fechaLimite").value = fecha;
        }
        
        // Cambiar el texto del botón
        const btnGuardar = document.getElementById("btn-guardar");
        if (btnGuardar) {
            btnGuardar.innerHTML = `
                <span class="material-symbols-outlined">edit</span>
                ACTUALIZAR TAREA
            `;
        }
    } else {
        alert("Error al cargar la tarea");
        console.error("Error:", response.status, data);
        window.location.href = "listar_task.html";
    }
}

// FUNCIÓN PARA ACTUALIZAR UNA TAREA
async function actualizarTarea() {
    console.log("Función actualizarTarea() iniciada");
    
    const taskId = document.getElementById("taskId")?.value;
    
    if (!taskId) {
        alert(" No se puede actualizar: ID de tarea no encontrado");
        return;
    }
    
    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fechaLimite = document.getElementById("fechaLimite").value;
    
    if (!titulo) {
        alert("El título es obligatorio");
        return;
    }
    
    if (!fechaLimite) {
        alert("La fecha límite es obligatoria");
        return;
    }
    
    const fechaCompleta = fechaLimite + "T23:59:59";
    
    const tareaActualizada = {
        id: parseInt(taskId),
        titulo: titulo,
        descripcion: descripcion || "",
        fechaLimite: fechaCompleta,
        completado: false 
    };
    
    console.log(" Enviando actualización:", tareaActualizada);
    
    const {response, data} = await apiRequest(
        API_URL + "/task/edit",
        "PUT",
        tareaActualizada,
        true
    );
    
    if (response.ok) {
        alert("Tarea actualizada con éxito");
        window.location.href = "listar_task.html";
    } else {
        console.log("Error al actualizar:", response.status, data);
        
        if (response.status === 403) {
            alert("No tienes permisos para editar esta tarea");
        } else if (response.status === 400) {
            alert("Datos inválidos: " + (typeof data === 'string' ? data : JSON.stringify(data)));
        } else {
            alert(" Error: " + (typeof data === 'string' ? data : JSON.stringify(data)));
        }
    }
}

// FUNCIÓN PARA LISTAR TAREAS
async function listarTareas() {
    console.log(" Función listarTareas() iniciada");
    
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("No hay token, redirigiendo a login");
        window.location.href = "login.html";
        return;
    }

    const {response, data} = await apiRequest(
        API_URL + "/task/listar",
        "GET",
        null,
        true
    );

    if (response.ok && Array.isArray(data)) {
        console.log(" Tareas recibidas:", data);
        console.log(" Primera tarea completa:", JSON.stringify(data[0], null, 2));
        mostrarTareasEnHTML(data);
    } else {
        console.error(" Error al listar tareas:", response.status, data);
        if (response.status === 403) {
            alert("Sesión expirada. Por favor inicia sesión nuevamente.");
            logout();
        }
    }
}

// FUNCIÓN PARA MOSTRAR TAREAS EN HTML
function mostrarTareasEnHTML(tareas) {
    console.log("Mostrando tareas en HTML, cantidad:", tareas.length);
    
    const contenedor = document.querySelector("main");
    
    if (!contenedor) {
        console.error("No se encontró el elemento <main>");
        return;
    }
    
    contenedor.innerHTML = "";
    
    if (tareas.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center text-white/70 py-8">
                <p>No tienes tareas pendientes. ¡Crea una nueva misión!</p>
            </div>
        `;
        return;
    }
    
    tareas.forEach((tarea, idx) => {
        const fechaFormateada = new Date(tarea.fechaLimite).toLocaleDateString('es-AR');
        
        
        const tareaId = tarea.id;
        
        contenedor.innerHTML += `
            <div class="flex gap-4 bg-[#28392e]/30 p-4 rounded-lg border border-transparent hover:border-primary/50 transition-colors duration-200">
                <div class="flex items-start gap-4 w-full">
                    <div class="text-white flex items-center justify-center rounded-lg bg-[#28392e] shrink-0 size-12 cursor-pointer group">
                        <span class="material-symbols-outlined text-white/70 group-hover:hidden">check_box_outline_blank</span>
                        <span class="material-symbols-outlined text-primary hidden group-hover:block">check_box</span>
                    </div>
                    <div class="flex flex-1 flex-col justify-center gap-1">
                        <p class="text-white text-base font-medium leading-normal">${tarea.titulo}</p>
                        <p class="text-[#9db9a6] text-sm font-normal leading-normal">${tarea.descripcion || 'Sin descripción'}</p>
                        <p class="text-[#9db9a6] text-sm font-normal leading-normal">Due: ${fechaFormateada}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button class="editar-btn flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#28392e] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors hover:bg-primary/20" data-id="${tareaId}">
                        <span class="material-symbols-outlined text-white">edit</span>
                    </button>
                    <button class="eliminar-btn flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#28392e] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 transition-colors hover:bg-red-500/30" data-id="${tareaId}">
                        <span class="material-symbols-outlined text-white">delete</span>
                    </button>
                </div>
            </div>
        `;
    });
}

// FUNCIÓN PARA ELIMINAR TAREA
async function eliminarTarea(id) {
    console.log("Intentando eliminar tarea con ID:", id);
    
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) {
        return;
    }

    const {response, data} = await apiRequest(
        API_URL + `/task/delete/${id}`,
        "DELETE",
        null,
        true
    );

    console.log("Respuesta de eliminación:", { status: response.status, data });

    if (response.ok) {
        alert("✅ Tarea eliminada correctamente");
        listarTareas();
    } else {
        let errorMsg = "Error desconocido";
        
        if (response.status === 403) {
            errorMsg = "No tienes permisos para eliminar esta tarea";
        } else if (response.status === 404) {
            errorMsg = "Tarea no encontrada";
        } else if (data) {
            errorMsg = typeof data === 'string' ? data : JSON.stringify(data);
        }
        
        console.error("Error al eliminar:", errorMsg);
        alert("Error al eliminar: " + errorMsg);
    }
}

// ============================================
// EVENT LISTENERS - SE EJECUTAN AL CARGAR
// ============================================
console.log("Cargando event listeners...");

document.addEventListener("DOMContentLoaded", () => {
    
    // PÁGINA DE CREAR TAREA (create_task.html)
    const btnGuardar = document.getElementById("btn-guardar");
    if (btnGuardar && window.location.pathname.includes("create_task.html")) {
        btnGuardar.addEventListener("click", function (event) {
            event.preventDefault();
            crearTarea();
        });
    }
    
    // PÁGINA DE EDITAR TAREA (edit_task.html)
    if (window.location.pathname.includes("edit_task.html")) {
        
        // Cargar los datos de la tarea
        cargarTareaParaEditar();
        
        // Configurar el botón para actualizar
        if (btnGuardar) {
            btnGuardar.addEventListener("click", function (event) {
                event.preventDefault();
                actualizarTarea();
            });
        }
    } else if (btnGuardar && !window.location.pathname.includes("create_task.html")) {
    }

    // AUTO-LISTAR TAREAS (listar_task.html)
    if (window.location.pathname.includes("listar_task.html")) {
        listarTareas();
    }

    // DELEGACIÓN DE EVENTOS para botones dinámicos
    document.addEventListener("click", (e) => {
        // Botón ELIMINAR
        const btnEliminar = e.target.closest(".eliminar-btn");
        if (btnEliminar) {
            const id = btnEliminar.getAttribute("data-id");
            eliminarTarea(id);
            return; // Importante para evitar que siga ejecutando
        }
        
        // Botón EDITAR
        const btnEditar = e.target.closest(".editar-btn");
        if (btnEditar) {
            const id = btnEditar.getAttribute("data-id");
            // Redirigir a la página de edición con el ID en la URL
            window.location.href = `edit_task.html?id=${id}`;
        }
    });
    
});