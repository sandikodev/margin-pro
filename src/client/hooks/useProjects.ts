
import { useState, useMemo, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Project } from '@shared/types';
import { cleanAIJSON } from '../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/client';
import { STORAGE_KEYS } from '@shared/constants';
import { useToast } from '../context/toast-context';

const DEFAULT_PROJECT_STATE: Project = {
  id: 'temp-fallback',
  name: 'Loading...',
  label: 'Default',
  costs: [],
  productionConfig: { period: 'weekly', daysActive: 5, targetUnits: 40 },
  targetNet: 0,
  lastModified: Date.now()
};

export const useProjects = (activeBusinessId?: string) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // --- STATE ---
  // Active Project ID persists in LocalStorage only for UI continuity
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PROJECTS + '_active') || '';
  });

  const [isImporting, setIsImporting] = useState(false);

  // --- QUERY ---
  const { data: allProjects = [], isLoading } = useQuery({
    queryKey: ['projects', activeBusinessId], // Scoped by business?
    // Actually, if we want to support multi-business switching quickly, better key is ['projects', { businessId }]
    queryFn: async () => {
      if (!activeBusinessId) return [];
      const res = await api.projects.$get({
        query: { businessId: activeBusinessId }
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      // Ensure Production Config Defaults if server missed any
      return data.map(p => ({
        ...p,
        productionConfig: p.productionConfig || { period: 'weekly', daysActive: 5, targetUnits: 40 }
      })) as unknown as Project[];
    },
    enabled: !!activeBusinessId,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // Derived: Current context projects (API already filters by businessId usually, but double check)
  const projects = useMemo(() => {
    // If our API call is specific to businessId, this filter is redundant but safe.
    if (!activeBusinessId) return [];
    return allProjects.filter(p => p.businessId === activeBusinessId);
  }, [allProjects, activeBusinessId]);

  // Sync Active ID Logic
  useEffect(() => {
    if (projects.length > 0) {
      // If current active doesn't exist in filtered list, switch to first
      if (!activeProjectId || !projects.find(p => p.id === activeProjectId)) {
        setActiveProjectId(projects[0].id);
      }
    } else {
      // No projects? Clear active
      if (activeProjectId) setActiveProjectId('');
    }
  }, [projects, activeProjectId]);

  useEffect(() => {
    if (activeProjectId) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS + '_active', activeProjectId);
    }
  }, [activeProjectId]);


  // --- MUTATIONS (Optimistic) ---

  // Helper to split Project into API DTO
  const toApiPayload = (p: Partial<Project>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, name, label, businessId, isFavorite, lastModified, author, ...data } = p;
    return {
      name,
      label,
      businessId,
      isFavorite,
      data // Remaining fields go into JSON column
    };
  };

  const createMutation = useMutation({
    mutationFn: async (project: Project) => {
      // Ensure businessID is set
      if (!project.businessId && activeBusinessId) project.businessId = activeBusinessId;

      const res = await api.projects.$post({ json: toApiPayload(project) });
      if (!res.ok) throw new Error("Failed to create");
      return await res.json();
    },
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ['projects', activeBusinessId] });
      const previous = queryClient.getQueryData(['projects', activeBusinessId]);

      // Optimistic Update
      queryClient.setQueryData<Project[]>(['projects', activeBusinessId], (old) => {
        return [newProject, ...(old || [])];
      });

      setActiveProjectId(newProject.id); // Switch instantly

      return { previous };
    },
    onError: (e, v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['projects', activeBusinessId], ctx.previous);
      showToast("Gagal membuat projek", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', activeBusinessId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, json }: { id: string, json: Partial<Project> }) => {
      const res = await api.projects[':id'].$put({
        param: { id },
        json: toApiPayload(json)
      } as any);
      if (!res.ok) throw new Error("Failed to update");
      return await res.json();
    },
    onMutate: async ({ id, json }) => {
      await queryClient.cancelQueries({ queryKey: ['projects', activeBusinessId] });
      const previous = queryClient.getQueryData(['projects', activeBusinessId]);

      queryClient.setQueryData<Project[]>(['projects', activeBusinessId], (old) => {
        return (old || []).map(p => p.id === id ? { ...p, ...json, lastModified: Date.now() } : p);
      });

      return { previous };
    },
    onError: (e, v, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(['projects', activeBusinessId], ctx.previous);
    },
    onSettled: () => {
      // Debounce invalidation? No need for now.
      // Actually, invalidation here causes re-fetch which might overwrite lastModified if clock skew?
      // Optimistic UI holds true until re-fetch.
      queryClient.invalidateQueries({ queryKey: ['projects', activeBusinessId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.projects[':id'].$delete({ param: { id } });
      if (!res.ok) throw new Error("Failed to delete");
      return await res.json();
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects', activeBusinessId] });
      const previous = queryClient.getQueryData(['projects', activeBusinessId]);

      queryClient.setQueryData<Project[]>(['projects', activeBusinessId], (old) => {
        const list = (old || []).filter(p => p.id !== id);
        // Handle active switch if deleted
        if (id === activeProjectId && list.length > 0) setActiveProjectId(list[0].id);
        return list;
      });

      return { previous };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', activeBusinessId] });
    }
  });


  // --- PUBLIC METHODS ---

  const activeProject = useMemo(() => {
    const found = projects.find(p => p.id === activeProjectId);
    if (found) return found;
    if (projects.length > 0) return projects[0];
    return DEFAULT_PROJECT_STATE;
  }, [projects, activeProjectId]);

  const updateProject = useCallback((updates: Partial<Project>) => {
    if (!activeProjectId) return;
    updateMutation.mutate({ id: activeProjectId, json: updates });
  }, [activeProjectId, updateMutation]);

  const editProject = useCallback((id: string, updates: Partial<Project>) => {
    updateMutation.mutate({ id, json: updates });
  }, [updateMutation]);

  const createNewProject = useCallback(() => {
    const id = Math.random().toString(36).substring(2, 9);
    const newP: Project = {
      id,
      businessId: activeBusinessId,
      name: 'Menu Baru',
      label: 'Draft',
      costs: [
        { id: 'c1', name: 'Bahan Utama', amount: 0, allocation: 'unit' },
        { id: 'c2', name: 'Packaging', amount: 0, allocation: 'unit' },
        { id: 'c3', name: 'Gas/Minyak (Bulk)', amount: 0, allocation: 'bulk', batchYield: 5, bulkUnit: 'days' },
        { id: 'c_fixed', name: 'Biaya Tetap Operasional', amount: 0, allocation: 'unit' }
      ],
      productionConfig: { period: 'weekly', daysActive: 5, targetUnits: 40 },
      pricingStrategy: 'competitor',
      competitorPrice: 12000,
      targetNet: 3000,
      lastModified: Date.now(),
      isFavorite: false
    };

    createMutation.mutate(newP);

    // setActiveProjectId(id); // Done in onMutate now
    return id; // Return ID for immediate usage if needed
  }, [activeBusinessId, createMutation]);

  const addProject = useCallback((project: Project) => {
    const finalProject = { ...project };
    if (!finalProject.businessId && activeBusinessId) {
      finalProject.businessId = activeBusinessId;
    }
    createMutation.mutate(finalProject);
  }, [activeBusinessId, createMutation]);

  const deleteProject = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const toggleFavorite = useCallback((id: string) => {
    const p = projects.find(x => x.id === id);
    if (p) editProject(id, { isFavorite: !p.isFavorite });
  }, [projects, editProject]);

  const importProjectWithAI = useCallback(async (jsonString: string) => {
    setIsImporting(true);
    try {
      const rawData = JSON.parse(jsonString);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // NOTE: Using import.meta.env for CLIENT SIDE access. 
      // process.env.GEMINI_API_KEY might be hidden in vite unless prefixed.
      // But server has it. Client might not. 
      // IMPORTANT: AI Logic should ideally be Server-Side RPC to hide Key.
      // For now, retaining Client Logic but assume VITE_ prefix.

      const prompt = `
        Fix missing fields for Food Pricing Project. Return strictly valid JSON.
        Input Data: ${JSON.stringify(rawData)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const cleanedData = JSON.parse(cleanAIJSON(response.text || '{}'));
      const newId = Math.random().toString(36).substring(2, 9);
      const newProject: Project = {
        ...cleanedData,
        id: newId,
        businessId: activeBusinessId,
        name: cleanedData.name ? `[Import] ${cleanedData.name}` : `[Import] Project ${newId}`,
        lastModified: Date.now(),
        confidence: 'medium',
      };

      addProject(newProject);
      return newId;
    } catch (e) {
      console.error("AI Import Failed:", e);
      showToast("AI Import Gagal", "error");
      return null;
    } finally {
      setIsImporting(false);
    }
  }, [activeBusinessId, addProject, showToast]);

  return {
    allProjects, // Now same as projects or scoped projects
    projects,
    activeProjectId,
    setActiveProjectId,
    activeProject,
    updateProject,
    editProject,
    createNewProject,
    addProject,
    deleteProject,
    toggleFavorite,
    importProjectWithAI,
    isImporting,
    isLoading
  };
};