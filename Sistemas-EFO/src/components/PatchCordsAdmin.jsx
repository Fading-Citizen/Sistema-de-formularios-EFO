import React, { useState, useEffect } from 'react';
import { Calculator, Database, Plus, Edit, Save, X, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CotizadorPatchCords from './CotizadorPatchCords';
import './PatchCordsAdmin.css';

const PatchCordsAdmin = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('database');
  
  // Debug log
  console.log('PatchCordsAdmin - user:', user);
  console.log('PatchCordsAdmin - activeView:', activeView);
  console.log('PatchCordsAdmin - isAdmin:', user?.role === 'super_admin'); // Cambiar por defecto a database para admin
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  
  // Base de datos de productos (basada en el Excel)
  const [productDatabase, setProductDatabase] = useState({
    conectores: {
      'SC/UPC_SM_Value': { costo: 0.12, envio: 0.025, impuestos: 0.0145, margenOp: 0.01914, costoFinalUnitario: 0.1786 },
      'SC/APC_SM_Value': { costo: 0.12, envio: 0.025, impuestos: 0.0145, margenOp: 0.01914, costoFinalUnitario: 0.1786 },
      'LC/UPC_SM_Value': { costo: 0.10, envio: 0.025, impuestos: 0.0125, margenOp: 0.01625, costoFinalUnitario: 0.154 },
      'LC/APC_SM_Value': { costo: 0.10, envio: 0.025, impuestos: 0.0125, margenOp: 0.01625, costoFinalUnitario: 0.154 },
      'FC/UPC_SM_Value': { costo: 0.15, envio: 0.025, impuestos: 0.01625, margenOp: 0.02144, costoFinalUnitario: 0.213 },
      'FC/APC_SM_Value': { costo: 0.15, envio: 0.025, impuestos: 0.01625, margenOp: 0.02144, costoFinalUnitario: 0.213 },
      'ST/UPC_SM_Value': { costo: 0.08, envio: 0.025, impuestos: 0.01, margenOp: 0.013, costoFinalUnitario: 0.128 },
      'ST/APC_SM_Value': { costo: 0.08, envio: 0.025, impuestos: 0.01, margenOp: 0.013, costoFinalUnitario: 0.128 },
      'SC/UPC_SM_Premium': { costo: 0.25, envio: 0.025, impuestos: 0.02875, margenOp: 0.03794, costoFinalUnitario: 0.341 },
      'SC/APC_SM_Premium': { costo: 0.25, envio: 0.025, impuestos: 0.02875, margenOp: 0.03794, costoFinalUnitario: 0.341 },
      'LC/UPC_SM_Premium': { costo: 0.22, envio: 0.025, impuestos: 0.02525, margenOp: 0.03338, costoFinalUnitario: 0.303 },
      'LC/APC_SM_Premium': { costo: 0.22, envio: 0.025, impuestos: 0.02525, margenOp: 0.03338, costoFinalUnitario: 0.303 },
      'FC/UPC_SM_Premium': { costo: 0.30, envio: 0.025, impuestos: 0.0325, margenOp: 0.04288, costoFinalUnitario: 0.4004 },
      'FC/APC_SM_Premium': { costo: 0.30, envio: 0.025, impuestos: 0.0325, margenOp: 0.04288, costoFinalUnitario: 0.4004 },
      'SC/PC_MM_Value': { costo: 0.10, envio: 0.025, impuestos: 0.0125, margenOp: 0.01625, costoFinalUnitario: 0.154 },
      'LC/PC_MM_Value': { costo: 0.08, envio: 0.025, impuestos: 0.01, margenOp: 0.013, costoFinalUnitario: 0.128 },
      'FC/PC_MM_Value': { costo: 0.12, envio: 0.025, impuestos: 0.0145, margenOp: 0.01914, costoFinalUnitario: 0.1786 },
      'ST/PC_MM_Value': { costo: 0.06, envio: 0.025, impuestos: 0.00875, margenOp: 0.01138, costoFinalUnitario: 0.105 }
    },
    cables: {
      'SM_9/125_Indoor': { costoPorMetro: 0.12, descripcion: 'Cable SM 9/125 Indoor OFNR' },
      'SM_9/125_Outdoor': { costoPorMetro: 0.18, descripcion: 'Cable SM 9/125 Outdoor OSP' },
      'SM_9/125_Armored': { costoPorMetro: 0.25, descripcion: 'Cable SM 9/125 Armored' },
      'MM_62.5/125_Indoor': { costoPorMetro: 0.08, descripcion: 'Cable MM 62.5/125 Indoor OFNR' },
      'MM_50/125_Indoor': { costoPorMetro: 0.10, descripcion: 'Cable MM 50/125 Indoor OFNR' },
      'MM_62.5/125_Outdoor': { costoPorMetro: 0.15, descripcion: 'Cable MM 62.5/125 Outdoor OSP' },
      'MM_50/125_Outdoor': { costoPorMetro: 0.18, descripcion: 'Cable MM 50/125 Outdoor OSP' }
    },
    extras: {
      'boots_sc': { costo: 0.05, descripcion: 'Boots SC' },
      'boots_lc': { costo: 0.04, descripcion: 'Boots LC' },
      'boots_fc': { costo: 0.06, descripcion: 'Boots FC' },
      'boots_st': { costo: 0.04, descripcion: 'Boots ST' },
      'cleaning_kit': { costo: 2.50, descripcion: 'Kit de limpieza' },
      'test_certificate': { costo: 15.00, descripcion: 'Certificado de pruebas' },
      'custom_length': { costo: 5.00, descripcion: 'Longitud personalizada' },
      'express_delivery': { costo: 25.00, descripcion: 'Entrega express' }
    }
  });

  // Funciones de edición de productos
  const startEdit = (productKey, category) => {
    const product = productDatabase[category][productKey];
    setEditingProduct({ key: productKey, category });
    setEditForm({
      key: productKey,
      category,
      ...product
    });
  };

  const saveEdit = async () => {
    if (!editingProduct) return;
    
    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { key, category, ...productData } = editForm;
      
      // Calcular costo final unitario para conectores
      if (category === 'conectores') {
        productData.costoFinalUnitario = parseFloat(
          (parseFloat(productData.costo) + 
           parseFloat(productData.envio) + 
           parseFloat(productData.impuestos) + 
           parseFloat(productData.margenOp)).toFixed(4)
        );
      }
      
      setProductDatabase(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: productData
        }
      }));
      
      setEditingProduct(null);
      setEditForm({});
    } catch (error) {
      alert('Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  // Solo mostrar vista admin para super admin
  const isAdmin = user?.role === 'super_admin';

  // Si no es admin, solo mostrar cotizador
  if (!isAdmin) {
    return <CotizadorPatchCords />;
  }

  // Vista de administrador
  const AdminView = () => (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="header-left">
          <h2>Panel de Administración - Patch Cords</h2>
          <p>Gestione precios y productos del sistema de cotización</p>
        </div>
        <div className="view-selector">
          <button 
            className={`view-btn ${activeView === 'cotizador' ? 'active' : ''}`}
            onClick={() => setActiveView('cotizador')}
          >
            <Calculator size={16} />
            Vista Cotizador
          </button>
          <button 
            className={`view-btn ${activeView === 'database' ? 'active' : ''}`}
            onClick={() => setActiveView('database')}
          >
            <Database size={16} />
            Base de Datos
          </button>
        </div>
      </div>

      {activeView === 'database' && (
        <div className="database-panel">
          {/* Conectores */}
          <div className="product-section">
            <div className="section-header">
              <h3>Conectores</h3>
              <p>Gestione los precios de conectores por línea de producto</p>
            </div>
            
            <div className="products-grid">
              {Object.entries(productDatabase.conectores).map(([key, product]) => (
                <div key={key} className="product-card">
                  <div className="product-header">
                    <h4>{key.replace(/_/g, ' ')}</h4>
                    <button 
                      className="edit-btn"
                      onClick={() => startEdit(key, 'conectores')}
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                  
                  <div className="product-details">
                    <div className="detail-item">
                      <span>Costo:</span>
                      <span>${product.costo}</span>
                    </div>
                    <div className="detail-item">
                      <span>Envío:</span>
                      <span>${product.envio}</span>
                    </div>
                    <div className="detail-item">
                      <span>Impuestos:</span>
                      <span>${product.impuestos}</span>
                    </div>
                    <div className="detail-item">
                      <span>Margen Op.:</span>
                      <span>${product.margenOp}</span>
                    </div>
                    <div className="detail-item total">
                      <span>Total:</span>
                      <span>${product.costoFinalUnitario}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cables */}
          <div className="product-section">
            <div className="section-header">
              <h3>Cables</h3>
              <p>Gestione los precios de cables por metro</p>
            </div>
            
            <div className="products-grid cables">
              {Object.entries(productDatabase.cables).map(([key, product]) => (
                <div key={key} className="product-card">
                  <div className="product-header">
                    <h4>{key.replace(/_/g, ' ')}</h4>
                    <button 
                      className="edit-btn"
                      onClick={() => startEdit(key, 'cables')}
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                  
                  <div className="product-details">
                    <div className="detail-item">
                      <span>Descripción:</span>
                      <span>{product.descripcion}</span>
                    </div>
                    <div className="detail-item total">
                      <span>Costo/Metro:</span>
                      <span>${product.costoPorMetro}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="product-section">
            <div className="section-header">
              <h3>Extras</h3>
              <p>Gestione productos y servicios adicionales</p>
            </div>
            
            <div className="products-grid extras">
              {Object.entries(productDatabase.extras).map(([key, product]) => (
                <div key={key} className="product-card">
                  <div className="product-header">
                    <h4>{key.replace(/_/g, ' ')}</h4>
                    <button 
                      className="edit-btn"
                      onClick={() => startEdit(key, 'extras')}
                    >
                      <Edit size={14} />
                    </button>
                  </div>
                  
                  <div className="product-details">
                    <div className="detail-item">
                      <span>Descripción:</span>
                      <span>{product.descripcion}</span>
                    </div>
                    <div className="detail-item total">
                      <span>Costo:</span>
                      <span>${product.costo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Modal de edición
  const EditModal = () => {
    if (!editingProduct) return null;

    return (
      <div className="modal-overlay">
        <div className="edit-modal">
          <div className="modal-header">
            <h3>Editar Producto</h3>
            <button className="close-btn" onClick={cancelEdit}>
              <X size={18} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="edit-form">
              <div className="form-group">
                <label>Producto:</label>
                <input 
                  type="text" 
                  value={editForm.key?.replace(/_/g, ' ') || ''} 
                  disabled 
                  className="form-input disabled"
                />
              </div>

              {editingProduct.category === 'conectores' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Costo:</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={editForm.costo || ''} 
                        onChange={(e) => handleEditFormChange('costo', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Envío:</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={editForm.envio || ''} 
                        onChange={(e) => handleEditFormChange('envio', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Impuestos:</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={editForm.impuestos || ''} 
                        onChange={(e) => handleEditFormChange('impuestos', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Margen Operativo:</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={editForm.margenOp || ''} 
                        onChange={(e) => handleEditFormChange('margenOp', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="total-preview">
                    <strong>
                      Costo Final: $
                      {((editForm.costo || 0) + 
                        (editForm.envio || 0) + 
                        (editForm.impuestos || 0) + 
                        (editForm.margenOp || 0)).toFixed(4)}
                    </strong>
                  </div>
                </>
              )}

              {editingProduct.category === 'cables' && (
                <>
                  <div className="form-group">
                    <label>Descripción:</label>
                    <input 
                      type="text" 
                      value={editForm.descripcion || ''} 
                      onChange={(e) => setEditForm(prev => ({...prev, descripcion: e.target.value}))}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Costo por Metro:</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editForm.costoPorMetro || ''} 
                      onChange={(e) => handleEditFormChange('costoPorMetro', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}

              {editingProduct.category === 'extras' && (
                <>
                  <div className="form-group">
                    <label>Descripción:</label>
                    <input 
                      type="text" 
                      value={editForm.descripcion || ''} 
                      onChange={(e) => setEditForm(prev => ({...prev, descripcion: e.target.value}))}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Costo:</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editForm.costo || ''} 
                      onChange={(e) => handleEditFormChange('costo', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn-cancel" onClick={cancelEdit}>
              Cancelar
            </button>
            <button 
              className="btn-save" 
              onClick={saveEdit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save size={16} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="patch-cords-admin">
      {activeView === 'cotizador' ? <CotizadorPatchCords /> : <AdminView />}
      <EditModal />
    </div>
  );
};

export default PatchCordsAdmin;
