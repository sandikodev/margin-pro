

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Liability, CashflowRecord, BusinessProfile } from '@shared/types';
import { FINANCIAL_DEFAULTS } from '@shared/constants';
import { api } from '@/lib/client';
import { queryKeys } from '@/lib/query-keys';

export const useFinance = (activeBusinessId?: string) => {
  const queryClient = useQueryClient();

  const businessId = activeBusinessId || '';

  // --- QUERIES ---

  const { data: liabilities = [] } = useQuery({
    queryKey: queryKeys.finance.liabilities(businessId),
    queryFn: async () => {
      if (!businessId) return [];
      // @ts-expect-error - RPC inference
      const res = await api.finance.liabilities.$get({ query: { businessId } });
      if (!res.ok) return [];
      const data = await res.json() as Liability[];
      return data.map((l) => ({ ...l, amount: Number(l.amount) }));
    },
    enabled: !!businessId
  });

  const { data: cashflow = [] } = useQuery({
    queryKey: queryKeys.finance.cashflow(businessId),
    queryFn: async () => {
      if (!businessId) return [];
      // @ts-expect-error - RPC inference
      const res = await api.finance.cashflow.$get({ query: { businessId } });
      if (!res.ok) return [];
      return await res.json() as unknown as CashflowRecord[];
    },
    enabled: !!businessId
  });

  const { data: financeSettings } = useQuery({
    queryKey: queryKeys.businesses.detail(businessId), // Use business detail for settings as they are part of it
    queryFn: async () => {
      if (!businessId) return {
        monthlyFixedCost: FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST,
        currentSavings: FINANCIAL_DEFAULTS.CURRENT_SAVINGS
      };
      const res = await api.businesses[':id'].$get({ param: { id: businessId } });
      if (!res.ok) return { ...FINANCIAL_DEFAULTS };
      const biz = await res.json() as BusinessProfile;
      return {
        monthlyFixedCost: biz.monthlyFixedCost || FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST,
        currentSavings: biz.currentSavings || FINANCIAL_DEFAULTS.CURRENT_SAVINGS
      };
    },
    enabled: !!businessId,
    staleTime: 1000 * 60 * 5
  });

  // --- MUTATIONS ---

  const createLiabilityMutation = useMutation({
    mutationFn: async (l: Liability) => {
      // @ts-expect-error - RPC inference
      const res = await api.finance.liabilities.$post({ json: { ...l, businessId } });
      return await res.json();
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['liabilities', businessId] });
      const prev = queryClient.getQueryData(['liabilities', businessId]);
      queryClient.setQueryData(['liabilities', businessId], (old: Liability[] | undefined) => [...(old || []), newItem]);
      return { prev };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['liabilities', businessId] })
  });

  const updateLiabilityMutation = useMutation({
    mutationFn: async (l: Liability) => {
      // @ts-expect-error - RPC type mismatch
      const res = await api.finance.liabilities[':id'].$put({
        param: { id: l.id },
        json: { ...l, businessId }
      });
      return await res.json();
    },
    onMutate: async (item) => {
      await queryClient.cancelQueries({ queryKey: ['liabilities', businessId] });
      const prev = queryClient.getQueryData(['liabilities', businessId]);
      queryClient.setQueryData(['liabilities', businessId], (old: Liability[] | undefined) =>
        old?.map((x) => x.id === item.id ? item : x)
      );
      return { prev };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['liabilities', businessId] })
  });

  const deleteLiabilityMutation = useMutation({
    mutationFn: async (id: string) => {
      // @ts-expect-error - RPC inference
      await api.finance.liabilities[':id'].$delete({ param: { id } });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['liabilities', businessId] })
  });

  const createCashflowMutation = useMutation({
    mutationFn: async (c: CashflowRecord) => {
      // @ts-expect-error - RPC inference
      const res = await api.finance.cashflow.$post({ json: { ...c, businessId } });
      return await res.json();
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ['cashflow', businessId] });
      const prev = queryClient.getQueryData(['cashflow', businessId]);
      queryClient.setQueryData(['cashflow', businessId], (old: CashflowRecord[] | undefined) => [...(old || []), newItem]);
      return { prev };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cashflow', businessId] })
  });

  const deleteCashflowMutation = useMutation({
    mutationFn: async (id: string) => {
      // @ts-expect-error - RPC inference
      await api.finance.cashflow[':id'].$delete({ param: { id } });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['cashflow', businessId] })
  });

  // Settings Mutation (Updates Business Data)
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: { monthlyFixedCost?: number, currentSavings?: number }) => {
      const currentBizRes = await api.businesses[':id'].$get({ param: { id: businessId || '' } });
      const currentBiz = await currentBizRes.json() as BusinessProfile;

      const payload = {
        ...currentBiz,
        ...settings
      };

      await api.businesses[':id'].$put({
        param: { id: businessId || '' },
        // RPC payload mismatch
        json: payload as BusinessProfile
      });
    },
    onMutate: async (settings) => {
      await queryClient.cancelQueries({ queryKey: ['business', businessId, 'finance-settings'] });
      const prev = queryClient.getQueryData(['business', businessId, 'finance-settings']);

      queryClient.setQueryData(['business', businessId, 'finance-settings'], (old: { monthlyFixedCost: number; currentSavings: number } | undefined) => ({
        monthlyFixedCost: old?.monthlyFixedCost || FINANCIAL_DEFAULTS.MONTHLY_FIXED_COST,
        currentSavings: old?.currentSavings || FINANCIAL_DEFAULTS.CURRENT_SAVINGS,
        ...settings
      }));
      return { prev };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.detail(businessId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.lists() });
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

  const setLiabilities = () => {
    console.warn("setLiabilities called - use specific add/update methods instead.");
  };

  const setCashflow = () => {
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
