# desarrollo_web_daniel_valenzuela

## Tarea 1

# Análisis del HTML de Gestión de Actividades Recreativas

El código HTML que estás viendo es la estructura de una página web para gestionar actividades recreativas. Te explicaré sus principales componentes:

## Estructura general

- El documento está en español (`<html lang="es">`)
- Tiene las secciones habituales: cabecera (`<head>`), cuerpo (`<body>`), encabezado (`<header>`), contenido principal (`<main>`) y pie de página (`<footer>`)
- Enlaza a una hoja de estilos CSS (`css/styles.css`) y a un archivo JavaScript (`css/js/script.js`)

## Secciones principales

1. **Encabezado (`<header>`):**
   - Título principal "Bienvenido a la Gestión de Actividades Recreativas"
   - Menú de navegación con enlaces a las diferentes secciones

2. **Últimas actividades agregadas:**
   - Muestra una tabla con actividades recientes
   - Incluye datos como fecha/hora, ubicación, tema y fotos
   - Hay algunos errores en la estructura de la tabla (por ejemplo, etiqueta `<\tr>` mal cerrada)

3. **Formulario para informar nuevas actividades:**
   - Dividido en fieldsets para organizar la información:
     - Información del lugar (región, comuna, sector)
     - Datos del organizador (nombre, email, teléfono, método de contacto)
     - Información de la actividad (fechas, descripción, tema, fotos)
   - Incluye validaciones básicas con atributos HTML (required, pattern, etc.)
   - Tiene elementos dinámicos que probablemente se gestionan con JavaScript

4. **Listado de actividades:**
   - Tabla con actividades existentes
   - Cada fila es clickeable para ver detalles (`onclick="mostrarDetalleActividad(id)"`)
   - Incluye una sección oculta para mostrar detalles específicos de cada actividad

## Características destacables

- **Formulario completo** con múltiples tipos de campos: selects, inputs de texto, fechas, archivos, etc.
- **Interactividad**: Elementos que cambian dinámicamente basados en selecciones del usuario
- **Maquetación organizada** usando secciones y fieldsets para agrupar información relacionada
- **Navegación simple** entre las diferentes partes de la aplicación

Hay algunos errores estructurales que deberían corregirse, como la etiqueta `<\tr>` mal cerrada y algunas rutas de archivos que podrían causar problemas (el script JavaScript está en una ubicación inusual: `css/js/script.js`).