import React from 'react';
import { ProductCalculator } from './calculator';
import { useOutletContext } from '@koda/runtime';
import { DashboardOutletContext } from '@/components/layout/DashboardShell';

export const CalculatorPage: React.FC = () => {
    const ctx = useOutletContext<DashboardOutletContext>();
    const { activeProject, activeBusiness, editProject, createNewProject, deleteProject, setActiveTab, formatValue } = ctx;

    if (!activeProject) return null;

    return (
        <ProductCalculator
            activeProject={activeProject}
            activeBusiness={activeBusiness}
            updateProject={(updates) => activeProject && editProject(activeProject.id, updates)}
            createNewProject={createNewProject}
            deleteProject={deleteProject}
            formatValue={formatValue}
            goToSimulation={() => setActiveTab('insights')}
        />
    );
}

export default CalculatorPage;
