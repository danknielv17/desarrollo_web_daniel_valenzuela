// ===== VALIDACIONES DEL FORMULARIO =====

/**
 * Valida el formato de teléfono móvil
 * @param {string} telefono - Número de teléfono en formato +NNN.NNNNNNNN
 * @returns {boolean} - true si el formato es válido, false en caso contrario
 */
function validarTelefono(telefono) {
    const regex = /^\+[0-9]{3}\.[0-9]{8}$/;
    return regex.test(telefono);
}

/**
 * Valida que la fecha de término sea posterior a la fecha de inicio
 * @param {string} inicio - Fecha y hora de inicio en formato ISO
 * @param {string} termino - Fecha y hora de término en formato ISO
 * @returns {boolean} - true si el término es posterior al inicio, false en caso contrario
 */
function validarFechas(inicio, termino) {
    // Si no hay fecha de término, no validamos
    if (!termino) return true;

    const fechaInicio = new Date(inicio);
    const fechaTermino = new Date(termino);

    return fechaTermino > fechaInicio;
}

/**
 * Valida que el sector especificado tenga un mínimo de caracteres
 * @param {string} sector - Sector de la actividad
 * @returns {boolean} - true si el sector es válido
 */
function validarSector(sector) {
    return sector && sector.trim().length >= 5;
}

// Exportamos las funciones para usarlas en script.js
const validacion = {
    validarTelefono,
    validarFechas,
    validarSector
};