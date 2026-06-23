import { useEffect, useState } from 'react';

/**
 * A hook that delays updating a value until a specified duration has elapsed.
 * Commonly used to debounce user input in search bars to limit API requests.
 *
 * @param value The value to debounce.
 * @param delay The delay time in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
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
