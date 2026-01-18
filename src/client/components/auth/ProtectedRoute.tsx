import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User } from '@shared/types';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: User['role']; // Optional specific role requirement
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/auth' 
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show nothing or a spinner while ensuring auth state is restored
    return <div className="min-h-screen bg-slate-50" />; 
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // User is auth but doesn't have permissions
    // Redirect to main app or a 403 page
    return <Navigate to="/app" replace />;
  }

  // If children are provided, render them (wrapping usage), otherwise render Outlet (layout usage)
  return children ? <>{children}</> : <Outlet />;
};
