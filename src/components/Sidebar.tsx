"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface SidebarProps {
  year: string;
  result: string;
  rocket: string;
  setYear: (v: string) => void;
  setResult: (v: string) => void;
  setRocket: (v: string) => void;
}

export default function Sidebar({
  year,
  result,
  rocket,
  setYear,
  setResult,
  setRocket,
}: SidebarProps) {
  const [rockets, setRockets] = useState<string[]>([]);

  // Cargar los nombres de los cohetes desde la API al montar el componente
  useEffect(() => {
    const fetchRockets = async () => {
      try {
        const { data } = await api.get("/rockets");
        setRockets(data.map((r: any) => r.name));
      } catch (error) {
        console.error("Error cargando cohetes:", error);
      }
    };

    fetchRockets();
  }, []);

  // Generamos una lista de años desde 2006 hasta 2025
  const years = Array.from({ length: 2025 - 2006 + 1 }, (_, i) =>
    (2006 + i).toString()
  );

  return (
    <aside
      className="
        bg-secondary/80 
        p-4 sm:p-3
        rounded-2xl shadow-xl 
        space-y-6
      "
    >
      <h2 className="text-lg font-semibold mb-2 text-primary">Filtros</h2>

      {/* Año */}
      <div>
        <label className="block text-xs sm:text-sm text-foreground/70 mb-1">
          Año
        </label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="
            w-24 p-1 text-sm sm:w-full sm:p-2 sm:text-base
            rounded-lg bg-background text-foreground
            border border-foreground/20 
          "
        >
          <option value="">Todos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Resultado */}
      <div>
        <label className="block text-xs sm:text-sm text-foreground/70 mb-1">
          Resultado
        </label>
        <select
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="
            w-24 p-1 text-sm sm:w-full sm:p-2 sm:text-base
            rounded-lg bg-background text-foreground
            border border-foreground/20 
          "
        >
          <option value="">Todos</option>
          <option value="success">Éxito</option>
          <option value="failure">Fracaso</option>
        </select>
      </div>

      {/* Cohete */}
      <div>
        <label className="block text-xs sm:text-sm text-foreground/70 mb-1">
          Cohete
        </label>
        <select
          value={rocket}
          onChange={(e) => setRocket(e.target.value)}
          className="
            w-24 p-1 text-sm sm:w-full sm:p-2 sm:text-base
            rounded-lg bg-background text-foreground
            border border-foreground/20 
          "
        >
          <option value="">Todos</option>
          {rockets.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
