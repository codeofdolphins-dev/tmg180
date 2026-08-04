import { QueryClient } from '@tanstack/react-query';

/**
 * Exported rather than created inline so the auth store can clear every cached
 * query on sign-out — leaving one person's data in the cache for the next
 * person to sign in on the same device is not acceptable here.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The API client already retries once through the refresh path; retrying
      // a genuine 401 or 403 on top of that just delays the error.
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});
