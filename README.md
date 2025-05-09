# desarrollo_web_daniel_valenzuela

## CC5002 - Tarea 2

# SQL y Flask: Gestión de Actividades Recreativas

## Características principales

- Registro de actividades con datos como fecha, comuna, sector, tema y fotos.
- Listado y detalle de actividades.
- Visualización de actividades en la portada en formato de tabla.
- Eliminación y edición de actividades (con integridad referencial).
- Estadísticas básicas.

---

## Estructura general implementada en la tarea 2

- `app/db/db.py`: Definición de modelos SQLAlchemy.
- `app/static/`: Archivos estáticos (CSS, JS, imágenes).
  - `app/static/uploads/`: Carpeta para almacenar fotos subidas por los usuarios.
- `app/templates/`: Plantillas HTML (portada (index), agregar, listado, detalle, estadísticas).
- `app/utils/`: Funciones auxiliares.
  - `app/utils/validations.py`: Funciones de validación de datos.
- `app/app.py`: Lógica principal de la aplicación Flask, incluyendo rutas y controladores.

---

## Ejecución de la aplicación

Para correr flask, por temas de tiempo y problemas en la estructura de las carpetas, correr el siguiente comando en 
el virtual environment:
```
$env:FLASK_APP="app.app:app"
flask run
```
## Detalles de la implementación

### Portada: 
- **Mensaje de bienvenida:** En `app/templates/index.html` aparece el mensaje "Bienvenido a la Gestión de Actividades Recreativas".
- **Menú con opciones:** El menú contiene "Agregar Actividad", "Ver Listado de Actividades" y "Estadísticas", cada una enlazada a su respectiva URL de Flask (`/agregar`, `/listado`, `/estadisticas`).
- **Listado de actividades:** Se muestran las últimas 5 actividades agregadas, obtenidas desde la base de datos en la función `portada()` de `app/app.py`.
  - Se ordenan las actividades desde la más cercana a la más lejana a la fecha actual.

### Agregar Actividad:

- El formulario de "Informar Actividad" en `app/templates/agregar.html` mantiene todas las validaciones en JavaScript (ver `app/static/js/script.js`, `app/static/js/validations.js`).
- Al confirmar, el formulario hace submit a la ruta `/agregar` de Flask.
- En el backend (`app/app.py`, función `agregar`), se validan los datos nuevamente y se insertan los registros en las tablas `actividad`, `actividad_tema`, `contactar_por` y `foto` (archivo).
- Se permite más de una inserción en `actividad_tema` y `contactar_por` según los datos recibidos.
- Los archivos se almacenan en la carpeta correspondiente.
- Si todo es correcto, redirige a la portada con un mensaje de éxito.
- Si hay errores, el formulario se muestra nuevamente con los mensajes de validación.

### Listado de Actividades:
- El listado de actividades se obtiene desde la base de datos usando SQLAlchemy en la ruta `/listado` de `app/app.py`.
- Se muestran 5 actividades por página, con paginación para avanzar y retroceder (`paginacion`).
- El template `app/templates/listado.html` muestra las actividades en una tabla, y al hacer clic en una fila se redirige al detalle de la actividad.
- El detalle de la actividad se obtiene desde la base de datos en la ruta `/actividad/<int:id>` y se muestra en `app/templates/detalle.html`.

### Estadísticas:
- La ruta `/estadisticas` en `app/app.py` solamente renderiza `app/templates/estadisticas.html`.
- Solo la ruta `/estadisticas` está implementada, y no se generan estadísticas dinámicas.
  - El template sigue mostrando información estática, con los gráficos com imagenes.
- Las funcionalidades relacionadas a las estadísticas quedarán pendientes para la siguiente tarea.