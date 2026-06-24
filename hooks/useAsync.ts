import { useState, useEffect, useCallback } from 'react';

/**
 * A hook that encapsulates async operations and returns execution status.
 *
 * @param asyncFn The async function to execute.
 * @param deps Dependency array for rebuilding the callback.
 * @returns State properties: data, loading, error, and execute function.
 */
export function useAsync<T>(asyncFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await asyncFn();
      setData(response);
      return response;
    } catch (err: any) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      setError(errorInstance);
      throw errorInstance;
    } finally {
      setLoading(false);
    }
  }, deps);

  // Auto-run on mount or dependency changes
  useEffect(() => {
    execute().catch(() => {});
  }, [execute]);

  return { data, loading, error, execute };
}
