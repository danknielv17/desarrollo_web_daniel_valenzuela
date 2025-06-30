# desarrollo_web_daniel_valenzuela

## CC5002 - Tareas 1-4

# Gestión de Actividades Recreativas

Esta tarea contiene **dos implementaciones** del sistema de gestión de actividades recreativas:

## Estructura general del proyecto Flask y Spring Boot:
```
desarrollo_web_daniel_valenzuela/
├── README.md            # Documentación del proyecto
├── .mvn/wrapper/         # Wrapper de Maven
├── pom.xml               # Archivo de configuración de Maven
├── app/                  # Implementación Flask (Tareas 1-3)
│   ├── app.py            # Archivo principal de Flask
│   ├── requirements.txt  # Dependencias de Flask
│   ├── db/               # Base de datos
│   ├── static/           # Archivos estáticos (CSS, JS)
    ├── templates/        # Plantillas HTML
│   └── utils/            # Utilidades y funciones auxiliares
├── src/                  # Implementación Spring Boot (Tarea 4)
│   ├── src/              # Código fuente de Spring Boot
│   ├── main/             # Directorio principal de la aplicación
│   │   ├── java/         # Código Java
│   │   ├── resources/    # Recursos de la aplicación (templates, static)
│   └── test/             # Pruebas unitarias
```

## Implementación Spring Boot (Tarea 4)

**Ubicación:** `desarrollo_web_daniel_valenzuela/src/`
**Puerto:** `http://localhost:8080`

```bash
# Ejecutar Spring Boot
cd app # Cambiar al directorio de la aplicación Spring Boot
mvn spring-boot:run
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

### Tecnologías Utilizadas
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
2. **Evaluar asíncronamente**: Modal para seleccionar nota 1-7
3. **Actualización automática**: Promedio se actualiza sin recargar página
4. **Validación completa**: Frontend (JavaScript) y Backend (Spring Boot)

### Estructura de la Tabla de Evaluaciones
```
| ID | Fecha Inicio | Sector | Nombre | Tema | Nota | Acciones |
```
### En paralelo a la implementación de Spring Boot, tenedremos la app en Flask (Tarea 1-3) corriendo.

## Implementación Flask (Tareas 1-3)

**Ubicación:** `desarrollo_web_daniel_valenzuela/app/`
**Puerto:** `http://127.0.0.1:5000/`

```bash
# Ejecutar Flask en consola 
export FLASK_APP=app.py
flask run
```