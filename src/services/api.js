// Todas las llamadas al backend pasan por acá
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // fetch solo falla así cuando no hay conexión con el servidor
    throw new Error("No se pudo conectar con el servidor");
  }

  if (!res.ok) {
    // FastAPI manda el mensaje en "detail"; si no hay, usamos uno genérico
    const body = await res.json().catch(() => null);
    const mensaje = typeof body?.detail === "string" ? body.detail : "Algo salió mal, probá de nuevo";
    throw new Error(mensaje);
  }

  if (res.status === 204) return null;
  return res.json();
}

// La API devuelve las listas paginadas: { items, total, page, size, pages }
// y el tamaño máximo de página es 100, así que pedimos todas las páginas
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

// La API no guarda colores, así que le asignamos uno fijo según el id
const PALETAS = [
  ["#7c3aed", "#ec4899"],
  ["#0ea5e9", "#6366f1"],
  ["#f59e0b", "#ef4444"],
  ["#10b981", "#0ea5e9"],
  ["#f43f5e", "#a855f7"],
  ["#14b8a6", "#84cc16"],
];

// La API no tiene "estado": si el año es posterior al actual es un estreno futuro,
// si no, está en cartelera
function calcularEstado(pelicula) {
  return pelicula.año > new Date().getFullYear() ? "proximamente" : "cartelera";
}

// Convierte lo que manda la API (genero_id, sala_id) en lo que usan los componentes
function adaptarPelicula(pelicula, generos, salas) {
  const genero = generos.find((g) => g.id === pelicula.genero_id);
  const sala = salas.find((s) => s.id === pelicula.sala_id);

  return {
    ...pelicula,
    genero: genero ? genero.nombre : "Sin género",
    sala: sala || null,
    estado: calcularEstado(pelicula),
    color: PALETAS[pelicula.id % PALETAS.length],
  };
}

// Trae películas, géneros y salas juntas y las combina
async function cargarPeliculas() {
  const [peliculas, generos, salas] = await Promise.all([
    pedirTodos("/peliculas/"),
    pedirTodos("/generos/"),
    pedirTodos("/salas/"),
  ]);

  // activo = false es una baja lógica (DELETE con ?logico=true), no se muestra
  return peliculas.filter((p) => p.activo).map((p) => adaptarPelicula(p, generos, salas));
}

// La API no filtra, así que los filtros (título, género y estado) se aplican acá
export async function getPeliculas({ q = "", genero = "", estado = "" } = {}) {
  const peliculas = await cargarPeliculas();
  const texto = q.trim().toLowerCase();

  return peliculas.filter(
    (p) =>
      (!texto || p.titulo.toLowerCase().includes(texto)) &&
      (!genero || p.genero_id === Number(genero)) &&
      (!estado || p.estado === estado)
  );
}

// GET /peliculas/{id} del backend tiene la condición invertida y no devuelve la película,
// por eso la buscamos en la lista completa
export async function getPelicula(id) {
  const peliculas = await cargarPeliculas();
  const pelicula = peliculas.find((p) => p.id === Number(id));

  if (!pelicula) throw new Error("Película no encontrada");
  return pelicula;
}

export async function getGeneros() {
  const generos = await pedirTodos("/generos/");
  return generos.filter((g) => g.activo);
}

// --- Tickets ---
// El backend todavía no tiene estos endpoints (/tickets y /disponibilidad).
// Quedan acá para cuando se agreguen, pero hoy ninguna pantalla los usa.
export const getDisponibilidad = (id, horario) =>
  request(`/peliculas/${id}/disponibilidad?horario=${encodeURIComponent(horario)}`);

export const comprarTicket = (datos) =>
  request("/tickets", { method: "POST", body: JSON.stringify(datos) });

export const getTickets = (email) => request(`/tickets?email=${encodeURIComponent(email)}`);

export const cancelarTicket = (id) => request(`/tickets/${id}`, { method: "DELETE" });
