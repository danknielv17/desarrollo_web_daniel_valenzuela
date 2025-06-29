// Sistema de evaluación de actividades - Spring Boot
// Funcionalidad asíncrona con JavaScript

// Variables globales
let actividadActual = null;
let nombreActividadActual = '';
let modalEvaluacion = null;

/**
 * Función para evaluar una actividad
 */
function evaluarActividad(actividadId, nombreActividad) {
    console.log(`Evaluando actividad ${actividadId}: ${nombreActividad}`);

    actividadActual = actividadId;
    nombreActividadActual = nombreActividad;

    // Actualizar el contenido del modal
    const nombreActividadElement = document.getElementById('nombreActividad');
    if (nombreActividadElement) {
        nombreActividadElement.innerHTML = `<strong>Evaluando:</strong> ${nombreActividad}`;
    }

    // Limpiar selección de nota
    const selectNota = document.getElementById('selectNota');
    if (selectNota) {
        selectNota.value = '';
    }

    // Ocultar mensaje de error
    const mensajeError = document.getElementById('mensajeError');
    if (mensajeError) {
        mensajeError.classList.add('d-none');
    }

    // Mostrar modal usando Bootstrap
    if (modalEvaluacion) {
        modalEvaluacion.show();
    }
}

/**
 * Confirmar y enviar la evaluación
 */
function confirmarEvaluacion() {
    console.log('Confirmando evaluación...');

    const selectNota = document.getElementById('selectNota');

    if (!selectNota) {
        console.error('Elemento selectNota no encontrado');
        return;
    }

    // Validar que se haya seleccionado una nota
    if (!selectNota.value) {
        mostrarError('Por favor selecciona una nota del 1 al 7');
        return;
    }

    const nota = parseInt(selectNota.value);

    // Validar rango de nota
    if (nota < 1 || nota > 7) {
        mostrarError('La nota debe estar entre 1 y 7');
        return;
    }

    // Deshabilitar botón durante el envío
    const btnConfirmar = document.getElementById('btnConfirmarNota');
    if (btnConfirmar) {
        const estadoOriginal = btnConfirmar.textContent;
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'Enviando...';

        // Enviar la evaluación
        enviarEvaluacion(actividadActual, nota)
            .finally(() => {
                // Restaurar botón siempre
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = estadoOriginal;
            });
    }
}

/**
 * Enviar evaluación al servidor usando fetch API
 */
async function enviarEvaluacion(actividadId, nota) {
    try {
        console.log(`Enviando nota ${nota} para actividad ${actividadId}`);

        const url = '/actividades/api/notas';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                actividadId: actividadId,
                nota: nota
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
        }

        if (data.success) {
            console.log('Evaluación enviada exitosamente');

            // Actualizar la nota en la tabla
            actualizarNotaEnTabla(actividadId, data.promedio);

            // Mostrar mensaje de éxito
            mostrarMensajeExito('¡Evaluación enviada exitosamente!');

            // Cerrar modal
            if (modalEvaluacion) {
                modalEvaluacion.hide();
            }
        } else {
            throw new Error(data.error || 'Error desconocido');
        }

    } catch (error) {
        console.error('Error al enviar evaluación:', error);
        mostrarError(`Error: ${error.message}`);
    }
}

/**
 * Actualizar la nota en la tabla
 */
function actualizarNotaEnTabla(actividadId, nuevoPromedio) {
    const celdaNota = document.querySelector(`td.nota-promedio[data-actividad-id="${actividadId}"]`);
    if (celdaNota) {
        const valorAnterior = celdaNota.textContent;
        celdaNota.textContent = nuevoPromedio;

        // Efecto visual de actualización
        celdaNota.style.backgroundColor = '#d4edda';
        celdaNota.style.color = '#155724';
        celdaNota.style.fontWeight = 'bold';

        setTimeout(() => {
            celdaNota.style.backgroundColor = '';
            celdaNota.style.color = '';
            celdaNota.style.fontWeight = '';
        }, 2000);

        console.log(`Nota actualizada para actividad ${actividadId}: ${valorAnterior} → ${nuevoPromedio}`);
    } else {
        console.error(`No se encontró la celda de nota para actividad ${actividadId}`);
    }
}

