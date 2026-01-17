
import React, { useState } from 'react';
import { Settings, Trash2, FilePlus, Share2, FileJson, Copy, FileText, ArrowLeft, Check } from 'lucide-react';
import { Project } from '../types';
import { OperationalContext } from '../components/calculator/OperationalContext';
import { CostList } from '../components/calculator/CostList';
import { PricingStrategySection } from '../components/calculator/PricingStrategySection';
import { ExportActions } from '../components/features/calculator/ExportActions';
import { FloatingActionMenu, FloatingActionItem } from '../components/ui/FloatingActionMenu';
import { calculateTotalHPP } from '../lib/utils';
import { generateIntelligencePDF, downloadProjectJSON, copyProjectToClipboard } from '../lib/export-service';

interface ProductCalculatorProps {
  activeProject: Project;
  updateProject: (updates: Partial<Project>) => void;
  createNewProject: () => void;
  deleteProject: (id: string) => void;
  formatValue: (val: number) => string;
  goToSimulation: () => void;
}

export const ProductCalculator: React.FC<ProductCalculatorProps> = ({
  activeProject, updateProject, createNewProject, deleteProject, formatValue, goToSimulation
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fabMode, setFabMode] = useState<'main' | 'export'>('main'); 
  const [copySuccess, setCopySuccess] = useState(false);

  const totalEffectiveCost = calculateTotalHPP(activeProject.costs, activeProject.productionConfig);
  const prodConfig = activeProject.productionConfig || { period: 'weekly', daysActive: 5, targetUnits: 40 };

  const handleDelete = () => {
    if (window.confirm(`Yakin ingin menghapus project "${activeProject.name}"?`)) {
       deleteProject(activeProject.id);
       setIsMenuOpen(false);
    }
  };

  const handleCreate = () => {
    createNewProject();
    setIsMenuOpen(false);
  };

  const handleMobileCopy = async () => {
    const success = await copyProjectToClipboard(activeProject);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Define FAB Items based on current mode
  const fabItems: FloatingActionItem[] = fabMode === 'main' ? [
    {
      id: 'create',
      label: 'Item Baru',
      icon: FilePlus,
      onClick: handleCreate,
      variant: 'default' // indigo
    },
    {
      id: 'delete',
      label: 'Hapus',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'danger'
    },
    {
      id: 'export',
      label: 'Export',
      icon: Share2,
      onClick: () => setFabMode('export'),
      variant: 'default', // white style handled by component default
      closeOnSelect: false // Keep menu open to show export options
    }
  ] : [
    {
      id: 'cancel',
      label: 'Batal',
      icon: ArrowLeft,
      onClick: () => setFabMode('main'),
      variant: 'default',
      closeOnSelect: false // Keep menu open to show main options
    },
    {
      id: 'copy',
      label: copySuccess ? 'Copied' : 'Copy',
      icon: copySuccess ? Check : Copy,
      onClick: handleMobileCopy,
      variant: 'default'
    },
    {
      id: 'json',
      label: 'JSON Data',
      icon: FileJson,
      onClick: () => downloadProjectJSON(activeProject),
      variant: 'success'
    },
    {
      id: 'pdf',
      label: 'PDF Report',
      icon: FileText,
      onClick: () => generateIntelligencePDF(activeProject, formatValue),
      variant: 'danger'
    }
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 relative pb-32">
      
      {/* EXPORT HEADER ACTIONS (Desktop Only) */}
      <div className="hidden lg:flex justify-end relative">
         <ExportActions activeProject={activeProject} formatValue={formatValue} />
      </div>

      <OperationalContext 
        activeProject={activeProject}
        updateProject={updateProject}
        prodConfig={prodConfig}
      />

      <CostList 
        activeProject={activeProject}
        updateProject={updateProject}
        formatValue={formatValue}
        prodConfig={prodConfig}
        totalEffectiveCost={totalEffectiveCost}
      />

      <PricingStrategySection 
        activeProject={activeProject}
        updateProject={updateProject}
        formatValue={formatValue}
        prodConfig={prodConfig}
        totalEffectiveCost={totalEffectiveCost}
        onSimulate={goToSimulation}
      />
      
      {/* FLOATING GEAR MENU (Mobile - Reusable Component) */}
      <div className="lg:hidden">
        <FloatingActionMenu 
          icon={Settings}
          isOpen={isMenuOpen}
          setIsOpen={(val) => {
            setIsMenuOpen(val);
            if (!val) setTimeout(() => setFabMode('main'), 300); // Reset mode on close
          }}
          items={fabItems}
        />
      </div>
    </div>
  );
};
