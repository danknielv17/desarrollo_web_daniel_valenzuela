import re
import filetype

def validate_name (value):
    return value and len(value) > 3

def validate_email (value):
    return "@" in value

