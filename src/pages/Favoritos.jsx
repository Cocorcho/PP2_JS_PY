import { Link } from "react-router-dom";
import { useFavoritos } from "../context/FavoritosContext.jsx";
import useFetch from "../hooks/useFetch.js";
import { getPeliculas } from "../services/api.js";
import PeliculaCard from "../components/PeliculaCard.jsx";
import { Cargando, ErrorMensaje, Vacio } from "../components/Estados.jsx";

export default function Favoritos() {
  const { esFavorito } = useFavoritos();
  // Pedimos las películas a la API para mostrar los datos actuales
  // (y no mostrar una película que ya se dio de baja)
  const { data: peliculas, loading, error } = useFetch(() => getPeliculas(), []);

  const favoritas = peliculas ? peliculas.filter((p) => esFavorito(p.id)) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mis favoritos</h1>

      {loading && <Cargando />}
      {error && <ErrorMensaje mensaje={error} />}

      {!loading && !error && favoritas.length === 0 && (
        <div>
          <Vacio texto="Todavía no guardaste ninguna película." />
          <p className="text-center">
            <Link to="/peliculas" className="text-violet-600 hover:underline dark:text-violet-400">
              Explorar películas
            </Link>
          </p>
        </div>
      )}

      {!loading && !error && favoritas.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favoritas.map((p) => (
            <PeliculaCard key={p.id} pelicula={p} />
          ))}
        </div>
      )}
    </div>
  );
}
