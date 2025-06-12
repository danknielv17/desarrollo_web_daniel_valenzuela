from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_wtf.csrf import CSRFProtect
from werkzeug.utils import secure_filename
import os
import hashlib
from sqlalchemy import func, extract
from datetime import datetime
from app.utils.validations import validar_nombre, validar_email, validar_telefono, validar_rango_fechas, validar_formato_fecha, validar_contactar_por, validar_imagen
from app.db.db import db, Actividad, ActividadTema, ContactarPor, Comentario, Foto, Region, Comuna, DATABASE_URL

# ========== CONFIGURACION ==========
app = Flask(__name__)
app.secret_key = 'clave_flask'

# Configuración de CSRF
csrf = CSRFProtect(app)

# Configuración de SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Configuración para archivos
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ========== RUTA PORTADA ==========
@app.route('/')
def portada():
    actividades = []
    ultimas = Actividad.query.order_by(Actividad.id.desc()).limit(5).all() # Ordenar por id descendente para obtener las últimas 5 actividades

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

    # Validaciones del lado del servidor
    # Validar nombre del organizador
    if not validar_nombre(datos.get('nombre-organizador')):
        errores.append('El nombre del organizador es obligatorio y debe tener al menos 3 caracteres.')

    # Validar email
    if not validar_email(datos.get('email-organizador')):
        errores.append('El email es obligatorio y debe tener un formato válido.')

    # Validar telefono
    if datos.get('telefono-organizador') and not validar_telefono(datos.get('telefono-organizador')):
        errores.append('El formato del teléfono no es válido. Debe tener formato +NN.NNNNNNNN')

    # Validar fecha de inicio de la actividad
    if not datos.get('inicio-actividad'):
        errores.append('Debe indicar una fecha de inicio.')

    # Validar formato de fecha de inicio de la actividad
    if not validar_formato_fecha(datos.get('inicio-actividad')):
        errores.append('El formato de la fecha de inicio no es válido.')

    # Validar fecha de término de la actividad
    if datos.get('termino-actividad'):
        if not validar_formato_fecha(datos.get('termino-actividad')):
            errores.append('El formato de la fecha de término no es válido.')
        elif not validar_rango_fechas(datos.get('inicio-actividad'), datos.get('termino-actividad')):
            errores.append('La fecha de término debe ser posterior a la de inicio.')

    # Si hay campos de contactar-por, validar que tengan contenido válido
    if datos.get('contactar-por') and not validar_contactar_por(datos.get('otro-contacto')):
        errores.append('El identificador de contacto debe tener al menos 3 caracteres y máximo 50.')

    # Validar imágenes
    fotos = request.files.getlist('foto-actividad[]')
    for foto in fotos:
        if foto and foto.filename:
            # Guarda temporalmente el archivo para validarlo
            temp_path = os.path.join(app.config['UPLOAD_FOLDER'], 'temp_' + secure_filename(foto.filename))
            foto.save(temp_path)

            # Reposiciona el puntero del archivo
            foto.seek(0)

            # Valida la imagen
            if not validar_imagen(foto):
                errores.append(f'El archivo {foto.filename} no es una imagen válida o no tiene un formato permitido (.jpg, .jpeg, .png).')

            # Elimina el archivo temporal
            if os.path.exists(temp_path):
                os.remove(temp_path)
    # Si hay errores de validación, mantiene visible el formulario
    if errores:
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
        temas_predefinidos = ['música', 'deporte', 'ciencias', 'religión', 'política', 'tecnología', 'juegos', 'baile', 'comida', 'otro']

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
            if foto and foto.filename:
                filename = secure_filename(foto.filename)
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                filename = f"{timestamp}_{hashlib.md5(filename.encode()).hexdigest()[:10]}_{filename}"
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
        actividades_query = Actividad.query.order_by(Actividad.dia_hora_inicio.asc())
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

    # Obtener los objetos completos de tema
    temas_obj = ActividadTema.query.filter_by(actividad_id=id).all()

    contactos = ContactarPor.query.filter_by(actividad_id=id).all()
    archivos = Foto.query.filter_by(actividad_id=id).all()

    return render_template('detalle.html',
                           actividad=actividad,
                           temas_obj=temas_obj,
                           contactos=contactos,
                           archivos=archivos)

