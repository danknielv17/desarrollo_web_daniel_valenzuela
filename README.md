# desarrollo_web_daniel_valenzuela

## CC5002 - Tarea 3

# Gestión de Actividades Recreativas: API Comentarios y Estadísticas

## Funcionalidades de Estadísticas

## Ejecución de la aplicación

Para correr flask, por temas de tiempo y problemas en la estructura de las carpetas, correr el siguiente comando en 
el virtual environment:
```
$env:FLASK_APP="app.app:app"
flask run
```

## Estructura implementada en la tarea 3

- `app/static/js/estadisticas.js`: Código JavaScript para generar gráficos interactivos de estadísticas.
- `app/static/css/detalle.css`: Código CSS para el estilo de la página de detalle de actividades.
- `app/static/css/formularioactividad.css`: Código CSS para separar estilo del formulario de los comentarios.
- `app/templates/404.html`: Página de error 404 personalizada para manejar rutas no encontradas.


## Características principales

### Funcionalidad de Estadísticas Interactivas

Se implementó una sección de **Estadísticas** que permite visualizar información relevante sobre las actividades registradas, 
utilizando gráficos interactivos generados con **Highcharts** y datos obtenidos dinámicamente desde el servidor mediante AJAX.

#### 1. Características:

- **Tres gráficos interactivos:**
  - **Gráfico de líneas:** Muestra la cantidad de actividades por día. (Por temas de eficiencia en la visualización, a diferencia de la tarea 1, 
aquí se muestra la cantidad de actividades por día histórico, no por días de la semana)
  - **Gráfico de torta:** Presenta la distribución de actividades por tipo.
  - **Gráfico de barras:** Visualiza la cantidad de actividades por momento del día (mañana, mediodía, tarde) agrupadas por mes. 
    - Considere que el momento del día se define como:
      - Mañana: 06:00 a 11:59
      - Mediodía: 12:00 a 17:59
      - Tarde: 18:00 a 05:59
- **Obtención dinámica de datos:**
  - Se crearon rutas API en Flask (`/api/estadisticas/por-dia`, `/api/estadisticas/por-tipo`, `/api/estadisticas/por-momento-mes`) 
que entregan los datos en formato JSON directamente desde la base de datos.

- **Visualización en el cliente:**
  - El archivo `app/static/js/estadisticas.js` utiliza `fetch` para obtener los datos y renderiza los gráficos en la página `estadisticas.html` 
usando Highcharts.

- **Navegación:**
  - Al inicio de la página de estadísticas, se mantiene el encabezado los enlaces flask para navegar al resto de páginas.
  - Al final de la página de estadísticas, se incluye un enlace para regresar a la portada del sistema.

Así, las estadísticas se actualizan automáticamente según los datos almacenados.

---

### Funcionalidad de Comentarios 
#### Implementación de sistema de comentarios en actividades

##### 1. Base de datos
La tabla `comentario` está definida con la estructura adecuada:
- `id` (clave primaria)
- `nombre` (varchar 80, obligatorio)
- `texto` (varchar 300, obligatorio)
- `fecha` (timestamp)
- `actividad_id` (clave foránea vinculada a actividad)

#### 2. Archivos relacionados
- `app/templates/detalle.html`: Contiene el formulario y la sección de comentarios en la vista de detalle de actividad.
- `app/static/js/script.js`: Gestiona la carga, validación y envío de comentarios mediante JavaScript.
- `app/app.py`: Define las rutas API para obtener y agregar comentarios (/api/comentarios/<actividad_id>).
- `app/db/db.py`: Modelo de datos para los comentarios (Comentario).

##### 3. Backend (Flask)
Los endpoints para gestionar comentarios están implementados:

- `GET /api/comentarios/<int:actividad_id>`: Devuelve comentarios de una actividad
- `POST /api/comentarios/<int:actividad_id>`: Agrega un nuevo comentario

Incluyen validaciones del lado del servidor para:
- Nombre entre 3 y 80 caracteres
- Texto entre 5 y 300 caracteres

##### 4. Frontend (HTML y JavaScript)
En el archivo `detalle.html`, está la estructura para:
- Formulario para agregar comentarios con validaciones
  - Campo de nombre (3-80 caracteres, obligatorio)
  - Campo de texto (mínimo 5 caracteres, máximo 300)
  - Botón para enviar
- Contenedor para mostrar comentarios existentes

El JavaScript en `script.js` contiene dentro de la función`document.addEventListener('DOMContentLoaded', ()` en donde:
  - Verifica longitud del nombre (3-80 caracteres)
  - Verifica longitud del texto (mínimo 5 caracteres)
  - Muestra errores sin recargar la página

#### 5. Seguridad:

- Se implementa protección CSRF usando Flask-WTF. El token se expone al frontend y se envía en cada solicitud `POST`.
- Manejo de errores y mensajes claros en caso de validaciones fallidas o problemas de red.

##### 6. Flujo de funcionamiento
1. Al cargar la página de detalle de una actividad, se solicitan los comentarios existentes mediante una petición `GET` a `/api/comentarios/<int:actividad_id>`.
2. El usuario puede agregar un nuevo comentario completando el formulario. Al enviarlo:
   - Se valida en el frontend la longitud del nombre y el comentario.
   - Se envía la información al backend por POST, incluyendo el token CSRF.
   - El backend valida nuevamente los datos y, si son correctos, guarda el comentario en la base de datos.
   - Si la operación es exitosa, el frontend recarga el listado de comentarios automáticamente.
   - Si ocurre un error, se muestra un mensaje descriptivo al usuario.