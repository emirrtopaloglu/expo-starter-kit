import { useEffect, useRef, useCallback } from 'react';

/**
 * A declarative setInterval hook that automatically manages pause, resume, and cleanup.
 *
 * @param callback The callback to execute.
 * @param delay The interval delay in milliseconds.
 * @returns Object with pause and resume controls.
 */
export function useInterval(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const resume = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => callbackRef.current(), delay);
  }, [delay]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    resume();
    return pause;
  }, [delay, resume, pause]);

  return { pause, resume };
}
