import { useLocation } from "../context/locationContext";
import { enrichRestaurant } from "../supporters/enrichRestaurants";
import {
  fetchNearbyRestaurants,
  fetchRouteTimes,
} from "../supporters/geoapify";
import type { Cuisine, Restaurant } from "../types/types";
import React, { useState, useEffect, useContext, createContext } from "react";
export const DEFAULT_RADIUS = 3000; // 3km — first attempt
export const EXPANDED_RADIUS = 8000; // 8km — one retry if first comes back empty
export const MIN_RESULTS = 3; //if the number of restaurants fall below 3, widen the radius...if it's still thin, fall back on 'We're not available in this location'

interface RestaurantContextType {
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
  // helpers
  fetchRestaurants: () => Promise<void>;
  getRestaurantById: (id: string) => Restaurant | undefined;
  getRestaurantsByCuisine: (cuisine: Cuisine) => Restaurant[];
}

const restaurantContext = createContext<RestaurantContextType | null>(null);

export const RestaurantProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //user location
  const { location } = useLocation();

  const fetchRestaurants = async (signal?: AbortSignal) => {
    if (!location) return;

    setError(null);
    setIsLoading(true);

    try {
      // try fetching in minimum radius
      let rawResults = await fetchNearbyRestaurants(
        location.coords,
        DEFAULT_RADIUS,
        signal,
      );
      // if the number of restaurants found in that radius falls below the minimum treshold, widen the radius and fetch again
      if (rawResults.length < MIN_RESULTS) {
        rawResults = await fetchNearbyRestaurants(
          location.coords,
          EXPANDED_RADIUS,
          signal,
        );
      }
      //   fallback : if it's still under the minimum treshold set error to We don't deliver to this location yet
      if (rawResults.length < MIN_RESULTS) {
        setError("Sorry, we don't deliver to your location yet.");
        return;
      }

      //   get restaurant coordinates
      const restaurantCoords = rawResults.map((res) => ({
        lat: res.properties.lat,
        lng: res.properties.lon,
      }));

      //   get real road network data between user's location and restaurant location
      const routeResults = await fetchRouteTimes(
        location.coords,
        restaurantCoords,
        signal,
      );
      const enrichedRestaurants = rawResults.map((raw, index) =>
        enrichRestaurant(raw, routeResults[index]),
      );

      setRestaurants(enrichedRestaurants);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError("Something went wrong fetching restaurants. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRestaurantById = (id: string): Restaurant | undefined => {
    return restaurants.find((r) => r.id === id);
  };

  const getRestaurantsByCuisine = (cuisine: Cuisine): Restaurant[] => {
    return restaurants.filter((r) => r.cuisine === cuisine);
  };

  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();

    fetchRestaurants(controller.signal);

    return () => controller.abort();
  }, [location?.coords.lat, location?.coords.lng]);

  return (
    <restaurantContext.Provider
      value={{
        restaurants,
        isLoading,
        error,
        fetchRestaurants,
        getRestaurantById,
        getRestaurantsByCuisine,
      }}
    >
      {children}
    </restaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(restaurantContext);

  if (!context)
    throw new Error("Restaurant hook has to be used within the provider");

  return context;
};
