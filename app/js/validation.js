// ===== VALIDACIONES DEL FORMULARIO =====

/**
 * Valida el nombre del organizador
 * @param {string} nombre - Nombre a validar
 * @returns {boolean} - true si el nombre es válido, false en caso contrario
 */
function validarNombre(nombre) {
    // Verificamos que el nombre exista
    if (!nombre) return false;

    // Verificamos longitud mínima después de eliminar espacios extras
    const nombreLimpio = nombre.trim();
    const longitudValida = nombreLimpio.length >= 4;

    // Expresión regular para validar caracteres permitidos (letras, espacios y acentos)
    const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
    const formatoValido = regex.test(nombreLimpio);

    // El nombre es válido si cumple ambas condiciones
    return longitudValida && formatoValido;
}

// Reemplazamos la referencia global
window.validarNombre = validarNombre;

validateName = (name) => {
    if(!name) return false;
    let lengthValid = name.trim().length >= 4;

    return lengthValid;
}
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

/**
 * Valida la longitud de un texto
 * @param {string} texto - Texto a validar
 * @param {number} min - Longitud mínima permitida
 * @param {number} max - Longitud máxima permitida
 * @returns {boolean} - true si la longitud está dentro del rango, false en caso contrario
 */
function validarLongitud(texto, min, max) {
    return texto.length >= min && texto.length <= max;
}

/**
 * Valida la cantidad de fotos seleccionadas
 * @param inputFiles
 * @param maxFotos
 * @returns {boolean}
 */
function validarCantidadFotos(inputFiles, maxFotos = 5) {
    return inputFiles.length <= maxFotos;
}

/**
 * Valida el formato de una dirección de correo electrónico
 * @param {string} email - Dirección de correo electrónico a validar
 * @returns {boolean} - true si el formato es válido, false en caso contrario
 */
function validarEmail(email) {
    // Verificamos que el email exista
    if (!email) return false;

    // Verificamos una longitud mínima razonable (usuario@dom.in = 10 chars)
    const longitudMinima = 6;
    const longitudValida = email.length >= longitudMinima;

    // Expresión regular mejorada que permite:
    // - Caracteres alfanuméricos, puntos, guiones y subrayados en la parte local
    // - Dominios de 2 a 6 caracteres (.com, .co, .info, etc.)
    const regex = /^[\w.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
    const formatoValido = regex.test(email);

    // Devolvemos true solo si cumple ambas condiciones
    return longitudValida && formatoValido;
}

// Disponible las funciones globalmente
window.validarNombre = validarNombre;
window.validarTelefono = validarTelefono;
window.validarRangoFechas = validarRangoFechas;
window.validarLongitud = validarLongitud;
window.validarCantidadFotos = validarCantidadFotos;
window.validarEmail = validarEmail;