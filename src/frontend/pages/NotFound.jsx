import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-6xl">🎞️</p>
      <h1 className="mt-4 text-2xl font-bold">Esta función no existe</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">La página que buscás no está en cartelera.</p>
      <Link to="/" className="mt-6 inline-block text-violet-600 hover:underline dark:text-violet-400">
        Volver al inicio
      </Link>
    </div>
  );
}
