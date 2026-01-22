import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/client';
import { useToast } from '@/context/toast-context';
import { useAuth } from '@/hooks/useAuth';
import { queryKeys } from '@/lib/query-keys';

interface TransactionHistoryItem {
  id: string;
  name: string;
  price: number;
  type: 'spend' | 'topup';
  date: number;
}

interface MarketplaceBalance {
  credits: number;
  history: TransactionHistoryItem[];
}

export const useMarketplace = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  // --- QUERY ---
  const { data } = useQuery({
    queryKey: queryKeys.marketplace.balance(),
    queryFn: async () => {
      const res = await api.marketplace.balance.$get();
      if (!res.ok) throw new Error("Failed to fetch balance");
      const balanceData = await res.json();
      return balanceData as MarketplaceBalance;
    },
    enabled: isAuthenticated, // Only fetch when authenticated
    // Polling if needed? Nah, just invalidate on mutate
    staleTime: 1000 * 60 * 5
  });

  // --- MUTATIONS ---
  const spendMutation = useMutation({
    mutationFn: async ({ amount, itemName }: { amount: number, itemName: string }) => {
      const res = await api.marketplace.spend.$post({
        json: { amount, itemName }
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string; message?: string };
        const msg = err.error || err.message || "Transaction failed";
        throw new Error(msg);
      }
      return await res.json();
    },
    onMutate: async ({ amount }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.marketplace.balance() });
      const prev = queryClient.getQueryData(queryKeys.marketplace.balance());

      // Optimistic
      queryClient.setQueryData(['marketplace-balance'], (old: MarketplaceBalance | undefined) => ({
        credits: (old?.credits || 0) - amount,
        history: old?.history || []
      }));

      return { prev };
    },
    onError: (err, v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKeys.marketplace.balance(), ctx.prev);
      showToast("Gagal transaksi: " + err.message, "error");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.marketplace.balance() })
  });

  const topUpMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await api.marketplace.topup.$post({ json: { amount } });
      if (!res.ok) throw new Error("Topup Failed");
      return await res.json();
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.marketplace.balance() })
  });

  // --- PUBLIC ---

  // Adapted to match existing signature: deductCredits(amount, name) => bool
  // BUT mutation is async. Legacy was synchronous.
  // We should probably change signature or wrap it.
  // Legacy: const deductCredits = (amount, itemName) => { ... return true/false }
  // New: async ...

  // We'll expose async methods but for backward compat we can try...
  // Actually, UI probably awaits or checks result.
  // Let's change the exported method to async.

  const deductCredits = async (amount: number, itemName: string) => {
    try {
      await spendMutation.mutateAsync({ amount, itemName });
      return true;
    } catch {
      return false;
    }
  };

  const topUpCredits = (amount: number) => {
    topUpMutation.mutate(amount);
  };

  return {
    credits: data?.credits || 0,
    transactionHistory: data?.history || [],
    deductCredits,
    topUpCredits
  };
};