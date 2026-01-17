
import React, { useState, useEffect, useRef } from 'react';
import { X, LucideIcon } from 'lucide-react';

export interface FloatingActionItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success' | 'warning';
  closeOnSelect?: boolean;
}

interface FloatingActionMenuProps {
  icon: LucideIcon;
  label?: string; // Accessibility label
  items?: FloatingActionItem[];
  onMainClick?: () => void;
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
  positionClassName?: string;
}

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  icon: MainIcon,
  label,
  items = [],
  onMainClick,
  isOpen: controlledIsOpen,
  setIsOpen: setControlledIsOpen,
  positionClassName = "bottom-32 right-6 lg:bottom-12 lg:right-12" // Raised to clear MobileNav
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setIsOpen = isControlled ? setControlledIsOpen : setInternalIsOpen;

  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        if (setIsOpen) setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const handleMainClick = () => {
    if (items.length > 0) {
      if (setIsOpen) setIsOpen(!isOpen);
    } else if (onMainClick) {
      onMainClick();
    }
  };

  return (
    <div 
      ref={menuRef}
      className={`fixed ${positionClassName} z-50 flex flex-col items-end gap-4 pointer-events-none`}
    >
      {/* Menu Items */}
      <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {items.map((item, idx) => {
          let bgClass = "bg-white text-slate-600 border-slate-200";
          let iconClass = "text-slate-600";
          
          if (item.variant === 'danger') {
             iconClass = "text-white";
             bgClass = "bg-rose-600 text-white shadow-rose-600/40";
          } else if (item.variant === 'success') {
             iconClass = "text-white";
             bgClass = "bg-emerald-600 text-white shadow-emerald-600/40";
          } else if (item.variant === 'warning') {
             iconClass = "text-white";
             bgClass = "bg-orange-500 text-white shadow-orange-500/40";
          } else {
             // Default
             iconClass = "text-indigo-600";
             bgClass = "bg-white text-slate-600 border-slate-200 shadow-xl";
          }

          return (
            <button 
              key={item.id}
              onClick={() => {
                item.onClick();
                // Close menu automatically after selection unless specified otherwise
                if (setIsOpen && item.closeOnSelect !== false) setIsOpen(false);
              }}
              className="flex items-center gap-3 group mr-1"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <span className="bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md border border-slate-100 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all origin-right">
                {item.label}
              </span>
              <div className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center group-active:scale-90 transition-transform border border-transparent ${bgClass}`}>
                <item.icon className={`w-5 h-5 ${iconClass}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Trigger Button */}
      <button 
        onClick={handleMainClick}
        aria-label={label || "Menu"}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center pointer-events-auto transition-all duration-300 active:scale-90 border-4 border-white/10
          ${isOpen 
            ? 'bg-slate-800 text-white rotate-90 shadow-slate-900/50' 
            : 'bg-indigo-600 text-white shadow-indigo-600/50 hover:bg-indigo-500'
          }`}
      >
        {isOpen && items.length > 0 ? <X className="w-6 h-6" /> : <MainIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};
