
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 Hour
      gcTime: 1000 * 60 * 60 * 24, // 24 Hours
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
  },
});

const isServer = typeof window === 'undefined';

export const persister = !isServer
  ? createSyncStoragePersister({
    storage: window.localStorage,
    throttleTime: 1000,
  })
  : undefined;
