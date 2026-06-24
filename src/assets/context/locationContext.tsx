import React from "react";
import { createContext, useContext, useState } from "react";
import type { UserLocation, LocationResult } from "../types/types";
import { SupportedCountries } from "../types/types";

type LocationContextType = {
  location: UserLocation | null;
  locationError: string | null;
  setLocation: (result: LocationResult) => void;
  clearLocation: () => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

const local_storage_location_key = "nyamza:location";

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //check if a location has already been saved in local storage
  const [location, setLocationState] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem(local_storage_location_key);
    return saved ? JSON.parse(saved) : null;
  });

  const [locationError, setLocationError] = useState<string | null>(null);

  const setLocation = (result: LocationResult) => {
    if (
      !SupportedCountries.includes(result.countryCode as "NG" | "GH" | "KE")
    ) {
      setLocationError(
        "Sorry, Nyamza isn't available in this location yet. We currently support Nigeria, Ghana and Kenya, coming soon to Niger and Benin.",
      );
      return;
    }
    // set the user's location
    const userLocation: UserLocation = {
      coords: result.coords,
      countryCode: result.countryCode,
      label: result.label,
      source: "search",
    };

    //   set it in local storage
    localStorage.setItem(
      local_storage_location_key,
      JSON.stringify(userLocation),
    );
    setLocationState(userLocation);
    setLocationError(null);
  };

  // clear location from local storage
  const clearLocation = () => {
    localStorage.removeItem(local_storage_location_key);
    setLocationState(null);
    setLocationError(null);
  };

  return (
    <LocationContext.Provider
      value={{ location, locationError, setLocation, clearLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("use Location must be used within a LocationProvider");
  }
  return context;
};
