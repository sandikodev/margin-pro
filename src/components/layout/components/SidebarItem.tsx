import React, { useState, useRef, useEffect } from 'react';
import { Star, Trash2, TrendingUp } from 'lucide-react';
import { Project } from '@shared/types';
import { useContextTrigger } from '@/hooks/useContextTrigger';

interface SidebarItemProps {
    project: Project;
    isActive: boolean;
    onClick: () => void;
    onDelete: () => void;
    onFavorite: () => void;
    onRename: (newName: string) => void;
    onContextMenu: (coords: { x: number; y: number }) => void;
    onInteractionStart: () => void;
}

const formatCompactCurrency = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'jt';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'rb';
    return val.toString();
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
    project, isActive, onClick, onDelete, onFavorite, onRename, onContextMenu, onInteractionStart
}) => {
    // Swipe State
    const [offset, setOffset] = useState(0);
    const startX = useRef(0);
    const currentOffset = useRef(0);
    const isDragging = useRef(false);

    // Renaming State
    const [isRenaming, setIsRenaming] = useState(false);
    const [tempName, setTempName] = useState(project.name);
    const inputRef = useRef<HTMLInputElement>(null);

    // Modular Context Interaction Hook
    const { isPressing, triggerProps } = useContextTrigger({
        onTrigger: (coords) => {
            setOffset(0);
            currentOffset.current = 0;
            if (navigator.vibrate) navigator.vibrate(50);
            onContextMenu(coords);
        },
        longPressDelay: 500
    });

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isRenaming]);

    // --- INTEGRATED TOUCH LOGIC (SWIPE + LONG PRESS) ---
    const handleTouchStart = (e: React.TouchEvent) => {
        if (isRenaming) return;
        onInteractionStart();
        startX.current = e.touches[0].clientX;
        isDragging.current = true;
        if (triggerProps.onTouchStart) triggerProps.onTouchStart(e);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (triggerProps.onTouchMove) triggerProps.onTouchMove(e);
        if (!isDragging.current || isRenaming) return;
        if (isPressing) return;

        const diff = e.touches[0].clientX - startX.current;

        if (diff < 0 && diff > -140) {
            currentOffset.current = diff;
            setOffset(diff);
        } else if (diff > 0) {
            currentOffset.current = diff * 0.2;
            setOffset(diff * 0.2);
        }
    };

    const handleTouchEnd = () => {
        if (triggerProps.onTouchEnd) triggerProps.onTouchEnd();
        isDragging.current = false;

        if (currentOffset.current < -60) {
            setOffset(-120);
            currentOffset.current = -120;
            if (navigator.vibrate) navigator.vibrate(20);
        } else {
            setOffset(0);
            currentOffset.current = 0;
        }
    };

    const handleFinishRename = () => {
        if (tempName.trim() && tempName !== project.name) {
            onRename(tempName);
        } else {
            setTempName(project.name);
        }
        setIsRenaming(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleFinishRename();
        if (e.key === 'Escape') {
            setTempName(project.name);
            setIsRenaming(false);
        }
    };

    return (
        <div className="relative mb-2 select-none group">
            {/* Background Actions (Revealed on Swipe) */}
            <div className="absolute inset-0 flex justify-end overflow-hidden rounded-xl bg-slate-950">
                <button
                    onClick={(e) => { e.stopPropagation(); onFavorite(); setOffset(0); }}
                    className="w-[60px] h-full flex flex-col items-center justify-center gap-1 text-slate-400 active:text-yellow-400 transition-colors bg-slate-900 border-l border-white/5"
                >
                    <Star className={`w-5 h-5 ${project.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    <span className="text-[8px] font-bold uppercase">Pin</span>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Hapus produk/layanan "${project.name}" secara permanen?`)) {
                            onDelete();
                        }
                    }}
                    className="w-[60px] h-full flex flex-col items-center justify-center gap-1 text-slate-400 active:text-rose-500 transition-colors bg-slate-900 border-l border-white/5"
                >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-[8px] font-bold uppercase">Hapus</span>
                </button>
            </div>

            <div
                onClick={() => {
                    if (Math.abs(offset) > 5) {
                        setOffset(0);
                        currentOffset.current = 0;
                        return;
                    }
                    if (isRenaming) return;
                    onClick();
                }}
                onContextMenu={(e) => {
                    onInteractionStart();
                    if (triggerProps.onContextMenu) triggerProps.onContextMenu(e);
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative w-full p-3 transition-all duration-300 ease-out cursor-pointer will-change-transform rounded-xl border z-10
          ${isActive
                        ? 'bg-slate-900 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)] translate-x-1'
                        : 'bg-slate-950 border-transparent hover:bg-slate-900'
                    }
          ${isPressing ? 'scale-[0.98] opacity-80' : ''}
          `}
                style={{ transform: `translateX(${offset}px)` }}
            >
                <div className="flex items-center gap-3">
                    {/* Visual Thumbnail */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 border border-white/10 shadow-sm transition-colors
                ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'}
            `}>
                        {project.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                            {isRenaming ? (
                                <input
                                    ref={inputRef}
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onBlur={handleFinishRename}
                                    onKeyDown={handleKeyDown}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full bg-slate-950 text-white text-sm font-bold rounded px-1 -ml-1 outline-none border border-indigo-500"
                                    autoFocus
                                />
                            ) : (
                                <h4 className={`text-sm font-bold truncate leading-tight ${isActive ? 'text-indigo-100' : 'text-slate-300'}`}>
                                    {project.name}
                                </h4>
                            )}

                            {/* Status Icons */}
                            <div className="flex items-center gap-1.5 pl-2 shrink-0">
                                {project.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                                {isActive && !isRenaming && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider font-black ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-500'}`}>
                                    {project.pricingStrategy === 'competitor' ? 'Market' : 'Markup'}
                                </span>
                                {project.targetNet > 0 && (
                                    <span className="text-[9px] font-medium text-emerald-400 flex items-center gap-0.5">
                                        <TrendingUp className="w-2.5 h-2.5" /> {formatCompactCurrency(project.targetNet)}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] text-slate-600 font-medium">
                                {new Date(project.lastModified).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
