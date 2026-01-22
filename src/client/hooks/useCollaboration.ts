import { useEffect, useRef } from 'react';
import { useLaboratoryStore } from '@/store/useLaboratoryStore';

export const useCollaboration = (enabled: boolean) => {
    const { nodes, connections, activeSimulation, syncFromRemote } = useLaboratoryStore();
    const lastSentRef = useRef<string>('');

    // Sync TO remote (Throttle to avoid spamming)
    useEffect(() => {
        if (!enabled) return;

        const currentState = JSON.stringify({ nodes, connections, activeSimulation });
        if (currentState === lastSentRef.current) return;

        const timer = setTimeout(async () => {
            try {
                // Mock API call or just broadcast if we had WS
                // For now, we'll simulate by logging
                console.log('Syncing to remote...');
                lastSentRef.current = currentState;
            } catch (e) {
                console.error('Failed to sync to remote', e);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [nodes, connections, activeSimulation, enabled]);

    // Sync FROM remote (Poll for changes - simulated)
    useEffect(() => {
        if (!enabled) return;

        const pollTimer = setInterval(async () => {
            // In a real app, we'd fetch the latest state from the server
            // For now, let's just listen for a global event
            const handleMessage = (e: Event) => {
                const customEvent = e as CustomEvent;
                if (customEvent.detail && typeof customEvent.detail === 'object') {
                    syncFromRemote(customEvent.detail);
                }
            };
            window.addEventListener('lab-sync', handleMessage);
            return () => window.removeEventListener('lab-sync', handleMessage);
        }, 2000);

        return () => clearInterval(pollTimer);
    }, [enabled, syncFromRemote]);
};
