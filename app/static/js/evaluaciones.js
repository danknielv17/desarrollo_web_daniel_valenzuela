// Funcionalidad para evaluar actividades - VERSIÓN CORREGIDA

// Variables globales
let actividadActual = null;
let nombreActividadActual = '';

/**
 * Obtener el token CSRF del meta tag
 */
function getCSRFToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : null;
}

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

    // Mostrar modal
    mostrarModal();
}

/**
 * Mostrar el modal
 */
function mostrarModal() {
    const modal = document.getElementById('modalEvaluacion');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';

        // Agregar clase para animación
        setTimeout(() => {
            modal.classList.add('show');
            overlay.classList.add('show');
        }, 10);
    } else {
        console.error('Modal o overlay no encontrado');
    }
}

/**
 * Cerrar el modal
 */
function cerrarModal() {
    const modal = document.getElementById('modalEvaluacion');
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.remove('show');
        overlay.classList.remove('show');

        setTimeout(() => {
            modal.style.display = 'none';
            overlay.style.display = 'none';
        }, 300);
    }

    // Limpiar variables
    actividadActual = null;
    nombreActividadActual = '';
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
 * Enviar evaluación al servidor con token CSRF
 */
async function enviarEvaluacion(actividadId, nota) {
    try {
        console.log(`Enviando nota ${nota} para actividad ${actividadId}`);

        const csrfToken = getCSRFToken();

        if (!csrfToken) {
            throw new Error('Token CSRF no encontrado');
        }

        const url = `/api/actividades/${actividadId}/notas`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
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
            cerrarModal();
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
 * Mostrar mensaje de error
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
 * Mostrar mensaje de éxito temporal
 */
function mostrarMensajeExito(mensaje) {
    // Crear elemento de mensaje
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success mensaje-temporal';
    alertDiv.innerHTML = `<strong>¡Éxito!</strong> ${mensaje}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 15px;
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;

    // Insertar en el body
    document.body.appendChild(alertDiv);

    // Remover después de 3 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}

/**
 * Manejar tecla Escape para cerrar modal
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});

/**
 * Configurar eventos cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de evaluaciones cargado');

    // Verificar que el token CSRF está presente
    const csrfToken = getCSRFToken();
    if (!csrfToken) {
        console.error('ADVERTENCIA: Token CSRF no encontrado en la página');
    } else {
        console.log('Token CSRF encontrado correctamente');
    }

    // Configurar el botón de confirmar nota
    const btnConfirmar = document.getElementById('btnConfirmarNota');
    if (btnConfirmar) {
        // Remover eventos previos y agregar nuevo
        btnConfirmar.removeEventListener('click', confirmarEvaluacion);
        btnConfirmar.addEventListener('click', confirmarEvaluacion);
        console.log('Evento click agregado al botón confirmar');
    } else {
        console.error('Botón btnConfirmarNota no encontrado');
    }

    // Configurar botones de cancelar
    const btnsCancelar = document.querySelectorAll('.btn-secondary, .btn-close');
    btnsCancelar.forEach(btn => {
        btn.addEventListener('click', cerrarModal);
    });

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
});
