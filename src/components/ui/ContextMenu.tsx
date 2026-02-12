import React, { useRef, useEffect, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface ContextMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

// 1. MAIN CONTAINER
export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onClose, title, children, className = '' }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    // Bind global click listener
    document.addEventListener('mousedown', handleClickOutside);
    // Bind scroll listener to close menu (UX best practice)
    window.addEventListener('scroll', onClose, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', onClose, true);
    };
  }, [onClose]);

  if (!position) return null;

  // Smart Positioning (Prevent overflow)
  const x = Math.min(position.x, window.innerWidth - 240); // 240 is approx width
  const y = Math.min(position.y, window.innerHeight - 300); // 300 is approx height estimate

  return (
    <div 
      ref={menuRef}
      className={`fixed z-[100] bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 w-64 animate-in zoom-in-95 duration-100 origin-top-left ${className}`}
      style={{ top: y, left: x }}
      onContextMenu={(e) => e.preventDefault()} // Prevent native menu on the menu itself
    >
       {title && (
         <div className="p-3 bg-slate-50 border-b border-slate-100 rounded-t-xl">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block truncate">
               {title}
            </span>
         </div>
       )}
       <div className="p-1 space-y-0.5">
          {children}
       </div>
    </div>
  );
};

// 2. MENU ITEM
interface ContextMenuItemProps {
  icon?: React.ElementType;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'warning';
  rightSlot?: ReactNode;
  children?: ReactNode; // For submenus or custom rendering
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ icon: Icon, label, onClick, variant = 'default', rightSlot, children }) => {
  const baseClasses = "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left group transition-colors relative";
  const variantClasses = variant === 'danger' 
    ? "text-slate-700 hover:bg-rose-50 hover:text-rose-600" 
    : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600";
  
  const iconColor = variant === 'danger' 
    ? "text-slate-400 group-hover:text-rose-600" 
    : "text-slate-400 group-hover:text-indigo-600";

  return (
    <div className="relative">
        <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
            <div className="flex items-center gap-3 truncate">
                {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
                <span className="text-xs font-bold truncate">{label}</span>
            </div>
            {rightSlot}
        </button>
        {children}
    </div>
  );
};

// 3. SEPARATOR
export const ContextMenuSeparator: React.FC = () => (
  <div className="h-px bg-slate-100 my-1 mx-2" />
);

// 4. LABEL / HEADER inside list
export const ContextMenuLabel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="px-3 py-1.5 mt-1">
     <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{children}</span>
  </div>
);

// 5. SUBMENU CONTAINER (Triggered on hover/click of parent item)
export const ContextMenuSubTrigger: React.FC<{ 
  label: string; 
  icon?: React.ElementType;
  children: ReactNode 
}> = ({ label, icon: Icon, children }) => {
  return (
    <div className="group/submenu relative">
        <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors">
           <div className="flex items-center gap-2 truncate">
              {Icon && <Icon className="w-4 h-4 text-slate-400 group-hover/submenu:text-indigo-600" />}
              <span className="text-xs font-bold truncate">{label}</span>
           </div>
           <ChevronRight className="w-3 h-3 text-slate-300" />
        </button>
        
        {/* Submenu Dropdown Positioned Right */}
        <div className="absolute left-[95%] top-0 ml-1 hidden group-hover/submenu:block bg-white border border-slate-200 rounded-xl shadow-xl w-48 p-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
           {children}
        </div>
    </div>
  );
};