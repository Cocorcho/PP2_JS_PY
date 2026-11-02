import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch.js";
import { getPeliculas } from "../services/api.js";
import PeliculaCard from "../components/PeliculaCard.jsx";
import { Cargando, ErrorMensaje } from "../components/Estados.jsx";

export default function Inicio() {
  const { data: peliculas, loading, error } = useFetch(() => getPeliculas({ estado: "cartelera" }), []);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 p-8 text-white md:p-12">
        <h1 className="text-3xl font-bold md:text-4xl">Tu próxima función empieza acá</h1>
        <p className="mt-3 max-w-xl text-white/90">
          Mirá la cartelera, guardá tus favoritas y comprá tus tickets sin hacer fila.
        </p>
        <Link
          to="/peliculas/cartelera"
          className="mt-6 inline-block rounded-md bg-white px-5 py-2 font-medium text-violet-700 hover:bg-violet-50"
        >
          Ver cartelera
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">En cartelera ahora</h2>
        {loading && <Cargando />}
        {error && <ErrorMensaje mensaje={error} />}
        {peliculas && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {peliculas.slice(0, 3).map((p) => (
              <PeliculaCard key={p.id} pelicula={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
