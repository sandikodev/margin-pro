
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BusinessProfile } from '@shared/types';
import { STORAGE_KEYS } from '@shared/constants';
import { api } from '../lib/client';
import { useToast } from '../context/toast-context';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Local UI State
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID);
  });

  const [isProfileEditing, setIsProfileEditing] = useState(false);

  // --- QUERY: Get Businesses ---
  // --- QUERY: Get Businesses ---
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const res = await api.businesses.$get();
      if (!res.ok) throw new Error("Failed to fetch businesses");
      const data = await res.json();
      return (data as any).data || data as unknown as BusinessProfile[];
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // Derived State
  const activeBusiness = businesses.find(b => b.id === activeBusinessId) || businesses[0] || null;

  // Effect: Sync Active ID to LocalStorage
  useEffect(() => {
    if (activeBusinessId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID, activeBusinessId);
    }
  }, [activeBusinessId]);

  // Effect: Auto-select first if none active
  useEffect(() => {
    if (!activeBusinessId && businesses.length > 0) {
      setActiveBusinessId(businesses[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businesses]); // Only run when businesses load/change


  // --- MUTATIONS ---


  const addMutation = useMutation({
    mutationFn: async (newBiz: BusinessProfile) => {
      const res = await api.businesses.$post({
        json: newBiz
      });
      if (!res.ok) throw new Error("Failed to create business");
      return await res.json();
    },
    onMutate: async (newBiz) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['businesses'] });

      // Snapshot previous value
      const previousBusinesses = queryClient.getQueryData<BusinessProfile[]>(['businesses']);

      // Optimistically update
      queryClient.setQueryData<BusinessProfile[]>(['businesses'], (old) => {
        return [...(old || []), newBiz]; // Client provided ID is trusted for optimist view
      });

      // Set active immediately
      setActiveBusinessId(newBiz.id);

      return { previousBusinesses };
    },
    onError: (err, newBiz, context) => {
      // Rollback
      if (context?.previousBusinesses) {
        queryClient.setQueryData(['businesses'], context.previousBusinesses);
      }
      showToast("Gagal membuat bisnis: " + err.message, 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
    onSuccess: (data, variables) => {
      showToast(`Bisnis "${variables.name}" berhasil dibuat`, 'success');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<BusinessProfile> & { id: string }) => {
      // Fetch current to merge (PUT requires full object usually, or we fix server to PATCH)
      // For now, client-side merge is safest without changing server.
      const currentRes = await (api as any).businesses[':id'].$get({ param: { id: updates.id } });
      if (!currentRes.ok) throw new Error("Failed to fetch current business for update");
      const currentData = await currentRes.json();

      const fullPayload = {
        ...currentData,
        ...updates
      } as BusinessProfile;

      const res = await (api as any).businesses[':id'].$put({
        param: { id: updates.id },
        json: fullPayload
      });
      if (!res.ok) throw new Error("Failed to update");
      return await res.json();
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ['businesses'] });
      const previousBusinesses = queryClient.getQueryData<BusinessProfile[]>(['businesses']);

      queryClient.setQueryData<BusinessProfile[]>(['businesses'], (old) => {
        return (old || []).map(b => b.id === updates.id ? { ...b, ...updates } : b);
      });

      return { previousBusinesses };
    },
    onError: (err, updates, context) => {
      if (context?.previousBusinesses) {
        queryClient.setQueryData(['businesses'], context.previousBusinesses);
      }
      showToast("Gagal update: " + err.message, 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
    onSuccess: () => {
      showToast("Profil bisnis diperbarui", 'success');
      setIsProfileEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.businesses[':id'].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete");
      return await res.json();
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      showToast("Bisnis dihapus", 'info');
      if (activeBusinessId === id) setActiveBusinessId(null);
    }
  });


  // --- API SURFACE ---

  return {
    businesses,
    activeBusiness,
    activeBusinessId,

    // Actions
    switchBusiness: setActiveBusinessId,

    addBusiness: addMutation.mutate,
    createBusiness: addMutation.mutateAsync,
    updateBusiness: (id: string, updates: Partial<BusinessProfile>) => updateMutation.mutate({ ...updates, id }),
    deleteBusiness: deleteMutation.mutate,

    // UI State
    isProfileEditing,
    setIsProfileEditing,

    // Loading State
    isLoading
  };
};
