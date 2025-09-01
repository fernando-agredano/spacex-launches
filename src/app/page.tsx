"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import LaunchCard from "@/components/LaunchCard";
import useLaunches from "@/hooks/useLaunches";
import { useState } from "react";

export default function Home() {
  const { launches, loading, error } = useLaunches();

  // Estados para filtros y búsqueda
  const [search, setSearch] = useState(""); // Texto a buscar por nombre
  const [year, setYear] = useState(""); // Filtro de año
  const [result, setResult] = useState(""); // Filtro de resultado (éxito/fracaso)
  const [rocket, setRocket] = useState(""); // Filtro de cohete

  const filtered = launches.filter((launch) => {
    // 1) Filtro por nombre: compara texto ingresado con el nombre del lanzamiento
    const matchName = launch.name.toLowerCase().includes(search.toLowerCase());

    // 2) Filtro por año: obtenemos el año del lanzamiento
    const launchYear = new Date(launch.date_utc).getFullYear().toString();
    const matchYear = year ? launchYear === year : true;

    // 3) Filtro por resultado: éxito o fracaso
    const matchResult = result
      ? result === "success"
        ? launch.success
        : !launch.success
      : true;

    // 4) Filtro por cohete
    const matchRocket = rocket ? launch.rocketName === rocket : true;

    // El lanzamiento debe cumplir con todos los filtros
    return matchName && matchYear && matchResult && matchRocket;
  });

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Navbar search={search} setSearch={setSearch} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (panel de filtros) */}
        <div className="w-64 shrink-0 overflow-y-auto bg-secondary/80 p-6">
          <Sidebar
            year={year}
            result={result}
            rocket={rocket}
            setYear={setYear}
            setResult={setResult}
            setRocket={setRocket}
          />
        </div>

        {/* Sección principal con la lista de lanzamientos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold text-primary">Lanzamientos</h1>

          {/* Estados de carga y error */}
          {loading && <p>Cargando lanzamientos...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-foreground/70">No se encontraron resultados.</p>
          )}

          {/* Grid de tarjetas con los lanzamientos filtrados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
