import React, { createContext, useContext, useState, useEffect } from 'react';

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
  SUPER_ADMIN: 'super_admin',
  CREDIT_ADMIN: 'credit_admin',
  GENERAL_ADMIN: 'general_admin',
  VIEWER: 'viewer'
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

// Base de datos simulada de usuarios
const USERS_DATABASE = [
  {
    id: 1,
    username: 'superadmin',
    password: 'efo2025super',
    role: USER_ROLES.SUPER_ADMIN,
    name: 'Administrador Principal',
    email: 'admin@efo.co',
    department: 'Sistemas',
    active: true,
    createdAt: '2025-01-01'
  },
  {
    id: 2,
    username: 'creditadmin',
    password: 'efo2025credit',
    role: USER_ROLES.CREDIT_ADMIN,
    name: 'María Fernández',
    email: 'credito@efo.co',
    department: 'Crédito y Cobranza',
    active: true,
    createdAt: '2025-01-05'
  },
  {
    id: 3,
    username: 'generaladmin',
    password: 'efo2025general',
    role: USER_ROLES.GENERAL_ADMIN,
    name: 'Carlos Rodríguez',
    email: 'general@efo.co',
    department: 'Administración General',
    active: true,
    createdAt: '2025-01-10'
  },
  {
    id: 4,
    username: 'viewer',
    password: 'efo2025view',
    role: USER_ROLES.VIEWER,
    name: 'Ana López',
    email: 'viewer@efo.co',
    department: 'Consulta',
    active: true,
    createdAt: '2025-01-15'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('efo_admin_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Verificar que el usuario siga activo
      const currentUser = USERS_DATABASE.find(u => u.id === userData.id && u.active);
      if (currentUser) {
        setUser(userData);
      } else {
        localStorage.removeItem('efo_admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Buscar usuario en la base de datos
      const foundUser = USERS_DATABASE.find(
        user => user.username === username && user.password === password && user.active
      );

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
          name: foundUser.name,
          email: foundUser.email,
          department: foundUser.department,
          permissions: ROLE_PERMISSIONS[foundUser.role],
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('efo_admin_user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'Credenciales incorrectas o usuario inactivo' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
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
    FORM_TYPES,
    USERS_DATABASE: user?.permissions?.canManageUsers ? USERS_DATABASE : []
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
