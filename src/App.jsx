import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Inicio from "./pages/Inicio.jsx";
import Peliculas from "./pages/Peliculas.jsx";
import PeliculasLista from "./pages/PeliculasLista.jsx";
import PeliculaDetalle from "./pages/PeliculaDetalle.jsx";
import Favoritos from "./pages/Favoritos.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Inicio />} />

          {/* Ruta anidada: /peliculas, /peliculas/cartelera y /peliculas/proximamente */}
          <Route path="/peliculas" element={<Peliculas />}>
            <Route index element={<PeliculasLista estado="" />} />
            <Route path="cartelera" element={<PeliculasLista estado="cartelera" />} />
            <Route path="proximamente" element={<PeliculasLista estado="proximamente" />} />
          </Route>

          {/* Ruta dinámica */}
          <Route path="/pelicula/:id" element={<PeliculaDetalle />} />

          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
