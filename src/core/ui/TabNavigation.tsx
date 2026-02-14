
import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'sticky' | 'inline'; // 'sticky' for page headers, 'inline' for modals/cards
  layout?: 'start' | 'center' | 'stretch'; // Alignment of tabs
  className?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'inline',
  layout = 'start',
  className = ''
}) => {
  // Base wrapper classes based on variant
  const wrapperClasses = variant === 'sticky'
    ? "sticky top-[-1rem] lg:top-[-2.5rem] z-40 -mx-4 lg:-mx-10 bg-slate-50/95 backdrop-blur-xl border-b border-slate-200/80 transition-all"
    : "bg-transparent transition-all";

  // Container padding based on variant
  const containerPadding = variant === 'sticky'
    ? "px-4 lg:px-10 py-3"
    : "p-1";

  // Alignment logic
  // justify-stretch is not a valid flex utility in standard Tailwind. 
  // We handle stretch via the children's flex-1 property.
  const justifyClass = layout === 'center' ? 'justify-center' : 'justify-start';

  return (
    <nav className={`${wrapperClasses} ${className}`}>
      <div className={`flex items-center gap-3 overflow-x-auto scrollbar-hide w-full ${containerPadding} ${justifyClass}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border
              ${layout === 'stretch' ? 'flex-1 justify-center' : ''}
              ${activeTab === tab.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50'}
            `}
          >
            {tab.icon && (
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-400'}`} />
            )}
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
