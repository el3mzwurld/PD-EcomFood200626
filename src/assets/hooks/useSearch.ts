import { useEffect, useState } from "react";
import { fetchLocationSuggestions } from "../supporters/geoapify";
import type { LocationResult } from "../types/types";

export const useSearch = (query: string) => {
  // states
  const [results, setResults] = useState<LocationResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchLocation = async (query: string, signal?: AbortSignal) => {
    setIsLoading(true);
    setSearchError(null);

    try {
      const data = await fetchLocationSuggestions(query, signal);
      console.log(data);
      if (data.length == 0) {
        setSearchError("No locations were found for this query");
        return;
      }

      setResults(data);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      console.error(
        `Error occured in searching for this location : ${query}, ${error}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const timeoutID = setTimeout(() => {
      fetchLocation(query, controller.signal);
    }, 250);

    return () => {
      clearTimeout(timeoutID);
      controller.abort();
    };
  }, [query]);

  return {
    results,
    searchError,
    isLoading,
  };
};
