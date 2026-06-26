import type { LocationResult, Coordinates } from "../types/types";

const places_url = "https://api.geoapify.com/v2/places";
const autocomplete_url = "https://api.geoapify.com/v1/geocode/autocomplete";
const api_key = "adbe980b02b341a498650221d57beea8";
const routing_matrix_url = "https://api.geoapify.com/v1/routematrix";
type GeoapifyFeature = {
  properties: {
    place_id: string;
    formatted: string;
    lat: number;
    lon: number;
    country_code: string;
  };
};

type GeoapifyResponse = {
  features: GeoapifyFeature[];
};

// auto complete suggestions

export async function fetchLocationSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<LocationResult[]> {
  // search parameters
  const params = new URLSearchParams({
    text: query,
    apiKey: api_key,
    limit: "5", //maximum of 5 suggestions per search
  });

  // fetch data
  const res = await fetch(`${autocomplete_url}?${params}`, { signal });

  // if the response is unsuccesful throw error
  if (!res.ok) throw new Error(`Autocomplete error, ${res.status}`);

  const data: GeoapifyResponse = await res.json();
  // filter the data into valid arrays
  const filtered_data = data.features.filter(
    (f) =>
      f.properties.place_id &&
      f.properties.formatted &&
      f.properties.lat &&
      f.properties.lon &&
      f.properties.country_code,
  );

  return filtered_data.map(
    (data): LocationResult => ({
      id: data.properties.place_id,
      label: data.properties.formatted,
      coords: {
        lat: data.properties.lat,
        lng: data.properties.lon,
      },
      countryCode: data.properties.country_code.toUpperCase(),
    }),
  );
}

type RawPlaceProperties = {
  place_id: string;
  name: string;
  country_code: string;
  formatted: string;
  lat: number;
  lon: number;
  categories: string[];
  catering?: {
    cuisine?: string;
  };
};

export type RawPlace = {
  properties: RawPlaceProperties;
};

type PlacesResponse = {
  features: RawPlace[];
};

export async function fetchNearbyRestaurants(
  coords: Coordinates,
  radius: number,
  signal?: AbortSignal,
): Promise<RawPlace[]> {
  //radius search parameters
  const params = new URLSearchParams({
    categories: "catering.restaurant,catering.fast_food",
    filter: `circle:${coords.lng},${coords.lat},${radius}`,
    limit: "20",
    apiKey: api_key,
  });

  // fetch data
  const res = await fetch(`${places_url}?${params}`, { signal });

  if (!res.ok) throw new Error(`Places fetch failed: ${res.status}`);

  const data: PlacesResponse = await res.json();

  const filtered_data = data.features.filter(
    (f) =>
      f.properties.place_id &&
      f.properties.name &&
      f.properties.lat &&
      f.properties.lon,
  );

  return filtered_data;
}

type RouteResult = {
  distanceKM: number;
  travelTimeSecs: number;
  available: boolean;
};

type RouteMatrixResponse = {
  sources_to_targets: Array<
    Array<{
      distance: number;
      time: number;
      source_index: number;
      target_index: number;
    } | null>
  >;
};

export async function fetchRouteTimes(
  userCoords: Coordinates,
  restaurantCoords: Coordinates[],
  signal?: AbortSignal,
): Promise<RouteResult[]> {
  const body = {
    mode: "drive",
    sources: [{ location: [userCoords.lat, userCoords.lng] }],
    targets: restaurantCoords.map((c) => ({ location: [c.lat, c.lng] })),
  };

  const res = await fetch(`${routing_matrix_url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: signal,
  });

  if (!res.ok)
    throw new Error(
      `Failed to find route matrix for source :${userCoords} to targets : ${restaurantCoords}`,
    );

  const data: RouteMatrixResponse = await res.json();

  const routes = data.sources_to_targets[0].map((place): RouteResult => {
    if (!place) {
      return { distanceKM: 0, available: false, travelTimeSecs: 0 };
    }
    return {
      distanceKM: +(place.distance / 1000).toFixed(2),
      travelTimeSecs: place.time,
      available: true,
    };
  });

  return routes;
}
