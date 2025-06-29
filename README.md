# desarrollo_web_daniel_valenzuela

## CC5002 - Tarea 3

# Gestión de Actividades Recreativas: Sistema de Evaluación de Actividades - Spring Boot

## Funcionalidades de Estadísticas

### Compilar el proyecto
```bash
mvn clean compile
```

### Ejecutar la aplicación
```bash
mvn spring-boot:run
```


Se implementa un sistema de evaluación de actividades recreativas usando Spring Boot con funcionalidades asíncronas en JavaScript.

## Características Principales

- **Evaluación asíncrona**: Permite evaluar actividades con notas del 1 al 7 usando llamadas AJAX
- **Cálculo automático de promedios**: Actualiza automáticamente el promedio de notas en tiempo real
- **Interfaz responsiva**: Diseño adaptable usando Bootstrap 5

## Estructura implementada en la tarea 4

```
src/
├── main/
│   ├── java/com/actividad/
│   │   ├── ActividadApplication.java          # Clase principal Spring Boot
│   │   ├── controller/
│   │   │   └── ActividadController.java       # Controlador REST y Web
│   │   ├── dto/
│   │   │   └── ActividadConNotaDTO.java       # DTO para actividades con notas
│   │   ├── model/
│   │   │   ├── Actividad.java                 # Entidad Actividad
│   │   │   └── Nota.java                      # Entidad Nota
│   │   └── repository/
│   │       ├── ActividadRepository.java       # Repositorio de Actividades
│   │       └── NotaRepository.java            # Repositorio de Notas
│   └── resources/
│       ├── application.properties             # Configuración de la aplicación
```


## Características principales

## Endpoints de la API

### Web Endpoints
- `GET /actividades/evaluaciones` - Página principal con la tabla de actividades

### REST API Endpoints
- `GET /actividades/api/terminadas` - Obtener actividades terminadas con notas
- `POST /actividades/api/notas` - Agregar nueva nota a una actividad
- `GET /actividades/api/{id}/promedio` - Obtener promedio actualizado de una actividad

## Uso de la Aplicación

### Evaluación de Actividades

1. **Visualizar actividades**: La página principal muestra todas las actividades terminadas
2. **Evaluar actividad**: Hacer clic en el botón "Evaluar" de cualquier actividad
3. **Seleccionar nota**: Elegir una nota entre 1 y 7 en el modal
4. **Confirmar evaluación**: La nota se guarda y el promedio se actualiza automáticamente

### Funcionalidades JavaScript

- **Validación en tiempo real**: Verifica que la nota esté entre 1 y 7
- **Llamadas asíncronas**: Usa fetch API para comunicación con el servidor
- **Actualización automática**: Actualiza el promedio en la tabla sin recargar la página
- **Feedback visual**: Muestra mensajes de éxito y error

## Estructura de la Tabla

La tabla muestra las siguientes columnas:
- **ID**: Identificador único de la actividad
- **Nombre**: Nombre de la actividad
- **Tipo**: Tipo de actividad (deportiva, cultural, etc.)
- **Fecha Término**: Fecha en que terminó la actividad
- **Lugar**: Ubicación de la actividad
- **Nota Promedio**: Promedio de todas las evaluaciones (muestra "-" si no hay notas)
- **Acciones**: Botón para evaluar la actividad

## Validaciones Implementadas

- Solo se pueden evaluar actividades terminadas (fecha de término < fecha actual)
- Las notas deben ser números enteros entre 1 y 7 (inclusive)
- Validación tanto en frontend (JavaScript) como en backend (Spring Boot)
- Manejo de errores con mensajes informativos

## Tecnologías Utilizadas

- **Backend**: Spring Boot 3.2, Spring Data JPA, Spring Web
- **Frontend**: HTML5, Bootstrap 5, JavaScript (Fetch API)
- **Base de datos**: MySQL 8.0
- **Plantillas**: Thymeleaf
- **Build**: Maven

## Solución de Problemas

### Error de importaciones
```bash
ModuleNotFoundError: No module named 'app.utils'
```
**Solución**: Las importaciones usan rutas relativas cuando se ejecuta desde `/app/`:

```python
from utils.validations import validar_nombre  # Correcto
from app.utils.validations import validar_nombre  # Error (forma antigua)
```

### Tabla evaluaciones vacía
**Verificar**: Que existan actividades con `fecha_termino < fecha_actual`

### Error de conexión a la base de datos
- Verifica que MySQL esté ejecutándose
- Confirma las credenciales en `db/db.py`
- Asegúrate de que la base de datos 'tarea2' exista y la tabla 'nota' esté creada

### La tabla no muestra actividades
- Verifica que existan actividades con fecha de término anterior a hoy
- Ejecuta el script `db/tabla-nota.sql` para crear la tabla nota si no existe

### Errores en JavaScript
- Abre las herramientas de desarrollador del navegador (F12)
- Revisa la consola para errores específicos
- Verifica que los endpoints de la API respondan correctamente
- Confirma que el archivo `static/js/evaluaciones.js` se cargue correctamente

## Desarrollo y Extensiones

Para agregar nuevas funcionalidades al sistema Flask:

1. **Nuevos endpoints**: Agregar rutas en `app.py`
2. **Nuevas validaciones**: Extender `utils/validations.py`
3. **Nuevas vistas**: Crear plantillas HTML en `templates/`
4. **Nuevos estilos**: Agregar CSS en `static/css/`
5. **Nueva funcionalidad JS**: Crear archivos en `static/js/`

### Sistema de Evaluaciones - Detalles de Implementación

#### Funcionalidad Principal
- **Página de evaluaciones**: `/evaluaciones`
- **Solo actividades terminadas**: Se evalúan actividades cuya fecha de término sea anterior a la fecha actual
- **Escala de notas**: 1-7 (enteros únicamente)
- **Promedio automático**: Se calcula y actualiza en tiempo real
- **Interfaz asíncrona**: Sin recargas de página

#### APIs REST Creadas
- `GET /evaluaciones` - Página principal de evaluaciones
- `GET /api/actividades/terminadas` - Lista actividades terminadas (JSON)
- `POST /api/actividades/{id}/notas` - Agregar nueva nota
- `GET /api/actividades/{id}/promedio` - Obtener promedio actualizado

#### Frontend JavaScript
- **Archivo**: `static/js/evaluaciones.js`
- **Modal personalizado**: Sin dependencias externas
- **Validación asíncrona**: Fetch API con manejo de errores
- **UX mejorada**: Loading states, tecla Escape, feedback visual

#### Estructura de Tabla
```
ID | Fecha Inicio | Sector | Nombre | Tema | Nota | Acciones
```

#### Validaciones Implementadas
- **Frontend**: JavaScript valida rango 1-7 antes de enviar
- **Backend**: Python valida tipo de dato y rango
- **Base de datos**: Solo acepta actividades terminadas
- **Integridad**: Manejo de errores robusto

#### Integración Visual
- **CSS específico**: `static/css/evaluaciones.css`
- **Navegación unificada**: Enlace agregado a todos los headers (excepto detalle.html)
- **Estilo consistente**: Mismo diseño que el resto de la aplicación
