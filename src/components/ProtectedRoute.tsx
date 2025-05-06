
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/signin' 
}) => {
  const { user, loading } = useAuth();

  // Show loading state while auth state is being checked
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Redirect to sign in if not logged in
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Show children if logged in
  return <>{children}</>;
};
