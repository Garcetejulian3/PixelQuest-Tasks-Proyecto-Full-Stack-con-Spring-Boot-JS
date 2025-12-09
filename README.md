# 📋 PixelQuest Tasks - Sistema de Gestión de Tareas

## 🎯 Descripción del Proyecto

**PixelQuest Tasks** es una aplicación web full-stack de gestión de tareas con temática retro-gaming, desarrollada con una arquitectura de backend separado del frontend. El proyecto implementa un sistema completo de autenticación y CRUD de tareas, permitiendo a los usuarios registrarse, iniciar sesión y administrar sus "misiones" personales.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java** con **Spring Boot**
- **Spring Security** para autenticación JWT
- **MySQL** como base de datos
- **JPA/Hibernate** para persistencia de datos
- API RESTful con endpoints protegidos

### Frontend
- **HTML5, CSS3 y JavaScript Vanilla**
- **Tailwind CSS** para estilos modernos
- **Diseño responsive** con temática pixel art
- Integración con API mediante `fetch`

---

## ✨ Funcionalidades Principales

### Sistema de Autenticación
- ✅ Registro de nuevos usuarios con validación
- ✅ Login con generación de tokens JWT
- ✅ Protección de rutas mediante tokens Bearer
- ✅ Logout con limpieza de sesión

### Gestión de Tareas (CRUD Completo)
- ✅ **Crear** nuevas tareas con título, descripción y fecha límite
- ✅ **Listar** todas las tareas del usuario autenticado
- ✅ **Editar** tareas existentes con carga dinámica de datos
- ✅ **Eliminar** tareas con confirmación

### Características Adicionales
- Diseño temático de videojuegos retro
- Validación de campos en frontend y backend
- Manejo de errores con mensajes informativos
- Protección de rutas según estado de autenticación
- Persistencia de sesión con `localStorage`

---

## 📚 Aprendizajes Clave

### Arquitectura Backend-Frontend Separada
Durante el desarrollo de este proyecto, comprendí la importancia de separar responsabilidades entre el backend y frontend:

- **Backend (Spring Boot)**: Maneja toda la lógica de negocio, seguridad, validaciones y acceso a datos
- **Frontend (JavaScript)**: Se enfoca únicamente en la presentación y experiencia de usuario
- **Comunicación vía API REST**: Ambas capas se comunican mediante peticiones HTTP con formato JSON

Esta separación permite:
- Mayor escalabilidad y mantenimiento
- Posibilidad de crear múltiples frontends (web, móvil) usando la misma API
- Desarrollo independiente de cada capa

### Trabajo con JavaScript y APIs
Aunque no era mi fuerte inicial, logré:

- **Consumir APIs RESTful** con `fetch` y manejo de promesas
- **Gestionar autenticación JWT** enviando tokens en headers
- **Manipular el DOM dinámicamente** para crear/actualizar elementos
- **Manejar el ciclo de vida** de las peticiones asíncronas
- **Implementar delegación de eventos** para elementos creados dinámicamente

**Recursos de apoyo**: Me guié con video tutoriales de YouTube y documentación oficial, lo que me permitió entender conceptos como:
- Async/await para código más legible
- Headers de autorización con Bearer tokens
- Diferencias entre GET, POST, PUT y DELETE
- Redirecciones y manejo de rutas en el frontend

### Spring Security y JWT
Implementé un sistema robusto de seguridad:

- Configuración de filtros de seguridad
- Generación y validación de tokens JWT
- Protección de endpoints según roles
- Manejo de excepciones de autenticación

### Base de Datos y JPA
- Diseño de entidades relacionadas (Usuario → Tareas)
- Uso de repositorios JPA para consultas
- Configuración de estrategias de generación de tablas
- Relaciones OneToMany y gestión de claves foráneas

---

## 🎨 Diseño de Interfaz

El proyecto cuenta con un diseño único inspirado en videojuegos retro:

