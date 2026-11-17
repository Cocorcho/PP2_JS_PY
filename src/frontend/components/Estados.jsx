// Mensajes reutilizables para cargando, error y listas vacías

export function Cargando({ texto = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      {texto}
    </div>
  );
}

export function ErrorMensaje({ mensaje }) {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
      Error: {mensaje}
    </div>
  );
}

export function Vacio({ texto }) {
  return <p className="py-16 text-center text-slate-500 dark:text-slate-400">{texto}</p>;
}
