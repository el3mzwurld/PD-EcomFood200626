import { seededRandom } from "../supporters/randomizer";
import {
  localMenuMapper,
  fastFoodMenuMapper,
  continentalMenuMapper,
} from "../data/menuMapper";
import type { Cuisine, Meal, SupportedCountry } from "../types/types";
import type { MealTemplate } from "../data/nigerian";
import { useEffect, useState } from "react";

const apiCuisineDishes: Partial<Record<Cuisine, string[]>> = {
  Italian: [
    "Spaghetti Bolognese",
    "Spicy Arrabiata Penne",
    "Vegan Lasagna",
    "Mediterranean Pasta Salad",
    "Potato Gratin with Chicken",
    "Rigatoni with fennel sausage sauce",
    "Chicken Alfredo Primavera",
    "Osso Buco alla Milanese",
    "Ribollita",
    "Salmon Prawn Risotto",
    "Fettucine alfredo",
    "Pilchard puttanesca",
    "Venetian Duck Ragu",
    "Chilli prawn linguine",
    "Lasagne",
    "Spinach & Ricotta Cannelloni",
    "Squash linguine",
    "Budino Di Ricotta",
    "Spaghetti alla Carbonara",
    "Pizza Express Margherita",
    "Fettuccine Alfredo",
  ],
  Chinese: [
    "Kung Pao Chicken",
    "Kung Po Prawns",
    "Ma Po Tofu",
    "Wontons",
    "Sweet and Sour Pork",
    "Szechuan Beef",
    "General Tsos Chicken",
    "Beef Lo Mein",
    "Shrimp Chow Fun",
    "Hot and Sour Soup",
    "Egg Drop Soup",
    "Chicken Congee",
    "Chinese Orange Chicken",
    "Beef and Broccoli Stir-Fry",
    "Chicken Fried Rice",
    "Singapore Noodles with Shrimp",
    "Silken Tofu with Sesame Soy Sauce",
    "Egg Foo Young",
    "Sichuan Style Stir-Fried Chinese Long Beans",
    "Chinese Tomato Egg Stir Fry",
  ],
  American: [
    "Big Mac",
    "Chick-Fil-A Sandwich",
    "BBQ Pork Sloppy Joes",
    "Buffalo Chicken",
    "Chicken Fajita Mac and Cheese",
    "Chicken Enchilada Casserole",
    "Chicken Pot Pie",
    "Clam chowder",
    "New York cheesecake",
    "Key Lime Pie",
    "Choc Chip Pecan Pie",
    "Peanut Butter Cheesecake",
    "Apple Frangipan Tart",
    "Banana Pancakes",
    "American Pancakes",
    "Chocolate Brownie",
  ],
  Indian: [
    "Dal fry",
    "Chicken Handi",
    "Lamb Biryani",
    "Tandoori chicken",
    "Baingan Bharta",
    "Lamb Rogan josh",
    "Recheado Masala Fish",
    "Nutty Chicken Curry",
    "Matar Paneer",
    "Kidney Bean Curry",
    "Smoked Haddock Kedgeree",
    "Bread omelette",
    "Chicken Mandi",
    "Beef Mandi",
  ],
};
const ghanaPriceMultiplier = 0.0068;
const kenyaPriceMultiplier = 0.084;
const pexels_api_key =
  "OixvBMtlsxC23FN6vYVTAMZx7GRmCWRVzn86TWvJH1WWXDl02iyENJ9S";

const randomMealTier = (): "Starter" | "Mains" => {
  const Arr: ("Starter" | "Mains")[] = ["Starter", "Mains"];
  const rand_index = Math.floor(Math.random() * Arr.length);

  return Arr[rand_index];
};

const mealPricer = (resID: string, country_code: SupportedCountry): number => {
  const meal_cat = randomMealTier();
  let price = 0;
  let normalized_price = price;
  const random = seededRandom(resID);
  if (meal_cat === "Starter") {
    const min = 1000;
    const max = 3000;
    price = Math.floor(Math.random() * (max - min + 1)) + min;

    if (country_code === "NG") {
      normalized_price = price;
      return Number(normalized_price.toFixed(0));
    } else if (country_code === "GH") {
      normalized_price = price * ghanaPriceMultiplier;
      return Number(normalized_price.toFixed(0));
    } else {
      normalized_price = price * kenyaPriceMultiplier;
      return Number(normalized_price.toFixed(0));
    }
  } else if (meal_cat === "Mains") {
    const min = 2000;
    const max = 10000;
    price = Math.floor(Math.random() * (max - min + 1)) + min;

    if (country_code === "NG") {
      normalized_price = price;
      return Number(normalized_price.toFixed(0));
    } else if (country_code === "GH") {
      normalized_price = price * ghanaPriceMultiplier;
      return Number(normalized_price.toFixed(0));
    } else {
      normalized_price = price * kenyaPriceMultiplier;
      return Number(normalized_price.toFixed(0));
    }
  }

  return normalized_price;
};

