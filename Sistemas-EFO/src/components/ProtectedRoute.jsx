import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = null }) => {
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

  // Verificar permisos de rol
  const hasRequiredRole = () => {
    if (requiredRole) {
      return user.role === requiredRole;
    }
    
    if (allowedRoles && Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role);
    }
    
    // Si no se especifica rol, permitir acceso
    return true;
  };

  if (!hasRequiredRole()) {
    console.log('🚫 Acceso denegado. Usuario:', user.role, 'Roles permitidos:', allowedRoles);
    
    // Redirigir según el rol del usuario
    const getRedirectPath = () => {
      switch (user.role) {
        case 'superadmin':
          return '/admin/super-admin';
        case 'admin':
        case 'user':
          return '/admin/dashboard';
        default:
          return '/admin/login';
      }
    };
    
    return <Navigate to={getRedirectPath()} replace />;
  }

  console.log('✅ Acceso permitido. Usuario:', user.role, 'Ruta:', location.pathname);
  return children;
};

export default ProtectedRoute;
