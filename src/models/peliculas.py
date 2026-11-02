from typing import TYPE_CHECKING, Optional
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from models.genero import Genero
    from models.salas import Sala


class PeliculaBase(SQLModel):
    titulo: str = Field(max_length=100)
    director: str = Field(max_length=100)
    año: int = Field(gt=0)
    genero_id: int | None = Field(default=None, foreign_key="genero.id")
    sala_id: int | None = Field(default=None, foreign_key="sala.id")
    activo: bool = Field(default=True)

class Pelicula(PeliculaBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    genero: Optional["Genero"] = Relationship(back_populates="peliculas")
    sala: Optional["Sala"] = Relationship(back_populates="peliculas")

class PeliculaPublic(PeliculaBase):
    id: int
