import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bug, ArrowLeft, Shield } from 'lucide-react';

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
        icon: Bug,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
    },
    {
        id: 'promise',
        name: 'Promise Rejection',
        description: 'Unhandled async/await error',
        icon: Bug,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
    },
    {
        id: 'type',
        name: 'Type Error',
        description: 'Type mismatch at runtime',
        icon: Bug,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
    },
    {
        id: 'reference',
        name: 'Reference Error',
        description: 'Undefined variable access',
        icon: Bug,
        color: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    {
        id: 'api',
        name: 'API Error',
        description: 'Simulated backend failure',
        icon: Bug,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        id: 'state',
        name: 'State Error',
        description: 'Invalid state mutation',
        icon: Bug,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
];

export default function AppErrorTestPage() {
    const navigate = useNavigate();

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Shield className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-red-500 text-sm font-bold uppercase tracking-wider">Protected Route Test</span>
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
                                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
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
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
