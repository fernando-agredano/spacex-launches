import { useEffect, useState } from "react";
import { EnrichedLaunch } from "@/types/launch";
import api from "@/lib/axios";

export default function useLaunches() {
  // Estado que almacena la lista de lanzamientos complementarios
  const [launches, setLaunches] = useState<EnrichedLaunch[]>([]);
  // Estado que indica si los datos aún se están cargando
  const [loading, setLoading] = useState(true);
  // Estado que guarda un mensaje de error en caso de un fallo
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const { data } = await api.get("/launches");
        const enriched = await Promise.all(
          data.map(async (launch: any) => {
            // Ejecución de 2 peticiones en paralelo: cohete y plataforma de lanzamiento
            const [rocketRes, padRes] = await Promise.all([
              api.get(`/rockets/${launch.rocket}`),
              api.get(`/launchpads/${launch.launchpad}`),
            ]);

            return {
              id: launch.id,
              name: launch.name,
              date_utc: launch.date_utc,
              success: launch.success,
              rocketName: rocketRes.data.name,       // Nombre del cohete
              launchpadName: padRes.data.name,       // Nombre de la plataforma
              latitude: padRes.data.latitude,        // Latitud de la plataforma
              longitude: padRes.data.longitude,      // Longitud de la plataforma
            };
          })
        );

        setLaunches(enriched);
      } catch (err) {
        setError("Error al cargar los lanzamientos");
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  return { launches, loading, error };
}
