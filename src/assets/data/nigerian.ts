import type { Meal } from "../types/types";

export type MealTemplate = Omit<Meal, "id" | "restaurantID">;

export const nigerianMenu: MealTemplate[] = [
  //Starters
  {
    name: "Puff Puff",
    description: "Sweet fried dough balls",
    price: 1500,
    category: "Starters",
  },
  {
    name: "Suya Skewers",
    description: "Spice grilled beef skewers, sliced onions",
    price: 3500,
    category: "Starters",
  },
  {
    name: "Meat pie",
    description: "Pastry beauty",
    price: 3500,
    category: "Starters",
  },
  {
    name: "Peppered gizzard",
    description: "Fried gizzard in spicy pepper sauce",
    price: 3500,
    category: "Starters",
  },
  {
    name: "Moi Moi",
    description: "Tasty bean cakes, with eggs and crayfish",
    price: 1500,
    category: "Starters",
  },
  //mains
  {
    name: "Jollof Rice & Chicken",
    description: "Smoky party-style jollof, grilled chicken",
    price: 4500,
    category: "Mains",
  },
  {
    name: "Frid Rice & Chicken",
    description: "Nigerian-style fried rice, grilled chicken",
    price: 4500,
    category: "Mains",
  },
  {
    name: "Native Rice",
    description: "Tasty palm oil rice, assorted meat and sea food",
    price: 6000,
    category: "Mains",
  },
  {
    name: "Goat Pepper soup",
    description: "Spicy clear broth with goat meat",
    price: 4000,
    category: "Mains",
  },
  {
    name: "Fried Rice & Beef",
    description:
      "Nigerian-style fried rice, with a twist of beefy richness in every bite",
    price: 7000,
    category: "Mains",
  },
  {
    name: "Amala & Ewedu",
    description:
      "Yam flour swallow, with assorted meat, ewedu and gbegiri, feel that owambe right at your doorstep",
    price: 4000,
    category: "Mains",
  },
  {
    name: "Yam & Egg Sauce",
    description: "Wake up to this Nigerian Classic, right at your doorstep",
    price: 3500,
    category: "Mains",
  },
  {
    name: "Potato Sliders & Chicken",
    description:
      "Mini sweet potato sliders, fried chicken bits and a grilled piece to sooth your cravings",
    price: 4000,
    category: "Mains",
  },
  //drinks
  {
    name: "Coca-Cola",
    description: "Chilled 50cl bottle",
    price: 1000,
    category: "Drinks",
  },
  {
    name: "Fanta Orange",
    description: "Chilled 50cl bottle",
    price: 1000,
    category: "Drinks",
  },
  {
    name: "7up",
    description: "Chilled 50cl bottle",
    price: 1000,
    category: "Drink",
  },
  {
    name: "Zobo",
    description: "An absolute sunday classic",
    price: 1200,
    category: "Drink",
  },
  {
    name: "Freshly Squeezed Orange Juice",
    description: "Cold pressed, bottled chilled, just for you",
    price: 1500,
    category: "Drink",
  },
  {
    name: "Chapman",
    description: "Your luxury cocktail, chilled. Just the way you like",
    price: 2000,
    category: "Drink",
  },
  {
    name: "Grape juice",
    description: "Grape flavored cocktail. With that special twang you like.",
    price: 2500,
    category: "Drink",
  },
];
