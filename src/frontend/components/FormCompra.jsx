import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { comprarTicket, getDisponibilidad } from "../services/api.js";

const REGEX_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Validamos todo en el front antes de molestar al servidor
function validar({ nombre, email, horario, cantidad }) {
  const errores = {};
  const nombreLimpio = nombre.trim();

  if (!nombreLimpio) errores.nombre = "El nombre es obligatorio";
  else if (nombreLimpio.length < 3) errores.nombre = "Mínimo 3 caracteres";
  else if (nombreLimpio.length > 40) errores.nombre = "Máximo 40 caracteres";

  if (!email.trim()) errores.email = "El email es obligatorio";
  else if (!REGEX_EMAIL.test(email.trim())) errores.email = "Ingresá un email válido (ej: nombre@correo.com)";

  if (!horario) errores.horario = "Elegí un horario";

  const cant = Number(cantidad);
  if (!Number.isInteger(cant) || cant < 1 || cant > 10) errores.cantidad = "Podés comprar de 1 a 10 tickets";

  return errores;
}

export default function FormCompra({ pelicula }) {
  const [form, setForm] = useState({
    nombre: "",
    email: localStorage.getItem("cine_email") || "",
    horario: "",
    cantidad: 1,
  });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [disponibles, setDisponibles] = useState(null);

  // Cada vez que cambia el horario (o después de comprar) consultamos cuántos lugares quedan
  useEffect(() => {
    if (!form.horario) {
      setDisponibles(null);
      return;
    }
    getDisponibilidad(pelicula.id, form.horario)
      .then((r) => setDisponibles(r.disponibles))
      .catch(() => setDisponibles(null));
  }, [form.horario, pelicula.id, ticket]);

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: undefined });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    const erroresNuevos = validar(form);
    setErrores(erroresNuevos);
    if (Object.keys(erroresNuevos).length > 0) return;

    setEnviando(true);
    setErrorApi(null);
    try {
      const nuevo = await comprarTicket({
        pelicula_id: pelicula.id,
        horario: form.horario,
        cantidad: Number(form.cantidad),
        nombre: form.nombre.trim(),
        email: form.email.trim(),
      });
      localStorage.setItem("cine_email", nuevo.email);
      setTicket(nuevo);
    } catch (err) {
      setErrorApi(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (ticket) {
    return (
      <div className="space-y-3 rounded-xl border border-green-300 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950">
        <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">¡Compra confirmada! 🎟️</h3>
        <p className="text-sm">
          {ticket.cantidad} ticket(s) para <strong>{ticket.titulo}</strong> a las {ticket.horario}.
          <br />
          Total: <strong>${ticket.total.toLocaleString("es-AR")}</strong>
        </p>
        <div className="flex gap-3 text-sm">
          <Link to="/mis-tickets" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
            Ver mis tickets
          </Link>
          <button onClick={() => setTicket(null)} className="underline">
            Comprar otro
          </button>
        </div>
      </div>
    );
  }

  const total = pelicula.precio * (Number(form.cantidad) || 0);
  const claseInput =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";

  return (
    <form onSubmit={manejarEnvio} noValidate className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold">Comprar tickets</h3>

      <Campo etiqueta="Nombre completo" error={errores.nombre}>
        <input name="nombre" value={form.nombre} onChange={manejarCambio} maxLength={40} className={claseInput} />
      </Campo>

      <Campo etiqueta="Email" error={errores.email}>
        <input name="email" type="email" value={form.email} onChange={manejarCambio} className={claseInput} />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo etiqueta="Horario" error={errores.horario}>
          <select name="horario" value={form.horario} onChange={manejarCambio} className={claseInput}>
            <option value="">Elegí uno</option>
            {pelicula.horarios.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </Campo>

        <Campo etiqueta="Cantidad" error={errores.cantidad}>
          <input name="cantidad" type="number" min="1" max="10" value={form.cantidad} onChange={manejarCambio} className={claseInput} />
        </Campo>
      </div>

      {disponibles !== null && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Lugares disponibles en esta función: {disponibles}</p>
      )}

      {errorApi && <p className="text-sm text-red-600 dark:text-red-400"> {errorApi}</p>}

      <div className="flex items-center justify-between">
        <span className="font-semibold">Total: ${total.toLocaleString("es-AR")}</span>
        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {enviando ? "Procesando..." : "Comprar"}
        </button>
      </div>
    </form>
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
