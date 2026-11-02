from typing import Optional
from .genero import Genero, GeneroPublic
from .salas import Sala, SalaPublic
from .peliculas import Pelicula, PeliculaPublic

class PeliculaNested(PeliculaPublic):
    genero: Optional[GeneroPublic] = None
    sala: Optional[SalaPublic] = None

class GeneroNested(GeneroPublic):
    peliculas: list[Pelicula] | None = None

class SalaNested(SalaPublic):
    peliculas: list[Pelicula] | None = None
