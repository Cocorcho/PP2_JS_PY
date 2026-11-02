import os
from pathlib import Path
from sqlmodel import Session, create_engine
from sqlalchemy.orm import declarative_base

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "cine.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
Base = declarative_base()

def get_db():
    with Session(engine) as session:
        yield session
