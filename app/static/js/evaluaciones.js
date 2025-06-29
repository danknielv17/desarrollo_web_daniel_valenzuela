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
    mostrarModal();
}

/**
 * Función para mostrar el modal de evaluación
 */
function mostrarModal() {
    const modal = document.getElementById('modalEvaluacion');
    const overlay = document.getElementById('modalOverlay');
    
    modal.style.display = 'block';
    overlay.style.display = 'block';
    
    // Agregar clase para animación
    setTimeout(() => {
        modal.classList.add('show');
        overlay.classList.add('show');
    }, 10);
}

/**
 * Función para cerrar el modal de evaluación
 */
function cerrarModal() {
    const modal = document.getElementById('modalEvaluacion');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.remove('show');
    overlay.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }, 300);
    
    // Limpiar variables
    actividadActual = null;
    nombreActividadActual = '';
}

/**
 * Función para confirmar y enviar la evaluación
 */
function confirmarEvaluacion() {
    const selectNota = document.getElementById('selectNota');
    const mensajeError = document.getElementById('mensajeError');
    
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
    
    // Deshabilitar botones durante el envío
    const btnConfirmar = document.querySelector('.btn-confirmar');
    const btnCancelar = document.querySelector('.btn-cancelar');
    
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Enviando...';
    btnCancelar.disabled = true;
    
    // Enviar la evaluación
    enviarEvaluacion(actividadActual, nota);
}

/**
 * Función para enviar la evaluación de forma asíncrona
 * @param {number} actividadId - ID de la actividad
 * @param {number} nota - Nota a asignar (1-7)
 */
function enviarEvaluacion(actividadId, nota) {
    const url = `/api/actividades/${actividadId}/notas`;
    
    const datos = {
        nota: nota
    };
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Error del servidor');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Actualizar la nota en la tabla
            actualizarNotaEnTabla(actividadId, data.promedio);
            
            // Mostrar mensaje de éxito
            mostrarMensajeExito('Evaluación enviada exitosamente');
            
            // Cerrar modal
            cerrarModal();
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    })
    .catch(error => {
        console.error('Error al enviar evaluación:', error);
        mostrarError(`Error de conexión: ${error.message}`);
    })
    .finally(() => {
        // Rehabilitar botones
        const btnConfirmar = document.querySelector('.btn-confirmar');
        const btnCancelar = document.querySelector('.btn-cancelar');
        
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = 'Evaluar';
        btnCancelar.disabled = false;
    });
}

/**
 * Función para actualizar la nota promedio en la tabla
 * @param {number} actividadId - ID de la actividad
 * @param {string} nuevoPromedio - Nuevo promedio calculado
 */
function actualizarNotaEnTabla(actividadId, nuevoPromedio) {
    const celdaNota = document.getElementById(`nota-${actividadId}`);
    if (celdaNota) {
        celdaNota.textContent = nuevoPromedio;
        
        // Agregar efecto visual de actualización
        celdaNota.classList.add('actualizada');
        setTimeout(() => {
            celdaNota.classList.remove('actualizada');
        }, 2000);
    }
}

/**
 * Función para mostrar mensajes de error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(mensaje) {
    const mensajeError = document.getElementById('mensajeError');
    mensajeError.textContent = mensaje;
    mensajeError.classList.remove('d-none');
    mensajeError.classList.add('error');
}

/**
 * Función para mostrar mensajes de éxito
 * @param {string} mensaje - Mensaje de éxito a mostrar
 */
function mostrarMensajeExito(mensaje) {
    // Crear elemento de mensaje temporal
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje-exito';
    mensajeDiv.textContent = mensaje;
    
    // Agregar al body
    document.body.appendChild(mensajeDiv);
    
    // Mostrar con animación
    setTimeout(() => {
        mensajeDiv.classList.add('show');
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        mensajeDiv.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 300);
    }, 3000);
}

/**
 * Función para manejar el cierre del modal con tecla Escape
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});

/**
 * Función para inicializar eventos cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de evaluaciones cargado correctamente');
    
    // Verificar que los elementos necesarios existen
    const modal = document.getElementById('modalEvaluacion');
    const overlay = document.getElementById('modalOverlay');
    
    if (!modal || !overlay) {
        console.error('Elementos del modal no encontrados');
        return;
    }
    
    // Agregar eventos adicionales si es necesario
    const selectNota = document.getElementById('selectNota');
    if (selectNota) {
        selectNota.addEventListener('change', function() {
            // Ocultar mensaje de error cuando se selecciona una nota
            const mensajeError = document.getElementById('mensajeError');
            if (mensajeError) {
                mensajeError.classList.add('d-none');
            }
        });
    }
});
