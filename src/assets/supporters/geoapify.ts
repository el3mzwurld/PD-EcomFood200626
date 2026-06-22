import type { LocationResult, Coordinates } from "../types/types";

const places_url = "https://api.geoapify.com/v2/places";
const autocomplete_url = "https://api.geoapify.com/v1/geocode/autocomplete";
const api_key = import.meta.env.VITE_API_KEY;

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
    format: "json",
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
  formatted: string;
  lat: number;
  lon: number;
  categories: string[];
  catering?: {
    cuisine?: string;
  };
};

type RawPlace = {
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
