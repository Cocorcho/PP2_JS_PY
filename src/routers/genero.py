from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, Query, Depends
from sqlmodel import Session, select
from fastapi_pagination import Page, paginate

from database import get_db

genero_routers = APIRouter()

from models.anidados import GeneroNested
from models.genero import GeneroPublic,Genero,GeneroBase

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

# -- GET ALL ---
@genero_routers.get("/", response_model=Page[GeneroPublic])
async def obtener_generos(db: Session = Depends(get_db)):
    return paginate(db.exec(select(Genero)).all())

# -- GET BY ID ---
@genero_routers.get("/{id}", responses=NOT_FOUND_RESPONSE, response_model = Genero)
async def obtener_genero(id: Annotated[int, Path(gt=0)], db:Session = Depends(get_db)):
    genero_obtenido = db.get(Genero,id)
    if genero_obtenido is None:
        return HTTPException(status_code=404, detail="Articulo no encontrado")
    else:
        return genero_obtenido

# -- POST ---
@genero_routers.post("/", response_model = GeneroNested)
async def crear_genero(genero_nuevo: Genero, db:Session = Depends(get_db)):

    genero_db = Genero.model_validate(genero_nuevo)
    db.add(genero_db)
    db.commit()
    db.refresh(genero_db)

    return genero_db


# -- PUT ---
@genero_routers.put("/{id}", responses=NOT_FOUND_RESPONSE, response_model=(GeneroPublic))
async def actualizar_genero(
    id: Annotated[int, Path(gt=0, description="ID del género a actualizar")],
    genero_update: GeneroBase,
    db:Session = Depends(get_db),
):
    genero_db = db.get(Genero, id)
    if genero_db is not None:
        genero_db.nombre = genero_update.nombre
        genero_db.activo = genero_update.activo
        db.add(genero_db)
        db.commit()
        db.refresh(genero_db)
        return genero_db

    return HTTPException(status_code=404, detail="Artículo no encontrado")


# -- DELETE ---

@genero_routers.delete("/{id}", responses=NOT_FOUND_RESPONSE, response_model=(GeneroPublic))
async def eliminar_genero(
    id: Annotated[int, Path(gt=0, description="ID del género a eliminar")],
    db:Session = Depends(get_db),
    logico: Annotated[bool,Query()] = False
):
    genero_db = db.get(Genero, id)
    if genero_db is not None:
        if logico:
            genero_db.activo = False
        else:
            db.delete(genero_db)
        db.commit()
        return genero_db

    return HTTPException(status_code=404, detail="Artículo no encontrado")