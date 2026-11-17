from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, Query, Depends
from sqlmodel import Session, select
from fastapi_pagination import Page, paginate
from database import get_db

salas_routers = APIRouter()

from models.anidados import SalaNested
from models.salas import SalaPublic,Sala,SalaBase

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
@salas_routers.get("/", response_model=Page[SalaPublic])
async def obtener_salas(db: Session = Depends(get_db)):
    return paginate(db.exec(select(Sala)).all())

# -- GET BY ID ---
@salas_routers.get("/{id}", responses=NOT_FOUND_RESPONSE, response_model = Sala)
async def obtener_sala(id: Annotated[int, Path(gt=0)], db:Session = Depends(get_db)):
    sala_obtenida = db.get(Sala,id)
    if sala_obtenida is None:
        raise HTTPException(status_code=404, detail="Articulo no encontrado")
    else:
        return sala_obtenida

# -- POST ---
@salas_routers.post("/", response_model = SalaNested)
async def crear_sala(sala_nueva: Sala, db:Session = Depends(get_db)):

    sala_db = Sala.model_validate(sala_nueva)
    db.add(sala_db)
    db.commit()
    db.refresh(sala_db)

    return sala_db

# -- PUT ---
@salas_routers.put("/{id}", responses=NOT_FOUND_RESPONSE, response_model=SalaPublic)
async def actualizar_sala(
    id: Annotated[int, Path(gt=0)],
    sala_actualizar: SalaBase,
    db: Session = Depends(get_db)
):
    sala_obtenida = db.get(Sala, id)
    if sala_obtenida is not None:
        sala_obtenida.nombre = sala_actualizar.nombre
        sala_obtenida.capacidad = sala_actualizar.capacidad
        sala_obtenida.activo = sala_actualizar.activo
        db.commit()
        db.refresh(sala_obtenida)
        return sala_obtenida
    

    raise HTTPException(status_code=404, detail="Articulo no encontrado")

# -- DELETE ---
@salas_routers.delete("/{id}", responses=NOT_FOUND_RESPONSE, response_model=list[SalaPublic])
async def eliminar_sala(id: Annotated[int, Path(gt=0)],
                         db: Annotated[Session, Depends(get_db)],
                        logico: Annotated[bool,Query()] = False):
    sala_obtenida = db.get(Sala,id)
    if sala_obtenida is None:
        raise HTTPException(status_code=404, detail="Articulo no encontrado")
    if logico:
        sala_obtenida.activo = False
        db.commit()
    else:
        db.delete(sala_obtenida)
        db.commit()    

    return db.exec(select(Sala)).all()
