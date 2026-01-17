
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // Data currency dianggap fresh selama 1 jam
      refetchOnWindowFocus: false,
    },
  },
});