- **Paleta de colores**: Verde neón (#13ec5b) sobre fondos oscuros
- **Tipografía**: "Press Start 2P" para headers, "Space Grotesk" para contenido
- **Efectos pixel art**: Bordes cuadrados, sombras estilo 8-bit
- **Responsive**: Adaptable a dispositivos móviles y desktop

---

## 🚀 Estructura del Proyecto

```
proyecto/
│
├── frontend/
│   ├── index.html (redirect)
│   ├── register.html
│   ├── login.html
│   ├── listar_task.html
│   ├── create_task.html
│   ├── edit_task.html
│   └── js/
│       ├── config.js
│       ├── auth.js
│       └── task.js
│
└── backend/ (Spring Boot)
    ├── controllers/
    ├── services/
    ├── repositories/
    ├── models/
    ├── security/
    └── application.properties
```

---

## 🔐 Seguridad Implementada

- **Autenticación JWT**: Tokens seguros con expiración
- **Encriptación de contraseñas**: Usando BCrypt
- **Validación de permisos**: Solo el propietario puede editar/eliminar sus tareas
- **CORS configurado**: Para permitir comunicación frontend-backend
- **Protección contra inyección SQL**: Mediante JPA y prepared statements

---

## 📝 Endpoints de la API

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

### Tareas (requieren autenticación)
- `GET /task/listar` - Obtener todas las tareas del usuario
- `GET /task/{id}` - Obtener una tarea específica
- `POST /task/crear` - Crear nueva tarea
- `PUT /task/edit` - Actualizar tarea existente
- `DELETE /task/delete/{id}` - Eliminar tarea

---

## 💡 Desafíos Superados

1. **Comunicación Frontend-Backend**: Entender el flujo de datos entre ambas capas
2. **Manejo de tokens JWT**: Almacenamiento seguro y envío en cada petición
3. **Validaciones sincronizadas**: Asegurar que frontend y backend validen correctamente
4. **Eventos dinámicos en JavaScript**: Implementar event delegation para elementos creados después del load
5. **Debugging de CORS**: Configurar correctamente los headers para permitir peticiones cross-origin

---

## 🎓 Conclusión

Este proyecto me permitió desarrollar habilidades fundamentales en:

- **Desarrollo full-stack** con arquitectura separada
- **Seguridad de aplicaciones web** con JWT y Spring Security
- **JavaScript moderno** para consumo de APIs
- **Diseño responsive** y experiencia de usuario
- **Resolución de problemas** mediante investigación y tutoriales

Aunque el JavaScript no es mi especialidad, aprendí a investigar, buscar recursos (video tutoriales, Stack Overflow, documentación) y aplicar soluciones adaptadas a mi proyecto. Esta experiencia refuerza la importancia de saber buscar información y adaptarse a nuevas tecnologías.

---

## 🔗 Próximos Pasos

- [ ] Implementar filtros por estado (completado/pendiente)
- [ ] Agregar fechas de creación y modificación
- [ ] Sistema de categorías o etiquetas
- [ ] Notificaciones de tareas próximas a vencer
- [ ] Deploy en producción (Railway, Vercel, etc.)

---

## 📦 Instalación y Ejecución

### Requisitos Previos
- Java 17 o superior
- MySQL 8.0+
- Maven 3.6+
- Docker (opcional)

### Opción 1: Ejecución Local (Sin Docker)

#### 1. Configurar la Base de Datos
```sql
CREATE DATABASE securytitaskdb;
```

#### 2. Configurar application.properties
Edita `src/main/resources/application.properties` con tus credenciales:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/securytitaskdb
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA
```

#### 3. Compilar y Ejecutar el Backend
```bash
# Compilar el proyecto
mvn clean package

# Ejecutar la aplicación
java -jar target/api_task_mini-0.0.1-SNAPSHOT.jar
```

El backend estará disponible en: `http://localhost:8080`

#### 4. Ejecutar el Frontend
Simplemente abre `index.html` en tu navegador o usa un servidor local:
```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js (npx)
npx http-server

# Opción 3: VS Code Live Server extension
```

El frontend estará disponible en: `http://localhost:8000` (o el puerto que elijas)

---

### Opción 2: Ejecución con Docker 🐳

#### 1. Crear docker-compose.yml
Crea este archivo en la raíz del proyecto:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: task-mysql
    environment:
      MYSQL_ROOT_PASSWORD: 12349080
      MYSQL_DATABASE: securytitaskdb
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - task-network

  backend:
    build: .
    container_name: task-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/securytitaskdb
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: 12349080
    depends_on:
      - mysql
    networks:
      - task-network

volumes:
  mysql_data:

networks:
  task-network:
    driver: bridge
```

#### 2. Ejecutar con Docker Compose
```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

#### 3. Acceder a la aplicación
- Backend: `http://localhost:8080`
- Frontend: Abrir `index.html` directamente

---

### Opción 3: Solo Backend con Docker

```bash
# 1. Asegúrate de tener MySQL corriendo localmente

# 2. Compilar el JAR
mvn clean package

# 3. Construir la imagen Docker
docker build -t pixelquest-backend .

# 4. Ejecutar el contenedor
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/securytitaskdb \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=12349080 \
  pixelquest-backend
```

---

### 🧪 Verificar que todo funciona

1. **Probar el backend**:
```bash
curl http://localhost:8080/auth/login
```

2. **Abrir el frontend**: Navegar a `register.html` y crear una cuenta

3. **Crear una tarea**: Iniciar sesión y probar el CRUD completo

---

### 🐛 Solución de Problemas Comunes

#### Error de conexión a MySQL
```
Error: Communications link failure
```
**Solución**: Verifica que MySQL esté corriendo y las credenciales sean correctas

#### CORS Error en el navegador
```
Access to fetch blocked by CORS policy
```
**Solución**: Verifica que el backend tenga configurado CORS correctamente

#### Puerto 8080 ya en uso
```bash
# Verificar qué proceso usa el puerto
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Cambiar puerto en application.properties
server.port=8081
```

---

**Desarrollado con 💚 y mucho aprendizaje**
