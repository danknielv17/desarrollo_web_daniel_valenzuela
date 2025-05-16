import re
from datetime import datetime
import filetype

# ========== VALIDACIONES ==========
def validar_nombre (value):
    return value and len(value) > 3

def validar_email(value):
    pattern = r'^[\w.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$'
    return re.match(pattern, value) is not None

def validar_telefono(value):
    pattern = r'^\+\d{2,3}\.\d{8,9}$'
    return re.match(pattern, value) is not None

def validar_contactar_por(value):
    return value and 3 < len(value) < 50

def validar_formato_fecha(value):
    try:
        if not value:
            return False
        datetime.strptime(value, '%Y-%m-%dT%H:%M')
        return True
    except ValueError:
        return False

def validar_rango_fechas(inicio, termino):
    try:
        if not inicio or not termino:
            return False
        fecha_inicio = datetime.strptime(inicio, '%Y-%m-%dT%H:%M')
        fecha_termino = datetime.strptime(termino, '%Y-%m-%dT%H:%M')
        return fecha_inicio < fecha_termino
    except ValueError:
        return False

def validar_extension_archivo(filename):
    """Valida que la extensión del archivo sea permitida."""
    extensiones_permitidas = {'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensiones_permitidas