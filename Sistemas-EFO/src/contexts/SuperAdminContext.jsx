import React, { createContext, useContext, useState, useEffect } from 'react';

const SuperAdminContext = createContext();

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
};

// Tipos de sistemas/módulos disponibles
export const SYSTEM_TYPES = {
  FORMS: 'forms',
  CRM: 'crm',
  INVENTORY: 'inventory',
  FINANCE: 'finance',
  HR: 'hr',
  PROJECTS: 'projects'
};

// Estados de sistemas
export const SYSTEM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  DEVELOPMENT: 'development'
};

// Tipos de dashboards
export const DASHBOARD_TYPES = {
  EXECUTIVE: 'executive',
  OPERATIONAL: 'operational',
  ANALYTICAL: 'analytical',
  REPORTS: 'reports'
};

// Base de datos de sistemas registrados
const SYSTEMS_DATABASE = [
  {
    id: 1,
    name: 'Subsistema de Crédito - Sistemas EFO',
    type: SYSTEM_TYPES.FORMS,
    description: 'Gestión de formularios de crédito y solicitudes generales',
    status: SYSTEM_STATUS.ACTIVE,
    version: '1.0.0',
    url: '/form/credito-efo',
    icon: 'FileText',
    color: '#006068',
    admins: [1, 2, 3, 4], // IDs de administradores
    dashboards: [
      {
        id: 101,
        name: 'Dashboard Principal',
        type: DASHBOARD_TYPES.OPERATIONAL,
        url: '/admin/dashboard',
        description: 'Panel principal de gestión de formularios'
      }
    ],
    metrics: {
      totalUsers: 4,
      activeSubmissions: 156,
      monthlyGrowth: '+12%',
      uptime: '99.9%'
    },
    permissions: ['view_forms', 'edit_forms', 'manage_users', 'export_data'],
    createdAt: '2025-01-01',
    lastUpdated: '2025-01-15'
  },
  {
    id: 2,
    name: 'Subsistema de Patch Cords - Sistemas EFO',
    type: SYSTEM_TYPES.INVENTORY,
    description: 'Configurador y gestión de patch cords de fibra óptica',
    status: SYSTEM_STATUS.ACTIVE,
    version: '1.0.0',
    url: '/admin/patch-cords',
    icon: 'Package',
    color: '#10b981',
    admins: [1, 2], // Super admin y credit admin
    dashboards: [
      {
        id: 201,
        name: 'Panel de Precios',
        type: DASHBOARD_TYPES.OPERATIONAL,
        url: '/admin/patch-cords',
        description: 'Gestión de precios de conectores, cables y servicios'
      },
      {
        id: 202,
        name: 'Configurador Público',
        type: DASHBOARD_TYPES.OPERATIONAL,
        url: '/patch-cords',
        description: 'Configurador público para clientes'
      }
    ],
    metrics: {
      totalUsers: 2,
      activePatchCords: 45,
      monthlyGrowth: 'N/A',
      uptime: 'N/A'
    },
    permissions: ['view_inventory', 'edit_patch_cords', 'manage_cables', 'generate_reports'],
    createdAt: '2025-01-10',
    lastUpdated: '2025-01-15'
  },
  {
    id: 3,
    name: "OTDR'S EFO",
    type: SYSTEM_TYPES.INVENTORY,
    description: 'Gestión de equipos OTDR y análisis de fibra óptica',
    status: SYSTEM_STATUS.DEVELOPMENT,
    version: '0.5.0',
    url: '/otdr/dashboard',
    icon: 'Package',
    color: '#059669',
    admins: [1],
    dashboards: [
      {
        id: 301,
        name: "Dashboard OTDR'S",
        type: DASHBOARD_TYPES.OPERATIONAL,
        url: '/otdr/equipment',
        description: 'Control de equipos OTDR y mediciones'
      }
    ],
    metrics: {
      totalUsers: 1,
      equipmentOTDR: 0,
      monthlyGrowth: 'N/A',
      uptime: 'N/A'
    },
    permissions: ['view_equipment', 'edit_otdr', 'manage_measurements', 'generate_reports'],
    createdAt: '2025-01-12',
    lastUpdated: '2025-01-15'
  }
];

