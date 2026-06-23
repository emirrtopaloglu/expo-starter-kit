import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: (failureCount, error: any) => {
        const status = error?.response?.status || error?.status;
        if (status === 401 || status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // irrelevant on mobile
      refetchOnReconnect: true, // refetch when connection returns
    },
    mutations: {
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'An error occurred';
        toast.error('Operation Failed', message);
      },
    },
  },
});