# ========== RUTA API COMENTARIOS ==========
# API: obtener comentarios de una actividad
@app.route('/api/comentarios/<int:actividad_id>')
def obtener_comentarios(actividad_id):
    comentarios = Comentario.query.filter_by(actividad_id=actividad_id).order_by(Comentario.fecha.desc()).all()
    return jsonify([{
        'nombre': c.nombre,
        'texto': c.texto,
        'fecha': c.fecha.strftime('%Y-%m-%d %H:%M')
    } for c in comentarios])

# API: agregar nuevo comentario
@app.route('/api/comentarios/<int:actividad_id>', methods=['POST'])
def agregar_comentario(actividad_id):
    print("Request headers:", request.headers)
    print("Request content-type:", request.content_type)
    print("Request data:", request.data)
    print("Request.get_json():", request.get_json())
    if not request.is_json:
        return jsonify({'ok': False, 'error': 'Formato no válido'}), 400

    data = request.get_json()

    if not data:
        return jsonify({'ok': False, 'error': 'No se recibieron datos'}), 400

    nombre = data.get('nombre', '').strip()
    texto = data.get('texto', '').strip()

    if len(nombre) < 3 or len(nombre) > 80:
        return jsonify({'ok': False, 'error': 'Nombre inválido'}), 400
    if len(texto) < 5:
        return jsonify({'ok': False, 'error': 'Comentario demasiado corto'}), 400

    nuevo = Comentario(
        nombre=nombre,
        texto=texto,
        fecha=datetime.now(),
        actividad_id=actividad_id
    )
    db.session.add(nuevo)
    db.session.commit()

    return jsonify({
        'ok': True,
        'comentario': {
            'fecha': nuevo.fecha.strftime('%Y-%m-%d %H:%M'),
            'nombre': nuevo.nombre,
            'texto': nuevo.texto
        }
    }), 200


# ========== RUTA ESTADISTICAS ==========
@app.route('/estadisticas')
def estadisticas():
    return render_template('estadisticas.html')

# ========== RUTA API ESTADISTICAS ==========

# Cantidad de actividades por día (gráfico de líneas)
@app.route('/api/estadisticas/por-dia')
def estadisticas_por_dia():
    resultados = db.session.query(
        func.date(Actividad.dia_hora_inicio).label('dia'),
        func.count(Actividad.id)
    ).group_by('dia').order_by('dia').all()
    data = {
        'labels': [r[0].strftime('%Y-%m-%d') for r in resultados],
        'values': [r[1] for r in resultados]
    }
    return jsonify(data)

# Total de actividades por tipo (gráfico de torta)
@app.route('/api/estadisticas/por-tipo')
def estadisticas_por_tipo():
    resultados = db.session.query(
        ActividadTema.tema,
        func.count(ActividadTema.id)
    ).group_by(ActividadTema.tema).all()
    data = {
        'labels': [r[0] for r in resultados],
        'values': [r[1] for r in resultados]
    }
    return jsonify(data)

# Actividades por momento del día y mes (gráfico de barras)
@app.route('/api/estadisticas/por-momento-mes')
def estadisticas_por_momento_mes():
    # Definir momentos del día
    def momento(hora):
        if 6 <= hora < 12:
            return 'Mañana'
        elif 12 <= hora < 18:
            return 'Mediodía'
        else:
            return 'Tarde'
    actividades = db.session.query(
        Actividad.dia_hora_inicio
    ).all()
    conteo = {}
    for (dt,) in actividades:
        mes = dt.strftime('%Y-%m')
        hora = dt.hour
        m = momento(hora)
        if mes not in conteo:
            conteo[mes] = {'Mañana': 0, 'Mediodía': 0, 'Tarde': 0}
        conteo[mes][m] += 1
    meses = sorted(conteo.keys())
    data = {
        'labels': meses,
        'manana': [conteo[m]['Mañana'] for m in meses],
        'mediodia': [conteo[m]['Mediodía'] for m in meses],
        'tarde': [conteo[m]['Tarde'] for m in meses]
    }
    return jsonify(data)

# ========== RUTA URLS NO FUNCIONALES ==========
@app.errorhandler(404)
def pagina_no_encontrada(e):
    return render_template('404.html'), 404

# ========== MAIN ==========
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Asegura que las tablas existen
    app.run(debug=True)
