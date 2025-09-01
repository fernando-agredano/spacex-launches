import { useRouter, usePathname } from "next/navigation";
import { Rocket, Star, Search, Home, MapPin } from "lucide-react";

export default function Navbar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (val: string) => void; // Función que actualiza el estado del buscador
}) {
  const router = useRouter();
  // Hook para determinar en qué ruta/path estamos actualmente
  const pathname = usePathname();

  return (
    <nav className="bg-secondary px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-2 text-primary text-xl font-bold">
        <Rocket size={28} /> SpaceX Launches
      </div>

      <div className="flex items-center bg-background rounded-xl px-3 py-1 w-72 border border-foreground/20">
        <Search className="text-foreground/60" />
        <input
          type="text"
          placeholder="Buscar misión..."
          className="bg-transparent text-foreground outline-none px-2 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/mapa")}
          className="flex items-center gap-1 text-foreground hover:text-primary transition"
        >
          <MapPin size={20} /> Mapa
        </button>

        {pathname !== "/favoritos" && (
          <button
            onClick={() => router.push("/favoritos")}
            className="flex items-center gap-1 text-foreground hover:text-primary transition"
          >
            <Star size={20} /> Favoritos
          </button>
        )}

        {pathname === "/favoritos" && (
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-foreground hover:text-primary transition"
          >
            <Home size={20} /> Inicio
          </button>
        )}
      </div>
    </nav>
  );
}
