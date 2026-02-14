import React from 'react';
import { Terminal, Bug, Code, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComponentWithError = () => {
    // This is intentional to trigger a ReferenceError that shows up in our new DX view
    // @ts-expect-error Intentional reference error to test DX view
    return <div>{nonExistentVariable.trigger()}</div>;
};

const DeepNestedError = () => {
    return (
        <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="text-sm font-bold mb-2">Deep Component</h3>
            <ComponentWithError />
        </div>
    );
};

export const AppDXTestPage: React.FC = () => {
    const navigate = useNavigate();
    const [crash, setCrash] = React.useState(false);

    if (crash) {
        return <DeepNestedError />;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh] text-center animate-in fade-in duration-1000">
            <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-red-500/10">
                <Code className="w-10 h-10 text-red-500" />
            </div>

            <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase [text-shadow:0_0_20px_rgba(0,0,0,0.05)]">
                App Error Lab <span className="text-red-600">v1.0</span>
            </h1>

            <p className="text-slate-600 mb-12 leading-relaxed text-lg max-w-lg font-medium">
                This environment is designed to simulate <b className="text-red-600">Core Runtime Failures</b>.
                Triggering the error will activate the new Margin Framework DX overlay with source code tracing.
            </p>

            <div className="flex flex-col gap-5 w-full max-w-sm">
                <button
                    onClick={() => setCrash(true)}
                    className="flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white hover:bg-red-600 font-black rounded-3xl transition-all active:scale-95 shadow-xl active:bg-red-700"
                >
                    <Bug className="w-5 h-5" /> EXECUTE_CRASH_TEST
                </button>

                <button
                    onClick={() => navigate('/app')}
                    className="flex items-center justify-center gap-3 px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold rounded-3xl transition-all border border-slate-200 active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" /> REBOOT_TO_DASHBOARD
                </button>
            </div>

            <div className="mt-20 flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] bg-slate-50 px-6 py-3 rounded-full border border-slate-200">
                <Terminal className="w-4 h-4 text-red-500/50" /> [SYSCALL]: LINT_OVERRIDE_ACTIVE
            </div>
        </div>
    );
};

export default AppDXTestPage;
