import { useEffect, useRef, useState } from 'react';

/**
 * A hook that limits the rate of updating a value.
 * Useful for limiting updates during high-frequency events.
 *
 * @param value The value to throttle.
 * @param limit The throttle limit in milliseconds.
 * @returns The throttled value.
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const remainingTime = limit - (Date.now() - lastRan.current);

    if (remainingTime <= 0) {
      setThrottledValue(value);
      lastRan.current = Date.now();
    } else {
      const handler = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }, remainingTime);

      return () => clearTimeout(handler);
    }
  }, [value, limit]);

  return throttledValue;
}
