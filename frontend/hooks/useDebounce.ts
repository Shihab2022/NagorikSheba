"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook that debounces a value by a specified delay in milliseconds.
 * Prevents rapid repeated re-renders or API calls while the user is actively typing.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
