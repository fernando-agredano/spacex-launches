"use client";

import { Rocket, Calendar, MapPin, Star } from "lucide-react";
import { EnrichedLaunch } from "@/types/launch";
import { useEffect, useState } from "react";

type Props = {
  launch: EnrichedLaunch; // Información del lanzamiento
  onRemoveFavorite?: (id: string) => void; // Callback para remover un lanzamiento de favoritos
};

// Componente LaunchCard: muestra la tarjeta con la info de un lanzamiento
export default function LaunchCard({ launch, onRemoveFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Obtenemos la lista de favoritos del localStorage
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites) as string[];
      // Verificamos si este lanzamiento ya está en favoritos
      setIsFavorite(favorites.includes(launch.id));
    }
  }, [launch.id]);

  // Función para agregar o quitar un lanzamiento de favoritos
  const toggleFavorite = () => {
    const stored = localStorage.getItem("favorites");
    let favorites = stored ? JSON.parse(stored) : [];

    if (favorites.includes(launch.id)) {
      favorites = favorites.filter((id: string) => id !== launch.id);
      setIsFavorite(false);
      localStorage.setItem("favorites", JSON.stringify(favorites));

      if (onRemoveFavorite) onRemoveFavorite(launch.id);
    } else {
      favorites.push(launch.id);
      setIsFavorite(true);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  };

  return (
    <div className="relative bg-secondary/70 rounded-2xl p-6 shadow-lg hover:scale-105 transition transform duration-300">
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 text-yellow-400 hover:text-yellow-500"
        aria-label="Agregar a favoritos"
      >
        <Star fill={isFavorite ? "currentColor" : "none"} size={20} />
      </button>
      <h3 className="text-lg font-bold text-primary mb-2">{launch.name}</h3>
      <div className="flex items-center gap-2 text-foreground/70 text-sm mb-1">
        <Calendar size={16} />
        {new Date(launch.date_utc).toLocaleDateString("es-ES")}
      </div>
      <div className="flex items-center gap-2 text-foreground/70 text-sm mb-1">
        <Rocket size={16} />
        {launch.rocketName}
      </div>
      <div className="flex items-center gap-2 text-foreground/70 text-sm">
        <MapPin size={16} />
        {launch.launchpadName} ({launch.latitude.toFixed(2)},{" "}
        {launch.longitude.toFixed(2)})
      </div>
      <span
        className={`mt-3 inline-block px-3 py-1 rounded-full text-xs ${
          launch.success ? "bg-green-600" : "bg-red-600"
        } text-white`}
      >
        {launch.success ? "Éxito" : "Fracaso"}
      </span>
    </div>
  );
}
