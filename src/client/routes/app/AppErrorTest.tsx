import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Bug, Wifi, Clock, FileX, Server, Zap, ArrowLeft, Shield } from 'lucide-react';

// --- ERROR COMPONENTS (Same as public but with app context) ---

const RuntimeErrorComponent: React.FC = () => {
    const obj = null;
    // @ts-expect-error Intentional error for testing
    return <div>{obj.nonExistentProperty.deepValue}</div>;
};

const AsyncErrorComponent: React.FC = () => {
    const [crash, setCrash] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setCrash(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (crash) {
        throw new Error('[App] Async Error in protected route');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <Clock className="w-12 h-12 text-slate-300" />
                <p className="text-xl font-bold text-slate-600 uppercase tracking-tighter">Loading async error...</p>
            </div>
        </div>
    );
};

const PromiseRejectionComponent: React.FC = () => {
    const [crash, setCrash] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setCrash(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (crash) {
        throw new Error('[App] Promise rejection in protected route');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <Zap className="w-12 h-12 text-slate-300" />
                <p className="text-xl font-bold text-slate-600 uppercase tracking-tighter">Triggering promise rejection...</p>
            </div>
        </div>
    );
};

const TypeErrorComponent: React.FC = () => {
    const arr = 'not an array';
    // @ts-expect-error Intentional
    return <div>{arr.map((x) => x)}</div>;
};

const ReferenceErrorComponent: React.FC = () => {
    // @ts-expect-error Intentional
    return <div>{undefinedVariable}</div>;
};

const APIErrorComponent: React.FC = () => {
    const [crash, setCrash] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setCrash(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (crash) {
        throw new Error('[App] API Error: Failed to fetch /api/protected-resource - 401 Unauthorized');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <Server className="w-12 h-12 text-slate-300" />
                <p className="text-xl font-bold text-slate-600 uppercase tracking-tighter">Simulating API error...</p>
            </div>
        </div>
    );
};

const StateErrorComponent: React.FC = () => {
    const [data, setData] = useState<unknown>(null);

    useEffect(() => {
        // Simulate delayed state access error
        setTimeout(() => {
            const unsafeData = data as unknown;
            // @ts-expect-error Intentional
            setData({ nested: unsafeData.invalidAccess.deep });
        }, 100);
    }, [data]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <Wifi className="w-12 h-12 text-slate-300" />
                <p className="text-xl font-bold text-slate-600 uppercase tracking-tighter">Triggering state error...</p>
            </div>
        </div>
    );
};

// Error types for App context
const appErrorTypes = [
    {
        id: 'runtime',
        name: 'Runtime Error',
        description: 'Null pointer exception in component',
        icon: Bug,
        color: 'text-red-600',
        bg: 'bg-red-50',
    },
    {
        id: 'async',
        name: 'Async Error',
        description: 'Error in useEffect lifecycle',
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    },
    {
        id: 'promise',
        name: 'Promise Rejection',
        description: 'Unhandled async/await error',
        icon: Zap,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
    },
    {
        id: 'type',
        name: 'Type Error',
        description: 'Type mismatch at runtime',
        icon: FileX,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
    },
    {
        id: 'reference',
        name: 'Reference Error',
        description: 'Undefined variable access',
        icon: AlertTriangle,
        color: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    {
        id: 'api',
        name: 'API Error',
        description: 'Simulated backend failure',
        icon: Server,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        id: 'state',
        name: 'State Error',
        description: 'Invalid state mutation',
        icon: Wifi,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
];

// --- ERROR TRIGGER PAGE (App) ---
export const AppErrorTestTrigger: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const [triggered, setTriggered] = useState(false);

    if (!triggered) {
        return (
            <div className="p-8">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-4">
                        App Error Test: {type?.toUpperCase()}
                    </h1>
                    <p className="text-slate-600 mb-8">
                        This will trigger an error in the protected app context to test the technical ErrorPage.
                    </p>
                    <button
                        onClick={() => setTriggered(true)}
                        className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all"
                    >
                        🔴 Trigger App Error
                    </button>
                    <div className="mt-8">
                        <Link to="/app/test-error" className="text-indigo-400 hover:text-indigo-300 text-sm">
                            ← Back to App Error Test Menu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
        case 'api':
            return <APIErrorComponent />;
        case 'state':
            return <StateErrorComponent />;
        default:
            return <RuntimeErrorComponent />;
    }
};

// --- MAIN APP TEST MENU ---
export const AppErrorTestPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-red-400" />
                        </div>
                        <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Protected Route Test</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                        App Error Test Suite
                    </h1>
                    <p className="text-slate-600">
                        Test the technical ErrorPage used for authenticated app routes
                    </p>
                </div>

                {/* Route Switcher */}
                <div className="flex gap-3 mb-8">
                    <Link
                        to="/test-error"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium border border-slate-700"
                    >
                        Public Routes
                    </Link>
                    <Link
                        to="/app/test-error"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
                    >
                        App Routes
                    </Link>
                </div>

                {/* Error Type Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {appErrorTypes.map((error) => (
                        <button
                            key={error.id}
                            onClick={() => navigate(`/app/test-error/${error.id}`)}
                            className={`${error.bg} border border-slate-200 hover:border-slate-300 p-5 rounded-xl text-left transition-all group shadow-sm`}
                        >
                            <div className="flex items-center gap-3">
                                <error.icon className={`w-5 h-5 ${error.color}`} />
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-300 transition-colors">
                                        {error.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">{error.description}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Back */}
                <Link
                    to="/app"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default AppErrorTestPage;
