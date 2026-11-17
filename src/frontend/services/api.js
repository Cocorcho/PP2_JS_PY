

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
    const mensaje = typeof body?.detail === "string" ? body.detail : "Algo salió mal, probá de nuevo";
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
 

const PALETAS = [
  ["#7c3aed", "#ec4899"],
  ["#0ea5e9", "#6366f1"],
  ["#f59e0b", "#ef4444"],
  ["#10b981", "#0ea5e9"],
  ["#f43f5e", "#a855f7"],
  ["#14b8a6", "#84cc16"],
];
 
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
 
  return peliculas.filter((p) => p.activo).map((p) => adaptarPelicula(p, generos, salas));
}
 
// Filtros 
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
 
 
// GETS
export const adminGetPeliculas = () => pedirTodos("/peliculas/");
export const adminGetGeneros = () => pedirTodos("/generos/");
export const adminGetSalas = () => pedirTodos("/salas/");
 
// POST 
export const adminCrearPelicula = (pelicula) =>
  request("/peliculas/", { method: "POST", body: JSON.stringify(pelicula) });
 
// DELETE 
export const adminEliminarPelicula = (id) =>
  request(`/peliculas/${id}?logico=false`, { method: "DELETE" });
