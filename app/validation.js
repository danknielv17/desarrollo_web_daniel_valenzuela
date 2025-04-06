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
function validarRangoFechas(inicio, termino) {
    return new Date(inicio) < new Date(termino);
}

// Validar longitud de texto
function validarLongitud(texto, min, max) {
    return texto.length >= min && texto.length <= max;
}

// Validar que la cantidad de fotos no supere el máximo
function validarCantidadFotos(inputFiles, maxFotos = 5) {
    return inputFiles.length <= maxFotos;
}

<!-- Exportamos las funciones para usarlas en script.js
const validacion = {
    validarTelefono,
    validarFechas,
    validarSector
}; -->