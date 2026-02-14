import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Clock } from 'lucide-react';

// --- ERROR COMPONENTS ---

const RuntimeErrorComponent: React.FC = () => {
    const obj = null;
    // @ts-expect-error Intentional error for testing
    return <div>{obj.nonExistentProperty.deepValue}</div>;
};

const AsyncErrorComponent: React.FC = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            throw new Error('Async Error: This error was thrown inside useEffect after 500ms');
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-8">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <Clock className="w-12 h-12 text-slate-300" />
                <p className="text-xl font-black text-slate-900">Loading async error...</p>
            </div>
        </div>
    );
};

const PromiseRejectionComponent: React.FC = () => {
    useEffect(() => {
        const fetchData = async () => {
            throw new Error('Promise Rejection: Unhandled promise rejection in async function');
        };
        fetchData();
    }, []);
    return <div className="text-white">Triggering promise rejection...</div>;
};

const TypeErrorComponent: React.FC = () => {
    const arr = 'not an array';
    // @ts-expect-error Intentional type error
    return <div>{(arr as unknown[]).map((x) => x as React.ReactNode)}</div>;
};

const ReferenceErrorComponent: React.FC = () => {
    // @ts-expect-error Intentional reference error
    return <div>{undefinedVariable}</div>;
};

const StackOverflowComponent: React.FC = () => {
    const recursiveFunc = (): number => {
        return recursiveFunc() + 1;
    };
    return <div>{recursiveFunc()}</div>;
};

const LazyFailComponent = React.lazy(() => {
    const modulePath = './non-existent-module-12345';
    return import(/* @vite-ignore */ modulePath);
});

const RenderErrorComponent: React.FC = () => {
    const invalidElement: unknown = { notAComponent: true };
    return <>{React.createElement(invalidElement as React.ElementType)}</>;
};

export default function PublicErrorTestTrigger() {
    const { type } = useParams<{ type: string }>();
    const [triggered, setTriggered] = useState(false);

    if (!triggered) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-black text-white mb-4">
                        Error Test: {type?.toUpperCase()}
                    </h1>
                    <p className="text-slate-400 mb-8">
                        Click button below to trigger the error and test the error boundary.
                    </p>
                    <button
                        onClick={() => setTriggered(true)}
                        className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all"
                    >
                        🔴 Trigger Error
                    </button>
                    <div className="mt-8">
                        <Link to="/test-error" className="text-indigo-400 hover:text-indigo-300 text-sm">
                            ← Back to Error Test Menu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Render error component based on type
    switch (type) {
        case 'runtime':
            return <RuntimeErrorComponent />;
        case 'async':
            return <AsyncErrorComponent />;
        case 'promise':
            return <PromiseRejectionComponent />;
        case 'type':
            return <TypeErrorComponent />;
        case 'reference':
            return <ReferenceErrorComponent />;
        case 'stack':
            return <StackOverflowComponent />;
        case 'lazy':
            return (
                <Suspense fallback={<div>Loading...</div>}>
                    <LazyFailComponent />
                </Suspense>
            );
        case 'render':
            return <RenderErrorComponent />;
        case 'dx':
            // @ts-expect-error Intentional DX test
            return <div>{nonExistentPublicVariable.trigger()}</div>;
        default:
            return <RuntimeErrorComponent />;
    }
}
