import os
import sys
from pathlib import Path
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel

from alembic import context

# Ensure src/backend is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Import models to register their tables in SQLModel.metadata
try:
    from models.peliculas import Pelicula
    from models.genero import Genero
    from models.salas import Sala
except ImportError:
    from src.backend.models.peliculas import Pelicula
    from src.backend.models.genero import Genero
    from src.backend.models.salas import Sala

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata


def get_clean_url(url: str | None) -> str | None:
    if url and url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


def run_migrations_offline() -> None:
    url = get_clean_url(os.getenv("DATABASE_URL") or config.get_main_option("sqlalchemy.url"))
    is_sqlite = (url or "").startswith("sqlite")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        render_as_batch=is_sqlite,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section, {})
    db_url = get_clean_url(os.getenv("DATABASE_URL"))
    if db_url:
        configuration["sqlalchemy.url"] = db_url

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        is_sqlite = connection.dialect.name == "sqlite"
        context.configure(
            connection=connection,
            render_as_batch=is_sqlite,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
