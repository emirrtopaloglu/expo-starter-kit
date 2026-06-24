import { useEffect, useRef } from 'react';

/**
 * A hook that stores and returns the value from the previous render.
 *
 * @param value The value to track.
 * @returns The value from the previous render.
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
