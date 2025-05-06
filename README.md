# desarrollo_web_daniel_valenzuela

## CC5002 - Tarea 2

# SQL y Flask: Gestión de Actividades Recreativas

# desarrollo_web_daniel_valenzuela

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