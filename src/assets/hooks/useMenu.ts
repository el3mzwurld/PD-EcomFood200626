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
    "Spaghetti Carbonara",
    "Pizza",
    "Tiramisu",
    "Risotto",
    "Penne Arrabiata",
    "Spaghetti",
    "Vegan Lasagna",
    "Squash linguine",
    "Rigatoni with fennel sausage sauce",
    "Fettucine alfredo",
  ],
  Chinese: [
    "Kung Pao Chicken",
    "Sweet and Sour Pork",
    "Fried Rice",
    "Dim Sum",
    "Peking Duck",
  ],
  American: [
    "Beef Burger",
    "BBQ Ribs",
    "Mac and Cheese",
    "Club Sandwich",
    "Buffalo Wings",
  ],
  Indian: [
    "Chicken Tikka Masala",
    "Butter Chicken",
    "Biryani",
    "Palak Paneer",
    "Lamb Rogan Josh",
  ],
};

interface MealDBResponse {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
}

//helper function to map cuisine to the Meal type

const mealDBMapper = (meal: MealDBResponse, restaurantID: string): Meal => {
  return {
    id: `${restaurantID}-${meal.idMeal}`,
    restaurantID: restaurantID,
    name: meal.strMeal,
    description: `A classic ${meal.strCategory.toLowerCase()} dish - made in ${meal.strArea.toLowerCase()}, straight to your doorstep.`,
    category: "Mains",
    price: 0,
  };
};

export const useMenu = (
  restaurantID: string,
  cuisine: Cuisine,
  countryCode: SupportedCountry,
) => {
  const [menu, setMenu] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const the_meal_db_url =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  useEffect(() => {
    if (!restaurantID || !cuisine) {
      return;
    }

    const random = seededRandom(restaurantID);

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

    const createLocalMenu = () => {
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

      setMenu(shuffleAndNormalizeMenu(dataset));
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
            const mappedMeal = mealDBMapper(meal, restaurantID);
            const price = 100; //TODO : i need to add currency-aware price generation ::: he price itself for these api generated meals will be randomized using the seededRandom generator...but what'll happen is this
            // the price will be unified across the page and will change according to the currency the user picks.

            return { ...mappedMeal, price };
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
