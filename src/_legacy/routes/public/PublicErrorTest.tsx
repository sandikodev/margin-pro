import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Bug, Wifi, Clock, FileX, Server, Zap, ArrowLeft, Terminal } from 'lucide-react';

// --- ERROR COMPONENTS ---

// 1. Immediate Runtime Error
const RuntimeErrorComponent: React.FC = () => {
    const obj = null;
    // @ts-expect-error Intentional error for testing
    return <div>{obj.nonExistentProperty.deepValue}</div>;
};

// 2. Async Error (useEffect)
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

// 3. Promise Rejection
const PromiseRejectionComponent: React.FC = () => {
    useEffect(() => {
        const fetchData = async () => {
            throw new Error('Promise Rejection: Unhandled promise rejection in async function');
        };
        fetchData();
    }, []);
    return <div className="text-white">Triggering promise rejection...</div>;
};

// 4. Type Error
const TypeErrorComponent: React.FC = () => {
    const arr = 'not an array';
    // @ts-expect-error Intentional type error
    return <div>{(arr as unknown[]).map((x) => x as React.ReactNode)}</div>;
};

// 5. Reference Error
const ReferenceErrorComponent: React.FC = () => {
    // @ts-expect-error Intentional reference error
    return <div>{undefinedVariable}</div>;
};

// 6. Range Error (Stack Overflow)
const StackOverflowComponent: React.FC = () => {
    const recursiveFunc = (): number => {
        return recursiveFunc() + 1;
    };
    return <div>{recursiveFunc()}</div>;
};

// 7. Lazy Load Failure
const LazyFailComponent = React.lazy(() => {
    const modulePath = './non-existent-module-12345';
    return import(/* @vite-ignore */ modulePath);
});

// 8. Render Error (Invalid JSX)
const RenderErrorComponent: React.FC = () => {
    const invalidElement: unknown = { notAComponent: true };
    return <>{React.createElement(invalidElement as React.ElementType)}</>;
};

// --- ERROR TYPE MAP ---
const errorTypes = [
    {
        id: 'runtime',
        name: 'Runtime Error',
        description: 'Accessing property of null object',
        icon: Bug,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
    },
    {
        id: 'async',
        name: 'Async Error',
        description: 'Error thrown inside useEffect',
        icon: Clock,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
    },
    {
        id: 'promise',
        name: 'Promise Rejection',
        description: 'Unhandled promise rejection',
        icon: Zap,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
    },
    {
        id: 'type',
        name: 'Type Error',
        description: 'Calling array method on string',
        icon: FileX,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
    },
    {
        id: 'reference',
        name: 'Reference Error',
        description: 'Accessing undefined variable',
        icon: AlertTriangle,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
    },
    {
        id: 'stack',
        name: 'Stack Overflow',
        description: 'Infinite recursion',
        icon: Server,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
    },
    {
        id: 'lazy',
        name: 'Lazy Load Failure',
        description: 'Failed to load module',
        icon: Wifi,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
    },
    {
        id: 'render',
        name: 'Render Error',
        description: 'Invalid React element',
        icon: Bug,
        color: 'text-pink-400',
        bg: 'bg-pink-500/10',
    },
    {
        id: 'dx',
        name: 'DX Error (Astro Style)',
        description: 'Test source snippets and editor links',
        icon: Terminal,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
    },
];

// --- ERROR TRIGGER PAGE ---
export const PublicErrorTestTrigger: React.FC = () => {
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
};

// --- MAIN TEST MENU ---
export const PublicErrorTestPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#02040a] p-6 relative overflow-hidden flex items-center justify-center selection:bg-indigo-500/30">
            {/* Luxurious Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl w-full animate-in fade-in duration-1000">
                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-full mb-8 backdrop-blur-xl">
                        <Bug className="w-4 h-4 text-indigo-400" />
                        <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Framework Stability Test</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight [text-shadow:0_0_30px_rgba(255,255,255,0.05)]">
                        Public Error <span className="text-indigo-500">Playground</span>
                    </h1>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium tracking-tight">
                        Validate the resilience of the Margin Framework across various failure vectors.
                    </p>
                </div>

                {/* Route Type Selector */}
                <div className="flex justify-center gap-6 mb-16">
                    <Link
                        to="/test-error"
                        className="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-[0_20px_40px_-12px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all active:scale-95 uppercase tracking-widest"
                    >
                        Public Group
                    </Link>
                    <Link
                        to="/app/test-error"
                        className="px-10 py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-[2rem] font-black text-sm border border-white/5 transition-all active:scale-95 uppercase tracking-widest backdrop-blur-sm"
                    >
                        App Group
                    </Link>
                </div>

                {/* Error Type Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {errorTypes.map((error) => (
                        <button
                            key={error.id}
                            onClick={() => navigate(`/test-error/${error.id}`)}
                            className={`${error.bg} border border-white/5 hover:border-indigo-500/30 p-8 rounded-[2.5rem] text-left transition-all group relative overflow-hidden hover:translate-y-[-4px] active:scale-95`}
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <error.icon className="w-20 h-20" />
                            </div>
                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 ${error.color}`}>
                                    <error.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                                    {error.name}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    {error.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Integration Menu */}
                <div className="mt-16 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 p-8 bg-white/5 border border-white/5 rounded-[2.5rem] backdrop-blur-md flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-[1.25rem] flex items-center justify-center text-indigo-400">
                                <FileX className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white mb-1">Test 404 Vectors</h3>
                                <p className="text-sm text-slate-500 font-medium">Simulate dead link propagation</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/missing-page" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black rounded-full transition-all uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95">PUBLIC</Link>
                            <Link to="/app/missing-page" className="px-5 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-black rounded-full transition-all uppercase tracking-widest border border-white/5 active:scale-95">APP</Link>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-20 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 text-slate-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em]"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Exit Testing Mode
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PublicErrorTestPage;
