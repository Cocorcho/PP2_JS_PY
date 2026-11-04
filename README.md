# CineApp – Cartelera y gestión de películas

Aplicación web para consultar y organizar información de películas. Permite explorar el catálogo, buscar títulos, filtrar por género, distinguir las películas en cartelera de los próximos estrenos y guardar películas favoritas.

El proyecto está desarrollado con **React** y **Vite** en el frontend, y utiliza una **API REST propia**, construida con **Python, FastAPI y SQLModel**, para administrar películas, géneros y salas. Los datos se almacenan localmente en una base de datos SQLite por defecto.

## Tecnologías utilizadas

- React 18
- Vite
- React Router
- Tailwind CSS
- Python
- FastAPI
- SQLModel / SQLAlchemy
- SQLite

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

- [Node.js y npm](https://nodejs.org/)
- Python 3.10 o superior
- pip (administrador de paquetes de Python)

## Instalación y ejecución local

El proyecto está compuesto por un frontend y un backend. Ambos deben estar en ejecución para que la aplicación pueda consultar los datos.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <CARPETA_DEL_PROYECTO>
```

### 2. Configurar y ejecutar el backend

Desde la carpeta raíz del proyecto, instalar las dependencias de Python:

```bash
pip install -r requirements.txt
```

Iniciar la API con Uvicorn:

```bash
uvicorn main:app --reload --app-dir src
```

Por defecto, la API queda disponible en `http://localhost:8000`. La documentación interactiva de sus endpoints puede consultarse en `http://localhost:8000/docs`.

La base de datos SQLite se crea automáticamente al iniciar el backend. Si se desea cargar el conjunto de datos de ejemplo incluido en el proyecto, ejecutar desde otra terminal, en la carpeta raíz:

```bash
python seed.py
```

### 3. Configurar y ejecutar el frontend

Abrir otra terminal en la carpeta raíz del proyecto e instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto con la dirección del backend:

```env
VITE_API_URL=http://localhost:8000
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador (habitualmente `http://localhost:5173`).

## Integrantes

- Lucas Robledo
- Bruno Rabaglino
- Soloa Tomas
