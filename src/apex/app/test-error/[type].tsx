import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Clock, Zap, Server, Wifi } from 'lucide-react';

// --- ERROR COMPONENTS ---

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
    return <div>{(arr as any).map((x: any) => x)}</div>;
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
            const unsafeData = data as any;
            try {
                setData({ nested: unsafeData.invalidAccess.deep });
            } catch (e) {
                // Re-throw so error boundary catches it
                throw e;
            }
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

export default function AppErrorTestTrigger() {
    const { type } = useParams<{ type: string }>();
    const [triggered, setTriggered] = useState(false);

    if (!triggered) {
        return (
            <div className="p-8">
                <div className="max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
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
                        <Link to="/app/test-error" className="text-indigo-600 hover:text-indigo-500 text-sm">
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
}
