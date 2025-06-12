from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# --- Configuración de la base de datos ---

# Credenciales para acceder a la base de datos
DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
db = SQLAlchemy()

# --- Models ---

class Actividad(db.Model):
    __tablename__ = 'actividad'
    id = Column(Integer, primary_key=True)
    dia_hora_inicio = Column(DateTime, nullable=False)
    dia_hora_termino = Column(DateTime)
    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    sector = Column(String(100))
    descripcion = Column(String(500))
    nombre = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    celular = Column(String(15))

    temas = relationship('ActividadTema', backref='actividad', cascade="all, delete-orphan")
    contactos = relationship('ContactarPor', backref='actividad', cascade="all, delete-orphan")
    fotos = relationship('Foto', backref='actividad', cascade="all, delete-orphan")

class ActividadTema(db.Model):
    __tablename__ = 'actividad_tema'
    id = Column(Integer, primary_key=True)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    tema = Column(String(100), nullable=False)  # O mantén como ENUM
    glosa_otro = Column(String(100))  # Añade esta línea

class ContactarPor(db.Model):
    __tablename__ = 'contactar_por'
    id = Column(Integer, primary_key=True)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    nombre = Column(String(50))  # antes: red_social
    identificador = Column(String(100))  # antes: valor

class Foto(db.Model):
    __tablename__ = 'foto'
    id = Column(Integer, primary_key=True)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    nombre_archivo = Column(String(300))
    ruta_archivo = Column(String(300))

class Region(db.Model):
    __tablename__ = 'region'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    comunas = relationship("Comuna", backref="region")

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)

class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, nullable=False)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    actividad = relationship('Actividad', backref='comentarios')

# --- Database Functions ---

def get_tema(actividad_id, tema_texto):
    # Verificar si el tema es personalizado
    if tema_texto not in ['música', 'deporte', 'ciencias', 'religión', 'política',
                          'tecnología', 'juegos', 'baile', 'comida', 'otro']:
        # Es un tema personalizado, guardar como "otro" y el texto en glosa_otro
        tema_actividad = ActividadTema(
            actividad_id=actividad_id,
            tema='otro',
            glosa_otro=tema_texto
        )
    else:
        # Es uno de los temas predefinidos
        tema_actividad = ActividadTema(
            actividad_id=actividad_id,
            tema=tema_texto
        )

    db.session.add(tema_actividad)
    db.session.commit()
    return tema_actividad

def get_actividad_by_id(actividad_id):
    with SessionLocal() as session:
        return session.query(Actividad).filter_by(id=actividad_id).first()

def get_all_actividades():
    with SessionLocal() as session:
        return session.query(Actividad).order_by(Actividad.inicio.desc()).all()

def get_actividades_by_tema(tema):
    with SessionLocal() as session:
        return session.query(Actividad).join(ActividadTema).filter(ActividadTema.tema == tema).all()

def get_fotos_by_actividad_id(actividad_id):
    with SessionLocal() as session:
        return session.query(Foto).filter_by(actividad_id=actividad_id).all()

def get_region_by_id(region_id):
    with SessionLocal() as session:
        return session.query(Region).filter_by(id=region_id).first()

def get_comunas_by_region_id(region_id):
    with SessionLocal() as session:
        return session.query(Comuna).filter_by(region_id=region_id).all()

def get_comentarios_by_actividad_id(actividad_id):
    with SessionLocal() as session:
        return session.query(Comentario).filter_by(actividad_id=actividad_id).all()
