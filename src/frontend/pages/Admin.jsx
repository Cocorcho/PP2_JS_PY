import { useState, useEffect, useCallback } from "react";
import {
  adminGetPeliculas,
  adminGetGeneros,
  adminGetSalas,
  adminCrearPelicula,
  adminEliminarPelicula,
} from "../services/api.js";
import { Cargando, ErrorMensaje, Vacio } from "../components/Estados.jsx";

const FORM_INICIAL = {
  titulo: "",
  director: "",
  año: new Date().getFullYear(),
  genero_id: "",
  sala_id: "",
};

const claseInput =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";

function validar({ titulo, director, año }) {
  const errores = {};

  if (!titulo.trim()) errores.titulo = "El título es obligatorio";
  else if (titulo.trim().length > 100) errores.titulo = "Máximo 100 caracteres";

  if (!director.trim()) errores.director = "El director es obligatorio";
  else if (director.trim().length > 100) errores.director = "Máximo 100 caracteres";

  const anio = Number(año);
  if (!Number.isInteger(anio) || anio <= 0) errores.año = "Ingresá un año válido";

  return errores;
}

export default function Admin() {
  const [peliculas, setPeliculas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const [p, g, s] = await Promise.all([adminGetPeliculas(), adminGetGeneros(), adminGetSalas()]);
      setPeliculas(p);
      setGeneros(g);
      setSalas(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: undefined });
  };

  const agregar = async (e) => {
    e.preventDefault();
    const erroresNuevos = validar(form);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    setEnviando(true);
    setErrorForm(null);
    setAviso(null);
    try {
      const creada = await adminCrearPelicula({
        titulo: form.titulo.trim(),
        director: form.director.trim(),
        año: Number(form.año),
        genero_id: form.genero_id ? Number(form.genero_id) : null,
        sala_id: form.sala_id ? Number(form.sala_id) : null,
        activo: true,
      });
      setAviso(`Se agregó "${creada.titulo}"`);
      setForm(FORM_INICIAL);
      await cargar();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const quitar = async (pelicula) => {
    if (!window.confirm(`¿Eliminar "${pelicula.titulo}"? Esta acción no se puede deshacer.`)) return;

    setEliminandoId(pelicula.id);
    setErrorForm(null);
    setAviso(null);
    try {
      await adminEliminarPelicula(pelicula.id);
      setAviso(`Se eliminó "${pelicula.titulo}"`);
      await cargar();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setEliminandoId(null);
    }
  };

  const nombreDe = (lista, id) => lista.find((x) => x.id === id)?.nombre ?? "—";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Administración de películas</h1>

      <form
        onSubmit={agregar}
        noValidate
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 className="text-lg font-semibold">Agregar película</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Campo etiqueta="Título" error={errores.titulo}>
            <input name="titulo" value={form.titulo} onChange={manejarCambio} maxLength={100} className={claseInput} />
          </Campo>

          <Campo etiqueta="Director" error={errores.director}>
            <input name="director" value={form.director} onChange={manejarCambio} maxLength={100} className={claseInput} />
          </Campo>

          <Campo etiqueta="Año" error={errores.año}>
            <input name="año" type="number" min="1" value={form.año} onChange={manejarCambio} className={claseInput} />
          </Campo>

          <Campo etiqueta="Género">
            <select name="genero_id" value={form.genero_id} onChange={manejarCambio} className={claseInput}>
              <option value="">Sin género</option>
              {generos.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </Campo>

          <Campo etiqueta="Sala">
            <select name="sala_id" value={form.sala_id} onChange={manejarCambio} className={claseInput}>
              <option value="">Sin sala</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </Campo>
        </div>

        {errorForm && <p className="text-sm text-red-600 dark:text-red-400">{errorForm}</p>}
        {aviso && <p className="text-sm text-green-600 dark:text-green-400">{aviso}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {enviando ? "Guardando..." : "Agregar"}
        </button>
      </form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Películas cargadas ({peliculas.length})</h2>

        {loading && <Cargando />}
        {error && <ErrorMensaje mensaje={error} />}
        {!loading && !error && peliculas.length === 0 && <Vacio texto="Todavía no hay películas." />}

        {!loading && !error && peliculas.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Director</th>
                  <th className="px-4 py-3 font-medium">Año</th>
                  <th className="px-4 py-3 font-medium">Género</th>
                  <th className="px-4 py-3 font-medium">Sala</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {peliculas.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3 font-medium">
                      {p.titulo}
                      {!p.activo && (
                        <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-700">inactiva</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.director}</td>
                    <td className="px-4 py-3">{p.año}</td>
                    <td className="px-4 py-3">{nombreDe(generos, p.genero_id)}</td>
                    <td className="px-4 py-3">{nombreDe(salas, p.sala_id)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => quitar(p)}
                        disabled={eliminandoId === p.id}
                        className="rounded-md border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        {eliminandoId === p.id ? "Quitando..." : "Quitar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Campo({ etiqueta, error, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{etiqueta}</span>
      {children}
      {error && <span className="block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
