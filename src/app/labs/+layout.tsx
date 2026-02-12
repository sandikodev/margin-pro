import { LabsShell } from './_components/LabsShell';

export const Layout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <LabsShell />
    );
};

const LabsNavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) => `
            flex items-center gap-2 text-[11px] font-black tracking-widest uppercase transition-all
            ${isActive ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'}
        `}
    >
        {icon}
        <span>{label}</span>
    </NavLink>
);

export default Layout;
