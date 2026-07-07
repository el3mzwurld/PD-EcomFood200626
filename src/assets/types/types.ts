//location types

export type Coordinates = {
  lat: number;
  lng: number;
};
export type Currency = "NGN" | "GHS" | "KES";

export type UserLocation = {
  coords: Coordinates;
  label: string; //actual street level address e.g 12 Adeola Hopewell St. VI
  countryCode: SupportedCountry; //NG
  source: "search" | "pin"; //for V1 i'm only using search, but i want to widen it to pin so the user can capture locations that don't nominally exist in the GeoApify API, for example, some streets are excluded.
};

export type LocationResult = {
  id: string;
  label: string;
  coords: Coordinates;
  countryCode: string;
};

export const SupportedCountries = ["NG", "GH", "KE"] as const; //assert it so that supported country knows it HAS to be NG | GH | KE
export type SupportedCountry = (typeof SupportedCountries)[number]; // NG, GH or KE

// Cuisine
export type Cuisine =
  | "Nigerian"
  | "Ghanaian"
  | "Kenyan"
  | "Italian"
  | "Chinese"
  | "Indian"
  | "American"
  | "Fast Food"
  | "Continental";

//restaurant
export type Restaurant = {
  id: string; //geoApify place id
  name: string;
  address: string;
  coords: Coordinates;
  cuisine: Cuisine;
  rating: number; //random, gotten off the id
  distanceKM: number;
  deliveryTimeMins: number;
  priceTier: 1 | 2 | 3;
  photoURL: string | null;
  available: boolean;
};

export type Meal = {
  id: string; //purely generated gotten from the restaurant ID
  restaurantID: string; //gotten off the place ID, passed into the menu page using useParams
  name: string;
  description: string;
  category: string;
  price: number;
  photoUrl?: string | null;
};

//Cart types
export type CartItem = {
  menuItemID: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartState = {
  restaurantID: string | null;
  restaurantName: string | null;
  items: CartItem[];
};

//order types

export type OrderStage =
  | "placed"
  | "confirmed"
  | "preparing"
  | "pickedUp"
  | "onTheWay"
  | "delivered";

export type Order = {
  id: string;
  restaurantID: string;
  restaurantName: string;
  items: CartItem[];
  total: number; //total cost in NGN/GHS/KES
  deliveryAddress: string;
  deliveryCoords: Coordinates;
  driverInstructions: string;
  createdAt: number; // regular JS milliseconds, multiply by 60000 to get time in seconds
  etaMinutes: number; // copied from restaurant delivery time
  paystackReference: string;
};

export type User = {
  name: string;
  email: string;
  password: string;
};
