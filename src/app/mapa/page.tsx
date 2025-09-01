"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Rocket, Home } from "lucide-react";

// Tipado de un lanzamiento (simplificado)
interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
}

// Tipado de una base de lanzamiento (Launchpad)
interface Launchpad {
  id: string;
  name: string;
  full_name: string;
  region: string;
  timezone: string;
  latitude: number;
  longitude: number;
  launches: Launch[];
}

export default function MapaPage() {
  // Estado con todas las bases de lanzamiento (launchpads)
  const [pads, setPads] = useState<Launchpad[]>([]);
  const [loading, setLoading] = useState(true); // Para indicar si aún se están cargando datos
  const router = useRouter();

  // Referencias al contenedor del mapa y a la instancia del mapa
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  // Cargar datos de la API de SpaceX
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) Pedir las bases de lanzamiento
        const { data: padsData } = await api.get("/launchpads");
        // 2) Pedir todos los lanzamientos
        const { data: allLaunches } = await api.get("/launches");

        // Usamos un Map para agrupar lanzamientos por base
        const launchpadMap = new Map<string, Launchpad>();

        // Crear las bases vacías con su información principal
        padsData.forEach((pad: any) => {
          launchpadMap.set(pad.id, {
            id: pad.id,
            name: pad.name,
            full_name: pad.full_name,
            region: pad.region,
            timezone: pad.timezone,
            latitude: pad.latitude,
            longitude: pad.longitude,
            launches: [],
          });
        });

        // Asociar cada lanzamiento a su base de lanzamiento
        allLaunches.forEach((launch: any) => {
          const pad = launchpadMap.get(launch.launchpad);
          if (pad) {
            pad.launches.push({
              id: launch.id,
              name: launch.name,
              date_utc: launch.date_utc,
              success: launch.success,
            });
          }
        });

        // Guardamos en el estado final como arreglo
        setPads(Array.from(launchpadMap.values()));
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Inicializar el mapa y agregar los marcadores
  useEffect(() => {
    // Verificar que Google Maps esté disponible y que el mapa no esté ya creado
    if (
      typeof window === "undefined" ||
      !window.google ||
      !mapRef.current ||
      mapInstance.current ||
      loading
    )
      return;

    // Crear mapa centrado en (0,0)
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 2,
    });

    // Agregar un marcador por cada base de lanzamiento
    pads.forEach((pad) => {
      const marker = new window.google.maps.Marker({
        position: { lat: pad.latitude, lng: pad.longitude },
        map: mapInstance.current!,
        title: pad.name,
      });

      // Ventana de información (al hacer click en el marcador)
      const infoWindow = new window.google.maps.InfoWindow();

      marker.addListener("click", () => {
        // Listado de lanzamientos
        const launchList = pad.launches
          .map((l) => {
            const date = new Date(l.date_utc).toLocaleDateString();
            const status =
              l.success === true
                ? `<span style="color: green; font-weight: 500;">Éxito</span>`
                : l.success === false
                ? `<span style="color: red; font-weight: 500;">Fallo</span>`
                : `<span style="color: red; font-weight: 500;">Fallo</span>`;

            return `
              <li style="margin-bottom:8px; font-size:14px;">
                <span style="font-weight:500;">${l.name}</span><br />
                <span style="color:#475569;">${date} – ${status}</span>
              </li>`;
          })
          .join("");

        const contentHTML = `
          <div style="
            font-family: 'Segoe UI', sans-serif;
            padding: 16px;
            max-width: 320px;
            background: #fff;
            color: #1a1a1a;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          ">
            <h2 style="margin-top:0; font-size:18px; color:#0f172a;">
              ${pad.name}
            </h2>
            <p><strong>Nombre completo:</strong> ${pad.full_name}</p>
            <p><strong>Región:</strong> ${pad.region}</p>
            <p><strong>Zona horaria:</strong> ${pad.timezone}</p>
            <p><strong>Coordenadas:</strong> ${pad.latitude.toFixed(
              4
            )}, ${pad.longitude.toFixed(4)}</p>
            <hr style="margin:12px 0;" />
            <p style="margin-bottom:8px; font-weight:600;">Lanzamientos:</p>
            <ul style="padding-left:16px; margin:0; max-height: 200px; overflow-y: auto;">
              ${
                launchList ||
                `<li style="color:#64748b;">No hay lanzamientos.</li>`
              }
            </ul>
          </div>`;

        // Mostrar la ventana sobre el marcador
        infoWindow.setContent(contentHTML);
        infoWindow.open({
          anchor: marker,
          map: mapInstance.current!,
          shouldFocus: false,
        });
      });
    });
  }, [loading, pads]);

  // Mientras se cargan los datos
  if (loading) {
    return <p className="p-6 text-center">Cargando mapa...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        <nav className="bg-secondary px-6 py-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center text-primary text-xl font-bold">
            <Rocket size={28} /> Mapa de Bases
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-foreground hover:text-primary transition"
          >
            <Home size={20} /> Inicio
          </button>
        </nav>

        {/* Contenedor del mapa */}
        <div
          className="mx-auto mt-6 rounded-xl shadow-lg overflow-hidden"
          style={{ height: "600px", width: "90%" }}
        >
          <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        </div>
      </div>
    </div>
  );
}
