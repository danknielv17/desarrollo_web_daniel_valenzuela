from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
import os
import hashlib
import filetype
from datetime import datetime
from app.utils.validations import validar_nombre, validar_email, validar_telefono
from app.db.db import db, Actividad, ActividadTema, ContactarPor, Foto, Region, Comuna

app = Flask(__name__)
app.secret_key = 'clave_flask'

# Configuración de SQLAlchemy
# Conexión a mi base de datos (así la configuré en mysql en mi pc)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:fox17@localhost/tarea2' # Cambiar por las credenciales dadas por profesor
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Configuración para archivos
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ========== RUTA PORTADA ==========
@app.route('/')
def portada():
    actividades = []
    ultimas = Actividad.query.order_by(Actividad.dia_hora_inicio.desc()).limit(5).all()

    for act in ultimas:
        comuna = Comuna.query.get(act.comuna_id)
        tema_obj = ActividadTema.query.filter_by(actividad_id=act.id).first()
        primera_foto = Foto.query.filter_by(actividad_id=act.id).first()

        actividades.append({
            'id': act.id,
            'descripcion': act.descripcion,
            'inicio': act.dia_hora_inicio.strftime("%Y-%m-%d %H:%M"),
            'termino': act.dia_hora_termino.strftime("%Y-%m-%d %H:%M") if act.dia_hora_termino else None,
            'comuna': comuna.nombre if comuna else '',
            'sector': act.sector,
            'tema': tema_obj.tema if tema_obj else '',
            'glosa_otro': tema_obj.glosa_otro if tema_obj and tema_obj.tema == 'otro' else None,
            'foto': primera_foto.nombre_archivo if primera_foto else None
        })

    return render_template('index.html', actividades=actividades)

# ========== RUTA AGREGAR ==========
# Solicita datos del servidor con GET y envia datos al servidor con POST
@app.route('/agregar', methods=['GET', 'POST'])
def agregar():
    if request.method == 'GET':
        return render_template("agregar.html")

    errores = []
    datos = request.form

    if not datos.get('nombre-organizador') or len(datos['nombre-organizador']) < 3:
        errores.append('El nombre del organizador es obligatorio.')
    if not datos.get('email-organizador'):
        errores.append('El email es obligatorio.')
    if not datos.get('inicio-actividad'):
        errores.append('Debe indicar una fecha de inicio.')

    if errores: # Si hay errores, mantiene visible el formulario
        flash('\n'.join(errores), 'error')
        return render_template('agregar.html', datos=datos)

    try:
        actividad = Actividad(
            dia_hora_inicio=datetime.strptime(datos['inicio-actividad'], '%Y-%m-%dT%H:%M'),
            dia_hora_termino=datetime.strptime(datos['termino-actividad'], '%Y-%m-%dT%H:%M') if datos.get(
                'termino-actividad') else None,
            comuna_id=int(datos['comuna']),
            sector=datos.get('sector'),
            descripcion=datos.get('descripcion-actividad'),
            nombre=datos['nombre-organizador'],
            email=datos['email-organizador'],
            celular=datos.get('telefono-organizador')
        )
        db.session.add(actividad)
        db.session.commit()

        # Tema
        tema = datos['tema-actividad']
        temas_predefinidos = ['música', 'deporte', 'ciencias', 'religión', 'política', 'tecnología', 'juegos', 'baile',
                              'comida', 'otro']

        if tema not in temas_predefinidos:
            db.session.add(ActividadTema(actividad_id=actividad.id, tema='otro', glosa_otro=tema))
        elif tema == 'otro':
            glosa_otro = datos.get('otro-tema')
            db.session.add(ActividadTema(actividad_id=actividad.id, tema='otro', glosa_otro=glosa_otro))
        else:
            db.session.add(ActividadTema(actividad_id=actividad.id, tema=tema))

        # Contacto
        red = datos.get('contactar-por')
        contacto = datos.get('otro-contacto')
        if red and contacto:
            db.session.add(ContactarPor(actividad_id=actividad.id, nombre=red, identificador=contacto))

        # Archivos
        fotos = request.files.getlist('foto-actividad[]')
        for foto in fotos:
            if foto and allowed_file(foto.filename):
                filename = secure_filename(foto.filename)
                ruta = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                foto.save(ruta)
                db.session.add(Foto(actividad_id=actividad.id, nombre_archivo=filename, ruta_archivo=ruta))

        db.session.commit()
        flash('Actividad registrada correctamente.', 'success')
        return redirect(url_for('portada'))

    # Si ocurre un error, se hace rollback y se muestra el error
    except Exception as e:
        db.session.rollback()
        flash(f'Error al registrar: {str(e)}', 'error')
        return render_template('agregar.html', datos=datos)

# ========== RUTA LISTADO ==========
@app.route('/listado')
def listado():
    try:
        page = int(request.args.get('page', 1))
        por_pagina = 5
        actividades_query = Actividad.query.order_by(Actividad.dia_hora_inicio.desc())
        paginacion = actividades_query.paginate(page=page, per_page=por_pagina)
        actividades = []
        for act in paginacion.items:
            comuna = Comuna.query.get(act.comuna_id)
            tema_obj = ActividadTema.query.filter_by(actividad_id=act.id).first()
            total_fotos = Foto.query.filter_by(actividad_id=act.id).count()
            actividades.append({
                'id': act.id,
                'inicio': act.dia_hora_inicio.strftime('%Y-%m-%d %H:%M'),
                'termino': act.dia_hora_termino.strftime('%Y-%m-%d %H:%M') if act.dia_hora_termino else None,
                'comuna': comuna.nombre if comuna else '-',
                'sector': act.sector,
                'tema': tema_obj.tema if tema_obj else '-',
                'glosa_otro': tema_obj.glosa_otro if tema_obj and tema_obj.tema == 'otro' else None,
                'nombre_organizador': act.nombre,
                'total_fotos': total_fotos
            })
        return render_template('listado.html',
                               actividades=actividades,
                               pagina_actual=page,
                               total_paginas=paginacion.pages or 1)
    except Exception as e:
        print(f"Error en listado: {str(e)}")
        return render_template('listado.html',
                               actividades=[],
                               pagina_actual=1,
                               total_paginas=1)

# ========== RUTA DETALLE ==========
@app.route('/actividad/<int:id>')
def detalle_actividad(id):
    actividad = Actividad.query.get_or_404(id)
    comuna = Comuna.query.get(actividad.comuna_id)
    actividad.comuna = comuna  # Asigna la comuna al objeto actividad
    temas_obj = ActividadTema.query.filter_by(actividad_id=id).all()

    # Extraer solo los nombres de los temas
    temas = [tema.tema for tema in temas_obj]

    contactos = ContactarPor.query.filter_by(actividad_id=id).all()
    archivos = Foto.query.filter_by(actividad_id=id).all()

    return render_template('detalle.html',
                           actividad=actividad,
                           temas=temas,
                           contactos=contactos,
                           archivos=archivos)

# ========== RUTA ESTADISTICAS ==========
@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')
# Las funcionalidades relacionadas a las estadísticas quedarán pendientes para la siguiente tarea.

# ========== MAIN ==========
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Asegura que las tablas existen
    app.run(debug=True)
