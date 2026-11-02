from typing import TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship

if TYPE_CHECKING:
    from models.peliculas import Pelicula

class SalaBase(SQLModel):
    nombre: str = Field(max_length=100)
    capacidad: int = Field(gt=0)
    activo: bool = Field(default=True)

class Sala(SalaBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    peliculas: list["Pelicula"] = Relationship(back_populates="sala")

class SalaPublic(SalaBase):
    id: int
