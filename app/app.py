from flask import Flask, render_template, request, redirect, url_for, flash
from utils.validations import validar_nombre, validar_email, validar_telefono
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
import pymysql
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'clave_flask'

# Configuración de SQLAlchemy (ajusta usuario y clave)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://tu_usuario:tu_contraseña@localhost/tarea2db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Configuración de subida de archivos
UPLOAD_FOLDER = os.path.join('static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Configuración de conexión a MySQL
def get_connection():
    return pymysql.connect(
        host='localhost',
        user='tu_usuario',
        password='tu_contraseña',
        db='tarea2db',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ========== RUTA PORTADA ==========
@app.route('/')
def portada():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM actividad ORDER BY fecha_creacion DESC LIMIT 5")
            actividades = cursor.fetchall()
    finally:
        connection.close()
    return render_template('index.html', actividades=actividades)

# ========== RUTA AGREGAR ACTIVIDAD ==========
@app.route('/agregar', methods=['GET', 'POST'])
def agregar():
    if request.method == 'GET':
        return render_template('agregar.html')

    errores = []
    datos = request.form

    # Validaciones básicas
    if not datos.get('nombre-organizador') or len(datos['nombre-organizador']) < 3:
        errores.append('El nombre del organizador es obligatorio.')
    if not datos.get('email-organizador'):
        errores.append('El email es obligatorio.')
    if not datos.get('inicio-actividad'):
        errores.append('Debe indicar una fecha de inicio.')

    if errores:
        flash('\n'.join(errores), 'error')
        return render_template('agregar.html', datos=datos)

    # Inserción
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            # 1. Insertar actividad
            cursor.execute("""
                INSERT INTO actividad (inicio, termino, comuna, sector, descripcion, nombre_organizador, email_organizador, telefono_organizador)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                datos['inicio-actividad'],
                datos.get('termino-actividad') or None,
                datos['comuna'],
                datos['sector'],
                datos.get('descripcion-actividad', ''),
                datos['nombre-organizador'],
                datos['email-organizador'],
                datos.get('telefono-organizador')
            ))
            actividad_id = connection.insert_id()

            # 2. Insertar tema
            tema = datos['tema-actividad']
            if tema == 'otro':
                tema = datos['otro-tema']
            cursor.execute("INSERT INTO actividad_tema (actividad_id, tema) VALUES (%s, %s)", (actividad_id, tema))

            # 3. Insertar contacto
            red = datos.get('contactar-por')
            contacto = datos.get('otro-contacto')
            if red and contacto:
                cursor.execute("INSERT INTO contactar_por (actividad_id, red_social, valor) VALUES (%s, %s, %s)",
                               (actividad_id, red, contacto))

            # 4. Subida de archivos
            fotos = request.files.getlist('foto-actividad[]')
            for archivo in fotos:
                if archivo and allowed_file(archivo.filename):
                    filename = secure_filename(archivo.filename)
                    ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    archivo.save(ruta)
                    cursor.execute("INSERT INTO archivo (actividad_id, nombre, ruta) VALUES (%s, %s, %s)",
                                   (actividad_id, filename, ruta))

        connection.commit()
        flash('Actividad registrada correctamente.', 'success')
        return redirect(url_for('portada'))

    except Exception as e:
        connection.rollback()
        flash(f'Error al registrar: {str(e)}', 'error')
        return render_template('agregar.html', datos=datos)
    finally:
        connection.close()
        return None

# ========== RUTA LISTADO ==========
@app.route('/listado')
def listado():
    page = int(request.args.get('page', 1))
    por_pagina = 5
    offset = (page - 1) * por_pagina

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM actividad ORDER BY inicio DESC LIMIT %s OFFSET %s", (por_pagina, offset))
            actividades = cursor.fetchall()

            cursor.execute("SELECT COUNT(*) AS total FROM actividad")
            total = cursor.fetchone()['total']
            total_paginas = (total + por_pagina - 1) // por_pagina
    finally:
        connection.close()

    return render_template('listado.html',
                           actividades=actividades,
                           pagina_actual=page,
                           total_paginas=total_paginas)

# ========== RUTA DETALLE ==========
@app.route('/actividad/<int:id>')
def detalle_actividad(id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM actividad WHERE id = %s", (id,))
            actividad = cursor.fetchone()
            if not actividad:
                return "Actividad no encontrada", 404

            cursor.execute("SELECT tema FROM actividad_tema WHERE actividad_id = %s", (id,))
            temas = [t['tema'] for t in cursor.fetchall()]

            cursor.execute("SELECT red_social, valor FROM contactar_por WHERE actividad_id = %s", (id,))
            contactos = cursor.fetchall()

            cursor.execute("SELECT nombre, ruta FROM archivo WHERE actividad_id = %s", (id,))
            archivos = cursor.fetchall()
    finally:
        connection.close()

    return render_template('detalle.html', actividad=actividad, temas=temas, contactos=contactos, archivos=archivos)

# ========= RUTA ESTADISTICAS ==========
@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')

# ========== MAIN ==========
if __name__ == '__main__':
    app.run(debug=True)
