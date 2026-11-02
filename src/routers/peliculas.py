from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, Query, Depends
from sqlmodel import Session, select
from fastapi_pagination import Page, paginate

from database import get_db

from models.anidados import PeliculaNested
from models.peliculas import PeliculaPublic,Pelicula,PeliculaBase

peliculas_routers = APIRouter()

NOT_FOUND_RESPONSE = {
    404: {
        "description": "Response not found si no se encuentra el id",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Artículo no encontrado",
                }
            }
        },
    },
}

# --- GET ALL ---
@peliculas_routers.get("/",response_model=Page[PeliculaPublic])
async def obtener_peliculas(
    db: Session = Depends(get_db),
    ):
    return paginate(db.exec(select(Pelicula)).all())

# --- GET BY ID ---

@peliculas_routers.get("/{id}", responses=NOT_FOUND_RESPONSE, response_model = Pelicula)
async def obtener_pelicula(id: Annotated[int, Path(gt=0)], db:Session = Depends(get_db)):
    peliculas_obtenidas = db.get(Pelicula,id)
    if peliculas_obtenidas is None:
        return peliculas_obtenidas
    else:
        return HTTPException(status_code=404, detail="Articulo no encontrado")

# --- POST ---

@peliculas_routers.post("/", response_model = PeliculaNested)
async def crear_pelicula(pelicula_nuevo: Pelicula, db:Session = Depends(get_db)):

    pelicula_db = Pelicula.model_validate(pelicula_nuevo)
    db.add(pelicula_db)
    db.commit()
    db.refresh(pelicula_db)

    return pelicula_db

# --- PUT ---

@peliculas_routers.put("/{id}", responses=NOT_FOUND_RESPONSE, response_model=(PeliculaPublic))
async def actualizar_pelicula(
    id: Annotated[int, Path(gt=0, description="ID de la película a actualizar")],
    pelicula_update: PeliculaBase,
    db:Session = Depends(get_db),
):

    pelicula_obtenidas = db.get(Pelicula,id)
    if pelicula_obtenidas is not None:
        pelicula_obtenidas.titulo = pelicula_editar.titulo
        pelicula_obtenidas.director = pelicula_editar.director
        pelicula_obtenidas.año = pelicula_editar.año
        pelicula_obtenidas.activo = pelicula_editar.activo
        db.commit()
        db.refresh(pelicula_obtenidas)
        return(pelicula_obtenidas)

    raise HTTPException(status_code=404, detail="Articulo no encontrado")

# --- DELETE ---

@peliculas_routers.delete("/{id}", responses=NOT_FOUND_RESPONSE, response_model=list[PeliculaPublic])
async def eliminar_pelicula(
                            id: Annotated[int, Path(gt=0)], 
                            db: Annotated[Session, Depends(get_db)],
                            logico: Annotated[bool, Query()] = False,
                           ) -> list[PeliculaPublic] :

    pelicula_obtenidas = db.get(Pelicula,id)
    if pelicula_obtenida is not None:
        if logico:
            pelicula_obtenida.activo = False 
        else:
            db.delete(pelicula_obtenida)
            db.commit()
    return db.exec(select(Pelicula)).all()
    raise HTTPException(status_code=404, detail="Articulo no encontrado")
