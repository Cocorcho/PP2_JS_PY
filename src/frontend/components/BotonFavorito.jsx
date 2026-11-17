import { useFavoritos } from "../context/FavoritosContext.jsx";

export default function BotonFavorito({ pelicula, conTexto = false }) {
  const { esFavorito, alternarFavorito } = useFavoritos();
  const activo = esFavorito(pelicula.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // por si el botón está dentro de un Link
        alternarFavorito(pelicula);
      }}
      className={`rounded-full px-3 py-1 text-sm transition ${
        activo
          ? "bg-pink-500 text-white"
          : "bg-white/80 text-slate-700 hover:bg-pink-100 dark:bg-slate-800 dark:text-slate-200"
      }`}
      aria-label={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {activo ? "♥" : "♡"} {conTexto && (activo ? "En favoritos" : "Agregar a favoritos")}
    </button>
  );
}
