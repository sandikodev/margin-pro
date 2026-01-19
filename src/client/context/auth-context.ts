import { createContext, useContext } from 'react';
import { User } from '@shared/types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, newUser: User) => void;
  logout: () => void;
  signOut: () => void;
  hasRole: (requiredRole: User['role']) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
