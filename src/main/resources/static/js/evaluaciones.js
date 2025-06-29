// JavaScript para manejar las evaluaciones de actividades de forma asíncrona - SIN Bootstrap

let actividadActual = null;

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando evaluaciones...');

    // Event listener para el botón de confirmar nota
    const btnConfirmar = document.getElementById('btnConfirmarNota');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', enviarEvaluacion);
        console.log('Event listener agregado al botón confirmar');
    } else {
        console.error('No se encontró el botón btnConfirmarNota');
    }

    // Event listeners para cerrar modal con tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            cerrarModal();
        }
    });
});

// Función para abrir el modal de evaluación
function abrirModalEvaluacion(boton) {
    console.log('Abriendo modal de evaluación...');

    const actividadId = boton.getAttribute('data-actividad-id');
    const nombreActividad = boton.getAttribute('data-nombre');

    console.log('Actividad ID:', actividadId, 'Nombre:', nombreActividad);

    actividadActual = actividadId;

    // Actualizar el contenido del modal
    const nombreElement = document.getElementById('nombreActividad');
    if (nombreElement) {
        nombreElement.innerHTML = `Actividad: <span style="color: #3169bc;">${nombreActividad}</span>`;
    }

    // Limpiar formulario y errores
    limpiarModal();

    // Mostrar modal manualmente
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modalEvaluacion');

    if (modalOverlay && modal) {
        modalOverlay.style.display = 'block';
        modal.style.display = 'block';

        // Agregar clases para animación después de un pequeño delay
        setTimeout(() => {
            modalOverlay.classList.add('show');
            modal.classList.add('show');
        }, 10);

        console.log('Modal mostrado');
    } else {
        console.error('No se encontraron elementos del modal');
    }
}

// Función para cerrar el modal
function cerrarModal() {
    console.log('Cerrando modal...');

    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modalEvaluacion');

    if (modalOverlay && modal) {
        modalOverlay.classList.remove('show');
        modal.classList.remove('show');

        setTimeout(() => {
            modalOverlay.style.display = 'none';
            modal.style.display = 'none';
            actividadActual = null;
        }, 300);

        console.log('Modal cerrado');
    }
}

// Función para limpiar el modal
function limpiarModal() {
    const selectNota = document.getElementById('selectNota');
    if (selectNota) {
        selectNota.value = '';
    }

    ocultarError();
    habilitarBoton();
}

// Función para enviar la evaluación de forma asíncrona
function enviarEvaluacion() {
    console.log('Enviando evaluación...');

    const selectNota = document.getElementById('selectNota');
    if (!selectNota) {
        console.error('No se encontró el select de nota');
        return;
    }

    const nota = selectNota.value;

    // Limpiar mensajes de error previos
    ocultarError();

    // Validaciones del lado del cliente
    if (!nota) {
        mostrarError('Debe seleccionar una nota');
        return;
    }

    const notaInt = parseInt(nota);
    if (isNaN(notaInt) || notaInt < 1 || notaInt > 7) {
        mostrarError('La nota debe ser un número entre 1 y 7');
        return;
    }

    if (!actividadActual) {
        mostrarError('Error: No se ha seleccionado una actividad');
        return;
    }

    console.log('Enviando nota:', notaInt, 'para actividad:', actividadActual);

    // Deshabilitar botón para evitar envíos múltiples
    deshabilitarBoton();

    // Preparar datos para enviar
    const datos = {
        actividadId: parseInt(actividadActual),
        nota: notaInt
    };

    // Realizar petición asíncrona con fetch
    fetch('/actividades/api/notas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        console.log('Respuesta recibida:', response.status);
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Error en el servidor');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos:', data);
        if (data.success) {
            // Actualizar la nota en la tabla
            actualizarNotaEnTabla(actividadActual, data.promedio);

            // Mostrar mensaje de éxito
            mostrarMensajeExito('Evaluación agregada correctamente');

            // Cerrar modal
            cerrarModal();
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    })
    .catch(error => {
        console.error('Error al enviar evaluación:', error);
        mostrarError('Error al enviar la evaluación: ' + error.message);
    })
    .finally(() => {
        // Rehabilitar botón
        habilitarBoton();
    });
}

