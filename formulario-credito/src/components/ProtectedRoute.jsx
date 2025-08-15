import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login y guardar la ruta intentada
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Verificar si se requiere un rol específico
  if (requiredRole && user.role !== requiredRole) {
    // Si no tiene el rol requerido, redirigir al dashboard normal
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
