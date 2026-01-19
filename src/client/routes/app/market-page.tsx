import React from 'react';
import { MarketplaceView } from './market';
import { useMarketplace } from '../../hooks/useMarketplace';
import { useCurrency } from '../../hooks/useCurrency';
import { INITIAL_MARKETPLACE } from '../../lib/constants';
import { useProjects } from '../../hooks/useProjects'; // Need addProject logic? No, handleBuyItem logic.
// We need to pass handleBuyItem down or implement it here.
import { Project, MarketplaceItem } from '@shared/types';
import { useToast } from '../../context/ToastContext';

interface MarketPageProps {
    addProject: (p: Project) => void;
    activeBusinessId: string;
    setActiveTab: (tab: string) => void;
    setActiveProjectId: (id: string) => void;
}

export const MarketPage: React.FC<MarketPageProps> = ({ addProject, activeBusinessId, setActiveTab, setActiveProjectId }) => {
    const { deductCredits } = useMarketplace();
    const { formatValue } = useCurrency();
    const { showToast } = useToast();

    const handleBuyItem = async (item: MarketplaceItem) => {
        const success = await deductCredits(item.price || 0, item.name);
        if (!success) {
          // Toast handled by hook or here? Hook has onError toast. 
          // But deductCredits catches error and returns false.
          // So we should show toast if false.
          // Actually useMarketplace hook onError does showToast. 
          // redundant toast is better than no toast.
          return;
        }
        const newProject: Project = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          businessId: activeBusinessId,
          name: `[NEW] ${item.name}`,
          lastModified: Date.now()
        };
        addProject(newProject);
        setActiveProjectId(newProject.id);
        setActiveTab('calc');
        showToast("Template berhasil dibeli", "success");
      };

    return (
        <MarketplaceView 
            items={INITIAL_MARKETPLACE} 
            handleBuyItem={handleBuyItem} 
            formatValue={formatValue} 
        />
    );
};
