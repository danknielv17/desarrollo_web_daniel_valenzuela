# desarrollo_web_daniel_valenzuela

## CC5002 - Tareas 1-4

# Gestión de Actividades Recreativas

Este proyecto contiene **dos implementaciones** del sistema de gestión de actividades recreativas:

## 🐍 Implementación Flask (Tareas 1-3)

**Ubicación:** `/app/`
**Puerto:** `http://localhost:5000`

```bash
# Ejecutar Flask
cd app
python app.py
```

### Funcionalidades Flask:
- ✅ Agregar actividades recreativas
- ✅ Listado de actividades con filtros
- ✅ Visualización de estadísticas
- ✅ Sistema de comentarios
- ✅ Sistema de evaluaciones (1-7)

---

## ☕ Implementación Spring Boot (Tarea 4)

**Ubicación:** `/src/`
**Puerto:** `http://localhost:8080`

```bash
# Ejecutar Spring Boot
mvn spring-boot:run
```

### Funcionalidades Spring Boot:
- ✅ **Sistema de evaluación de actividades** (Tarea 4)
- ✅ Evaluación asíncrona con JavaScript
- ✅ Cálculo automático de promedios
- ✅ Interfaz responsiva con Bootstrap 5

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
