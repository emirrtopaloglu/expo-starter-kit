import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * A hook that manages a stopwatch.
 *
 * @returns elapsed milliseconds, isRunning status, and start/stop/reset methods.
 */
export function useStopwatch() {
  const [elapsed, setElapsed] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setElapsed(0);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const startTime = Date.now() - elapsed;

    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 50); // Updates every 50ms for smooth UI stopwatch rendering

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]); // Depend on isRunning and restart internal ticker with correct startTime offset

  return { elapsed, isRunning, start, stop, reset };
}
