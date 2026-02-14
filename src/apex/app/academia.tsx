import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { DashboardOutletContext } from '@/core/ui/layout/DashboardShell';
import { AcademyView as AcademyComponent } from '@/core/ui/features/academy/AcademyView';

export default function AcademyPage() {
    const { setActiveTab } = useOutletContext<DashboardOutletContext>();
    const navigate = useNavigate();

    return (
        <AcademyComponent
            onOpenAbout={() => navigate('/app/about')}
        />
    );
}
