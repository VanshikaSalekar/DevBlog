
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ 
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

  // Redirect if not logged in or not an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to={redirectTo} replace />;
  }

  // Show children if logged in as admin
  return <>{children}</>;
};
