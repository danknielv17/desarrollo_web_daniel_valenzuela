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
  - **Gráfico de líneas:** Muestra la cantidad de actividades por día.
  - **Gráfico de torta:** Presenta la distribución de actividades por tipo.
  - **Gráfico de barras:** Visualiza la cantidad de actividades por momento del día (mañana, mediodía, tarde) agrupadas por mes.

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