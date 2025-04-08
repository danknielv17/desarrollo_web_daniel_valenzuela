// ===== VALIDACIONES DEL FORMULARIO =====

/**
 * Valida el nombre del organizador obligatorio
 * @param {string} nombre - Nombre a validar
 * @returns {boolean} - true si el nombre es válido, false en caso contrario
 */
function validarNombre(nombre) {
    // Verificamos que el nombre exista
    if (!nombre) return false;

    // Verificamos longitud mínima después de eliminar espacios extras
    const nombreLimpio = nombre.trim();
    const longitudMinima = 3;
    // Verificamos longitud máxima
    const longitudMaxima = 200;
    const longitudValida = nombreLimpio.length >= longitudMinima && nombreLimpio.length <= longitudMaxima;

    // Expresión regular para validar caracteres permitidos (letras, espacios y acentos)
    const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
    const formatoValido = regex.test(nombreLimpio);

    // El nombre es válido si cumple ambas condiciones
    return longitudValida && formatoValido;
}

/**
 * Valida el formato de una dirección de correo electrónico obligatorio
 * @param {string} email - Dirección de correo electrónico a validar
 * @returns {boolean} - true si el formato es válido, false en caso contrario
 */
function validarEmail(email) {
    // Verificamos que el email exista
    if (!email) return false;

    // Verificamos una longitud mínima razonable (usuario@dom.in = 10 chars)
    const longitudMinima = 6;
    // Verificamos longitud máxima
    const longitudMaxima = 100;
    const longitudValida = email.length >= longitudMinima && email.length <= longitudMaxima;

    // Expresión regular mejorada que permite:
    // - Caracteres alfanuméricos, puntos, guiones y subrayados en la parte local
    // - Dominios de 2 a 6 caracteres (.com, .co, .info, etc.)
    const regex = /^[\w.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
    const formatoValido = regex.test(email);

    // Devolvemos true solo si cumple ambas condiciones
    return longitudValida && formatoValido;
}

/**
 * Valida el formato de teléfono móvil, no es obligatorio
 * @param {string} telefono - Número de teléfono en formato +NNN.NNNNNNNN
 * @returns {boolean} - true si el formato es válido, false en caso contrario
 */
function validarTelefono(telefono) {
    const regex = /^\+[0-9]{3}\.[0-9]{8}$/;
    return regex.test(telefono);
}

/**
 * Valida que una fecha exista y tenga el formato correcto (YYYY-MM-DD HH:MM) obligatorio
 * @param {string} fecha - Fecha a validar
 * @returns {boolean} - true si la fecha tiene un formato válido, false en caso contrario
 */
function validarFormatoFecha(fecha) {
    // Verificar que la fecha existe
    if (!fecha) return false;

    // Expresión para el formato YYYY-MM-DD HH:MM
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

    // Verificar el formato
    if (!regex.test(fecha)) return false;

    // Verificar que la fecha es válida usando Date
    const dateObj = new Date(fecha);
    return !isNaN(dateObj.getTime());
}

/**
 * Valida que la fecha de término sea posterior a la fecha de inicio obligatorio
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
 * Valida la cantidad de fotos seleccionadas en los inputs de tipo file obligatorio
 * @param {NodeList|HTMLCollection} inputFiles - Colección de elementos input file
 * @param {number} minFotos - Cantidad mínima de fotos requerida (por defecto: 1)
 * @param {number} maxFotos - Cantidad máxima de fotos permitida (por defecto: 5)
 * @returns {boolean} - true si la cantidad está dentro del rango permitido
 */
function validarCantidadFotos(inputFiles, minFotos = 1, maxFotos = 5) {
    let fotosSeleccionadas = 0;

    // Contar archivos seleccionados
    for (const input of inputFiles) {
        if (input.files && input.files.length > 0) {
            fotosSeleccionadas++;
        }
    }

    return fotosSeleccionadas >= minFotos && fotosSeleccionadas <= maxFotos;
}

// Disponible las funciones globalmente
window.validarNombre = validarNombre;
window.validarEmail = validarEmail;
window.validarTelefono = validarTelefono;
window.validarFormatoFecha = validarFormatoFecha;
window.validarRangoFechas = validarRangoFechas;
window.validarLongitud = validarLongitud;
window.validarCantidadFotos = validarCantidadFotos;