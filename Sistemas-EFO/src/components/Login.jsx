import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoEFO from '../assets/images/Logoefo.png';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
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
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return '/admin/super-admin';
      case USER_ROLES.CREDIT_ADMIN:
      case USER_ROLES.GENERAL_ADMIN:
      case USER_ROLES.VIEWER:
        return '/admin/dashboard';
      default:
        return '/admin/dashboard';
    }
  };

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(credentials.username, credentials.password);

    if (result.success) {
      // Si hay una ruta específica solicitada, usar esa; sino, usar la ruta por defecto del rol
      const redirectTo = from || getDefaultRouteForRole(result.user.role);
      navigate(redirectTo, { replace: true });
    } else {
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
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              placeholder="Ingresa tu usuario"
              autoComplete="username"
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

        {/* Información de usuarios de prueba */}
        <div className="demo-users">
          <h3>Usuarios de Prueba</h3>
          <div className="user-demo-grid">
            <div className="user-demo-item">
              <strong>Super Admin</strong>
              <code>superadmin / efo2025super</code>
              <span>Acceso completo</span>
            </div>
            <div className="user-demo-item">
              <strong>Admin Crédito</strong>
              <code>creditadmin / efo2025credit</code>
              <span>Solo subsistema de crédito</span>
            </div>
            <div className="user-demo-item">
              <strong>Admin General</strong>
              <code>generaladmin / efo2025general</code>
              <span>Subsistemas generales</span>
            </div>
            <div className="user-demo-item">
              <strong>Solo Lectura</strong>
              <code>viewer / efo2025view</code>
              <span>Solo visualización</span>
            </div>
          </div>
        </div>

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
