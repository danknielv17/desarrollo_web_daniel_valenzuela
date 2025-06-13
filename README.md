# desarrollo_web_daniel_valenzuela

## CC5002 - Tarea 3

# SQL y Flask: Gestión de Actividades Recreativas

## Funcionalidades de Estadísticas

## Ejecución de la aplicación

Para correr flask, por temas de tiempo y problemas en la estructura de las carpetas, correr el siguiente comando en 
el virtual environment:
```
$env:FLASK_APP="app.app:app"
flask run
```

## Características principales

### Funcionalidad de Estadísticas Interactivas

Se implementó una sección de **Estadísticas** que permite visualizar información relevante sobre las actividades registradas, 
utilizando gráficos interactivos generados con **Highcharts** y datos obtenidos dinámicamente desde el servidor mediante AJAX.

#### Características:

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

### Funcionalidad de Comentarios 
#### Implementación de sistema de comentarios en actividades

La funcionalidad para agregar comentarios a las actividades y listarlos de forma asíncrona ya está correctamente implementada. Vamos a repasar los componentes principales:

###### 1. Base de datos
La tabla `comentario` está definida con la estructura adecuada:
- `id` (clave primaria)
- `nombre` (varchar 80, obligatorio)
- `texto` (varchar 300, obligatorio)
- `fecha` (timestamp)
- `actividad_id` (clave foránea vinculada a actividad)

##### 2. Backend (Flask)
Los endpoints para gestionar comentarios están implementados:

- `GET /api/comentarios/<int:actividad_id>`: Devuelve comentarios de una actividad
- `POST /api/comentarios/<int:actividad_id>`: Agrega un nuevo comentario

Incluyen validaciones del lado del servidor para:
- Nombre entre 3 y 80 caracteres
- Texto entre 5 y 300 caracteres

##### 3. Frontend (HTML y JavaScript)
En el archivo `detalle.html`, está la estructura para:
- Formulario para agregar comentarios con validaciones
- Contenedor para mostrar comentarios existentes

El JavaScript en `script.js` contiene las funciones:

- `cargarComentarios(actividadId)`: Obtiene la lista de comentarios
- `inicializarFormularioComentario(actividadId)`: Gestiona el envío con validaciones

##### 4. Flujo de la funcionalidad
1. Al cargar la página, se obtienen los comentarios existentes
2. El usuario completa el formulario y envía
3. Se validan los datos en JavaScript
4. Se envían al servidor mediante Fetch API
5. El servidor valida y guarda el comentario
6. La lista de comentarios se actualiza dinámicamente