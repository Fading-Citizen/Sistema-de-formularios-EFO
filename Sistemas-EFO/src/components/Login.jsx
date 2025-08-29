import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoEFO from '../assets/images/Logoefo.png';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, USER_ROLES } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Función para determinar la ruta de redirección según el rol
  const getDefaultRouteForRole = (role) => {
    console.log('🎯 Determinando ruta para rol:', role);
    
    switch (role) {
      case 'superadmin':
      case USER_ROLES.SUPER_ADMIN:
        return '/admin/super-admin';
      case 'admin':
      case USER_ROLES.CREDIT_ADMIN:
      case USER_ROLES.GENERAL_ADMIN:
        return '/admin/dashboard';
      case 'user':
      case USER_ROLES.VIEWER:
        return '/admin/dashboard';
      default:
        console.log('⚠️ Rol no reconocido, usando dashboard por defecto');
        return '/admin/dashboard';
    }
  };

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('📝 Enviando formulario de login...');
    const result = await login(credentials.email, credentials.password);
    console.log('📋 Resultado del login:', result);

    if (result.success) {
      console.log('✅ Login exitoso, usuario:', result.user);
      
      // Si hay una ruta específica solicitada, usar esa; sino, usar la ruta por defecto del rol
      const redirectTo = from || getDefaultRouteForRole(result.user.role);
      console.log('🚀 Redirigiendo a:', redirectTo);
      
      navigate(redirectTo, { replace: true });
    } else {
      console.log('❌ Login fallido:', result.error);
      setError(result.error);
    }

    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <img src={logoEFO} alt="EFO Logo" className="logo-login" />
          </div>
          <h1>Acceso Administrativo</h1>
          <p>Panel de control - Sistemas EFO</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tu email"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <a 
            href="https://electrolfibraoptica.com" 
            className="home-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowLeft size={16} />
            Volver al sitio web
          </a>
          <p>
            ¿Necesitas acceso?{' '}
            <a href="mailto:admin@efo.com">Contacta al administrador</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
