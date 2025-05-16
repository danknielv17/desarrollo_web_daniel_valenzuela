import re
from datetime import datetime
import filetype


# ========== VALIDACIONES ==========

def validar_nombre(value):
    """
    Valida que el nombre del organizador sea válido.

    Args:
        value (str): Nombre a validar

    Returns:
        bool: True si el nombre existe y tiene más de 3 caracteres, False en caso contrario
    """
    return value and len(value) > 3


def validar_email(value):
    """
    Valida el formato de una dirección de correo electrónico.

    Args:
        value (str): Dirección de correo electrónico a validar

    Returns:
        bool: True si el formato es válido, False en caso contrario
    """
    pattern = r'^[\w.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$'
    return re.match(pattern, value) is not None


def validar_telefono(value):
    """
    Valida el formato de un número telefónico.

    Args:
        value (str): Número de teléfono en formato +NN.NNNNNNNN

    Returns:
        bool: True si el formato es válido, False en caso contrario
    """
    pattern = r'^\+\d{2,3}\.\d{8,9}$'
    return re.match(pattern, value) is not None


def validar_contactar_por(value):
    """
    Valida que el nombre del método de contacto tenga una longitud adecuada.

    Args:
        value (str): Nombre del método de contacto

    Returns:
        bool: True si existe y tiene entre 4 y 49 caracteres, False en caso contrario
    """
    return value and 3 < len(value) < 50


def validar_formato_fecha(value):
    """
    Valida que una fecha exista y tenga el formato correcto (YYYY-MM-DDTHH:MM).

    Args:
        value (str): Fecha a validar

    Returns:
        bool: True si la fecha tiene un formato válido, False en caso contrario
    """
    try:
        if not value:
            return False
        datetime.strptime(value, '%Y-%m-%dT%H:%M')
        return True
    except ValueError:
        return False


def validar_rango_fechas(inicio, termino):
    """
    Valida que la fecha de término sea posterior a la fecha de inicio.

    Args:
        inicio (str): Fecha y hora de inicio en formato YYYY-MM-DDTHH:MM
        termino (str): Fecha y hora de término en formato YYYY-MM-DDTHH:MM

    Returns:
        bool: True si el término es posterior al inicio, False en caso contrario
    """
    try:
        if not inicio or not termino:
            return False
        fecha_inicio = datetime.strptime(inicio, '%Y-%m-%dT%H:%M')
        fecha_termino = datetime.strptime(termino, '%Y-%m-%dT%H:%M')
        return fecha_inicio < fecha_termino
    except ValueError:
        return False


def validar_extension_archivo(filename):
    """
    Valida que la extensión del archivo sea una de las permitidas.

    Args:
        filename (str): Nombre del archivo a validar

    Returns:
        bool: True si la extensión es png, jpg o jpeg, False en caso contrario
    """
    extensiones_permitidas = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensiones_permitidas