# 🎬 CineReact — API de Cine + Frontend React

Proyecto full-stack con **FastAPI** (backend) y **React + Vite** (frontend).

## Estructura del proyecto

```
├── requirements.txt     # Dependencias de Python
├── package.json         # Dependencias de Node.js
├── alembic.ini          # Configuración de migraciones
├── vite.config.js       # Configuración de Vite
├── vercel.json          # Configuración de Vercel
├── index.html           # HTML principal del frontend
└── src/
    ├── backend/         # API FastAPI
    │   ├── main.py      # App FastAPI
    │   ├── database.py  # Conexión a la base de datos
    │   ├── models/      # Modelos SQLModel
    │   ├── routers/     # Rutas de la API
    │   ├── alembic/     # Migraciones
    │   └── seed.py      # Datos iniciales
    └── frontend/        # App React
        ├── pages/       # Páginas
        ├── components/  # Componentes
        ├── services/    # Llamadas a la API
        ├── context/     # Contextos de React
        └── hooks/       # Hooks personalizados
```

## Desarrollo local

### Backend
```bash
# Crear y activar entorno virtual
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
alembic upgrade head

# Poblar la base de datos
python src/backend/seed.py

# Iniciar el servidor
uvicorn main:app --app-dir src/backend --reload
# → API disponible en http://localhost:8000
# → Documentación en http://localhost:8000/docs
```

### Frontend
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# → Frontend disponible en http://localhost:5173
```

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

2. Configurar las siguientes opciones:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. Agregar variable de entorno:
   - `VITE_API_URL`: URL del backend en FastAPI Cloud (ej: `https://tu-app.fastapicloud.dev`)

4. Deployar 🚀

## Variables de entorno

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | FastAPI Cloud | URL de PostgreSQL |
| `CORS_ORIGINS` | FastAPI Cloud | Dominios del frontend (separados por coma) |
| `VITE_API_URL` | Vercel | URL del backend |
