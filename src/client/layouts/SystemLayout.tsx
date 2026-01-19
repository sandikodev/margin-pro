import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Shield, Users, BarChart3, LogOut, LayoutGrid } from 'lucide-react';
import { useToast } from '../context/toast-context';
import { useAuth } from '../hooks/useAuth';

export const SystemLayout: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    showToast('Signed out from System', 'info');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar - System Style (Darker, Serious) */}
      <aside className="w-64 border-r border-slate-800 flex flex-col shrink-0 bg-slate-950/50 backdrop-blur-xl fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-sm tracking-widest uppercase">System</h1>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">CORE</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
           <div className="px-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 mt-4">Command Center</div>
           
           <NavItem to="/system/admin" icon={<LayoutGrid size={18} />} label="Global Config" />
           <NavItem to="/system/intelligence" icon={<BarChart3 size={18} />} label="Intelligence HQ" />
           
           <div className="px-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 mt-6">Relations</div>
           <NavItem to="/system/partners" icon={<Users size={18} />} label="Affiliates" />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors w-full">
              <LogOut size={16} />
              <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen bg-slate-950">
         <Outlet />
      </main>

    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink 
    to={to} 
    end 
    className={({ isActive }) => `
      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-bold
      ${isActive 
        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-900/20' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}
    `}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);
