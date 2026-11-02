import { useState, useEffect } from "react";
import { getPeliculas, getGeneros } from "../services/api.js";
import PeliculaCard from "../components/PeliculaCard.jsx";
import { Cargando, ErrorMensaje, Vacio } from "../components/Estados.jsx";

export default function PeliculasLista({ estado }) {
  const [peliculas, setPeliculas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Los géneros se piden una sola vez
  useEffect(() => {
    getGeneros().then(setGeneros).catch(() => setGeneros([]));
  }, []);

  // Las películas se vuelven a pedir cuando cambia la pestaña o algún filtro
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Pequeña espera para no disparar una petición por cada letra que se escribe
    const espera = setTimeout(() => {
      getPeliculas({ q: busqueda, genero, estado })
        .then(setPeliculas)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(espera);
  }, [estado, busqueda, genero]);

  const claseInput =
    "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={`${claseInput} w-full sm:w-64`}
        />
        <select value={genero} onChange={(e) => setGenero(e.target.value)} className={claseInput}>
          <option value="">Todos los géneros</option>
          {generos.map((g) => (
            <option key={g.id} value={g.id}>{g.nombre}</option>
          ))}
        </select>
      </div>

      {loading && <Cargando />}
      {error && <ErrorMensaje mensaje={error} />}
      {!loading && !error && peliculas.length === 0 && <Vacio texto="No encontramos películas con esos filtros." />}

      {!loading && !error && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {peliculas.map((p) => (
            <PeliculaCard key={p.id} pelicula={p} />
          ))}
        </div>
      )}
    </div>
  );
}
