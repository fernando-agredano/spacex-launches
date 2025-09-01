// Estructura basica de lanzamiento
export type Launch = {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  rocket: string;
  launchpad: string;
};

// Estructura complementaria de lanzamiento
export type EnrichedLaunch = {
  id: string;
  name: string;
  date_utc: string;
  success: boolean;
  rocketName: string;
  launchpadName: string;
  latitude: number;
  longitude: number;
};