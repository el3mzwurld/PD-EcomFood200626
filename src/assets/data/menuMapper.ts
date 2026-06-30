import type { Cuisine, SupportedCountry } from "../types/types";
import {
  continentalMenu,
  ghanaianContMenu,
  kenyaContMenu,
} from "./continental";
import {
  fastFoodMenu,
  ghanianFastFoodMenu,
  kenyanFastFoodMenu,
} from "./fastFood";
import { ghanianMenu } from "./ghanian";
import { kenyanMenu } from "./kenyan";
import { nigerianMenu, type MealTemplate } from "./nigerian";

export const localMenuMapper: Partial<Record<Cuisine, MealTemplate[]>> = {
  Nigerian: nigerianMenu,
  Kenyan: kenyanMenu,
  Ghanaian: ghanianMenu,
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
