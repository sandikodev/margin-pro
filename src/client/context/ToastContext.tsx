import React, { useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Toast, ToastType, ToastContext } from './toast-context';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
           <div 
             key={toast.id}
             className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-right-full duration-300
                ${toast.type === 'success' ? 'bg-white border-emerald-100 text-emerald-800' : ''}
                ${toast.type === 'error' ? 'bg-white border-rose-100 text-rose-800' : ''}
                ${toast.type === 'info' ? 'bg-slate-900 border-slate-800 text-white' : ''}
             `}
           >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-slate-400" />}
              
              <p className="text-sm font-semibold">{toast.message}</p>
              
              <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-70">
                 <X className="w-4 h-4 opacity-50" />
              </button>
           </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
