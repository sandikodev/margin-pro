import React, { useState } from 'react';
import { User } from '@shared/types';
import { DEMO_USER_CREDENTIALS } from '../lib/demo-data';
import { AuthContext } from './AuthContext';

// Local Storage Keys
const AUTH_TOKEN_KEY = 'margins_pro_token';
const AUTH_USER_KEY = 'margins_pro_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy Initialization to avoid useEffect setStates
  const [user, setUser] = useState<User | null>(() => {
    try {
        const savedUser = localStorage.getItem(AUTH_USER_KEY);
        if (savedUser) {
            return JSON.parse(savedUser);
        }
        
        // Legacy fallback
        if (localStorage.getItem('margins_pro_auth') === 'true') {
             return {
                id: 'demo-user-001',
                email: DEMO_USER_CREDENTIALS.email,
                name: 'Demo Merchant',
                role: 'user',
                createdAt: Date.now()
            } as User;
        }
    } catch (e) {
        console.error("Failed to parse auth user", e);
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
      return !!localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem('margins_pro_auth') === 'true';
  });

  const [isLoading] = useState(false); // No longer loading since we init synchronously

  const login = (token: string, newUser: User) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    localStorage.setItem('margins_pro_auth', 'true'); // Legacy
    
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem('margins_pro_auth'); // Legacy
    localStorage.removeItem('margins_pro_onboarded');
    
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (requiredRole: User['role']) => {
    if (!user || !user.role) return false;
    if (user.role === 'admin') return true; 
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
