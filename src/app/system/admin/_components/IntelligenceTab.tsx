import React, { useState, useMemo } from 'react';
import { Zap, TrendingUp, Terminal, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { useConfig } from '@/hooks/useConfig';
import { PlatformConfig } from '@shared/types';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';

interface AuditEntry {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  type: 'success' | 'info' | 'error';
}

interface IntelligenceTabProps {
    auditLogs: AuditEntry[];
}

export const IntelligenceTab: React.FC<IntelligenceTabProps> = ({ auditLogs }) => {
    const { platforms } = useConfig();
    const [simulationImpact, setSimulationImpact] = useState(0);

    const platformEfficiency = useMemo(() => {
        return Object.entries(platforms).map(([id, p]: [string, PlatformConfig]) => ({
            subject: id,
            efficiency: (1 - p.defaultCommission) * 100,
            margin: (p.defaultCommission * 100) * 1.5,
            fullMark: 100
        })).slice(0, 6);
    }, [platforms]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-10"
        >
            <div className="flex items-center justify-between">
                <DashboardSectionHeader 
                    icon={Zap}
                    title="Intelligence Hub"
                    subtitle="Predictive simulation and efficiency analytics"
                />
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-slate-900 rounded-xl flex items-center gap-3">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] font-black uppercase text-white tracking-widest">Al Engine Active</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-indigo-500" /> Platform Efficiency Index
                        </h4>
                        <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={platformEfficiency}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Efficiency" dataKey="efficiency" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                                <Radar name="Margin" dataKey="margin" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                        </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                            <Terminal className="w-3 h-3 text-emerald-400" /> System Terminal
                        </h4>
                        <div className="flex-1 font-mono text-[10px] space-y-2 overflow-y-auto max-h-[250px] scrollbar-hide">
                            <p className="text-emerald-400 opacity-60">{'>'}&nbsp;initializing_wild_edition...</p>
                            <p className="text-emerald-400 opacity-60">{'>'}&nbsp;security_handshake_complete</p>
                            <p className="text-indigo-400">{'>'}&nbsp;fetching_platform_deltas... [OK]</p>
                            {auditLogs.slice(0, 5).map(log => (
                                <p key={log.id} className="text-slate-400 text-[9px]">
                                    <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span> {log.action}: {log.details}
                                </p>
                            ))}
                            <p className="text-amber-400 animate-pulse">{'>'}&nbsp;awaiting_admin_input_</p>
                        </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border-4 border-indigo-50 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sliders className="w-32 h-32 text-indigo-600" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="max-w-md">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-3">
                                    "What-If" Simulation Playground
                                </h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">Adjust the global commission multiplier to see how fee changes across all platforms would impact overall unit profitability.</p>
                        </div>
                        <div className="flex-1 max-w-sm space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Multiplier: {simulationImpact > 0 ? '+' : ''}{simulationImpact}%</span>
                                    <span className={`text-2xl font-black ${simulationImpact > 0 ? 'text-red-500' : simulationImpact < 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {simulationImpact === 0 ? 'NEUTRAL' : simulationImpact > 0 ? 'DECREASE' : 'INCREASE'}
                                    </span>
                                </div>
                                <input 
                                type="range" min="-10" max="10" step="0.5"
                                value={simulationImpact}
                                onChange={(e) => setSimulationImpact(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Avg. Margin Delta</span>
                                            <span className={`text-sm font-black ${simulationImpact > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{-simulationImpact}%</span>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Est. Revenue Risk</span>
                                            <span className="text-sm font-black text-slate-800">±{Math.abs(simulationImpact * 1.5).toFixed(1)}%</span>
                                    </div>
                                </div>
                        </div>
                    </div>
            </div>
        </motion.div>
    );
};
