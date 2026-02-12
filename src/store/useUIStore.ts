import { create } from 'zustand';

interface UIState {
    // Layout State
    isSidebarOpen: boolean;
    activeProjectId: string | null;
    activeTab: string;

    // Preferences
    theme: 'light' | 'dark' | 'system';

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setActiveProjectId: (id: string | null) => void;
    setActiveTab: (tab: string) => void;
    setTheme: (theme: UIState['theme']) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSidebarOpen: true,
    activeProjectId: null,
    activeTab: 'dashboard',
    theme: 'system',

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    setActiveProjectId: (id) => set({ activeProjectId: id }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setTheme: (theme) => set({ theme }),
}));
