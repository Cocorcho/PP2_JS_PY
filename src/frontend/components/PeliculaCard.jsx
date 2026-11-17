import { Link } from "react-router-dom";
import BotonFavorito from "./BotonFavorito.jsx";

export default function PeliculaCard({ pelicula }) {
  const [c1, c2] = pelicula.color;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

      <Link to={`/pelicula/${pelicula.id}`}>
        <div
          className="relative flex h-44 items-center justify-center text-6xl font-black text-white/90"
          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
        >
          {pelicula.titulo.charAt(0)}
          <span className="absolute left-3 top-3 rounded bg-black/40 px-2 py-0.5 text-xs font-medium">
            {pelicula.año}
          </span>
          {pelicula.estado === "proximamente" && (
            <span className="absolute bottom-3 left-3 rounded bg-amber-400 px-2 py-0.5 text-xs font-semibold text-black">
              Próximamente
            </span>
          )}
          <div className="absolute right-3 top-3">
            <BotonFavorito pelicula={pelicula} />
          </div>
        </div>
      </Link>

      <div className="space-y-1 p-4">
        <h3 className="font-semibold">{pelicula.titulo}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {pelicula.genero} · Dir. {pelicula.director}
        </p>
        <Link
          to={`/pelicula/${pelicula.id}`}
          className="inline-block pt-2 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
        >
          Ver detalle →
        </Link>
      </div>
    </article>
  );
}
