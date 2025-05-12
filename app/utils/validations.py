import re
import filetype

def validar_nombre (value):
    return value and len(value) > 3

def validar_email(value):
    pattern = r'^[\w.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$'
    return re.match(pattern, value) is not None

def validar_telefono (value):
    return re.match(r'^\d{10}$', value) is not None
