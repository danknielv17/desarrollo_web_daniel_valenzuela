from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

DB_NAME = "tarea2"
DB_USERNAME = "root"
DB_PASSWORD = "fox17"
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
    id = db.Column(db.Integer, primary_key=True)
    inicio = db.Column(db.DateTime, nullable=False)
    termino = db.Column(db.DateTime)
    comuna = db.Column(db.String(100), nullable=False)
    sector = db.Column(db.String(200))
    descripcion = db.Column(db.Text)
    nombre_organizador = db.Column(db.String(100), nullable=False)
    email_organizador = db.Column(db.String(100), nullable=False)
    telefono_organizador = db.Column(db.String(20))

    temas = db.relationship('ActividadTema', backref='actividad', cascade="all, delete-orphan")
    contactos = db.relationship('ContactarPor', backref='actividad', cascade="all, delete-orphan")
    archivos = db.relationship('Archivo', backref='actividad', cascade="all, delete-orphan")

class ActividadTema(db.Model):
    __tablename__ = 'actividad_tema'
    id = db.Column(db.Integer, primary_key=True)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)
    tema = db.Column(db.String(100), nullable=False)

class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

class ContactarPor(db.Model):
    __tablename__ = 'contactar_por'
    id = db.Column(db.Integer, primary_key=True)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)
    red_social = db.Column(db.String(50))
    valor = db.Column(db.String(100))

class Archivo(db.Model):
    __tablename__ = 'archivo'
    id = db.Column(db.Integer, primary_key=True)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)
    nombre = db.Column(db.String(255))
    ruta = db.Column(db.String(255))

# --- Database Functions ---

def init_db(app):
    """Inicializa SQLAlchemy con una instancia de Flask y crea las tablas si no existen."""
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()

def get_session():
    """Retorna una sesión no relacionada a Flask (para pruebas o scripts externos)."""
    return SessionLocal()

def get_actividad_by_id(actividad_id):
    return Actividad.query.get(actividad_id)

def get_all_actividades():
    return Actividad.query.all()

def get_actividades_by_tema(tema):
    return Actividad.query.join(ActividadTema).filter(ActividadTema.tema == tema).all()

def get_foto_actividad_id(actividad_id):
    actividad = Actividad.query.get(actividad_id)
    if actividad and actividad.archivos:
        return actividad.archivos[0].ruta
    return None

def get_region_by_id(region_id):
    return Region.query.get(region_id)


def get_comunas_by_region_id(region_id):
    return Comuna.query.filter_by(region_id=region_id).all()