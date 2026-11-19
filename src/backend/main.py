import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from fastapi_pagination import add_pagination
from fastapi_pagination.utils import disable_installed_extensions_check

disable_installed_extensions_check()

from .database import engine

from .routers.peliculas import peliculas_routers
from .routers.genero import genero_routers
from .routers.salas import salas_routers

# Crea las tablas y la db
SQLModel.metadata.create_all(bind=engine)

cine_app = FastAPI()
app = cine_app

cine_app.title = "API de Cine"
cine_app.version = "4.0.0"

cine_app.include_router(peliculas_routers, tags=["Peliculas"], prefix="/peliculas")
cine_app.include_router(genero_routers, tags=["Generos"], prefix="/generos")
cine_app.include_router(salas_routers, tags=["Salas"], prefix="/salas")

# CORS: permite orígenes configurados por variable de entorno o todos por defecto
_origins = os.getenv("CORS_ORIGINS", "*")
allowed_origins = [o.strip() for o in _origins.split(",")] if _origins != "*" else ["*"]

cine_app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allowed_origins != ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

add_pagination(cine_app)

@cine_app.get("/health")
def health_check():
    return {"status": "ok"}
