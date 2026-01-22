import React, { useState, useEffect } from 'react';
import { User } from '@shared/types';
import { api } from '@/lib/client';
import { AuthContext } from './auth-context';
import { queryClient } from '@/lib/query-client';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check Session on Mount (Server Cookie Only)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.auth.me.$get();
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user as User);
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
    // Clear any previous session data from cache
    queryClient.clear();

    // Clear all session-specific local storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('margin_pro_')) {
        localStorage.removeItem(key);
      }
    });

    setUser(newUser);
    setIsAuthenticated(true);
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    // Prevent duplicate logout calls
    if (isLoggingOut) {
      console.warn('Logout already in progress');
      return;
    }

    setIsLoggingOut(true);

    try {
      await api.auth.logout.$post();
    } catch (e) {
      console.error("Logout API failed", e);
    }

    // Reset Client State
    queryClient.clear();

    // Clear all session-specific local storage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('margin_pro_')) {
        localStorage.removeItem(key);
      }
    });

    setUser(null);
    setIsAuthenticated(false);
    setIsLoggingOut(false);

    // Navigation is handled by the caller for better control
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
