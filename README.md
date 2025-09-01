# 🚀 SpaceX Launches

Aplicación web desarrollada con **Next.js**, **React** y **TypeScript** que permite consultar y explorar información sobre los lanzamientos de **SpaceX**.  
El proyecto incluye funcionalidades de filtrado, gestión de favoritos y una vista de mapa interactivo para ubicar los sitios de lanzamiento.

---

## 📦 Instalación

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/spacex-launches.git
cd spacex-launches

# 2. Instalar dependencias
npm install

# 3. Ejecutar el servidor en modo desarrollo
npm run dev
```

---

## 🧑‍💻 Instrucciones de uso

Una vez iniciado el proyecto en el navegador:

1. **Listado de lanzamientos:** Observaras una lista con información relevante de cada lanzamiento de SpaceX.
2. **Filtros:** Tendras la posibilidad de filtrar los lanzamientos por nombre de la mision, fecha, el resultado de la mision o el modelo del cohete empleado.
3. **Favoritos:** Haz clic en el icono de estrella ⭐ para marcar un lanzamiento como favorito.
4. **Mapa:** Accede al mapa de Google Maps para visualizar las bases de lanzamiento y todos aquellos lanzamientos llevados a cabo en dichas bases.

---

## ⚠️ Consideraciones adicionales

- Necesitas una clave de API de Google Maps para utilizar la vista del mapa.

### ¿Cómo obtener una clave de Google Maps?

1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto (o usa uno existente).
3. Habilita la API de Maps JavaScript.
4. Crea una clave de API en la sección "Credenciales".
5. Agrega tu clave en el archivo de entorno `.env` o `.env.local` como:

```env
VITE_GOOGLE_MAPS_API_KEY=tu_clave_aquí
```

---

## 🛠️ Tecnologías utilizadas

- **React 19** – Librería principal para construir la interfaz.
- **Vite** – Bundler para desarrollo rápido.
- **TypeScript** – Tipado estático.
- **MUI** – Componentes de UI modernos.
- **SWR** – Fetching de datos con caching y revalidación.
- **Axios** – Cliente HTTP.
- **Google Maps API** – Mapa interactivo con marcadores.
- **Tailwind CSS** – Estilado rápido y responsive.
- **Date-fns** – Utilidades para manejar fechas.

---

## ✅ Scripts disponibles

```bash
npm run dev       # Ejecuta la app en modo desarrollo
npm run build     # Compila la app para producción
npm run preview   # Previsualiza la versión de producción localmente
npm run lint      # Ejecuta ESLint para verificar errores
```
