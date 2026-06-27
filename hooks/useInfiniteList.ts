import { useState, useEffect, useCallback } from 'react';

/**
 * A hook designed to manage pagination, items list, loading, and refreshing states
 * for list views (e.g. FlashList / FlatList).
 *
 * @param fetchPageFn Callback function that takes a page index and returns a list of items.
 * @param initialPage The starting page index (defaults to 1).
 */
export function useInfiniteList<T>(fetchPageFn: (page: number) => Promise<T[]>, initialPage = 1) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadData = useCallback(
    async (targetPage: number, append = true) => {
      setLoading(true);
      setError(null);
      try {
        const newItems = await fetchPageFn(targetPage);
        if (newItems.length === 0) {
          setHasMore(false);
          if (!append) setItems([]); // Clear list if initial page is empty
        } else {
          setItems((prev) => (append ? [...prev, ...newItems] : newItems));
          setHasMore(true);
        }
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [fetchPageFn]
  );

  // Initial load
  useEffect(() => {
    loadData(initialPage, false);
  }, [fetchPageFn, initialPage, loadData]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadData(nextPage, true);
  }, [loading, hasMore, page, loadData]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setPage(initialPage);
    loadData(initialPage, false);
  }, [initialPage, loadData]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    isRefreshing,
  };
}
