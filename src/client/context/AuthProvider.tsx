import React, { useState, useEffect } from 'react';
import { User } from '@shared/types';
import { api } from '../lib/client';
import { AuthContext } from './auth-context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check Session on Mount (Server Cookie Only)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await (api as any).auth.me.$get();
        if (res.ok) {
           const data = await res.json();
           if (data.user) {
             setUser(data.user as unknown as User);
             setIsAuthenticated(true);
           }
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = (token: string, newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
        await (api as any).auth.logout.$post();
    } catch(e) { console.error("Logout API failed", e); }
    
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('margin_pro_auth'); 
    localStorage.removeItem('margin_pro_is_demo');
    
    window.location.href = '/auth';
  };

  const hasRole = (requiredRole: User['role']) => {
    if (!user || !user.role) return false;
    if (user.role === 'admin' || user.role === 'super_admin') return true; 
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, signOut: logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
