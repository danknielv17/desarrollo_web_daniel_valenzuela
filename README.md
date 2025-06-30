# desarrollo_web_daniel_valenzuela

## CC5002 - Tareas 1-4

# Gestión de Actividades Recreativas

Esta tarea contiene **dos implementaciones** del sistema de gestión de actividades recreativas:

## Estructura general del proyecto Flask y Spring Boot:
```
desarrollo_web_daniel_valenzuela/
├── README.md            # Documentación del proyecto
├── .mvn/wrapper/         # Wrapper de Maven
├── mvnw                  # Script para ejecutar Maven
├── mvnw.cmd              # Script para ejecutar Maven en Windows
├── pom.xml               # Archivo de configuración de Maven
├── app/                  # Implementación Flask (Tareas 1-3)
│   ├── app.py            # Archivo principal de Flask
│   ├── requirements.txt  # Dependencias de Flask
│   ├── db/               # Base de datos
│   ├── static/           # Archivos estáticos (CSS, JS)
    ├── templates/        # Plantillas HTML
│   └── utils/            # Utilidades y funciones auxiliares
├── src/                  # Implementación Spring Boot (Tarea 4)
│   ├── main/             # Directorio principal de la aplicación
│   │   ├── java/         # Código Java
│   │   ├── resources/    # Recursos de la aplicación (templates, static)
│   └── test/             # Pruebas unitarias
```

## Implementación Spring Boot (Tarea 4)

**Ubicación:** `desarrollo_web_daniel_valenzuela/src/`

**Puerto:** `http://localhost:8080`

Importante asegurarse de tener instalado las herramientas necesarias para ejecutar Spring Boot:
- **Java 17**
- **Maven**: Maven para compilar y ejecutar la aplicación. Está el wrapper de Maven incluido en el proyecto.

```bash
# Ejecutar Spring Boot
.\mvnw.cmd spring-boot:run
```

Link para acceder a la aplicación Spring Boot:
```link
http://localhost:8080/actividades/evaluaciones
```

### Funcionalidades Spring Boot:
- **Sistema de evaluación de actividades** (Tarea 4)
- Evaluación asíncrona con JavaScript
- Cálculo automático de promedios
- Interfaz responsiva con Bootstrap 5

## Características Principales de la Tarea 4 (Spring Boot)

### Herramientas Utilizadas
- **Backend**: Spring Boot 3.2 + Java 17 + JPA
- **Frontend**: Bootstrap 5 + JavaScript (Fetch API)
- **Base de datos**: MySQL 8.0
- **Plantillas**: Thymeleaf

### Endpoints Spring Boot
- `GET /actividades/evaluaciones` - Página principal
- `GET /actividades/api/terminadas` - API REST actividades terminadas
- `POST /actividades/api/notas` - API REST agregar nota
- `GET /actividades/api/{id}/promedio` - API REST obtener promedio

### Funcionalidad Principal
1. **Visualizar actividades terminadas**: Solo actividades con fecha_termino < fecha_actual
2. **Evaluar asíncronamente**: Modal para seleccionar nota 1-7. Se muestra al final de la página al hacer clic en "Evaluar"
3. **Actualización automática**: Promedio se actualiza sin recargar página
4. **Validación completa**: Frontend (JavaScript) y Backend (Spring Boot)

### Estructura de la Tabla de Evaluaciones
```
| ID | Fecha Inicio | Sector | Nombre (organizador) | Tema | Nota | Acción |
```

## Tests
### Estructura de Tests
1. Tests de Modelos
   Actividad: Creación completa, validación de fechas terminadas
   Nota: Creación válida, validación de rango (1-7)
2. Tests de Repositorios
   ActividadRepository: Búsqueda de actividades terminadas
   NotaRepository: Cálculo de promedios y conteo de notas
3. Tests de Controladores Web
   GET /actividades/evaluaciones: Renderizado de página de evaluaciones
4. Tests de API REST
   GET /actividades/api/terminadas: Obtener actividades terminadas
   POST /actividades/api/notas: Agregar notas con validaciones
   GET /actividades/api/{id}/promedio: Calcular promedios
5. Tests de Integración
   Flujo completo: Obtener actividades → Agregar notas → Calcular promedio
   Validación de datos: Manejo de errores y casos edge
   Casos de Test Cubiertos
   Validaciones de Notas
   - Notas válidas (1-7)
   - Notas inválidas (fuera del rango)
   - Actividad no encontrada
   - Actividad no terminada
   Cálculo de Promedios
   - Promedio con múltiples notas
   - Sin notas (promedio = "-")
   - Conteo correcto de notas
   API REST
   - Respuestas JSON correctas
   - Códigos de estado HTTP apropiados
   - Manejo de errores 400/500

### En paralelo a la implementación de Spring Boot

Tenedremos la app en Flask igualmente en el repositorio

## Implementación Flask 

**Ubicación:** `desarrollo_web_daniel_valenzuela/app/`

**Puerto:** `http://127.0.0.1:5000/`

```bash
# Ejecutar Flask en consola 
export FLASK_APP=app.py
flask run
```

Alternativamente
```bash
# Ejecutar Flask
$env:FLASK_APP="app.app:app"
flask run
```