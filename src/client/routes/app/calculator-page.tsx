import React from 'react';
import { ProductCalculator } from './calculator';
import { useCurrency } from '@/hooks/useCurrency';
import { Project, BusinessProfile } from '@shared/types';

interface CalculatorPageProps {
    activeProject: Project | undefined;
    activeBusiness: BusinessProfile | undefined;
    updateProject: (id: string, updates: Partial<Project>) => void;
    createNewProject: () => void;
    deleteProject: (id: string) => void;
    goToSimulation: () => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
    activeProject, activeBusiness, updateProject, createNewProject, deleteProject, goToSimulation
}) => {
    const { formatValue } = useCurrency();

    if (!activeProject) return null; // Or some empty state

    return (
        <ProductCalculator
            activeProject={activeProject}
            activeBusiness={activeBusiness}
            updateProject={(updates) => activeProject && updateProject(activeProject.id, updates)}
            createNewProject={createNewProject}
            deleteProject={deleteProject}
            formatValue={formatValue}
            goToSimulation={goToSimulation}
        />
    );
}
