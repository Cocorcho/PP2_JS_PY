import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getPelicula } from "../services/api.js";
import BotonFavorito from "../components/BotonFavorito.jsx";
import { Cargando, ErrorMensaje } from "../components/Estados.jsx";

export default function PeliculaDetalle() {
  const { id } = useParams(); // parámetro de la ruta dinámica /pelicula/:id
  const { data: pelicula, loading, error } = useFetch(() => getPelicula(id), [id]);

  if (loading) return <Cargando />;
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMensaje mensaje={error} />
        <Link to="/peliculas" className="text-violet-600 hover:underline dark:text-violet-400">
          ← Volver a las películas
        </Link>
      </div>
    );
  }

  const [c1, c2] = pelicula.color;

  return (
    <div className="space-y-6">
      <Link to="/peliculas" className="text-sm text-violet-600 hover:underline dark:text-violet-400">
        ← Volver a las películas
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div
            className="flex h-56 items-center justify-center rounded-2xl text-8xl font-black text-white/90"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          >
            {pelicula.titulo.charAt(0)}
          </div>

          <h1 className="text-3xl font-bold">{pelicula.titulo}</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {pelicula.genero} · {pelicula.año} · Dir. {pelicula.director}
          </p>
          {pelicula.sala && (
            <p>
              Sala: <strong>{pelicula.sala.nombre}</strong> · Capacidad: {pelicula.sala.capacidad.toLocaleString("es-AR")} personas
            </p>
          )}
          <BotonFavorito pelicula={pelicula} conTexto />
        </div>

        <div>
          {pelicula.estado === "cartelera" ? (
            <div className="rounded-xl border border-green-300 bg-green-50 p-5 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
              Esta película está en cartelera.
            </div>
          ) : (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              Esta película todavía no se estrenó. Guardala en favoritos para no perdértela.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
