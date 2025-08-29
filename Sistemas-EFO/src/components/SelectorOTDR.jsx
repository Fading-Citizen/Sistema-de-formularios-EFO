import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, ExternalLink } from 'lucide-react';
import logoEFO from '../assets/images/Logoefo.png';
import { otdrApi } from '../config/otdrApi';
import './SelectorOTDR.css';
import './Shared.css';

const SelectorOTDR = () => {
  // Grupos de rango dinámico
  const otdrGroups = {
    '7-22': { minDB: 7, maxDB: 22, minKm: 20, maxKm: 70 },
    '19-26': { minDB: 19, maxDB: 26, minKm: 60, maxKm: 80 },
    '26-35': { minDB: 26, maxDB: 35, minKm: 80, maxKm: 110 },
    '35-45': { minDB: 35, maxDB: 45, minKm: 110, maxKm: 145 },
    '46-50': { minDB: 46, maxDB: 50, minKm: 145, maxKm: 160 }
  };

  // Estados
  const [products, setProducts] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRange, setSelectedRange] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos OTDR activos al montar el componente
  useEffect(() => {
    loadActiveOTDR();
  }, []);

  const loadActiveOTDR = async () => {
    try {
      setLoading(true);
      const response = await otdrApi.getActiveOTDR();
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error('Error loading OTDR data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros cuando cambien los criterios de selección
  useEffect(() => {
    filterProducts();
  }, [selectedTypes, selectedRange, products]);

  // Manejar cambios en checkboxes
  const handleTypeChange = (type) => {
    let newSelectedTypes = [...selectedTypes];
    
    if (newSelectedTypes.includes(type)) {
      newSelectedTypes = newSelectedTypes.filter(t => t !== type);
    } else {
      // Validar combinaciones
      if (newSelectedTypes.length >= 2) return;
      
      const hasMultimodo = newSelectedTypes.includes('MULTIMODO') || type === 'MULTIMODO';
      const hasFibraActiva = newSelectedTypes.includes('FIBRA_ACTIVA') || type === 'FIBRA_ACTIVA';
      
      // No permitir MULTIMODO + FIBRA_ACTIVA
      if (hasMultimodo && hasFibraActiva) return;
      
      newSelectedTypes.push(type);
    }
    
    setSelectedTypes(newSelectedTypes);
  };

  // Manejar cambio de rango
  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  // Filtrar productos
  const filterProducts = () => {
    const filtered = products.filter(p => {
      // Validar tipo de OTDR
      const typeMatch = selectedTypes.length === 0 || 
        selectedTypes.every(t => {
          if (t === 'FIBRA_ACTIVA') return p.fibraActiva;
          return p.modes.includes(t);
        });

      // Excluir productos con fibra activa si no se selecciona el filtro
      const fibraActivaMatch = selectedTypes.includes('FIBRA_ACTIVA') || !p.fibraActiva;

      // Validar rango dinámico
      const rangeMatch = !selectedRange || 
        (p.rangoDinamico >= otdrGroups[selectedRange].minDB && 
         p.rangoDinamico <= otdrGroups[selectedRange].maxDB);

      return typeMatch && fibraActivaMatch && rangeMatch;
    });

    setFilteredProducts(filtered);
  };

  const isTypeDisabled = (type) => {
    if (selectedTypes.length >= 2 && !selectedTypes.includes(type)) return true;
    if (type === 'MULTIMODO' && selectedTypes.includes('FIBRA_ACTIVA')) return true;
    if (type === 'FIBRA_ACTIVA' && selectedTypes.includes('MULTIMODO')) return true;
    return false;
  };

  return (
    <div className="selector-otdr">
      <div className="system-header">
        <img src={logoEFO} alt="EFO" className="efo-logo" />
        <div className="header-text">
          <h1>Selector de OTDR</h1>
          <p>Encuentra el OTDR perfecto para tus necesidades de medición en fibra óptica</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-container">
        <div className="filter-group">
          <label className="filter-label">
            <Filter size={16} />
            Selecciona el Tipo de Fibra
          </label>
          <div className="filter-checkbox-group">
            <div className={`checkbox-container ${isTypeDisabled('MONOMODO') ? 'disabled' : ''}`}>
              <input 
                type="checkbox" 
                id="monomodoCheckbox" 
                checked={selectedTypes.includes('MONOMODO')}
                onChange={() => handleTypeChange('MONOMODO')}
                disabled={isTypeDisabled('MONOMODO')}
              />
              <label htmlFor="monomodoCheckbox">Monomodo</label>
            </div>
            <div className={`checkbox-container ${isTypeDisabled('MULTIMODO') ? 'disabled' : ''}`}>
              <input 
                type="checkbox" 
                id="multimodoCheckbox" 
                checked={selectedTypes.includes('MULTIMODO')}
                onChange={() => handleTypeChange('MULTIMODO')}
                disabled={isTypeDisabled('MULTIMODO')}
              />
              <label htmlFor="multimodoCheckbox">Multimodo</label>
            </div>
            <div className={`checkbox-container ${isTypeDisabled('FIBRA_ACTIVA') ? 'disabled' : ''}`}>
              <input 
                type="checkbox" 
                id="fibraActivaCheckbox" 
                checked={selectedTypes.includes('FIBRA_ACTIVA')}
                onChange={() => handleTypeChange('FIBRA_ACTIVA')}
                disabled={isTypeDisabled('FIBRA_ACTIVA')}
              />
              <label htmlFor="fibraActivaCheckbox">Fibra Activa</label>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="distanceFilter" className="filter-label">
            <Search size={16} />
            Rango dinámico
          </label>
          <select 
            id="distanceFilter" 
            className="filter-dropdown"
            value={selectedRange}
            onChange={(e) => handleRangeChange(e.target.value)}
          >
            <option value="">Todos los rangos</option>
            <option value="7-22">7-22 dB (20-70 km)</option>
            <option value="19-26">19-26 dB (60-80 km)</option>
            <option value="26-35">26-35 dB (80-110 km)</option>
            <option value="35-45">35-45 dB (110-145 km)</option>
            <option value="46-50">46-50 dB (145-160 km)</option>
          </select>
        </div>
      </div>

      {/* Resultados */}
      <div className="otdr-container">
        <div className="results-header">
          <h2>Resultados de OTDR ({filteredProducts.length})</h2>
          <p>Equipos disponibles según tus filtros de selección</p>
        </div>

        <div className="product-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <h3>Cargando OTDR...</h3>
              <p>Obteniendo equipos disponibles</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results">
              <Search size={48} />
              <h3>No se encontraron OTDR</h3>
              <p>No hay equipos que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div key={index} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.modelo} />
                </div>
                <div className="product-content">
                  <div className="product-modelo">{product.modelo}</div>
                  <div className="product-details">
                    <div className="detail-item">
                      <span className="detail-label">Tipo:</span>
                      <span className="detail-value">
                        {product.modes.join(' / ')}
                        {product.fibraActiva && <span className="fibra-activa-tag">FIBRA ACTIVA</span>}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rango dinámico:</span>
                      <span className="detail-value">{product.rangoDinamico} dB / {product.distanciaAprox}</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-product-btn"
                    >
                      <Eye size={16} />
                      Ver Producto
                    </a>
                    <a 
                      href={product.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="external-link-btn"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectorOTDR;
