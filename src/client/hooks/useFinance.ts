
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Liability, CashflowRecord } from '@shared/types';
import { FINANCIAL_DEFAULTS } from '@shared/constants';
import { api } from '../lib/client';
import { useToast } from '../context/ToastContext';

export const useFinance = (activeBusinessId?: string) => {
  const queryClient = useQueryClient();

  const businessId = activeBusinessId || '';

  // --- QUERIES ---

  const { data: liabilities = [] } = useQuery({
    queryKey: ['liabilities', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const res = await (api as any).finance.liabilities.$get({ query: { businessId } });
      if (!res.ok) return [];
      const data = await res.json();
      // Convert dates/types if needed (server sends number timestamp)
      return data.map((l: any) => ({ ...l, amount: Number(l.amount) })) as unknown as Liability[];
    },
    enabled: !!businessId
  });

  const { data: cashflow = [] } = useQuery({
    queryKey: ['cashflow', businessId],
    queryFn: async () => {
      if (!businessId) return [];
      const res = await (api as any).finance.cashflow.$get({ query: { businessId } });
      if (!res.ok) return [];
      return await res.json() as unknown as CashflowRecord[];
    },
    enabled: !!businessId
  });

  // Settings come from Business Profile directly now?
  // We can fetch business data optionally or assume it's passed down?
  // Ideally, useProfile handles business data. 
  // But useFinance exposes `setMonthlyFixedCost`.
  // Let's implement setMonthlyFixedCost to update the Business via api.businesses.

  // NOTE: We don't fetch business data here to avoid duplication.
  // The consumer should likely pass `monthlyFixedCost` from `useProfile`.
  // BUT for backward compatibility, we can expose generic state or fetch it.
  // Let's rely on the consumer (DashboardPage) to pass these if needed, OR fetch business here.
  // Fetching here is safer for isolation.
  const { data: financeSettings } = useQuery({
    queryKey: ['business', businessId, 'finance-settings'],
    queryFn: async () => {
      if (!businessId) return {
        monthlyFixedCost: FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST,
        currentSavings: FINANCIAL_DEFAULTS.CURRENT_SAVINGS
      };
      const res = await (api as any).businesses[':id'].$get({ param: { id: businessId } });
      if (!res.ok) return {
        monthlyFixedCost: FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST,
        currentSavings: FINANCIAL_DEFAULTS.CURRENT_SAVINGS
      };
      const biz = await res.json();
      const data = biz.data || {};
      return {
        monthlyFixedCost: data.monthlyFixedCost || FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST,
        currentSavings: data.currentSavings || FINANCIAL_DEFAULTS.CURRENT_SAVINGS
      };
    },
    enabled: !!businessId,
    staleTime: 1000 * 60 * 5
  });


  // --- MUTATIONS ---

  const createLiabilityMutation = useMutation({
    mutationFn: async (l: Liability) => {
      const res = await (api as any).finance.liabilities.$post({ json: { ...l, businessId } });
      return await res.json();
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['liabilities', businessId] });
      const prev = queryClient.getQueryData(['liabilities', businessId]);
      queryClient.setQueryData(['liabilities', businessId], (old: any) => [...(old || []), newItem]);
      return { prev };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['liabilities', businessId] })
  });

  const updateLiabilityMutation = useMutation({
    mutationFn: async (l: Liability) => {
      const res = await (api as any).finance.liabilities[':id'].$put({
        param: { id: l.id },
        json: { ...l, businessId }
      });
      return await res.json();
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: ['liabilities', businessId] });
      const prev = queryClient.getQueryData(['liabilities', businessId]);
      queryClient.setQueryData(['liabilities', businessId], (old: any) =>
        old?.map((x: Liability) => x.id === item.id ? item : x)
      );
      return { prev };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['liabilities', businessId] })
  });

  const deleteLiabilityMutation = useMutation({
    mutationFn: async (id: string) => {
      await (api as any).finance.liabilities[':id'].$delete({ param: { id } });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['liabilities', businessId] })
  });

  const createCashflowMutation = useMutation({
    mutationFn: async (c: CashflowRecord) => {
      const res = await (api as any).finance.cashflow.$post({ json: { ...c, businessId } });
      return await res.json();
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['cashflow', businessId] });
      const prev = queryClient.getQueryData(['cashflow', businessId]);
      queryClient.setQueryData(['cashflow', businessId], (old: any) => [...(old || []), newItem]);
      return { prev };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cashflow', businessId] })
  });

  const deleteCashflowMutation = useMutation({
    mutationFn: async (id: string) => {
      await (api as any).finance.cashflow[':id'].$delete({ param: { id } });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cashflow', businessId] })
  });

  // Settings Mutation (Updates Business Data)
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: { monthlyFixedCost?: number, currentSavings?: number }) => {
      // We need to fetch current business data first to merge? 
      // Or server handles merge? Server usually replaces 'data' JSON if we send it.
      // Ideally we need a specific endpoint for PATCHing data, or we ensure we send full data.
      // Hono RPC for business update expects FULL data or partial?
      // Our route was: ...set({ ...body.data ... })
      // So if we send only { monthlyFixedCost: 100 }, we might wipe address!
      // CRITICAL: We need to merge on client or server.
      // Since we don't have partial JSON update on server (SQLite limitation often, but Drizzle can do it if logic exists),
      // We should fetch, merge, update.

      const currentBizRes = await (api as any).businesses[':id'].$get({ param: { id: businessId } });
      const currentBiz = await currentBizRes.json();

      // We must send a full valid payload or a partial that matches schema?
      // The schema has required fields (name, type).
      // So we must merge with currentBiz.

      const payload = {
        ...currentBiz, // Spread root fields (name, type, etc)
        ...settings // Overwrite finance settings (monthlyFixedCost) directly at root (zod schema expects them at root now)
      };

      await (api as any).businesses[':id'].$put({
        param: { id: businessId },
        json: payload
      });
    },
    onMutate: async (settings) => {
      await queryClient.cancelQueries({ queryKey: ['business', businessId, 'finance-settings'] });
      const prev = queryClient.getQueryData(['business', businessId, 'finance-settings']);

      queryClient.setQueryData(['business', businessId, 'finance-settings'], (old: any) => ({
        ...old,
        ...settings
      }));
      return { prev };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['business', businessId, 'finance-settings'] });
      queryClient.invalidateQueries({ queryKey: ['businesses'] }); // Invalidate profile too
    }
  });


  // --- PUBLIC METHODS ---

  const toggleLiabilityPaid = (id: string) => {
    const l = liabilities.find(x => x.id === id);
    if (l) {
      updateLiabilityMutation.mutate({ ...l, isPaidThisMonth: !l.isPaidThisMonth });
    }
  };

  const deleteCashflow = (id: string) => {
    if (window.confirm('Hapus catatan transaksi ini?')) {
      deleteCashflowMutation.mutate(id);
    }
  };

  const setLiabilities = (_newData: Liability[] | ((prev: Liability[]) => Liability[])) => {
    // Compatibility shim for direct set state. 
    // Ideally we shouldn't use this anymore, but if code relies on it:
    // We can't really support functional updates for generic bulk set easily.
    // Assuming it's used for adding/updating?
    // If code calls setLiabilities([...prev, new]), we should use AddMutation.
    console.warn("setLiabilities called - use specific add/update methods instead.");
  };

  const setCashflow = (_newData: any) => {
    console.warn("setCashflow called - use addCashflow instead");
  };

  const setMonthlyFixedCost = (val: number | ((prev: number) => number)) => {
    const newValue = typeof val === 'function' ? val(financeSettings?.monthlyFixedCost || 0) : val;
    updateSettingsMutation.mutate({ monthlyFixedCost: newValue });
  };

  const setCurrentSavings = (val: number | ((prev: number) => number)) => {
    const newValue = typeof val === 'function' ? val(financeSettings?.currentSavings || 0) : val;
    updateSettingsMutation.mutate({ currentSavings: newValue });
  };

  return {
    liabilities,
    setLiabilities, // Deprecated but kept for type compat if needed
    toggleLiabilityPaid,
    cashflow,
    setCashflow, // Deprecated
    deleteCashflow,

    // New Adders
    addLiability: createLiabilityMutation.mutate,
    addCashflow: createCashflowMutation.mutate,

    monthlyFixedCost: financeSettings?.monthlyFixedCost || 0,
    setMonthlyFixedCost,
    currentSavings: financeSettings?.currentSavings || 0,
    setCurrentSavings,
    deleteLiability: deleteLiabilityMutation.mutate
  };
};
