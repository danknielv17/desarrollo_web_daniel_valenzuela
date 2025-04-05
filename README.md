# desarrollo_web_daniel_valenzuela

## Tarea 1

# Análisis del HTML de Gestión de Actividades Recreativas

## Estructura general

- El documento está en español (`<html lang="es">`)
- Secciones: cabecera (`<head>`), cuerpo (`<body>`), encabezado (`<header>`), contenido principal (`<main>`) y pie de página (`<footer>`)
- Enlaza a una hoja de estilos CSS (`css/styles.css`) y a un archivo JavaScript (`css/js/script.js`)

## Secciones principales

1. **Portada:**
   - Título principal "Bienvenido a la Gestión de Actividades Recreativas"
   - Menú de navegación con enlaces a las diferentes secciones

   - **Listado con las últimas actividades agregadas:**
   - Muestra una tabla con actividades recientes
   - Incluye datos como fecha/hora, ubicación, tema y fotos
   - Hay algunos errores en la estructura de la tabla (por ejemplo, etiqueta `<\tr>` mal cerrada)

2. **Agregar nueva actividad:**
   - Formulario para agregar una nueva actividad
   - Dividido en fieldsets para organizar la información:
     - Información del lugar (región, comuna, sector)
     - Datos del organizador (nombre, email, teléfono, método de contacto)
     - Información de la actividad (fechas, descripción, tema, fotos)
   - Incluye validaciones básicas con atributos HTML (required, pattern, etc.)
   - Tiene elementos dinámicos que probablemente se gestionan con JavaScript

3. **Listado de actividades:**
   - Tabla con actividades existentes
   - Cada fila es clickeable para ver detalles (`onclick="mostrarDetalleActividad(id)"`)
   - Incluye una sección oculta para mostrar detalles específicos de cada actividad

4. **Estadísticas:**
   - Gráficos que muestran estadísticas de actividades 
   - El primer gráfico de líneas informa la cantidad de actividades por día. En el eje X muestra los días 
     y en el eje Y muestra la cantidad de actividades. 
   - El segundo gráfico es un gráfico de torta que muestra el total de actividades por tipo. 
   - El tercer gráfico es uno de barras que muestra tres barras por cada punto del eje X. 
     El eje X son los meses y para cada mes muestra una barra con la cantidad de actividades que se inician en la mañana, 
     la cantidad de actividades que se inician al mediodía y la cantidad de actividades de la tarde. El eje Y indica la cantidad.

## Características destacables

- **Formulario completo** con múltiples tipos de campos: selects, inputs de texto, fechas, archivos, etc.
- **Interactividad**: Elementos que cambian dinámicamente basados en selecciones del usuario
- **Maquetación organizada** usando secciones y fieldsets para agrupar información relacionada
- **Navegación simple** entre las diferentes partes de la aplicación