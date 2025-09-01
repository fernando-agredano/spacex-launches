"use client";

import { useEffect, useState } from "react";
import LaunchCard from "@/components/LaunchCard";
import { EnrichedLaunch } from "@/types/launch";
import Navbar from "@/components/Navbar";
import api from "@/lib/axios";

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<EnrichedLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      // 1. Obtener los IDs de favoritos guardados en localStorage
      const storedIds = JSON.parse(localStorage.getItem("favorites") || "[]");

      // 2. Para cada ID, hacer varias peticiones y enriquecer los datos del lanzamiento
      const enrichedFavorites = await Promise.all(
        storedIds.map(async (id: string) => {
          // Obtener datos del lanzamiento específico
          const { data: launch } = await api.get(`/launches/${id}`);
          // Obtener datos adicionales del cohete y la base de lanzamiento
          const [rocketRes, padRes] = await Promise.all([
            api.get(`/rockets/${launch.rocket}`),
            api.get(`/launchpads/${launch.launchpad}`),
          ]);

          return {
            id: launch.id,
            name: launch.name,
            date_utc: launch.date_utc,
            success: launch.success,
            rocketName: rocketRes.data.name,
            launchpadName: padRes.data.name,
            latitude: padRes.data.latitude,
            longitude: padRes.data.longitude,
          };
        })
      );

      // 3. Guardar en el estado los favoritos
      setFavorites(enrichedFavorites);
      setLoading(false); // Datos cargados
    };

    fetchFavorites(); // Ejecutar la función
  }, []);

  // Controlar la eliminación de un favorito
  const handleRemove = (id: string) => {
    // 1. Eliminar del estado
    const updated = favorites.filter((launch) => launch.id !== id);
    setFavorites(updated);

    // 2. Actualizar el localStorage
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavorites = stored.filter((favId: string) => favId !== id);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Filtrar favoritos por nombre con la barra de búsqueda
  const filtered = favorites.filter((launch) =>
    launch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar search={search} setSearch={setSearch} />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary mb-6">Mis Favoritos</h1>
        {loading ? (
          <p>Cargando favoritos...</p>
        ) : filtered.length === 0 ? (
          <p>No se encontraron resultados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((launch) => (
              <LaunchCard
                key={launch.id}
                launch={launch}
                onRemoveFavorite={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
