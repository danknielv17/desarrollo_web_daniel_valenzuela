import re
import filetype

def validar_nombre (value):
    return value and len(value) > 3

def validar_email (value):
    return "@" in value

def validar_telefono (value):
    return re.match(r'^\d{10}$', value) is not None
