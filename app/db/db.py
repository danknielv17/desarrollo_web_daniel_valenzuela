from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
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
    id = Column(Integer, primary_key=True)
    inicio = Column(DateTime, nullable=False)
    termino = Column(DateTime)
    comuna = Column(String(100), nullable=False)
    sector = Column(String(200))
    descripcion = Column(Text)
    nombre_organizador = Column(String(100), nullable=False)
    email_organizador = Column(String(100), nullable=False)
    telefono_organizador = Column(String(20))

    temas = relationship('ActividadTema', backref='actividad', cascade="all, delete-orphan")
    contactos = relationship('ContactarPor', backref='actividad', cascade="all, delete-orphan")
    archivos = relationship('Archivo', backref='actividad', cascade="all, delete-orphan")

class ActividadTema(db.Model):
    __tablename__ = 'actividad_tema'
    id = Column(Integer, primary_key=True)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    tema = Column(String(100), nullable=False)

class ContactarPor(db.Model):
    __tablename__ = 'contactar_por'
    id = Column(Integer, primary_key=True)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    red_social = Column(String(50))
    valor = Column(String(100))

class Archivo(db.Model):
    __tablename__ = 'archivo'
    id = Column(Integer, primary_key=True)
    actividad_id = Column(Integer, ForeignKey('actividad.id'), nullable=False)
    nombre = Column(String(255))
    ruta = Column(String(255))

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

# --- Database Functions ---

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
        return session.query(Archivo).filter_by(actividad_id=actividad_id).all()

def get_region_by_id(region_id):
    with SessionLocal() as session:
        return session.query(Region).filter_by(id=region_id).first()

def get_comunas_by_region_id(region_id):
    with SessionLocal() as session:
        return session.query(Comuna).filter_by(region_id=region_id).all()
