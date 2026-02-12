import { create } from 'zustand';

export interface LabNode {
    id: string;
    type: 'ingredient' | 'labor' | 'fixed' | 'product';
    label: string;
    value: number;
    position: { x: number; y: number };
}

export interface LabConnection {
    id: string;
    fromId: string;
    toId: string;
}

export interface LabBlueprint {
    id: string;
    name: string;
    timestamp: number;
    nodes: LabNode[];
    connections: LabConnection[];
}

interface LaboratoryState {
    nodes: LabNode[];
    connections: LabConnection[];
    activeSimulation: string | null;

    // Actions
    addNode: (type: LabNode['type']) => void;
    removeNode: (id: string) => void;
    updateNodePosition: (id: string, x: number, y: number) => void;
    updateNodeValue: (id: string, value: number) => void;
    connectNodes: (fromId: string, toId: string) => void;
    disconnectNodes: (connectionId: string) => void;
    setSimulation: (sim: string | null) => void;
    simulateChaos: () => void;
    resetLab: () => void;
    saveBlueprint: (name: string) => void;
    loadBlueprint: (id: string) => void;

    // Remote Sync
    syncFromRemote: (state: Partial<LaboratoryState>) => void;

    // Computed
    calculateMargin: () => { margin: number; totalCost: number; targetPrice: number; status: 'healthy' | 'warning' | 'danger' };
}

export const useLaboratoryStore = create<LaboratoryState>((set, get) => ({
    nodes: [
        { id: '1', type: 'ingredient', label: 'Biji Kopi', value: 150000, position: { x: 100, y: 100 } },
        { id: '2', type: 'labor', label: 'Barista', value: 35000, position: { x: 100, y: 250 } },
        { id: '3', type: 'product', label: 'Espresso Blend', value: 500000, position: { x: 400, y: 175 } },
    ],
    connections: [
        { id: 'c1', fromId: '1', toId: '3' },
        { id: 'c2', fromId: '2', toId: '3' },
    ],
    activeSimulation: null,

    addNode: (type) => set((state) => {
        const id = `node-${Date.now()}`;
        const newNode: LabNode = {
            id,
            type,
            label: type.charAt(0).toUpperCase() + type.slice(1) + ' Node',
            value: type === 'product' ? 500000 : 0,
            position: { x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }
        };
        return { nodes: [...state.nodes, newNode] };
    }),

    removeNode: (id) => set((state) => ({
        nodes: state.nodes.filter(n => n.id !== id),
        connections: state.connections.filter(c => c.fromId !== id && c.toId !== id)
    })),

    updateNodePosition: (id, x, y) => set((state) => ({
        nodes: state.nodes.map(n => n.id === id ? { ...n, position: { x, y } } : n)
    })),

    updateNodeValue: (id, value) => set((state) => ({
        nodes: state.nodes.map(n => n.id === id ? { ...n, value } : n)
    })),

    connectNodes: (fromId, toId) => set((state) => {
        // Prevent duplicate connections
        if (state.connections.find(c => c.fromId === fromId && c.toId === toId)) return state;
        return {
            connections: [...state.connections, { id: `c-${Date.now()}`, fromId, toId }]
        };
    }),

    disconnectNodes: (connectionId) => set((state) => ({
        connections: state.connections.filter(c => c.id !== connectionId)
    })),

    setSimulation: (sim) => set({ activeSimulation: sim }),

    simulateChaos: () => {
        const scenarios = ['spike', 'crisis', 'waste'];
        const randomSim = scenarios[Math.floor(Math.random() * scenarios.length)];
        set({ activeSimulation: randomSim });
    },

    resetLab: () => set({ nodes: [], connections: [], activeSimulation: null }),

    saveBlueprint: (name) => {
        const state = get();
        const blueprint = {
            id: `bp-${Date.now()}`,
            name,
            timestamp: Date.now(),
            nodes: state.nodes,
            connections: state.connections
        };
        const blueprints = JSON.parse(localStorage.getItem('lab_blueprints') || '[]');
        localStorage.setItem('lab_blueprints', JSON.stringify([...blueprints, blueprint]));
    },

    loadBlueprint: (id) => {
        const blueprints = JSON.parse(localStorage.getItem('lab_blueprints') || '[]') as LabBlueprint[];
        const bp = blueprints.find((b) => b.id === id);
        if (bp) {
            set({ nodes: bp.nodes, connections: bp.connections });
        }
    },

    syncFromRemote: (remoteState) => set((state) => ({ ...state, ...remoteState })),

    calculateMargin: () => {
        const state = get();
        const productNode = state.nodes.find(n => n.type === 'product');
        if (!productNode) return { margin: 0, totalCost: 0, targetPrice: 0, status: 'healthy' };

        // Calculate cost from connections
        const inputs = state.connections
            .filter(c => c.toId === productNode.id)
            .map(c => state.nodes.find(n => n.id === c.fromId))
            .filter(Boolean) as LabNode[];

        let totalCost = inputs.reduce((sum, node) => sum + node.value, 0);

        // Advanced Simulation Modifiers
        if (state.activeSimulation === 'spike') totalCost *= 1.5;
        if (state.activeSimulation === 'crisis') totalCost *= 2.1;
        if (state.activeSimulation === 'waste') totalCost *= 1.15;

        const targetPrice = productNode.value || 0;
        const margin = targetPrice > 0 ? ((targetPrice - totalCost) / targetPrice) * 100 : 0;

        let status: 'healthy' | 'warning' | 'danger' = 'healthy';
        if (margin < 20) status = 'danger';
        else if (margin < 35) status = 'warning';

        return { margin, totalCost, targetPrice, status };
    }
}));
