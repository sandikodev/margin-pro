import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Components & Layouts
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { SystemLayout } from './layouts/SystemLayout';
import { LegalLayout } from './layouts/LegalLayout';
import { LabsLayout } from './layouts/LabsLayout';
import { AppErrorPage } from './components/ui/AppErrorPage';
import { PublicErrorPage } from './components/ui/PublicErrorPage';
import { FullPageLoader } from './components/ui/design-system/Loading';

// Public Routes
import { PricingPage } from './routes/public/pricing';
import { InvitePage } from './routes/public/invite';
import { BlogIndex } from './routes/public/blog';
import { BlogPostPage } from './routes/public/blog/post';
import { LegalIndexPage } from './routes/public/legal/index';
import { LegalDocumentPage } from './routes/public/legal/document';
import { PublicErrorTestPage, PublicErrorTestTrigger } from './routes/public/PublicErrorTest';

// Router Components
import {
    AuthWrapper, LandingWrapper, DemoWrapper, OnboardingWrapper,
    DashboardPageConnect, MarketPageConnect, ProfilePageConnect,
    FinancePageConnect, CalculatorPageConnect, InsightsPageConnect,
    TopUpViewConnect, LaboratoryPageConnect
} from './router-components';

const AdminDashboard = React.lazy(() => import('./routes/system/admin').then(module => ({ default: module.AdminDashboard })));
const AcademyView = React.lazy(() => import('./routes/app/academy').then(module => ({ default: module.AcademyView })));
const AboutView = React.lazy(() => import('./routes/app/about').then(module => ({ default: module.AboutView })));
const ChangelogView = React.lazy(() => import('./routes/app/changelog').then(module => ({ default: module.ChangelogView })));
const AppErrorTestPage = React.lazy(() => import('./routes/app/AppErrorTest').then(module => ({ default: module.AppErrorTestPage })));
const AppErrorTestTrigger = React.lazy(() => import('./routes/app/AppErrorTest').then(module => ({ default: module.AppErrorTestTrigger })));
const AppDXTestPage = React.lazy(() => import('./routes/app/AppDXTest').then(module => ({ default: module.AppDXTestPage })));

// --- ROUTER ---

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        errorElement: <PublicErrorPage />,
        children: [
            { path: "/", element: <LandingWrapper /> },
            { path: "/auth", element: <AuthWrapper /> },
            { path: "/demo", element: <DemoWrapper /> },
            { path: "/r/:code", element: <InvitePage /> },
            { path: "/pricing", element: <PricingPage /> },
            { path: "/blog", element: <BlogIndex /> },
            { path: "/blog/:slug", element: <BlogPostPage /> },
            {
                path: "/legal",
                element: <LegalLayout />,
                children: [
                    { index: true, element: <LegalIndexPage /> },
                    { path: ":slug", element: <LegalDocumentPage /> }
                ]
            },
            { path: "/test-error", element: <PublicErrorTestPage /> },
            { path: "/test-error/:type", element: <PublicErrorTestTrigger /> },
        ]
    },
    {
        path: "/onboarding",
        element: (
            <ProtectedRoute>
                <Suspense fallback={<FullPageLoader text="Loading Setup..." />}>
                    <OnboardingWrapper />
                </Suspense>
            </ProtectedRoute>
        ),
        errorElement: <AppErrorPage />,
    },
    {
        path: "/app",
        element: <ProtectedLayout />,
        errorElement: <AppErrorPage />,
        children: [
            { index: true, element: <DashboardPageConnect /> },
            { path: "market", element: <MarketPageConnect /> },
            { path: "profile", element: <ProfilePageConnect /> },
            { path: "finance", element: <FinancePageConnect /> },
            { path: "project", element: <CalculatorPageConnect /> },
            { path: "calc", element: <Navigate to="/app/project" replace /> }, // Keep legacy redirect
            { path: "insights", element: <InsightsPageConnect /> },
            { path: "academia", element: <AcademyView onOpenAbout={() => { }} /> },
            { path: "edu", element: <Navigate to="academia" replace /> },
            { path: "about", element: <AboutView onBack={() => { }} onOpenChangelog={() => { }} /> },
            { path: "changelog", element: <ChangelogView onBack={() => { }} /> },
            { path: "topup", element: <TopUpViewConnect /> },
            { path: "test-error", element: <AppErrorTestPage /> },
            { path: "dx-test", element: <AppDXTestPage /> },
            { path: "test-error/:type", element: <AppErrorTestTrigger /> },
            { path: "*", element: <Navigate to="/app" replace /> }
        ]
    },
    {
        path: "/system",
        element: (
            <ProtectedRoute requiredRole="admin" redirectTo="/app">
                <SystemLayout />
            </ProtectedRoute>
        ),
        errorElement: <AppErrorPage />,
        children: [
            { path: "admin", element: <AdminDashboard /> },
            { index: true, element: <Navigate to="admin" replace /> }
        ]
    },
    {
        path: "/labs",
        element: <LabsLayout />,
        errorElement: <AppErrorPage />,
        children: [
            { index: true, element: <LaboratoryPageConnect /> }
        ]
    },
    { path: "*", element: <Navigate to="/" replace /> }
], {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
    }
});
