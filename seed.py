import sys
from pathlib import Path

# Add src to sys.path
BASE_DIR = Path(__file__).resolve().parent
SRC_DIR = BASE_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from sqlmodel import Session, select
from database import engine
from models.genero import Genero
from models.salas import Sala
from models.peliculas import Pelicula


def populate():
    with Session(engine) as session:
        # Check if generos already exist or create them
        generos_data = [
            "Acción",
            "Ciencia Ficción",
            "Drama",
            "Comedia",
            "Terror",
            "Animación",
            "Aventura",
            "Suspenso",
        ]
        generos_dict = {}
        for nombre in generos_data:
            genero = session.exec(select(Genero).where(Genero.nombre == nombre)).first()
            if not genero:
                genero = Genero(nombre=nombre, activo=True)
                session.add(genero)
                session.commit()
                session.refresh(genero)
            generos_dict[nombre] = genero

        # Check if salas already exist or create them
        salas_data = [
            ("Sala 1 - IMAX", 250),
            ("Sala 2 - 3D Dolby", 180),
            ("Sala 3 - Estándar 4K", 150),
            ("Sala 4 - VIP Premium", 80),
        ]
        salas_dict = {}
        for nombre, capacidad in salas_data:
            sala = session.exec(select(Sala).where(Sala.nombre == nombre)).first()
            if not sala:
                sala = Sala(nombre=nombre, capacidad=capacidad, activo=True)
                session.add(sala)
                session.commit()
                session.refresh(sala)
            salas_dict[nombre] = sala

        # 20 peliculas aleatorias / variadas
        peliculas_data = [
            {
                "titulo": "Inception",
                "director": "Christopher Nolan",
                "año": 2010,
                "genero": "Ciencia Ficción",
                "sala": "Sala 1 - IMAX",
            },
            {
                "titulo": "El Padrino",
                "director": "Francis Ford Coppola",
                "año": 1972,
                "genero": "Drama",
                "sala": "Sala 2 - 3D Dolby",
            },
            {
                "titulo": "Pulp Fiction",
                "director": "Quentin Tarantino",
                "año": 1994,
                "genero": "Suspenso",
                "sala": "Sala 3 - Estándar 4K",
            },
            {
                "titulo": "El Señor de los Anillos: El Retorno del Rey",
                "director": "Peter Jackson",
                "año": 2003,
                "genero": "Aventura",
                "sala": "Sala 1 - IMAX",
            },
            {
                "titulo": "Interstellar",
                "director": "Christopher Nolan",
                "año": 2014,
                "genero": "Ciencia Ficción",
                "sala": "Sala 4 - VIP Premium",
            },
            {
                "titulo": "Matrix",
                "director": "Lana y Lilly Wachowski",
                "año": 1999,
                "genero": "Ciencia Ficción",
                "sala": "Sala 2 - 3D Dolby",
            },
            {
                "titulo": "Parasite",
                "director": "Bong Joon-ho",
                "año": 2019,
                "genero": "Suspenso",
                "sala": "Sala 3 - Estándar 4K",
            },
            {
                "titulo": "El Resplandor",
                "director": "Stanley Kubrick",
                "año": 1980,
                "genero": "Terror",
                "sala": "Sala 4 - VIP Premium",
            },
            {
                "titulo": "Titanic",
                "director": "James Cameron",
                "año": 1997,
                "genero": "Drama",
                "sala": "Sala 1 - IMAX",
            },
            {
                "titulo": "Jurassic Park",
                "director": "Steven Spielberg",
                "año": 1993,
                "genero": "Aventura",
                "sala": "Sala 2 - 3D Dolby",
            },
            {
                "titulo": "Toy Story",
                "director": "John Lasseter",
                "año": 1995,
                "genero": "Animación",
                "sala": "Sala 3 - Estándar 4K",
            },
            {
                "titulo": "El Gran Hotel Budapest",
                "director": "Wes Anderson",
                "año": 2014,
                "genero": "Comedia",
                "sala": "Sala 4 - VIP Premium",
            },
            {
                "titulo": "Spider-Man: Un nuevo universo",
                "director": "Peter Ramsey",
                "año": 2018,
                "genero": "Animación",
                "sala": "Sala 1 - IMAX",
            },
            {
                "titulo": "Gladiador",
                "director": "Ridley Scott",
                "año": 2000,
                "genero": "Acción",
                "sala": "Sala 2 - 3D Dolby",
            },
            {
                "titulo": "Bastardos Sin Gloria",
                "director": "Quentin Tarantino",
                "año": 2009,
                "genero": "Acción",
                "sala": "Sala 3 - Estándar 4K",
            },
            {
                "titulo": "Coco",
                "director": "Lee Unkrich",
                "año": 2017,
                "genero": "Animación",
                "sala": "Sala 4 - VIP Premium",
            },
            {
                "titulo": "El Secreto de sus Ojos",
                "director": "Juan José Campanella",
                "año": 2009,
                "genero": "Suspenso",
                "sala": "Sala 1 - IMAX",
            },
            {
                "titulo": "Forrest Gump",
                "director": "Robert Zemeckis",
                "año": 1994,
                "genero": "Drama",
                "sala": "Sala 2 - 3D Dolby",
            },
            {
                "titulo": "Relatos Salvajes",
                "director": "Damián Szifron",
                "año": 2014,
                "genero": "Comedia",
                "sala": "Sala 3 - Estándar 4K",
            },
            {
                "titulo": "Dune",
                "director": "Denis Villeneuve",
                "año": 2021,
                "genero": "Ciencia Ficción",
                "sala": "Sala 4 - VIP Premium",
            },
        ]

        count = 0
        for p in peliculas_data:
            existe = session.exec(
                select(Pelicula).where(Pelicula.titulo == p["titulo"])
            ).first()
            if not existe:
                pelicula = Pelicula(
                    titulo=p["titulo"],
                    director=p["director"],
                    año=p["año"],
                    genero_id=generos_dict[p["genero"]].id,
                    sala_id=salas_dict[p["sala"]].id,
                    activo=True,
                )
                session.add(pelicula)
                count += 1

        session.commit()
        print(f"Poblado exitoso: se agregaron {count} peliculas.")


if __name__ == "__main__":
    populate()
