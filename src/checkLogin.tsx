import React, { ReactNode } from 'react';
import useAuthStore from './stores/useAuthStore';
import { Navigate } from 'react-router-dom';

// Define props type
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuthStore(); // Replace with your actual authentication logic

  // If the user is not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
