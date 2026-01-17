import { useState, useMemo, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Project } from '../types';
import { cleanAIJSON } from '../lib/utils';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/client';

const STORAGE_KEY = 'margins_pro_v12_final';

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
  const isDemo = localStorage.getItem('margins_pro_is_demo') === 'true';

  // --- STATE (Optimistic UI) ---
  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    // If Demo, load from LocalStorage entirely
    // If Real, try load from LocalStorage as cache, but will be overwritten by API
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    // Fallback Only for purely client-side/demo
    if (parsed.length === 0 && isDemo) {
      return [{
        id: 'fiera-real-v2',
        businessId: 'fiera-food-001',
        name: 'Rice Bowl Fiera Food',
        label: 'Real Ops',
        confidence: 'high',
        isFavorite: true,
        costs: [
          { id: '1', name: 'Ayam Broiler (Range Fluktuatif)', amount: 68000, minAmount: 66000, maxAmount: 70000, isRange: true, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
          { id: '2', name: 'Beras (Weekly Usage)', amount: 42000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
          { id: '9', name: 'Bowl + Tutup (Pack 20pcs)', amount: 12500, minAmount: 10000, maxAmount: 15000, isRange: true, allocation: 'bulk', batchYield: 20, bulkUnit: 'units' },
          { id: '10', name: 'Cup 22oz (50pcs)', amount: 15000, allocation: 'bulk', batchYield: 50, bulkUnit: 'units' },
          { id: '11', name: 'Sealer Lid (2000pcs)', amount: 31500, minAmount: 30000, maxAmount: 33000, isRange: true, allocation: 'bulk', batchYield: 2000, bulkUnit: 'units' },
          { id: '3', name: 'Minyak Goreng (1L)', amount: 17000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units', detailTotalQty: 1000, detailPerPortion: 15, detailUnit: 'ml' },
          { id: '4', name: 'Tepung Terigu (1kg)', amount: 10000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
          { id: '5', name: 'Saus & Bumbu', amount: 20000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
          { id: '6', name: 'Sayur & Pelengkap', amount: 25000, allocation: 'bulk', batchYield: 40, bulkUnit: 'units' },
          { id: '7', name: 'Gas LPG (Habis 5 Hari)', amount: 22000, allocation: 'bulk', batchYield: 5, bulkUnit: 'days' },
          { id: '8', name: 'Bensin Ops (Habis 5 Hari)', amount: 25000, allocation: 'bulk', batchYield: 5, bulkUnit: 'days' },
          { id: 'c_fixed_default', name: 'Biaya Tetap Operasional', amount: 0, allocation: 'unit' }
        ],
        productionConfig: { period: 'weekly', daysActive: 5, targetUnits: 40 },
        pricingStrategy: 'competitor',
        competitorPrice: 10000,
        targetNet: 2500,
        lastModified: Date.now()
      }];
    }
    return parsed;
  });

  // --- API SYNC ---
  const { data: remoteProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.projects.$get();
      if (!res.ok) throw new Error("Failed to fetch");
      // Parse: The API returns JSON with a 'data' flattened. 
      // We need to ensure it matches Project type.
      const json = await res.json();
      // Map API response to match Project type strictly if needed, 
      // but our RPC client should handle types if Shared correctly.
      // For now, assume strict mapping.
      return json as Project[];
    },
    enabled: !isDemo // Only fetch if not demo
  });

  // Sync Remote -> Local
  useEffect(() => {
    if (remoteProjects && !isDemo) {
      setAllProjects(remoteProjects);
    }
  }, [remoteProjects, isDemo]);

  // Sync Local -> Storage (Always backup)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProjects));
  }, [allProjects]);


  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: async (json: any) => {
      const res = await api.projects.$post({ json });
      return await res.json();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, json }: { id: string, json: any }) => {
      const res = await api.projects[':id'].$put({ param: { id }, json });
      return await res.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.projects[':id'].$delete({ param: { id } });
      return await res.json();
    }
  });


  const projects = useMemo(() => {
    if (!activeBusinessId) return allProjects;
    return allProjects.filter(p => p.businessId === activeBusinessId || !p.businessId);
  }, [allProjects, activeBusinessId]);

  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (projects.length > 0) {
      if (!activeProjectId || !projects.find(p => p.id === activeProjectId)) {
        setActiveProjectId(projects[0].id);
      }
    }
  }, [projects, activeProjectId]);

  const activeProject = useMemo(() => {
    const found = projects.find(p => p.id === activeProjectId);
    if (found) return found;
    if (projects.length > 0) return projects[0];
    return DEFAULT_PROJECT_STATE;
  }, [projects, activeProjectId]);

  const updateProject = useCallback((updates: Partial<Project>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === activeProjectId) {
        const updated = { ...p, ...updates, lastModified: Date.now() };
        // Fire API
        if (!isDemo) {
          updateMutation.mutate({
            id: p.id,
            json: { name: updated.name, data: updated, isFavorite: updated.isFavorite }
          });
        }
        return updated;
      }
      return p;
    }));
  }, [activeProjectId, isDemo]);

  // NEW: Update any project by ID (Generic)
  const editProject = useCallback((id: string, updates: Partial<Project>) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates, lastModified: Date.now() };
        if (!isDemo) {
          updateMutation.mutate({
            id: p.id,
            json: { name: updated.name, data: updated, isFavorite: updated.isFavorite }
          });
        }
        return updated;
      }
      return p;
    }));
  }, [isDemo]);

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

    setAllProjects(prev => [newP, ...prev]);
    setActiveProjectId(id);

    if (!isDemo) {
      createMutation.mutate({
        name: newP.name,
        businessId: activeBusinessId,
        data: newP
      });
    }

    return id;
  }, [activeBusinessId, isDemo]);

  const addProject = useCallback((project: Project) => {
    const finalProject = { ...project };
    if (!finalProject.businessId && activeBusinessId) {
      finalProject.businessId = activeBusinessId;
    }
    setAllProjects(prev => [finalProject, ...prev]);
    setActiveProjectId(finalProject.id);

    if (!isDemo) {
      createMutation.mutate({
        name: finalProject.name,
        businessId: finalProject.businessId,
        data: finalProject
      });
    }
  }, [activeBusinessId, isDemo]);

  const deleteProject = useCallback((id: string) => {
    setAllProjects(prev => {
      const updatedList = prev.filter(p => p.id !== id);
      if (id === activeProjectId) {
        const remainingInContext = activeBusinessId
          ? updatedList.filter(p => p.businessId === activeBusinessId || !p.businessId)
          : updatedList;

        if (remainingInContext.length > 0) {
          setTimeout(() => setActiveProjectId(remainingInContext[0].id), 0);
        } else {
          setTimeout(() => setActiveProjectId(''), 0);
        }
      }
      return updatedList;
    });

    if (!isDemo) {
      deleteMutation.mutate(id);
    }
  }, [activeProjectId, activeBusinessId, isDemo]);

  const toggleFavorite = useCallback((id: string) => {
    setAllProjects(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, isFavorite: !p.isFavorite };
        if (!isDemo) {
          updateMutation.mutate({
            id: p.id,
            json: { data: updated, isFavorite: updated.isFavorite }
          });
        }
        return updated;
      }
      return p;
    }));
  }, [isDemo]);

  const importProjectWithAI = useCallback(async (jsonString: string) => {
    setIsImporting(true);
    try {
      const rawData = JSON.parse(jsonString);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Use correct ENV
      const prompt = `
        Fix missing fields for Food Pricing Project. Return strictly valid JSON.
        Input Data: ${JSON.stringify(rawData)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp', // Updated model
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

      // Reuse addProject to handle logic
      addProject(newProject);

      return newId;
    } catch (e) {
      console.error("AI Import Failed:", e);
      return null;
    } finally {
      setIsImporting(false);
    }
  }, [activeBusinessId, addProject]);

  return {
    allProjects,
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
    isImporting
  };
};