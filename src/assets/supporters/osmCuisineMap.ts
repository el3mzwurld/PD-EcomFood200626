import type { Cuisine } from "../types/types";
import type { SupportedCountry } from "../types/types";

//map cuisine names to
export const OsmCuisineMapper: Record<string, Cuisine> = {
  //national cuisines
  italian: "Italian",
  chinese: "Chinese",
  american: "American",
  indian: "Indian",

  //dish level tags
  pizza: "Italian",
  burger: "American",
  sandwich: "Fast Food",
  ice_cream: "Fast Food",
  kebab: "Fast Food",
  bbq: "Fast Food",
  wings: "Fast Food",
  noodles: "Fast Food",
  regional: "Fast Food",

  //catch alls, non-generalistic cuisines salads, cakes, basically cuisines that don't capture a specific type of food
  salads: "Continental",
  coffee_shop: "Continental",
  cake: "Continental",
  arab: "Continental",
};
// OSM tags that mean "local to this country" — resolved dynamically using countryCode
export const localAfricanTags = new Set([
  "african",
  "local",
  "waakye",
  "banku",
  "fufu",
  "jollof_rice",
  "plane_rice",
  "pastry",
  "ghanaian",
  "nigerian",
  "kenyan",
]);
//maps supported country codes to their local cuisines
export const countryToCuisine: Record<SupportedCountry, Cuisine> = {
  NG: "Nigerian",
  GH: "Ghanaian",
  KE: "Kenyan",
};

export const weightedCuisinePool: Record<SupportedCountry, Cuisine[]> = {
  NG: [
    "Nigerian",
    "Nigerian",
    "Nigerian",
    "Nigerian",
    "Nigerian",
    "Fast Food",
    "Fast Food",
    "Continental",
    "Chinese",
    "American",
  ],
  GH: [
    "Ghanaian",
    "Ghanaian",
    "Ghanaian",
    "Ghanaian",
    "Ghanaian",
    "Fast Food",
    "Fast Food",
    "Continental",
    "Chinese",
    "American",
  ],
  KE: [
    "Kenyan",
    "Kenyan",
    "Kenyan",
    "Kenyan",
    "Kenyan",
    "Fast Food",
    "Fast Food",
    "Indian",
    "Continental",
    "Chinese",
  ],
};
