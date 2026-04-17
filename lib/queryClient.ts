import { QueryClient } from '@tanstack/react-query';

/**
 * Shared QueryClient for React Query. Use this instance for invalidation
 * from outside React components when needed (e.g. after a WatermelonDB write).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
});
