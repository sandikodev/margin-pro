import { createContext } from 'react';
import { User } from '@shared/types';

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    hasRole: (role: User['role']) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
