# desarrollo_web_daniel_valenzuela

## CC5002 - Tarea 1

# HTML, CSS y JS: Gestión de Actividades Recreativas

## Estructura general

- Secciones: cabecera (`<head>`), cuerpo (`<body>`), encabezado (`<header>`), contenido principal (`<main>`) y pie de página (`<footer>`)
- Enlaza a una hoja de estilos CSS (`css/styles.css`) y a un archivo JavaScript (`css/js/script.js`)

## Secciones principales

1. **Portada:**
   - Título principal "Bienvenido a la Gestión de Actividades Recreativas"
   - Menú de navegación con enlaces a las diferentes secciones

   - **Listado con las últimas actividades agregadas:**
   - Muestra una tabla con actividades recientes
   - Incluye datos como fecha/hora, ubicación, tema y fotos

2. **Agregar nueva actividad:**
   - Formulario para agregar una nueva actividad
   - Dividido en fieldsets para organizar la información:
     - Información del lugar: 
       - Región y comuna (selects obligatorios)
       - Sector (opcional de llenar)
     - Datos del organizador:
       - Nombre, email (inputs obligatorios de llenar)
       - Teléfono (input opcional de llenar)
       - Contactar por (select opcional de elegir, si elige, es obligatorio llenar el campo 
         correspondiente)
     - Información de la actividad: (fechas, descripción, tema, fotos)
       - Fecha de inicio (input de fecha obligatorio)
       - Fecha de término (input de fecha opcional)
       - Descripción (textarea opcional)
       - Tema (select obligatorio)
         - Si elige "Otro", se habilita un input de texto para especificar el tema 
       - Fotos (input de archivo, obligatorio al menos una foto)
   - Incluye validaciones básicas con atributos HTML (required, pattern, etc.)

3. **Listado de actividades:**
   - Tabla con actividades existentes
   - Cada fila es clickeable para ver detalles (`onclick="mostrarDetalleActividad(id)"`)
   - Incluye una sección oculta para mostrar detalles específicos de cada actividad
     - Al hacer clic en una foto, se muestra una imagen ampliada junto con un botón para cerrar la vista

4. **Estadísticas:**
   - Gráficos que muestran estadísticas de actividades 
   - El primer gráfico de líneas informa la cantidad de actividades por día. En el eje X muestra los días 
     y en el eje Y muestra la cantidad de actividades. 
   - El segundo gráfico es un gráfico de torta que muestra el total de actividades por tipo. 
   - El tercer gráfico es uno de barras que muestra tres barras por cada punto del eje X. 
     El eje X son los meses y para cada mes muestra una barra con la cantidad de actividades que se inician en la mañana, 
     la cantidad de actividades que se inician al mediodía y la cantidad de actividades de la tarde. El eje Y indica la cantidad.

## Validaciones
- Validaciones básicas en el formulario de agregar actividad
- Los campos obligatorios presentan required y a su vez, su respectiva validación en `validation.js` y `script.js`
- Sin los requiered, el usuario al intentar enviar el formulario, se le indicará con una alerta que debe llenar los campos obligatorios con el formato correcto
  - Región y comuna valida que se hayan seleccionado 
  - Nombre y email validan que estén llenos, valida un largo válido de nombre y que el email tenga un formato correcto
  - Fecha de inicio valida que esté seleccionada y que sea una fecha válida con formato YYYY-MM-DD
  - Tema valida que se haya seleccionado y si elige otro, que el campo de texto esté lleno
  - Foto valida que al menos una foto esté seleccionada
- Los campos con validaciones opcionales no son obligatorios de llenar, pero si el usuario decide llenar el campo, se valida su correcta 
  escritura y selección.
  - Sector valida que sea un texto de largo válido
  - Teléfono valida que el número esté escrito en un formato válido 
  - En contactar por, si elige una opción, tiene required para que el campo correspondiente esté lleno (lógica presente en `inicializarContactarPor` 
    en `script.js`)
  - Fecha de término valida que sea una fecha válida y posterior a la fecha de inicio