import { useState, useEffect } from "react";

export default function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    setError(null);

    fetchFn()
      .then((resultado) => {
        if (activo) {
          setData(resultado);
        }
      })
      .catch((err) => {
        if (activo) {
          setError(err.message || "Error al cargar los datos");
        }
      })
      .finally(() => {
        if (activo) {
          setLoading(false);
        }
      });

    return () => {
      activo = false;
    };
  }, deps);

  return { data, loading, error };
}
