// Logic :
// The logic behind this is to get the responses from the fetchNearbyRestaurants and enrich the restaurant objects with details they need to make sense to the UI

import type { Restaurant, SupportedCountry } from "../types/types";
import type { RawPlace } from "./geoapify";
import { seededRandom } from "./randomizer";
import { resolveCuisine } from "./resolveCuisine";
import placeholder from "../img/placeholder.png";
export const enrichRestaurant = (
  raw: RawPlace,
  route: { distanceKM: number; travelTimeSecs: number; available: boolean },
  country_code?: SupportedCountry,
): Restaurant => {
  const random = seededRandom(raw.properties.place_id);
  const countryCode = raw.properties.country_code.toUpperCase();
  const cuisine = resolveCuisine(
    raw.properties.catering?.cuisine,
    country_code ? country_code : raw.properties.country_code.toUpperCase(),
    random,
  );

  return {
    address: raw.properties.formatted,
    available: route.available,
    coords: {
      lat: raw.properties.lat,
      lng: raw.properties.lon,
    },
    cuisine: cuisine,
    deliveryTimeMins: route.travelTimeSecs / 60,
    distanceKM: route.distanceKM,
    id: raw.properties.place_id,
    priceTier: (Math.floor(random() * 3) + 1) as 1 | 2 | 3,
    name: raw.properties.name,
    rating: +(3.5 + random() * 1.5).toFixed(1),
    photoURL: placeholder,
  };
};
