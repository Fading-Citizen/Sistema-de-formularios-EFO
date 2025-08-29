import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Search,
  Filter,
  Package,
  Home,
  LogOut,
  Upload,
  Download
} from 'lucide-react';
import logoEFO from '../assets/images/Logoefo.png';
import './OTDRAdmin.css';

const OTDRAdmin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Estados para gestión de OTDR
  const [otdrList, setOtdrList] = useState([
    {
      id: 1,
      modelo: "OTDR GRANDWAY FHO1500 ULTIMA MILLA",
      modes: ["MONOMODO"],
      rangoDinamico: 7,
      distanciaAprox: "20 km ≈",
      distanciaNum: 20,
      fibraActiva: true,
      image: "https://electrolfibraoptica.com/wp-content/uploads/2025/06/edf78fa506dea0dd291f70e8fc91f3fc_OTDR_GRANDWAY_FHO1500_51.webp",
      link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho1500/",
      activo: true
    },
    {
      id: 2,
      modelo: "OTDR GRANDWAY FHO3000L",
      modes: ["MONOMODO"],
      rangoDinamico: 26,
      distanciaAprox: "80 km ≈",
      distanciaNum: 80,
      fibraActiva: false,
      image: "https://electrolfibraoptica.com/wp-content/uploads/2025/02/OTRDFHO3000L-1-1.webp",
      link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho3000l/",
      activo: true
    }
    // Agregar más productos aquí...
  ]);

  const [filteredOTDR, setFilteredOTDR] = useState(otdrList);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOTDR, setEditingOTDR] = useState(null);
  const [loading, setLoading] = useState(false);

  // Formulario para agregar/editar OTDR
  const [formData, setFormData] = useState({
    modelo: '',
    modes: [],
    rangoDinamico: '',
    distanciaAprox: '',
    distanciaNum: '',
    fibraActiva: false,
    image: '',
    link: '',
    activo: true
  });

  // Filtrar OTDR según búsqueda y filtros
  useEffect(() => {
    let filtered = otdrList;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(otdr => 
        otdr.modelo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por modo
    if (filterMode) {
      filtered = filtered.filter(otdr => 
        otdr.modes.includes(filterMode)
      );
    }

    setFilteredOTDR(filtered);
  }, [otdrList, searchTerm, filterMode]);

  // Manejar logout
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Abrir modal para agregar nuevo OTDR
  const handleAddNew = () => {
    setFormData({
      modelo: '',
      modes: [],
      rangoDinamico: '',
      distanciaAprox: '',
      distanciaNum: '',
      fibraActiva: false,
      image: '',
      link: '',
      activo: true
    });
    setEditingOTDR(null);
    setShowAddModal(true);
  };

  // Abrir modal para editar OTDR
  const handleEdit = (otdr) => {
    setFormData(otdr);
    setEditingOTDR(otdr);
    setShowAddModal(true);
  };

  // Guardar OTDR (agregar o editar)
  const handleSave = () => {
    if (!formData.modelo || !formData.rangoDinamico) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (editingOTDR) {
        // Editar existente
        const updatedList = otdrList.map(otdr => 
          otdr.id === editingOTDR.id ? { ...formData, id: editingOTDR.id } : otdr
        );
        setOtdrList(updatedList);
      } else {
        // Agregar nuevo
        const newOTDR = {
          ...formData,
          id: Math.max(...otdrList.map(o => o.id)) + 1
        };
        setOtdrList([...otdrList, newOTDR]);
      }

      setShowAddModal(false);
      setLoading(false);
    }, 1000);
  };

  // Eliminar OTDR
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este OTDR?')) {
      setOtdrList(otdrList.filter(otdr => otdr.id !== id));
    }
  };

  // Toggle activo/inactivo
  const toggleActive = (id) => {
    const updatedList = otdrList.map(otdr => 
      otdr.id === id ? { ...otdr, activo: !otdr.activo } : otdr
    );
    setOtdrList(updatedList);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'modes') {
      const currentModes = [...formData.modes];
      if (checked) {
        if (!currentModes.includes(value)) {
          currentModes.push(value);
        }
      } else {
        const index = currentModes.indexOf(value);
        if (index > -1) {
          currentModes.splice(index, 1);
        }
      }
      setFormData({ ...formData, modes: currentModes });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  return (
    <div className="otdr-admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <img src={logoEFO} alt="EFO Logo" className="admin-logo" />
              <div className="header-info">
                <h1>Panel de Administración OTDR</h1>
                <p>Gestión de equipos y especificaciones</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="home-btn"
              onClick={() => navigate('/')}
            >
              <Home size={16} />
              Inicio
            </button>
            <div className="user-info">
              <div className="user-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.email || 'Administrador'}</span>
                <span className="user-role">Super Admin</span>
              </div>
            </div>
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Controles principales */}
      <div className="admin-controls">
        <div className="controls-container">
          <div className="search-filters">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar OTDR por modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los modos</option>
              <option value="MONOMODO">Monomodo</option>
              <option value="MULTIMODO">Multimodo</option>
            </select>
          </div>
          <div className="action-buttons">
            <button 
              className="btn-primary"
              onClick={handleAddNew}
            >
              <Plus size={16} />
              Agregar OTDR
            </button>
            <button className="btn-secondary">
              <Upload size={16} />
              Importar
            </button>
            <button className="btn-secondary">
              <Download size={16} />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de OTDR */}
      <div className="otdr-list-container">
        <div className="list-header">
          <h2>Equipos OTDR ({filteredOTDR.length})</h2>
          <p>Gestiona los equipos disponibles en el selector público</p>
        </div>

        <div className="otdr-grid">
          {filteredOTDR.map(otdr => (
            <div key={otdr.id} className={`otdr-card ${!otdr.activo ? 'inactive' : ''}`}>
              <div className="card-header">
                <div className="otdr-image">
                  <img src={otdr.image} alt={otdr.modelo} />
                </div>
                <div className="card-status">
                  <button
                    className={`status-toggle ${otdr.activo ? 'active' : 'inactive'}`}
                    onClick={() => toggleActive(otdr.id)}
                  >
                    {otdr.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
              </div>

              <div className="card-content">
                <h3 className="otdr-modelo">{otdr.modelo}</h3>
                <div className="otdr-specs">
                  <div className="spec-item">
                    <span className="spec-label">Modo:</span>
                    <span className="spec-value">
                      {otdr.modes.join(', ')}
                      {otdr.fibraActiva && <span className="fibra-tag">FIBRA ACTIVA</span>}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Rango:</span>
                    <span className="spec-value">{otdr.rangoDinamico} dB</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Distancia:</span>
                    <span className="spec-value">{otdr.distanciaAprox}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(otdr)}
                >
                  <Edit3 size={14} />
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(otdr.id)}
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para agregar/editar OTDR */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingOTDR ? 'Editar OTDR' : 'Agregar Nuevo OTDR'}</h3>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Modelo *</label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    placeholder="Ej: OTDR GRANDWAY FHO1500"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rango Dinámico (dB) *</label>
                  <input
                    type="number"
                    name="rangoDinamico"
                    value={formData.rangoDinamico}
                    onChange={handleInputChange}
                    placeholder="Ej: 22"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Distancia Aproximada</label>
                  <input
                    type="text"
                    name="distanciaAprox"
                    value={formData.distanciaAprox}
                    onChange={handleInputChange}
                    placeholder="Ej: 70km ≈"
                  />
                </div>

                <div className="form-group">
                  <label>Distancia Numérica (km)</label>
                  <input
                    type="number"
                    name="distanciaNum"
                    value={formData.distanciaNum}
                    onChange={handleInputChange}
                    placeholder="Ej: 70"
                  />
                </div>

                <div className="form-group full-width">
                  <label>URL de Imagen</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>Enlace del Producto</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Modos de Fibra</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="modes"
                        value="MONOMODO"
                        checked={formData.modes.includes('MONOMODO')}
                        onChange={handleInputChange}
                      />
                      Monomodo
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="modes"
                        value="MULTIMODO"
                        checked={formData.modes.includes('MULTIMODO')}
                        onChange={handleInputChange}
                      />
                      Multimodo
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="fibraActiva"
                      checked={formData.fibraActiva}
                      onChange={handleInputChange}
                    />
                    Fibra Activa
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>Guardando...</>
                ) : (
                  <>
                    <Save size={16} />
                    {editingOTDR ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OTDRAdmin;
