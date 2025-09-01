"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios"; // Usamos instancia

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

  // useEffect para cargar los nombres de los cohetes desde la API al montar el componente
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
    <aside className="w-64 bg-secondary/80 p-6 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-primary">Filtros</h2>

      {/* Filtrar por año */}
      <div>
        <label className="block text-sm text-foreground/70 mb-2">Año</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 rounded-lg bg-background text-foreground border border-foreground/20"
        >
          <option value="">Todos</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Filtar por Resultado */}
      <div>
        <label className="block text-sm text-foreground/70 mb-2">
          Resultado
        </label>
        <select
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="w-full p-2 rounded-lg bg-background text-foreground border border-foreground/20"
        >
          <option value="">Todos</option>
          <option value="success">Éxito</option>
          <option value="failure">Fracaso</option>
        </select>
      </div>

      {/* Filtrar por Cohete */}
      <div>
        <label className="block text-sm text-foreground/70 mb-2">Cohete</label>
        <select
          value={rocket}
          onChange={(e) => setRocket(e.target.value)}
          className="w-full p-2 rounded-lg bg-background text-foreground border border-foreground/20"
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