interface MealDBResponse {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strMealThumb: string;
}

//helper function to map cuisine to the Meal type

const mealDBMapper = (
  meal: MealDBResponse,
  restaurantID: string,
  country_Code: SupportedCountry,
): Meal => {
  return {
    id: `${restaurantID}-${meal.idMeal}`,
    restaurantID: restaurantID,
    name: meal.strMeal,
    description: `A classic ${meal.strCategory.toLowerCase()} dish - made in ${meal.strArea.toLowerCase()}, straight to your doorstep.`,
    category: randomMealTier(),
    price: mealPricer(restaurantID, country_Code),
    photoUrl: meal.strMealThumb,
  };
};

export const useMenu = (
  restaurantID?: string,
  cuisine?: Cuisine,
  countryCode?: SupportedCountry | undefined,
) => {
  const [menu, setMenu] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const the_meal_db_url =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  useEffect(() => {
    if (!restaurantID || !cuisine || !countryCode) {
      return;
    }

    const random = seededRandom(restaurantID);

    const fetchMealImages = async (mealName: string) => {
      const name = `${mealName} menu item`;
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(name)}&per_page=1`,
        {
          headers: {
            Authorization: pexels_api_key,
          },
        },
      );

      const data = await response.json();

      const image = data.photos?.[0]?.src?.large ?? null;
      return image;
    };
    //local menu
    const localMealNormalize = (meal: MealTemplate): Meal => {
      return {
        ...meal,
        id: `${restaurantID}-${meal.name.toLowerCase().replace(/\s+/g, "-")}`,
        restaurantID: restaurantID,
      };
    };
    //shuffle menu order
    const shuffleAndNormalizeMenu = (meals: MealTemplate[]): Meal[] => {
      const shuffledMeals = [...meals].sort(() => random() - 0.5);

      return shuffledMeals.map((meal) => localMealNormalize(meal));
    };

    const createLocalMenu = async () => {
      let dataset: MealTemplate[] | undefined;

      // check what the cuisine is and match the cuisine to the specific meal mapper
      if (cuisine === "Fast Food") {
        dataset = fastFoodMenuMapper[countryCode as SupportedCountry];
      } else if (cuisine === "Continental") {
        dataset = continentalMenuMapper[countryCode as SupportedCountry];
      } else {
        dataset = localMenuMapper[cuisine];
      }

      if (!dataset) {
        setError("Menu not available");
        return;
      }

      const shuffledMeals = shuffleAndNormalizeMenu(dataset);
      const images = await Promise.all(
        shuffledMeals.map((m) => fetchMealImages(m.name)),
      );

      const meals: Meal[] = shuffledMeals.map((meal, index) => {
        return {
          ...meal,
          photoUrl: images[index] as string,
        };
      });

      setMenu(meals);
    };

    //api menu

    const fetchApiMenu = async () => {
      setIsLoading(true);
      setError(null);

      const dishes = apiCuisineDishes[cuisine] ?? [];
      try {
        //fetch recipe data from the meal db api
        const search_results = await Promise.all(
          dishes.map(async (dish) => {
            const res = await fetch(
              `${the_meal_db_url}${encodeURIComponent(dish)}`,
            );
            const data = await res.json();
            return data.meals?.[0] ?? null;
          }),
        );
        //filter out the null meals that couldn't be found and map the found meals into Meal objects
        const meals = search_results
          .filter((meal) => meal !== null)
          .map((meal) => {
            const mappedMeal = mealDBMapper(meal, restaurantID, countryCode);

            return { ...mappedMeal };
          });
        // if no meal was found, we return Menu not available
        if (meals.length === 0) {
          setError("Menu not available");
          return;
        }
        //set menu with new menu objects
        setMenu(meals);
      } catch (error) {
        setError("Failed to fetch Menu.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const isApiCuisine = cuisine in apiCuisineDishes;

    if (isApiCuisine) {
      fetchApiMenu();
    } else {
      createLocalMenu();
    }
  }, [restaurantID, cuisine, countryCode]);

  return {
    menu,
    isLoading,
    error,
  };
};