// Función para mostrar errores en el modal
function mostrarError(mensaje) {
    console.log('Mostrando error:', mensaje);

    const mensajeError = document.getElementById('mensajeError');
    const textoError = document.getElementById('textoError');

    if (mensajeError) {
        if (textoError) {
            textoError.textContent = mensaje;
        } else {
            mensajeError.innerHTML = mensaje;
        }
        mensajeError.classList.remove('d-none');
    } else {
        console.error('No se encontró el elemento de mensaje de error');
        alert(mensaje); // Fallback
    }
}

// Función para ocultar errores
function ocultarError() {
    const mensajeError = document.getElementById('mensajeError');
    if (mensajeError) {
        mensajeError.classList.add('d-none');
    }
}

// Función para deshabilitar el botón de confirmar
function deshabilitarBoton() {
    const btn = document.getElementById('btnConfirmarNota');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
    }
}

// Función para habilitar el botón de confirmar
function habilitarBoton() {
    const btn = document.getElementById('btnConfirmarNota');
    if (btn) {
        btn.disabled = false;
        btn.textContent = 'Confirmar Nota';
    }
}

// Función para actualizar la nota en la tabla
function actualizarNotaEnTabla(actividadId, nuevoPromedio) {
    console.log('Actualizando nota en tabla:', actividadId, nuevoPromedio);

    const celdaNota = document.querySelector(`td.nota-promedio[data-actividad-id="${actividadId}"]`);
    if (celdaNota) {
        celdaNota.textContent = nuevoPromedio;

        // Agregar efecto visual de actualización
        celdaNota.classList.add('actualizada');
        setTimeout(() => {
            celdaNota.classList.remove('actualizada');
        }, 2000);

        console.log('Nota actualizada en la tabla');
    } else {
        console.error('No se encontró la celda de nota para actualizar');
    }
}

// Función para mostrar mensaje de éxito flotante
function mostrarMensajeExito(mensaje) {
    console.log('Mostrando mensaje de éxito:', mensaje);

    // Crear elemento de mensaje si no existe
    let mensajeExito = document.getElementById('mensajeExito');
    if (!mensajeExito) {
        mensajeExito = document.createElement('div');
        mensajeExito.id = 'mensajeExito';
        mensajeExito.className = 'mensaje-exito';
        mensajeExito.innerHTML = '<p></p>';
        document.body.appendChild(mensajeExito);
    }

    const p = mensajeExito.querySelector('p');
    if (p) {
        p.textContent = mensaje;
    }

    mensajeExito.style.display = 'block';

    setTimeout(() => {
        mensajeExito.classList.add('show');
    }, 10);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        mensajeExito.classList.remove('show');
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 300);
    }, 3000);
}

// Función alternativa usando XMLHttpRequest
function enviarEvaluacionXHR() {
    const selectNota = document.getElementById('selectNota');
    if (!selectNota) return;

    const nota = selectNota.value;

    // Validaciones (mismas que en la función fetch)
    ocultarError();

    if (!nota) {
        mostrarError('Debe seleccionar una nota');
        return;
    }

    const notaInt = parseInt(nota);
    if (isNaN(notaInt) || notaInt < 1 || notaInt > 7) {
        mostrarError('La nota debe ser un número entre 1 y 7');
        return;
    }

    if (!actividadActual) {
        mostrarError('Error: No se ha seleccionado una actividad');
        return;
    }

    deshabilitarBoton();

    // Crear petición XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/actividades/api/notas', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            habilitarBoton();

            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        actualizarNotaEnTabla(actividadActual, data.promedio);
                        mostrarMensajeExito('Evaluación agregada correctamente');
                        cerrarModal();
                    } else {
                        mostrarError(data.error || 'Error desconocido');
                    }
                } catch (e) {
                    mostrarError('Error al procesar la respuesta del servidor');
                }
            } else {
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    mostrarError(errorData.error || 'Error en el servidor');
                } catch (e) {
                    mostrarError('Error de comunicación con el servidor');
                }
            }
        }
    };

    const datos = {
        actividadId: parseInt(actividadActual),
        nota: notaInt
    };

    xhr.send(JSON.stringify(datos));
}

// Funciones de utilidad para debugging
function logEstadoModal() {
    console.log('Estado del modal:', {
        actividad: actividadActual,
        modalVisible: document.getElementById('modalEvaluacion').style.display,
        notaSeleccionada: document.getElementById('selectNota')?.value
    });
}

function reiniciarComponentes() {
    actividadActual = null;
    limpiarModal();
    cerrarModal();
}
