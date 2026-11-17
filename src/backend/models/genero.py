from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from models.peliculas import Pelicula

class GeneroBase(SQLModel):
    nombre: str = Field(max_length=100)
    activo: bool = Field(default=True)

class Genero(GeneroBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    peliculas: list["Pelicula"] = Relationship(back_populates="genero")

class GeneroPublic(GeneroBase):
    id: int
