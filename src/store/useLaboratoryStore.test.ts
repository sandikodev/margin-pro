import { describe, it, expect, beforeEach } from 'vitest';
import { useLaboratoryStore } from './useLaboratoryStore';

describe('useLaboratoryStore', () => {
    beforeEach(() => {
        useLaboratoryStore.getState().resetLab();
    });

    it('should calculate margin correctly from nodes and connections', () => {
        // Setup nodes
        useLaboratoryStore.getState().addNode('ingredient');
        useLaboratoryStore.getState().addNode('product');

        const nodes = useLaboratoryStore.getState().nodes;
        const i1 = nodes[nodes.length - 2];
        const p1 = nodes[nodes.length - 1];

        useLaboratoryStore.getState().updateNodeValue(i1.id, 100000);
        useLaboratoryStore.getState().updateNodeValue(p1.id, 500000);
        useLaboratoryStore.getState().connectNodes(i1.id, p1.id);

        // Target price is 500,000. Cost is 100,000. Margin = (500-100)/500 = 80%
        expect(useLaboratoryStore.getState().calculateMargin().margin).toBe(80);
    });

    it('should apply "spike" simulation correctly', () => {
        useLaboratoryStore.getState().addNode('ingredient');
        useLaboratoryStore.getState().addNode('product');

        const nodes = useLaboratoryStore.getState().nodes;
        const i1 = nodes[nodes.length - 2];
        const p1 = nodes[nodes.length - 1];

        useLaboratoryStore.getState().updateNodeValue(i1.id, 200000);
        useLaboratoryStore.getState().updateNodeValue(p1.id, 500000);
        useLaboratoryStore.getState().connectNodes(i1.id, p1.id);

        useLaboratoryStore.getState().setSimulation('spike'); // Cost x 1.5 = 300,000. Margin = (500-300)/500 = 40%
        expect(useLaboratoryStore.getState().calculateMargin().margin).toBe(40);
    });

    it('should handle "crisis" simulation correctly', () => {
        useLaboratoryStore.getState().addNode('ingredient');
        useLaboratoryStore.getState().addNode('product');

        const nodes = useLaboratoryStore.getState().nodes;
        const i1 = nodes[nodes.length - 2];
        const p1 = nodes[nodes.length - 1];

        useLaboratoryStore.getState().updateNodeValue(i1.id, 200000);
        useLaboratoryStore.getState().updateNodeValue(p1.id, 500000);
        useLaboratoryStore.getState().connectNodes(i1.id, p1.id);

        useLaboratoryStore.getState().setSimulation('crisis'); // Cost x 2.1 = 420,000. Margin = (500-420)/500 = 16%
        expect(useLaboratoryStore.getState().calculateMargin().margin).toBeCloseTo(16, 1);
    });
});
