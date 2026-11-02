import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useFavoritos } from "../context/FavoritosContext.jsx";

const enlaces = [
  { to: "/", texto: "Inicio" },
  { to: "/peliculas", texto: "Películas" },
  { to: "/favoritos", texto: "Favoritos" },
];

export default function Navbar() {
  const { tema, alternarTema } = useTheme();
  const { favoritos } = useFavoritos();

  const claseLink = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition ${
      isActive
        ? "bg-violet-600 text-white"
        : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-xl font-bold text-violet-600 dark:text-violet-400">
          CineRealct
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          {enlaces.map((e) => (
            <NavLink key={e.to} to={e.to} end={e.to === "/"} className={claseLink}>
              {e.texto}
              {e.to === "/favoritos" && favoritos.length > 0 && (
                <span className="ml-1.5 rounded-full bg-pink-500 px-1.5 py-0.5 text-xs text-white">
                  {favoritos.length}
                </span>
              )}
            </NavLink>
          ))}
          <button
            onClick={alternarTema}
            className="ml-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700"
            aria-label="Cambiar tema"
          >
            {tema === "oscuro" ? "Claro" : "Oscuro"}
          </button>
        </div>
      </nav>
    </header>
  );
}