/**
 * Mostrar mensaje de error en el modal
 */
function mostrarError(mensaje) {
    const mensajeError = document.getElementById('mensajeError');
    if (mensajeError) {
        mensajeError.textContent = mensaje;
        mensajeError.classList.remove('d-none');
    } else {
        console.error('Elemento mensajeError no encontrado');
        alert(mensaje); // Fallback
    }
}

/**
 * Mostrar mensaje de éxito temporal usando Toast de Bootstrap
 */
function mostrarMensajeExito(mensaje) {
    // Crear toast dinámicamente
    const toastContainer = getOrCreateToastContainer();

    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>¡Éxito!</strong> ${mensaje}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    // Mostrar el toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    toast.show();

    // Remover el elemento después de que se oculte
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

/**
 * Obtener o crear el contenedor de toasts
 */
function getOrCreateToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Configurar eventos cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de evaluaciones Spring Boot cargado');

    // Inicializar modal de Bootstrap
    const modalElement = document.getElementById('modalEvaluacion');
    if (modalElement) {
        modalEvaluacion = new bootstrap.Modal(modalElement);
        console.log('Modal de evaluación inicializado');
    } else {
        console.error('Modal de evaluación no encontrado');
    }

    // Configurar el botón de confirmar nota
    const btnConfirmar = document.getElementById('btnConfirmarNota');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', confirmarEvaluacion);
        console.log('Evento click agregado al botón confirmar');
    } else {
        console.error('Botón btnConfirmarNota no encontrado');
    }

    // Configurar el select de nota para ocultar errores
    const selectNota = document.getElementById('selectNota');
    if (selectNota) {
        selectNota.addEventListener('change', function() {
            const mensajeError = document.getElementById('mensajeError');
            if (mensajeError) {
                mensajeError.classList.add('d-none');
            }
        });
        console.log('Evento change agregado al select de notas');
    } else {
        console.error('Select de notas no encontrado');
    }

    // Verificar si hay actividades para evaluar
    const tabla = document.getElementById('tablaActividades');
    if (tabla) {
        const filas = tabla.querySelectorAll('tbody tr');
        console.log(`Actividades disponibles para evaluar: ${filas.length}`);

        // Verificar que los botones evaluar existen
        const botonesEvaluar = document.querySelectorAll('.btn-evaluar');
        console.log(`Botones evaluar encontrados: ${botonesEvaluar.length}`);
    } else {
        console.log('Tabla de actividades no encontrada - posiblemente no hay actividades para evaluar');
    }

    // Limpiar variables cuando se cierra el modal
    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', function() {
            actividadActual = null;
            nombreActividadActual = '';

            // Limpiar formulario
            const selectNota = document.getElementById('selectNota');
            if (selectNota) {
                selectNota.value = '';
            }

            // Ocultar mensajes de error
            const mensajeError = document.getElementById('mensajeError');
            if (mensajeError) {
                mensajeError.classList.add('d-none');
            }
        });
    }
});

/**
 * Función auxiliar para actualizar todas las notas (por si se necesita)
 */
async function actualizarTodasLasNotas() {
    try {
        const response = await fetch('/actividades/api/terminadas');
        const actividades = await response.json();

        actividades.forEach(actividad => {
            const celdaNota = document.querySelector(`td.nota-promedio[data-actividad-id="${actividad.id}"]`);
            if (celdaNota) {
                celdaNota.textContent = actividad.notaPromedio;
            }
        });

        console.log('Todas las notas actualizadas');
    } catch (error) {
        console.error('Error al actualizar notas:', error);
    }
}
