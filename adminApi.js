// Llamadas al backend usadas solo por el panel /admin.
// Está separado de services/api.js para no modificar el código existente.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    let mensaje = "Algo salió mal, probá de nuevo";

    if (typeof body?.detail === "string") {
      mensaje = body.detail;
    } else if (Array.isArray(body?.detail)) {
      // Errores de validación de FastAPI (422): [{ loc, msg }, ...]
      mensaje = body.detail.map((d) => `${d.loc?.slice(-1)[0]}: ${d.msg}`).join(" · ");
    }
    throw new Error(mensaje);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function pedirTodos(path) {
  const items = [];
  let pagina = 1;
  let paginas = 1;

  while (pagina <= paginas) {
    const data = await request(`${path}?page=${pagina}&size=100`);
    items.push(...data.items);
    paginas = data.pages;
    pagina++;
  }

  return items;
}

export const adminGetPeliculas = () => pedirTodos("/peliculas/");
export const adminGetGeneros = () => pedirTodos("/generos/");
export const adminGetSalas = () => pedirTodos("/salas/");


export const adminCrearPelicula = (pelicula) =>
  request("/peliculas/", { method: "POST", body: JSON.stringify(pelicula) });

export const adminEliminarPelicula = (id) =>
  request(`/peliculas/${id}?logico=false`, { method: "DELETE" });
