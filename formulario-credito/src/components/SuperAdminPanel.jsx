import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSuperAdmin, SYSTEM_STATUS, DASHBOARD_TYPES } from '../contexts/SuperAdminContext';
import logoEFO from '../assets/images/Logoefo.png';
import { 
  Crown,
  Settings,
  Users,
  BarChart3,
  Server,
  Plus,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Wrench,
  FileText,
  DollarSign,
  Package,
  UserCheck,
  Briefcase,
  Monitor,
  Shield,
  Activity,
  TrendingUp,
  Calendar,
  LogOut,
  Home,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import './SuperAdminPanel.css';

const SuperAdminPanel = () => {
  const { user, logout, getUserRoleLabel } = useAuth();
  const { 
    systems, 
    getOverallMetrics, 
    getSystemsByStatus,
    changeSystemStatus,
    selectedSystem,
    setSelectedSystem,
    SYSTEM_TEMPLATES
  } = useSuperAdmin();

  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateSystem, setShowCreateSystem] = useState(false);

  const metrics = getOverallMetrics();

  const getSystemIcon = (iconName) => {
    const icons = {
      FileText: FileText,
      Users: Users,
      Package: Package,
      DollarSign: DollarSign,
      UserCheck: UserCheck,
      Briefcase: Briefcase
    };
    const IconComponent = icons[iconName] || FileText;
    return <IconComponent size={24} />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case SYSTEM_STATUS.ACTIVE:
        return <CheckCircle className="status-icon active" size={16} />;
      case SYSTEM_STATUS.INACTIVE:
        return <AlertCircle className="status-icon inactive" size={16} />;
      case SYSTEM_STATUS.MAINTENANCE:
        return <Wrench className="status-icon maintenance" size={16} />;
      case SYSTEM_STATUS.DEVELOPMENT:
        return <Clock className="status-icon development" size={16} />;
      default:
        return <AlertCircle className="status-icon" size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      [SYSTEM_STATUS.ACTIVE]: 'Activo',
      [SYSTEM_STATUS.INACTIVE]: 'Inactivo',
      [SYSTEM_STATUS.MAINTENANCE]: 'Mantenimiento',
      [SYSTEM_STATUS.DEVELOPMENT]: 'Desarrollo'
    };
    return labels[status] || 'Desconocido';
  };

  const handleLogout = () => {
    logout();
  };

  const handleSystemAccess = (system) => {
    if (system.status === SYSTEM_STATUS.ACTIVE) {
      // Redirigir al sistema específico
      window.open(system.url, '_blank');
    }
  };

  return (
    <div className="super-admin-container">
      {/* Header */}
      <header className="super-admin-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <img src={logoEFO} alt="EFO Logo" className="logo-super-admin" />
              <div className="header-info">
                <h1>
                  <Crown size={24} />
                  Super Admin Panel
                </h1>
                <p>Centro de control - Ecosistema EFO</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => window.open('https://electrolfibraoptica.com/', '_blank')}
              className="home-btn"
            >
              <Home size={16} />
              Sitio Web
            </button>
            
            <div className="user-info-super">
              <div className="user-avatar">
                <Crown size={20} />
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">
                  <Shield size={12} />
                  {getUserRoleLabel(user.role)}
                </span>
              </div>
            </div>
            
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="super-admin-nav">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={16} />
            Panel General
          </button>
          <button 
            className={`nav-tab ${activeTab === 'systems' ? 'active' : ''}`}
            onClick={() => setActiveTab('systems')}
          >
            <Server size={16} />
            Sistemas
          </button>
          <button 
            className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            Administradores
          </button>
          <button 
            className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <Activity size={16} />
            Analíticas
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="super-admin-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            {/* Metrics Cards */}
            <div className="metrics-grid">
              <div className="metric-card total">
                <div className="metric-icon">
                  <Server size={24} />
                </div>
                <div className="metric-content">
                  <h3>Sistemas Totales</h3>
                  <div className="metric-number">{metrics.totalSystems}</div>
                  <span className="metric-subtitle">Módulos registrados</span>
                </div>
              </div>

              <div className="metric-card active">
                <div className="metric-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="metric-content">
                  <h3>Sistemas Activos</h3>
                  <div className="metric-number">{metrics.activeSystems}</div>
                  <span className="metric-subtitle">En producción</span>
                </div>
              </div>

              <div className="metric-card users">
                <div className="metric-icon">
                  <Users size={24} />
                </div>
                <div className="metric-content">
                  <h3>Usuarios Totales</h3>
                  <div className="metric-number">{metrics.totalUsers}</div>
                  <span className="metric-subtitle">Administradores</span>
                </div>
              </div>

              <div className="metric-card dashboards">
                <div className="metric-icon">
                  <Monitor size={24} />
                </div>
                <div className="metric-content">
                  <h3>Dashboards</h3>
                  <div className="metric-number">{metrics.totalDashboards}</div>
                  <span className="metric-subtitle">Paneles configurados</span>
                </div>
              </div>
            </div>

            {/* Quick Access Systems */}
            <div className="quick-access-section">
              <div className="section-header">
                <h2>Acceso Rápido a Sistemas</h2>
                <button 
                  className="create-system-btn"
                  onClick={() => setShowCreateSystem(true)}
                >
                  <Plus size={16} />
                  Crear Sistema
                </button>
              </div>

              <div className="systems-grid">
                {systems.map(system => (
                  <div key={system.id} className={`system-card ${system.status}`}>
                    <div className="system-header">
                      <div className="system-icon" style={{ backgroundColor: system.color }}>
                        {getSystemIcon(system.icon)}
                      </div>
                      <div className="system-status">
                        {getStatusIcon(system.status)}
                        <span>{getStatusLabel(system.status)}</span>
                      </div>
                    </div>
                    
                    <div className="system-content">
                      <h3>{system.name}</h3>
                      <p>{system.description}</p>
                      <div className="system-metrics">
                        <div className="metric-item">
                          <span className="metric-label">Usuarios:</span>
                          <span className="metric-value">{system.metrics.totalUsers}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Versión:</span>
                          <span className="metric-value">{system.version}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="system-actions">
                      <button 
                        className="action-btn primary"
                        onClick={() => handleSystemAccess(system)}
                        disabled={system.status !== SYSTEM_STATUS.ACTIVE}
                      >
                        <Eye size={14} />
                        {system.status === SYSTEM_STATUS.ACTIVE ? 'Acceder' : 'No disponible'}
                      </button>
                      <button 
                        className="action-btn secondary"
                        onClick={() => setSelectedSystem(system)}
                      >
                        <Settings size={14} />
                        Configurar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Systems Tab */}
        {activeTab === 'systems' && (
          <div className="systems-section">
            <div className="section-header">
              <h2>Gestión de Sistemas</h2>
              <div className="header-actions">
                <button 
                  className="create-system-btn"
                  onClick={() => setShowCreateSystem(true)}
                >
                  <Plus size={16} />
                  Nuevo Sistema
                </button>
              </div>
            </div>

            <div className="systems-table">
              <table>
                <thead>
                  <tr>
                    <th>Sistema</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                    <th>Usuarios</th>
                    <th>Dashboards</th>
                    <th>Última Actualización</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {systems.map(system => (
                    <tr key={system.id}>
                      <td>
                        <div className="system-info">
                          <div className="system-icon-small" style={{ backgroundColor: system.color }}>
                            {getSystemIcon(system.icon)}
                          </div>
                          <div>
                            <div className="system-name">{system.name}</div>
                            <div className="system-version">v{system.version}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="status-badge">
                          {getStatusIcon(system.status)}
                          <span>{getStatusLabel(system.status)}</span>
                        </div>
                      </td>
                      <td>{system.type}</td>
                      <td>{system.metrics.totalUsers}</td>
                      <td>{system.dashboards.length}</td>
                      <td>{new Date(system.lastUpdated).toLocaleDateString()}</td>
                      <td>
                        <div className="actions">
                          <button 
                            className="action-btn view"
                            onClick={() => handleSystemAccess(system)}
                            disabled={system.status !== SYSTEM_STATUS.ACTIVE}
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="action-btn edit"
                            onClick={() => setSelectedSystem(system)}
                          >
                            <Edit size={14} />
                          </button>
                          {system.status === SYSTEM_STATUS.ACTIVE ? (
                            <button 
                              className="action-btn pause"
                              onClick={() => changeSystemStatus(system.id, SYSTEM_STATUS.INACTIVE)}
                            >
                              <Pause size={14} />
                            </button>
                          ) : (
                            <button 
                              className="action-btn play"
                              onClick={() => changeSystemStatus(system.id, SYSTEM_STATUS.ACTIVE)}
                            >
                              <Play size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placeholder para otras tabs */}
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Gestión de Administradores</h2>
            <p>Panel de gestión de usuarios y permisos (En desarrollo)</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Panel de Analíticas</h2>
            <p>Métricas y reportes del ecosistema (En desarrollo)</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdminPanel;
