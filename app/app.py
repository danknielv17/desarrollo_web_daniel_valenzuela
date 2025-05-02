from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from utils.validations import validar_nombre, validar_email, validar_telefono
from db.models import db, Actividad, ActividadTema, ContactarPor, Archivo

app = Flask(__name__)
app.secret_key = 'clave_flask'

# Configuración de SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:fox17@localhost/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Configuración para archivos
UPLOAD_FOLDER = os.path.join('static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ========== RUTA PORTADA ==========
@app.route('/')
def portada():
    actividades = Actividad.query.order_by(Actividad.fecha_creacion.desc()).limit(5).all()
    return render_template('index.html', actividades=actividades)

# ========== RUTA AGREGAR ==========
@app.route('/agregar', methods=['GET', 'POST'])
def agregar():
    if request.method == 'GET':
        return render_template('agregar.html')

    errores = []
    datos = request.form

    if not datos.get('nombre-organizador') or len(datos['nombre-organizador']) < 3:
        errores.append('El nombre del organizador es obligatorio.')
    if not datos.get('email-organizador'):
        errores.append('El email es obligatorio.')
    if not datos.get('inicio-actividad'):
        errores.append('Debe indicar una fecha de inicio.')

    if errores:
        flash('\n'.join(errores), 'error')
        return render_template('agregar.html', datos=datos)

    try:
        actividad = Actividad(
            inicio=datos['inicio-actividad'],
            termino=datos.get('termino-actividad') or None,
            comuna=datos['comuna'],
            sector=datos['sector'],
            descripcion=datos.get('descripcion-actividad', ''),
            nombre_organizador=datos['nombre-organizador'],
            email_organizador=datos['email-organizador'],
            telefono_organizador=datos.get('telefono-organizador'),
        )
        db.session.add(actividad)
        db.session.commit()

        # Tema
        tema = datos['tema-actividad']
        if tema == 'otro':
            tema = datos['otro-tema']
        db.session.add(ActividadTema(actividad_id=actividad.id, tema=tema))

        # Contacto
        red = datos.get('contactar-por')
        contacto = datos.get('otro-contacto')
        if red and contacto:
            db.session.add(ContactarPor(actividad_id=actividad.id, red_social=red, valor=contacto))

        # Archivos
        fotos = request.files.getlist('foto-actividad[]')
        for archivo in fotos:
            if archivo and allowed_file(archivo.filename):
                filename = secure_filename(archivo.filename)
                ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                archivo.save(ruta)
                db.session.add(Archivo(actividad_id=actividad.id, nombre=filename, ruta=ruta))

        db.session.commit()
        flash('Actividad registrada correctamente.', 'success')
        return redirect(url_for('portada'))

    except Exception as e:
        db.session.rollback()
        flash(f'Error al registrar: {str(e)}', 'error')
        return render_template('agregar.html', datos=datos)

# ========== RUTA LISTADO ==========
@app.route('/listado')
def listado():
    page = int(request.args.get('page', 1))
    por_pagina = 5
    actividades = Actividad.query.order_by(Actividad.inicio.desc()).paginate(page=page, per_page=por_pagina)
    return render_template('listado.html',
                           actividades=actividades.items,
                           pagina_actual=page,
                           total_paginas=actividades.pages)

# ========== RUTA DETALLE ==========
@app.route('/actividad/<int:id>')
def detalle_actividad(id):
    actividad = Actividad.query.get_or_404(id)
    temas = ActividadTema.query.filter_by(actividad_id=id).all()
    contactos = ContactarPor.query.filter_by(actividad_id=id).all()
    archivos = Archivo.query.filter_by(actividad_id=id).all()
    return render_template('detalle.html', actividad=actividad, temas=temas, contactos=contactos, archivos=archivos)

# ========== RUTA ESTADISTICAS ==========
@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')

# ========== MAIN ==========
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Asegura que las tablas existen
    app.run(debug=True)
