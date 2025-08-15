import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Por ahora, credenciales hardcodeadas para MVP
      if (username === 'admin' && password === 'efo2025') {
        const userData = {
          id: 1,
          username: 'admin',
          role: 'administrator',
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales incorrectas' };
      }
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
