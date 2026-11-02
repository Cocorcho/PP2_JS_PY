import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem("tema") || "oscuro");

  // Cada vez que cambia el tema lo reflejamos en <html> y lo guardamos
  useEffect(() => {
    document.documentElement.classList.toggle("dark", tema === "oscuro");
    localStorage.setItem("tema", tema);
  }, [tema]);

  const alternarTema = () => setTema((actual) => (actual === "oscuro" ? "claro" : "oscuro"));

  return <ThemeContext.Provider value={{ tema, alternarTema }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme tiene que usarse dentro de ThemeProvider");
  return ctx;
}
