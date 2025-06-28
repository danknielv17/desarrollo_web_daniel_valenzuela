// Funcionalidad JavaScript para la página de evaluaciones de actividades

// Variables globales
let actividadActual = null;
let nombreActividadActual = '';

/**
 * Función para inicializar la funcionalidad de evaluación de una actividad
 * @param {number} actividadId - ID de la actividad a evaluar
 * @param {string} nombreActividad - Nombre de la actividad
 */
function evaluarActividad(actividadId, nombreActividad) {
    actividadActual = actividadId;
    nombreActividadActual = nombreActividad;

    // Actualizar el contenido del modal
    document.getElementById('nombreActividad').textContent = `Evaluando: ${nombreActividad}`;
    document.getElementById('selectNota').value = '';
    document.getElementById('mensajeError').classList.add('d-none');

    // Mostrar el modal
    document.getElementById('modalEvaluacion').classList.add('show');
}

/**
 * Función para cerrar el modal de evaluación
 */
function cerrarModal() {
    document.getElementById('modalEvaluacion').classList.remove('show');
}

/**
 * Función para actualizar la nota en la tabla después de agregarla
 * @param {number} actividadId - ID de la actividad
 * @param {string} nuevaNota - Nueva nota promedio calculada
 */
function actualizarNotaEnTabla(actividadId, nuevaNota) {
    const celdaNota = document.querySelector(`td[data-actividad-id="${actividadId}"]`);
    if (celdaNota) {
        celdaNota.textContent = nuevaNota;
        // Añadir efecto visual de actualización
        celdaNota.style.backgroundColor = '#dff0d8';
        setTimeout(() => {
            celdaNota.style.backgroundColor = '';
        }, 2000);
    }
}

/**
 * Función para mostrar mensajes de error en el modal
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(mensaje) {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.textContent = mensaje;
    mensajeError.classList.remove('d-none');
}

/**
 * Función para mostrar mensajes de éxito temporales
 * @param {string} mensaje - Mensaje de éxito a mostrar
 */
function mostrarMensajeExito(mensaje) {
    // Crear y mostrar una alerta de éxito temporal
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success position-fixed';
    alerta.innerHTML = `${mensaje}`;

    document.body.appendChild(alerta);

    // Remover la alerta después de 3 segundos
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 3000);
}

/**
 * Función para enviar la nota al servidor de forma asíncrona
 * @param {number} actividadId - ID de la actividad
 * @param {number} nota - Nota a enviar (1-7)
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
async function enviarNota(actividadId, nota) {
    const response = await fetch(`/api/actividades/${actividadId}/notas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nota: nota
        })
    });

    return response.json();
}

/**
 * Función para validar que la nota esté en el rango correcto
 * @param {string} nota - Valor de la nota a validar
 * @returns {boolean} - True si la nota es válida, false en caso contrario
 */
function validarNota(nota) {
    if (!nota) {
        mostrarError('Por favor selecciona una nota');
        return false;
    }

    const notaNum = parseInt(nota);
    if (notaNum < 1 || notaNum > 7) {
        mostrarError('La nota debe estar entre 1 y 7');
        return false;
    }

    return true;
}

/**
 * Función para manejar el proceso completo de confirmación de nota
 */
async function confirmarNota() {
    const btnConfirmar = document.getElementById('btnConfirmarNota');
    const nota = document.getElementById('selectNota').value;

    // Validar la nota
    if (!validarNota(nota)) {
        return;
    }

    const notaNum = parseInt(nota);

    // Deshabilitar el botón mientras se procesa
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Procesando...';

    try {
        // Enviar la nota al servidor
        const data = await enviarNota(actividadActual, notaNum);

        if (data.success) {
            // Actualizar la nota en la tabla
            actualizarNotaEnTabla(actividadActual, data.promedio);

            // Cerrar el modal
            cerrarModal();

            // Mostrar mensaje de éxito
            mostrarMensajeExito('Nota agregada exitosamente');
        } else {
            mostrarError(data.error || 'Error al agregar la nota');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión. Intenta nuevamente.');
    } finally {
        // Rehabilitar el botón
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = 'Confirmar Nota';
    }
}

/**
 * Función para limpiar errores cuando cambia la selección
 */
function limpiarErrores() {
    document.getElementById('mensajeError').classList.add('d-none');
}

/**
 * Función para manejar clics fuera del modal (cerrar modal)
 * @param {Event} event - Evento de clic
 */
function manejarClicModal(event) {
    const modal = document.getElementById('modalEvaluacion');
    if (event.target === modal) {
        cerrarModal();
    }
}

/**
 * Función de inicialización que se ejecuta cuando el DOM está listo
 */
function inicializarEvaluaciones() {
    // Event listeners
    const btnConfirmarNota = document.getElementById('btnConfirmarNota');
    if (btnConfirmarNota) {
        btnConfirmarNota.addEventListener('click', confirmarNota);
    }

    const selectNota = document.getElementById('selectNota');
    if (selectNota) {
        selectNota.addEventListener('change', limpiarErrores);
    }

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener('click', manejarClicModal);

    // Manejar tecla Escape para cerrar modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            cerrarModal();
        }
    });

    console.log('Sistema de evaluaciones inicializado correctamente');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarEvaluaciones);
