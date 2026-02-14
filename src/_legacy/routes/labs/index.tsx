import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2,
    Plus,
    Activity,
    Wind,
    Flame,
    Droplets
} from 'lucide-react';
import { useLaboratoryStore, LabBlueprint } from '@/store/useLaboratoryStore';
import { BentoCard } from '@koda/ui';
import {
    Users,
    HardHat,
    Box,
    Save,
    FolderOpen,
    Info,
    Target
} from 'lucide-react';

export const LaboratoryPage: React.FC = () => {
    const {
        nodes,
        connections,
        updateNodePosition,
        updateNodeValue,
        activeSimulation,
        setSimulation,
        calculateMargin,
        addNode,
        removeNode,
        resetLab,
        connectNodes,
        disconnectNodes,
        saveBlueprint,
        simulateChaos,
        loadBlueprint
    } = useLaboratoryStore();

    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [showBlueprints, setShowBlueprints] = useState(false);

    const canvasRef = useRef<HTMLDivElement>(null);

    const { margin, totalCost, targetPrice, status } = calculateMargin();

    // Get blueprints from localstorage
    const blueprints = JSON.parse(localStorage.getItem('lab_blueprints') || '[]') as LabBlueprint[];

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingNodeId && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - 60; // Offset for node half-width
            const y = e.clientY - rect.top - 40;  // Offset for node half-height
            updateNodePosition(draggingNodeId, x, y);
        }
    };

    const handleMouseUp = () => setDraggingNodeId(null);

    const simulations = [
        { id: 'spike', name: 'Price Spike', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { id: 'crisis', name: 'Economic Crisis', icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { id: 'waste', name: 'Efficiency Leak', icon: Droplets, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    const handleNodeClick = (id: string) => {
        if (connectingFromId) {
            if (connectingFromId !== id) {
                connectNodes(connectingFromId, id);
            }
            setConnectingFromId(null);
        } else {
            setSelectedNodeId(id);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current) {
            setSelectedNodeId(null);
            setConnectingFromId(null);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Visual Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 bg-slate-950 rounded-3xl border border-white/5 relative overflow-hidden cursor-crosshair group"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleCanvasClick}
                >
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />

                    {/* SVG Connections Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                            </linearGradient>
                        </defs>
                        {connections.map(conn => {
                            const from = nodes.find(n => n.id === conn.fromId);
                            const to = nodes.find(n => n.id === conn.toId);
                            if (!from || !to) return null;
                            const x1 = from.position.x + 60;
                            const y1 = from.position.y + 40;
                            const x2 = to.position.x + 60;
                            const y2 = to.position.y + 40;

                            return (
                                <motion.path
                                    key={conn.id}
                                    d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                                    stroke="url(#line-grad)"
                                    strokeWidth="2"
                                    fill="none"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    className="cursor-pointer pointer-events-auto hover:stroke-indigo-400 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        disconnectNodes(conn.id);
                                    }}
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes Layer */}
                    {nodes.map(node => (
                        <motion.div
                            key={node.id}
                            style={{ x: node.position.x, y: node.position.y }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                setDraggingNodeId(node.id);
                                handleNodeClick(node.id);
                            }}
                            className={`absolute w-36 h-24 rounded-2xl border flex flex-col items-center justify-center p-3 cursor-grab active:cursor-grabbing backdrop-blur-xl transition-all group ${node.id === selectedNodeId ? 'ring-2 ring-indigo-500 border-indigo-400' : ''
                                } ${node.id === connectingFromId ? 'animate-pulse ring-2 ring-emerald-500' : ''
                                } ${node.type === 'product'
                                    ? 'bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                    : 'bg-slate-900/80 border-white/10'
                                }`}
                        >
                            {/* Connection Port Visual */}
                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex flex-col items-center gap-1 w-full">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                                    {node.type}
                                </span>
                                <div className="flex items-center gap-2">
                                    {node.type === 'ingredient' && <Box className="w-3 h-3 text-emerald-400" />}
                                    {node.type === 'labor' && <HardHat className="w-3 h-3 text-amber-400" />}
                                    {node.type === 'fixed' && <Users className="w-3 h-3 text-blue-400" />}
                                    {node.type === 'product' && <Target className="w-3 h-3 text-indigo-400" />}
                                    <span className="text-white font-bold text-[11px] text-center leading-tight truncate max-w-[80px]">
                                        {node.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 bg-black/20 px-2 py-0.5 rounded-lg border border-white/5">
                                    <span className="text-[9px] text-slate-400">Rp</span>
                                    <input
                                        type="number"
                                        value={node.value}
                                        onChange={(e) => updateNodeValue(node.id, Number(e.target.value))}
                                        className="bg-transparent text-white font-black text-[11px] w-full text-center outline-none"
                                    />
                                </div>
                            </div>

                            {/* Delete specific node button */}
                            {node.id === selectedNodeId && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            )}
                        </motion.div>
                    ))}

                    {/* Floating Controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 bg-slate-900/90 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl ring-1 ring-white/5">
                        <div className="flex items-center gap-1 pr-3 border-r border-white/10">
                            <button
                                onClick={() => setConnectingFromId(selectedNodeId)}
                                className={`p-3 rounded-xl transition-all ${connectingFromId ? 'bg-emerald-500 text-white animate-pulse' : 'hover:bg-white/5 text-slate-400'}`}
                                title="Connect Selected Flow"
                            >
                                <Activity className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-1 group/palette">
                            <button onClick={() => addNode('ingredient')} className="p-3 hover:bg-emerald-500/10 text-emerald-400 rounded-xl transition-all" title="Add Material">
                                <Box className="w-5 h-5" />
                            </button>
                            <button onClick={() => addNode('labor')} className="p-3 hover:bg-amber-500/10 text-amber-400 rounded-xl transition-all" title="Add Labor">
                                <HardHat className="w-5 h-5" />
                            </button>
                            <button onClick={() => addNode('fixed')} className="p-3 hover:bg-blue-500/10 text-blue-400 rounded-xl transition-all" title="Add Fixed Cost">
                                <Users className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="w-px h-6 bg-white/10 mx-1" />

                        <button
                            onClick={() => confirm('Reset current lab?') && resetLab()}
                            className="p-3 hover:bg-rose-500/10 text-rose-400 rounded-xl transition-all"
                            title="Reset Canvas"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="w-px h-6 bg-white/10 mx-1" />

                        <button
                            onClick={() => {
                                const name = prompt("Blueprint Name:");
                                if (name) saveBlueprint(name);
                            }}
                            className="p-3 hover:bg-white/5 text-slate-400 rounded-xl transition-all"
                            title="Save Blueprint"
                        >
                            <Save className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setShowBlueprints(!showBlueprints)}
                            className={`p-3 rounded-xl transition-all ${showBlueprints ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                            title="Open Blueprints"
                        >
                            <FolderOpen className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Blueprint Selection Overlay */}
                    <AnimatePresence>
                        {showBlueprints && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 z-[60]"
                            >
                                <h4 className="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Saved Blueprints</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                    {blueprints.length > 0 ? blueprints.map((bp) => (
                                        <button
                                            key={bp.id}
                                            onClick={() => { loadBlueprint(bp.id); setShowBlueprints(false); }}
                                            className="w-full p-3 bg-white/5 hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/30 rounded-xl text-left transition-all group"
                                        >
                                            <p className="text-xs font-bold text-white group-hover:text-indigo-300">{bp.name}</p>
                                            <p className="text-[9px] text-slate-500">{new Date(bp.timestamp).toLocaleDateString()}</p>
                                        </button>
                                    )) : (
                                        <p className="text-xs text-slate-600 italic text-center py-4">No blueprints yet.</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Controls */}
                <div className="w-80 flex flex-col gap-4">
                    <BentoCard className="p-5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            Simulation Cards
                        </h3>
                        <div className="space-y-3">
                            {simulations.map(sim => (
                                <motion.button
                                    key={sim.id}
                                    whileHover={{ x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSimulation(activeSimulation === sim.id ? null : sim.id)}
                                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${activeSimulation === sim.id
                                        ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20'
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl ${sim.bg}`}>
                                        <sim.icon className={`w-5 h-5 ${sim.color}`} />
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${activeSimulation === sim.id ? 'text-white' : 'text-slate-200'}`}>
                                            {sim.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-0.5 tracking-tight leading-tight">
                                            Test business resilience.
                                        </p>
                                    </div>
                                </motion.button>
                            ))}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={simulateChaos}
                                className="w-full p-4 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-4"
                            >
                                <Flame className="w-4 h-4 animate-pulse" />
                                Simulate Chaos
                            </motion.button>
                        </div>
                    </BentoCard>

                    <BentoCard className="flex-1 p-5 overflow-y-auto">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-tighter">
                            Live Metrics
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Estimated Margin</p>
                                <motion.div
                                    animate={{
                                        color: status === 'danger' ? '#f43f5e' : status === 'warning' ? '#fbbf24' : '#10b981'
                                    }}
                                    className="text-5xl font-black tracking-tighter transition-colors"
                                >
                                    {margin.toFixed(1)}%
                                </motion.div>
                                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${status === 'danger' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                            status === 'warning' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' :
                                                'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                            }`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.max(0, Math.min(100, margin))}%` }}
                                    />
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">Total Cost</span>
                                        <span className="text-xs font-mono font-bold text-white">Rp {totalCost.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">Target Price</span>
                                        <span className="text-xs font-mono font-bold text-indigo-400">Rp {targetPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">Health Status</p>
                                <div className={`p-3 rounded-xl border ${status === 'danger' ? 'bg-rose-500/10 border-rose-500/30' :
                                    status === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                                        'bg-emerald-500/10 border-emerald-500/30'
                                    }`}>
                                    <p className={`text-[10px] font-bold ${status === 'danger' ? 'text-rose-400' :
                                        status === 'warning' ? 'text-amber-400' :
                                            'text-emerald-400'
                                        }`}>
                                        {status === 'danger' ? 'Kritis ❌' : status === 'warning' ? 'Peringatan ⚠️' : 'Sehat ✅'}
                                    </p>
                                    <p className="text-[9px] text-slate-500 mt-1 leading-normal">
                                        {activeSimulation ? `Skenario ${activeSimulation} sedang berjalan...` : 'Kondisi pasar terpantau stabil.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    <BentoCard className="p-4 bg-indigo-500/5 border-indigo-500/10">
                        <div className="flex items-start gap-3">
                            <Info className="w-4 h-4 text-indigo-400 mt-0.5" />
                            <div>
                                <h4 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Laboratory Tips</h4>
                                <ul className="text-[9px] text-slate-400 space-y-1 list-disc pl-3">
                                    <li>Klik + Aktivitas untuk menghubungkan antar node.</li>
                                    <li>Klik pada garis koneksi untuk menghapusnya.</li>
                                    <li>Edit harga langsung di dalam kotak node.</li>
                                    <li>Gunakan Chaos untuk uji ketahanan bisnis.</li>
                                </ul>
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </div>

            {/* Bottom Strategy Timeline */}
            <div className="h-32 bg-slate-900/50 rounded-3xl border border-white/5 p-4 flex items-center gap-6">
                <div className="flex flex-col justify-center px-4 border-r border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strategy</span>
                    <span className="text-white font-bold text-lg">Timeline</span>
                </div>
                <div className="flex-1 flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {['Q1: Efficient Prod', 'Q2: Market Expansion', 'Q3: Automation', 'Q4: Scale Up'].map((milestone, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="min-w-[180px] p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 cursor-pointer group hover:bg-white/10"
                        >
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs ring-1 ring-indigo-500/50">
                                {idx + 1}
                            </div>
                            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{milestone}</span>
                        </motion.div>
                    ))}
                    <button className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-400 transition-all">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

