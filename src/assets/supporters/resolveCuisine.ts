import type { Cuisine, SupportedCountry } from "../types/types";
import {
  OsmCuisineMapper,
  localAfricanTags,
  countryToCuisine,
  weightedCuisinePool,
} from "./osmCuisineMap";

export function resolveCuisine(
  rawOsmCuisineString: string | undefined,
  countryCode: string,
  rand: () => number,
): Cuisine {
  if (rawOsmCuisineString) {
    //split the compound tags into individual tokens : if there's no semi colon, JS will treat it as an array of 1 element
    const tokens = rawOsmCuisineString
      .toLowerCase()
      .split(";")
      .map((t) => t.trim());

    for (const cuisine of tokens) {
      if (localAfricanTags.has(cuisine)) {
        return (
          countryToCuisine[countryCode as SupportedCountry] ?? "Continental"
        );
      }

      const mappedCuisine = OsmCuisineMapper[cuisine];
      if (mappedCuisine) return mappedCuisine;
    }
  }
  //if no cuisine matches our mappers - we will sort of infer the cuisine, by randomizing on the weighted pool using the country code as a sort of guide
  const pool = weightedCuisinePool[countryCode as SupportedCountry];

  if (pool) {
    return pool[Math.floor(rand() * pool.length)];
  }
  // if somehow the country code doesn't exist on our weighted pool, return a continental dish
  return "Continental";
}
