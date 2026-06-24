import { useLocation } from "../context/locationContext";
import { enrichRestaurant } from "../supporters/enrichRestaurants";
import {
  fetchNearbyRestaurants,
  fetchRouteTimes,
} from "../supporters/geoapify";
import type { Restaurant } from "../types/types";
import { useState, useEffect } from "react";

export const DEFAULT_RADIUS = 3000; // 3km — first attempt
export const EXPANDED_RADIUS = 8000; // 8km — one retry if first comes back empty
export const MIN_RESULTS = 3; //if the number of restaurants fall below 3, widen the radius...if it's still thin, fall back on 'We're not available in this location'

export const useRestaurant = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // current location state from the context
  const { location } = useLocation();

  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();

    const fetchRestaurants = async () => {
      setError(null);
      setIsLoading(true);

      try {
        // try fetching in minimum radius
        let rawResults = await fetchNearbyRestaurants(
          location.coords,
          DEFAULT_RADIUS,
          controller.signal,
        );
        // if the number of restaurants found in that radius falls below the minimum treshold, widen the radius and fetch again
        if (rawResults.length < MIN_RESULTS) {
          rawResults = await fetchNearbyRestaurants(
            location.coords,
            EXPANDED_RADIUS,
            controller.signal,
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
          controller.signal,
        );
        const enrichedRestaurants = rawResults.map((raw, index) =>
          enrichRestaurant(raw, routeResults[index]),
        );

        setRestaurants(enrichedRestaurants);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          "Something went wrong fetching restaurants. Please try again.",
        );
        console.error(err);
      }
    };

    fetchRestaurants();

    return () => controller.abort();
  }, [location?.coords.lat, location?.coords.lng]);

  return {
    restaurants,
    isLoading,
    error,
  };
};
