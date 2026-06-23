// Logic :
// The logic behind this is to get the responses from the fetchNearbyRestaurants and enrich the restaurant objects with details they need to make sense to the UI

import type { Restaurant } from "../types/types";
import { seededRandom } from "./randomizer";
import { resolveCuisine } from "./resolveCuisine";

// (alias) type Restaurant = {
//  id: string;
//  name: string;
//  address: string;
//  coords: Coordinates;
//  cuisine: Cuisine;
//  rating: number;
//  distanceKM: number;
//  deliveryTimeMins: number;
//  priceTier: 1 | 2 | 3;
//  photoURL: string | null;
//  available: boolean;
// }

interface RawRestaurant {
  id: string;
  name: string;
  address: string;
  country_code: string;
  lat: number;
  lon: number;
  categories: string[];
  catering?: {
    cuisine?: string;
  };
}

export const enrichRestaurant = (
  raw: RawRestaurant,
  route: { distanceKM: number; travelTimeSecs: number; available: boolean },
): Restaurant => {
  const random = seededRandom(raw.id);
  const countryCode = raw.country_code.toUpperCase();
  const cuisine = resolveCuisine(raw.catering?.cuisine, countryCode, random);

  return {
    address: raw.address,
    available: route.available,
    coords: {
      lat: raw.lat,
      lng: raw.lon,
    },
    cuisine: cuisine,
    deliveryTimeMins: route.travelTimeSecs / 60,
    distanceKM: route.distanceKM,
    id: raw.id,
    priceTier: (Math.floor(random() * 3) + 1) as 1 | 2 | 3,
    name: raw.name,
    rating: +(3.5 + random() * 1.5).toFixed(1),
    photoURL: `https://picsum.photos/seed/${raw.id}/400/250`,
  };
};
