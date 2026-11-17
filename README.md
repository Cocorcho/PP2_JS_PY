# 🎬 CineApp — Cartelera y gestión de películas

Aplicación web full-stack para consultar y organizar información de películas, administrar cartelera, próximos estrenos, catálogo y favoritos.

El proyecto está desarrollado con **React** y **Vite** en el frontend, y utiliza una **API REST propia**, construida con **Python, FastAPI y SQLModel**, para administrar películas, géneros y salas. Los datos se almacenan localmente en una base de datos SQLite por defecto, con soporte para PostgreSQL en producción.

## Integrantes

- Lucas Robledo
- Bruno Rabaglino
- Soloa Tomas

## Tecnologías utilizadas

- **Frontend:** React 18, Vite, React Router, Tailwind CSS
- **Backend:** Python 3.10+, FastAPI, SQLModel, SQLAlchemy, Alembic, FastAPI Pagination
- **Bases de datos:** SQLite (desarrollo local) / PostgreSQL (producción)

---

## Estructura del proyecto

```text
├── requirements.txt     # Dependencias de Python
├── package.json         # Dependencias de Node.js
├── alembic.ini          # Configuración de migraciones
├── pyproject.toml       # Configuración de empaquetado para FastAPI Cloud
├── vite.config.js       # Configuración de Vite
├── vercel.json          # Configuración de Vercel
├── index.html           # HTML principal del frontend
└── src/
    ├── backend/         # API FastAPI
    │   ├── main.py      # App FastAPI
    │   ├── database.py  # Conexión a la base de datos
    │   ├── models/      # Modelos SQLModel
    │   ├── routers/     # Rutas de la API
    │   ├── alembic/     # Migraciones de base de datos
    │   └── seed.py      # Datos iniciales
    └── frontend/        # App React
        ├── pages/       # Páginas (Inicio, Películas, Detalle, Admin, Favoritos)
        ├── components/  # Componentes reutilizables
        ├── services/    # Llamadas a la API (api.js)
        ├── context/     # Contextos de React
        └── hooks/       # Hooks personalizados
```

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/Cocorcho/PP2_JS_PY.git
cd PP2_JS_PY
```

### 2. Configurar y ejecutar el Backend

```bash
# Crear y activar entorno virtual
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
alembic upgrade head

# Poblar la base de datos con datos de prueba
python src/backend/seed.py

# Iniciar la API
uvicorn main:app --app-dir src/backend --reload
```
* **API disponible en:** `http://localhost:8000`
* **Documentación interactiva Swagger:** `http://localhost:8000/docs`

### 3. Configurar y ejecutar el Frontend

Abrir otra terminal en la carpeta raíz del proyecto:

```bash
# Instalar dependencias
npm install

# Crear archivo .env si no existe
# VITE_API_URL=http://localhost:8000

# Iniciar servidor de desarrollo
npm run dev
```
* **Página web disponible en:** `http://localhost:5173`

---

## Deploy

### Backend → FastAPI Cloud

1. Instalar el CLI de FastAPI Cloud:
   ```bash
   pip install fastapi-cloud-cli
   ```

2. Deployar el backend:
   ```bash
   fastapi deploy src/backend
   ```

3. Configurar variables de entorno en el dashboard de FastAPI Cloud:
   - `DATABASE_URL`: URL de la base de datos PostgreSQL
   - `CORS_ORIGINS`: Dominio(s) del frontend en Vercel (ej: `https://tu-app.vercel.app`)

4. Ejecutar migraciones y seed contra la DB de producción:
   ```bash
   DATABASE_URL=postgresql://... alembic upgrade head
   DATABASE_URL=postgresql://... python src/backend/seed.py
   ```

### Frontend → Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar las opciones:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Agregar variable de entorno:
   - `VITE_API_URL`: URL del backend en FastAPI Cloud (ej: `https://tu-app.fastapicloud.dev`)
4. Deployar 🚀

---

## Variables de entorno

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | FastAPI Cloud | URL de PostgreSQL en producción |
| `CORS_ORIGINS` | FastAPI Cloud | Dominios permitidos del frontend (separados por coma) |
| `VITE_API_URL` | Vercel | URL del backend para llamadas desde React |
