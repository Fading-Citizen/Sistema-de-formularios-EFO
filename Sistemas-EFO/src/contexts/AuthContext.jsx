import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../config/authApi.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Definición de roles y permisos
export const USER_ROLES = {
  SUPER_ADMIN: 'superadmin',
  CREDIT_ADMIN: 'admin', 
  GENERAL_ADMIN: 'admin',
  VIEWER: 'user'
};

export const FORM_TYPES = {
  CREDIT: 'credito',
  GENERAL: 'general',
  CONTACT: 'contacto'
};

// Configuración de permisos por rol
const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: {
    forms: [FORM_TYPES.CREDIT, FORM_TYPES.GENERAL, FORM_TYPES.CONTACT],
    canManageUsers: true,
    canViewAll: true,
    canEdit: true,
    canDelete: true,
    canArchive: true,
    canExport: true
  },
  [USER_ROLES.CREDIT_ADMIN]: {
    forms: [FORM_TYPES.CREDIT],
    canManageUsers: false,
    canViewAll: true,
    canEdit: true,
    canDelete: false,
    canArchive: true,
    canExport: true
  },
  [USER_ROLES.GENERAL_ADMIN]: {
    forms: [FORM_TYPES.GENERAL, FORM_TYPES.CONTACT],
    canManageUsers: false,
    canViewAll: true,
    canEdit: true,
    canDelete: false,
    canArchive: true,
    canExport: true
  },
  [USER_ROLES.VIEWER]: {
    forms: [FORM_TYPES.CREDIT, FORM_TYPES.GENERAL, FORM_TYPES.CONTACT],
    canManageUsers: false,
    canViewAll: true,
    canEdit: false,
    canDelete: false,
    canArchive: false,
    canExport: false
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('efo_admin_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('efo_admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Iniciando login con:', email);
      
      // Usar la API de autenticación con Supabase
      const result = await authApi.login(email, password);

      if (result.success) {
        const userData = {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
          name: result.user.name,
          permissions: ROLE_PERMISSIONS[result.user.role] || ROLE_PERMISSIONS[USER_ROLES.VIEWER],
          loginTime: new Date().toISOString()
        };

        setUser(userData);
        localStorage.setItem('efo_admin_user', JSON.stringify(userData));
        
        console.log('✅ Login exitoso:', userData);
        return { success: true, user: userData };
      } else {
        console.log('❌ Login fallido:', result.error);
        return { success: false, error: result.error };
      }

    } catch (error) {
      console.error('💥 Error en login:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica tu conexión a internet.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('efo_admin_user');
  };

  // Funciones de utilidad para verificar permisos
  const hasPermission = (permission) => {
    return user?.permissions?.[permission] || false;
  };

  const canAccessForm = (formType) => {
    return user?.permissions?.forms?.includes(formType) || false;
  };

  const canManageUsers = () => {
    return hasPermission('canManageUsers');
  };

  const canEdit = () => {
    return hasPermission('canEdit');
  };

  const canDelete = () => {
    return hasPermission('canDelete');
  };

  const canArchive = () => {
    return hasPermission('canArchive');
  };

  const canExport = () => {
    return hasPermission('canExport');
  };

  const getUserRoleLabel = (role) => {
    const labels = {
      [USER_ROLES.SUPER_ADMIN]: 'Super Administrador',
      [USER_ROLES.CREDIT_ADMIN]: 'Administrador de Crédito',
      [USER_ROLES.GENERAL_ADMIN]: 'Administrador General',
      [USER_ROLES.VIEWER]: 'Solo Lectura'
    };
    return labels[role] || 'Desconocido';
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    // Funciones de permisos
    hasPermission,
    canAccessForm,
    canManageUsers,
    canEdit,
    canDelete,
    canArchive,
    canExport,
    getUserRoleLabel,
    // Constantes
    USER_ROLES,
    FORM_TYPES
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