// Plantillas de sistemas para crear nuevos módulos
export const SYSTEM_TEMPLATES = [
  {
    type: SYSTEM_TYPES.FINANCE,
    name: 'Sistema Financiero',
    description: 'Gestión de contabilidad, facturación y finanzas',
    icon: 'DollarSign',
    color: '#f59e0b',
    defaultDashboards: [
      { name: 'Dashboard Contable', type: DASHBOARD_TYPES.ANALYTICAL },
      { name: 'Dashboard Facturación', type: DASHBOARD_TYPES.OPERATIONAL }
    ],
    defaultPermissions: ['view_finances', 'edit_invoices', 'manage_accounting']
  },
  {
    type: SYSTEM_TYPES.HR,
    name: 'Sistema de Recursos Humanos',
    description: 'Gestión de empleados, nómina y reclutamiento',
    icon: 'UserCheck',
    color: '#ef4444',
    defaultDashboards: [
      { name: 'Dashboard RRHH', type: DASHBOARD_TYPES.OPERATIONAL },
      { name: 'Dashboard Nómina', type: DASHBOARD_TYPES.ANALYTICAL }
    ],
    defaultPermissions: ['view_employees', 'edit_payroll', 'manage_hr']
  },
  {
    type: SYSTEM_TYPES.PROJECTS,
    name: 'Sistema de Proyectos',
    description: 'Gestión de proyectos y tareas',
    icon: 'Briefcase',
    color: '#8b5cf6',
    defaultDashboards: [
      { name: 'Dashboard Proyectos', type: DASHBOARD_TYPES.OPERATIONAL },
      { name: 'Dashboard Tareas', type: DASHBOARD_TYPES.ANALYTICAL }
    ],
    defaultPermissions: ['view_projects', 'edit_tasks', 'manage_teams']
  }
];

export const SuperAdminProvider = ({ children }) => {
  const [systems, setSystems] = useState(SYSTEMS_DATABASE);
  const [loading, setLoading] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(null);

  // Obtener sistemas por estado
  const getSystemsByStatus = (status) => {
    return systems.filter(system => system.status === status);
  };

  // Obtener métricas generales
  const getOverallMetrics = () => {
    const activeSystems = getSystemsByStatus(SYSTEM_STATUS.ACTIVE).length;
    const totalUsers = systems.reduce((sum, system) => sum + system.metrics.totalUsers, 0);
    const developmentSystems = getSystemsByStatus(SYSTEM_STATUS.DEVELOPMENT).length;
    
    return {
      totalSystems: systems.length,
      activeSystems,
      developmentSystems,
      totalUsers,
      totalDashboards: systems.reduce((sum, system) => sum + system.dashboards.length, 0)
    };
  };

  // Crear nuevo sistema
  const createSystem = (systemData) => {
    const newSystem = {
      id: Date.now(),
      ...systemData,
      status: SYSTEM_STATUS.DEVELOPMENT,
      version: '0.1.0',
      admins: [1], // Solo super admin inicialmente
      metrics: {
        totalUsers: 1,
        activeSubmissions: 0,
        monthlyGrowth: 'N/A',
        uptime: 'N/A'
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    setSystems(prev => [...prev, newSystem]);
    return newSystem;
  };

  // Actualizar sistema
  const updateSystem = (systemId, updates) => {
    setSystems(prev => prev.map(system => 
      system.id === systemId 
        ? { ...system, ...updates, lastUpdated: new Date().toISOString() }
        : system
    ));
  };

  // Eliminar sistema
  const deleteSystem = (systemId) => {
    setSystems(prev => prev.filter(system => system.id !== systemId));
  };

  // Cambiar estado del sistema
  const changeSystemStatus = (systemId, newStatus) => {
    updateSystem(systemId, { status: newStatus });
  };

  // Gestión de administradores
  const addAdminToSystem = (systemId, adminId) => {
    const system = systems.find(s => s.id === systemId);
    if (system && !system.admins.includes(adminId)) {
      updateSystem(systemId, { 
        admins: [...system.admins, adminId] 
      });
    }
  };

  const removeAdminFromSystem = (systemId, adminId) => {
    const system = systems.find(s => s.id === systemId);
    if (system) {
      updateSystem(systemId, { 
        admins: system.admins.filter(id => id !== adminId) 
      });
    }
  };

  // Gestión de dashboards
  const addDashboardToSystem = (systemId, dashboardData) => {
    const system = systems.find(s => s.id === systemId);
    if (system) {
      const newDashboard = {
        id: Date.now(),
        ...dashboardData
      };
      updateSystem(systemId, { 
        dashboards: [...system.dashboards, newDashboard] 
      });
    }
  };

  const removeDashboardFromSystem = (systemId, dashboardId) => {
    const system = systems.find(s => s.id === systemId);
    if (system) {
      updateSystem(systemId, { 
        dashboards: system.dashboards.filter(d => d.id !== dashboardId) 
      });
    }
  };

  const value = {
    systems,
    loading,
    selectedSystem,
    setSelectedSystem,
    // Métricas
    getOverallMetrics,
    getSystemsByStatus,
    // Gestión de sistemas
    createSystem,
    updateSystem,
    deleteSystem,
    changeSystemStatus,
    // Gestión de administradores
    addAdminToSystem,
    removeAdminFromSystem,
    // Gestión de dashboards
    addDashboardToSystem,
    removeDashboardFromSystem,
    // Constantes
    SYSTEM_TYPES,
    SYSTEM_STATUS,
    DASHBOARD_TYPES,
    SYSTEM_TEMPLATES
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};
