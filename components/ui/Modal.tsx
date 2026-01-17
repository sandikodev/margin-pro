
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  maxWidth?: string;
  headerAction?: React.ReactNode;
  headerContent?: React.ReactNode; // New prop for Tabs or other controls in header
  footer?: React.ReactNode; 
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon: Icon, 
  children, 
  maxWidth = 'max-w-xl',
  headerAction,
  headerContent,
  footer
}) => {
  const [show, setShow] = useState(isOpen);
  const [animate, setAnimate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShow(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show || !mounted) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[100] flex items-end lg:items-center justify-center lg:p-4 pointer-events-none`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md backdrop-saturate-150 transition-all duration-500 ease-out pointer-events-auto ${animate ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`
          relative w-full ${maxWidth} bg-white 
          rounded-t-[2rem] lg:rounded-[2.5rem] 
          shadow-2xl shadow-slate-900/50 border border-white/40
          flex flex-col max-h-[92vh] lg:max-h-[85vh]
          transform transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1) pointer-events-auto
          ${animate 
            ? 'translate-y-0 scale-100 opacity-100' 
            : 'translate-y-full lg:translate-y-12 lg:scale-95 opacity-0'}
        `}
      >
         {/* Mobile Drag Handle */}
         <div className="lg:hidden absolute top-0 left-0 w-full h-6 flex items-center justify-center z-20" onClick={onClose}>
            <div className="w-12 h-1 bg-slate-300/50 rounded-full" />
         </div>

         {/* Compact Header */}
         <div className="shrink-0 px-5 py-4 border-b border-slate-100 bg-white rounded-t-[2rem] lg:rounded-t-[2.5rem] relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
               {/* Title Area */}
               <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                  {Icon && (
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/50">
                       <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex flex-col">
                     {title && <h3 className="text-sm lg:text-base font-black text-slate-900 leading-tight truncate">{title}</h3>}
                     {description && <p className="text-[10px] font-bold text-slate-400 leading-tight truncate uppercase tracking-wide">{description}</p>}
                  </div>
               </div>

               {/* Right Actions */}
               <div className="flex items-center gap-2 shrink-0">
                 {headerAction}
                 <button 
                   onClick={onClose}
                   className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all active:scale-90 border border-slate-100"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
            </div>

            {/* Header Content (e.g., Tabs) - Integrated directly in header */}
            {headerContent && (
               <div className="w-full">
                  {headerContent}
               </div>
            )}
         </div>

         {/* Content Area - Reverted BG to slate-50/30 for semi-transparency feeling */}
         <div className="overflow-y-auto scrollbar-hide flex-grow overscroll-contain bg-slate-50/30 relative">
            <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-slate-100/50 to-transparent pointer-events-none z-10"></div>
            {children}
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-slate-100/50 to-transparent pointer-events-none z-10"></div>
         </div>

         {/* Sticky Footer */}
         {footer && (
            <div className="shrink-0 p-5 bg-white border-t border-slate-100 rounded-b-[2.5rem] relative z-10 pb-safe">
               {footer}
            </div>
         )}
         
      </div>
    </div>,
    document.body
  );
};
