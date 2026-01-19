import React from 'react';
import { ProductCalculator } from './calculator';
import { useCurrency } from '../../hooks/useCurrency';
import { Project } from '@shared/types';

interface CalculatorPageProps {
    activeProject: Project | null;
    updateProject: (id: string, updates: Partial<Project>) => void;
    createNewProject: () => void;
    deleteProject: (id: string) => void;
    goToSimulation: () => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ 
    activeProject, updateProject, createNewProject, deleteProject, goToSimulation 
}) => {
    const { formatValue } = useCurrency();

    if (!activeProject) return null; // Or some empty state

    return (
        <ProductCalculator 
            activeProject={activeProject} 
            updateProject={(updates) => updateProject(activeProject.id, updates)} 
            createNewProject={createNewProject} 
            deleteProject={deleteProject}
            formatValue={formatValue} 
            goToSimulation={goToSimulation} 
        />
    );
}
