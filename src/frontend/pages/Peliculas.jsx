import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/peliculas", texto: "Todas", end: true },
  { to: "/peliculas/cartelera", texto: "En cartelera" },
  { to: "/peliculas/proximamente", texto: "Próximamente" },
];

export default function Peliculas() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Películas</h1>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                isActive
                  ? "border-violet-600 text-violet-600 dark:text-violet-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`
            }
          >
            {t.texto}
          </NavLink>
        ))}
      </div>
      
      <Outlet />
    </div>
  );
}
