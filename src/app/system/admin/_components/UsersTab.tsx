import React, { useState, useEffect, useMemo } from 'react';
import { User, Search, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/context/toast-context';
import { api } from '@/lib/client';
import { User as UserModel } from '@shared/types';
import { BentoCard } from '@koda/ui';
import { DashboardSectionHeader } from '@/components/ui/design-system/SectionHeader';
import { cn } from '@/lib/utils';

interface UsersTabProps {
    addAuditLog: (action: string, details: string, type?: 'success' | 'info' | 'error') => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ addAuditLog }) => {
    const { showToast } = useToast();
    const [users, setUsers] = useState<UserModel[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = React.useCallback(async () => {
        setIsLoading(true);
        try {
            // @ts-expect-error - RPC inference
            const res = await (api.admin.users as never).$get();
            if (res.ok) {
                const data = await res.json();
                setUsers(data as UserModel[]);
            }
        } catch (e) {
            console.error("Failed to fetch users", e);
            showToast("Failed to fetch users", "error");
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        try {
            // @ts-expect-error - RPC inference
            await (api.admin.users[':id'] as never).$put({
                param: { id: userId },
                json: { role: newRole }
            });
            await fetchUsers();
            showToast('User role updated', 'success');
            addAuditLog('User Role Update', `Changed user ${userId} to ${newRole}`, 'success');
        } catch {
            showToast('Failed to update role', 'error');
        }
    };

    const filteredUsers = useMemo(() => {
        if (!userSearch) return users;
        return users.filter(u =>
            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.referralCode?.toLowerCase().includes(userSearch.toLowerCase())
        );
    }, [users, userSearch]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <DashboardSectionHeader
                    icon={UserIcon}
                    title="User Management"
                    subtitle="Monitor registrations and manage access levels"
                />
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search user..."
                        className="pl-12 pr-6 py-3 bg-slate-900/5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white w-full md:w-80 font-bold text-sm shadow-sm transition-all"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                    />
                </div>
            </div>

            <BentoCard className="shadow-xl overflow-hidden !p-0 border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Affiliate Stats</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300 animate-pulse">
                                            <div className="w-12 h-12 bg-slate-200 rounded-full" />
                                            <div className="h-4 w-32 bg-slate-200 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <User className="w-12 h-12 opacity-50" />
                                            <p className="text-sm font-black uppercase tracking-widest">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100/50 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100">
                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{user.name || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border outline-none cursor-pointer transition-all",
                                                    user.role === 'admin'
                                                        ? 'bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-300'
                                                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300'
                                                )}
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] uppercase text-slate-400 font-bold">Code:</span>
                                                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">{user.referralCode || '-'}</span>
                                                </div>
                                                {user.referredBy && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] uppercase text-slate-400 font-bold">Ref By:</span>
                                                        <span className="text-xs font-mono text-slate-500">{user.referredBy}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-400">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </BentoCard>
        </motion.div>
    );
};
