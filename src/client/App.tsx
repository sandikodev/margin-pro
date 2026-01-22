import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthProvider';
import { ToastProvider } from './context/ToastContext';

// Modular Router
import { router } from './router';

// Global UI Components
import { FullPageLoader } from './components/ui/design-system/Loading';

/**
 * App Component
 * 
 * Root entry point of the Margin Pro client application.
 * Provides global state through context providers and manages
 * the client-side routing system.
 */
export const App: React.FC = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <Suspense fallback={<FullPageLoader />}>
                    <RouterProvider router={router} />
                </Suspense>
            </AuthProvider>
        </ToastProvider>
    );
};

export default App;
