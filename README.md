# desarrollo_web_daniel_valenzuela

## CC5002 - Tarea 3

# Gestión de Actividades Recreativas: API Comentarios y Estadísticas

## Funcionalidades de Estadísticas

## Ejecución de la aplicación

Para correr flask, por temas de tiempo y problemas en la estructura de las carpetas, correr el siguiente comando en 
el virtual environment:
```
$env:FLASK_APP="app.app:app"
flask run
```

## Estructura implementada en la tarea 4

```
src/
├── main/
│   ├── java/com/actividad/
│   │   ├── controller/
│   │   │   └── ActividadController.java
│   │   ├── dto/
│   │   │   └── ActividadConNotaDTO.java
│   │   ├── model/
│   │   │   ├── Actividad.java
│   │   │   └── Nota.java
│   │   ├── repository/
│   │   │   ├── ActividadRepository.java
│   │   │   └── NotaRepository.java
│   │   └── ActividadApplication.java
│   └── resources/
│       └── application.properties
```


## Características principales