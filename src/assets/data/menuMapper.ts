import type { Cuisine, SupportedCountry } from "../types/types";
import {
  continentalMenu,
  ghanaianContMenu,
  ghanaianMenu,
  kenyaContMenu,
} from "./continental";
import {
  fastFoodMenu,
  ghanianFastFoodMenu,
  kenyanFastFoodMenu,
} from "./fastFood";
import { kenyanMenu } from "./kenyan";
import { nigerianMenu, type MealTemplate } from "./nigerian";

export const localMenuMapper: Partial<Record<Cuisine, MealTemplate[]>> = {
  Nigerian: nigerianMenu,
  Kenyan: kenyanMenu,
  Ghanaian: ghanaianMenu,
};

export const continentalMenuMapper: Record<SupportedCountry, MealTemplate[]> = {
  NG: continentalMenu,
  GH: ghanaianContMenu,
  KE: kenyaContMenu,
};

export const fastFoodMenuMapper: Record<SupportedCountry, MealTemplate[]> = {
  NG: fastFoodMenu,
  GH: ghanianFastFoodMenu,
  KE: kenyanFastFoodMenu,
};
