import { createContext, useContext, useState, useEffect } from "react";

const FavoritosContext = createContext(null);

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favoritos")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const esFavorito = (id) => favoritos.some((p) => p.id === id);

  const alternarFavorito = (pelicula) => {
    setFavoritos((actuales) =>
      esFavorito(pelicula.id) ? actuales.filter((p) => p.id !== pelicula.id) : [...actuales, pelicula]
    );
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, esFavorito, alternarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos tiene que usarse dentro de FavoritosProvider");
  return ctx;
}
