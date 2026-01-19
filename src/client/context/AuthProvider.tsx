import React, { useState, useEffect, createContext } from 'react';
import { User } from '@shared/types';
// import { DEMO_USER_CREDENTIALS } from '../lib/demo-data'; // Demo mode removed in favor of strict auth
import { api } from '../lib/client'; // Hono RPC Client

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, newUser: User) => void;
  logout: () => void;
  hasRole: (requiredRole: User['role']) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Token is now set via HttpOnly cookie by the server
    // We just update the state
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
        await (api as any).auth.logout.$post();
    } catch(e) { console.error("Logout API failed", e); }
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear legacy flags
    localStorage.removeItem('margin_pro_auth'); 
    localStorage.removeItem('margin_pro_is_demo');
    
    window.location.href = '/auth'; // Redirect to auth page
  };

  const hasRole = (requiredRole: User['role']) => {
    if (!user || !user.role) return false;
    if (user.role === 'admin' || user.role === 'super_admin') return true; 
    return user.role === requiredRole;
  };

  // Non-blocking provider (Public pages render instantly)
  // Protected Routes must check `isLoading` themselves
  // if (isLoading) { return <Loading /> } <--- Removed for Performance

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
