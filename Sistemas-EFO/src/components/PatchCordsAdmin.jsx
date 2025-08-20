import React, { useState, useEffect } from 'react';
import { Calculator, Database, Plus, Edit, Save, X, ArrowLeft, Check, Search, List, Grid, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CotizadorPatchCords from './CotizadorPatchCords';
import './PatchCordsAdmin.css';

const PatchCordsAdmin = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('database');
  const [displayMode, setDisplayMode] = useState('list'); // 'list' or 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItems, setEditingItems] = useState({}); // Para edición inline
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemCategory, setNewItemCategory] = useState('conectores');
  
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

  // Funciones para edición inline
  const startInlineEdit = (productKey, category) => {
    setEditingItems(prev => ({
      ...prev,
      [`${category}_${productKey}`]: true
    }));
  };

  const saveInlineEdit = (productKey, category, newData) => {
    // Calcular costo final unitario para conectores
    if (category === 'conectores') {
      newData.costoFinalUnitario = parseFloat(
        (parseFloat(newData.costo || 0) + 
         parseFloat(newData.envio || 0) + 
         parseFloat(newData.impuestos || 0) + 
         parseFloat(newData.margenOp || 0)).toFixed(4)
      );
    }

    setProductDatabase(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [productKey]: newData
      }
    }));

    setEditingItems(prev => ({
      ...prev,
      [`${category}_${productKey}`]: false
    }));
  };

  const cancelInlineEdit = (productKey, category) => {
    setEditingItems(prev => ({
      ...prev,
      [`${category}_${productKey}`]: false
    }));
  };

  // Función para agregar nuevo producto
  const addNewProduct = (category, productKey, productData) => {
    if (productDatabase[category][productKey]) {
      alert('Ya existe un producto con ese nombre');
      return;
    }

    if (category === 'conectores') {
      productData.costoFinalUnitario = parseFloat(
        (parseFloat(productData.costo || 0) + 
         parseFloat(productData.envio || 0) + 
         parseFloat(productData.impuestos || 0) + 
         parseFloat(productData.margenOp || 0)).toFixed(4)
      );
    }

    setProductDatabase(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [productKey]: productData
      }
    }));
    setShowAddForm(false);
  };

  // Función para eliminar producto
  const deleteProduct = (productKey, category) => {
    if (confirm(`¿Está seguro de eliminar ${productKey}?`)) {
      setProductDatabase(prev => ({
        ...prev,
        [category]: Object.fromEntries(
          Object.entries(prev[category]).filter(([key]) => key !== productKey)
        )
      }));
    }
  };

  // Función para filtrar productos
  const filterProducts = (products, category) => {
    if (!searchTerm) return Object.entries(products);
    
    return Object.entries(products).filter(([key, product]) => {
      const searchLower = searchTerm.toLowerCase();
      const keyMatch = key.toLowerCase().includes(searchLower);
      const descMatch = product.descripcion?.toLowerCase().includes(searchLower);
      return keyMatch || descMatch;
    });
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
        <div className="header-controls">
          <div className="search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="view-controls">
            <button 
              className={`control-btn ${displayMode === 'list' ? 'active' : ''}`}
              onClick={() => setDisplayMode('list')}
              title="Vista Lista"
            >
              <List size={16} />
            </button>
            <button 
              className={`control-btn ${displayMode === 'cards' ? 'active' : ''}`}
              onClick={() => setDisplayMode('cards')}
              title="Vista Tarjetas"
            >
              <Grid size={16} />
            </button>
          </div>
          <button 
            className="add-btn"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} />
            Nuevo Producto
          </button>
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
          {displayMode === 'list' ? (
            <DatabaseListView />
          ) : (
            <DatabaseCardView />
          )}
        </div>
      )}

      {showAddForm && (
        <AddProductModal />
      )}
    </div>
  );
  // Componente para vista de lista con edición inline
  const DatabaseListView = () => (
    <div className="list-view">
      {/* Conectores */}
      <div className="product-section">
        <h3>Conectores ({filterProducts(productDatabase.conectores, 'conectores').length})</h3>
        <div className="list-table">
          <div className="list-header">
            <span>Producto</span>
            <span>Costo</span>
            <span>Envío</span>
            <span>Impuestos</span>
            <span>Margen Op.</span>
            <span>Total</span>
            <span>Acciones</span>
          </div>
          {filterProducts(productDatabase.conectores, 'conectores').map(([key, product]) => (
            <ConectorListItem key={key} productKey={key} product={product} />
          ))}
        </div>
      </div>

      {/* Cables */}
      <div className="product-section">
        <h3>Cables ({filterProducts(productDatabase.cables, 'cables').length})</h3>
        <div className="list-table cables">
          <div className="list-header">
            <span>Producto</span>
            <span>Descripción</span>
            <span>Costo/Metro</span>
            <span>Acciones</span>
          </div>
          {filterProducts(productDatabase.cables, 'cables').map(([key, product]) => (
            <CableListItem key={key} productKey={key} product={product} />
          ))}
        </div>
      </div>

      {/* Extras */}
      <div className="product-section">
        <h3>Extras ({filterProducts(productDatabase.extras, 'extras').length})</h3>
        <div className="list-table extras">
          <div className="list-header">
            <span>Producto</span>
            <span>Costo</span>
            <span>Acciones</span>
          </div>
          {filterProducts(productDatabase.extras, 'extras').map(([key, product]) => (
            <ExtraListItem key={key} productKey={key} product={product} />
          ))}
        </div>
      </div>
    </div>
  );

  // Componente para vista de tarjetas (original)
  const DatabaseCardView = () => (
    <div className="card-view">
      {/* Conectores */}
      <div className="product-section">
        <h3>Conectores</h3>
        <div className="products-grid">
          {filterProducts(productDatabase.conectores, 'conectores').map(([key, product]) => (
            <div key={key} className="product-card">
              <div className="product-header">
                <h4>{key.replace(/_/g, ' ')}</h4>
                <div className="card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => startEdit(key, 'conectores')}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteProduct(key, 'conectores')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
        <h3>Cables</h3>
        <div className="products-grid cables">
          {filterProducts(productDatabase.cables, 'cables').map(([key, product]) => (
            <div key={key} className="product-card">
              <div className="product-header">
                <h4>{key.replace(/_/g, ' ')}</h4>
                <div className="card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => startEdit(key, 'cables')}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteProduct(key, 'cables')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
        <h3>Extras</h3>
        <div className="products-grid extras">
          {filterProducts(productDatabase.extras, 'extras').map(([key, product]) => (
            <div key={key} className="product-card">
              <div className="product-header">
                <h4>{key.replace(/_/g, ' ')}</h4>
                <div className="card-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => startEdit(key, 'extras')}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteProduct(key, 'extras')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="product-details">
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
  );

  // Componente para elementos de lista de conectores con edición inline
  const ConectorListItem = ({ productKey, product }) => {
    const isEditing = editingItems[`conectores_${productKey}`];
    const [editValues, setEditValues] = useState(product);

    const handleSave = () => {
      saveInlineEdit(productKey, 'conectores', editValues);
    };

    const handleCancel = () => {
      setEditValues(product);
      cancelInlineEdit(productKey, 'conectores');
    };

    if (isEditing) {
      return (
        <div className="list-row editing">
          <span className="product-name">{productKey.replace(/_/g, ' ')}</span>
          <input
            type="number"
            step="0.01"
            value={editValues.costo}
            onChange={(e) => setEditValues({...editValues, costo: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            step="0.01"
            value={editValues.envio}
            onChange={(e) => setEditValues({...editValues, envio: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            step="0.01"
            value={editValues.impuestos}
            onChange={(e) => setEditValues({...editValues, impuestos: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            step="0.01"
            value={editValues.margenOp}
            onChange={(e) => setEditValues({...editValues, margenOp: parseFloat(e.target.value) || 0})}
          />
          <span className="total-calc">
            ${(editValues.costo + editValues.envio + editValues.impuestos + editValues.margenOp).toFixed(4)}
          </span>
          <div className="actions">
            <button className="save-btn" onClick={handleSave}>
              <Check size={14} />
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              <X size={14} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="list-row">
        <span className="product-name">{productKey.replace(/_/g, ' ')}</span>
        <span>${product.costo}</span>
        <span>${product.envio}</span>
        <span>${product.impuestos}</span>
        <span>${product.margenOp}</span>
        <span className="total">${product.costoFinalUnitario}</span>
        <div className="actions">
          <button 
            className="edit-btn"
            onClick={() => startInlineEdit(productKey, 'conectores')}
          >
            <Edit size={14} />
          </button>
          <button 
            className="delete-btn"
            onClick={() => deleteProduct(productKey, 'conectores')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  // Componente para elementos de lista de cables con edición inline
  const CableListItem = ({ productKey, product }) => {
    const isEditing = editingItems[`cables_${productKey}`];
    const [editValues, setEditValues] = useState(product);

    const handleSave = () => {
      saveInlineEdit(productKey, 'cables', editValues);
    };

    const handleCancel = () => {
      setEditValues(product);
      cancelInlineEdit(productKey, 'cables');
    };

    if (isEditing) {
      return (
        <div className="list-row editing">
          <span className="product-name">{productKey.replace(/_/g, ' ')}</span>
          <input
            type="text"
            value={editValues.descripcion}
            onChange={(e) => setEditValues({...editValues, descripcion: e.target.value})}
          />
          <input
            type="number"
            step="0.01"
            value={editValues.costoPorMetro}
            onChange={(e) => setEditValues({...editValues, costoPorMetro: parseFloat(e.target.value) || 0})}
          />
          <div className="actions">
            <button className="save-btn" onClick={handleSave}>
              <Check size={14} />
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              <X size={14} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="list-row">
        <span className="product-name">{productKey.replace(/_/g, ' ')}</span>
        <span>{product.descripcion}</span>
        <span>${product.costoPorMetro}</span>
        <div className="actions">
          <button 
            className="edit-btn"
            onClick={() => startInlineEdit(productKey, 'cables')}
          >
            <Edit size={14} />
          </button>
          <button 
            className="delete-btn"
            onClick={() => deleteProduct(productKey, 'cables')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  // Componente para elementos de lista de extras con edición inline
  const ExtraListItem = ({ productKey, product }) => {
    const isEditing = editingItems[`extras_${productKey}`];
    const [editValues, setEditValues] = useState(product);

    const handleSave = () => {
      saveInlineEdit(productKey, 'extras', editValues);
    };

    const handleCancel = () => {
      setEditValues(product);
      cancelInlineEdit(productKey, 'extras');
    };

    if (isEditing) {
      return (
        <div className="list-row editing">
          <span className="product-name">{productKey.replace(/_/g, ' ')}</span>
          <input
            type="number"
            step="0.01"
            value={editValues.costo}
            onChange={(e) => setEditValues({...editValues, costo: parseFloat(e.target.value) || 0})}
          />
          <div className="actions">
            <button className="save-btn" onClick={handleSave}>
              <Check size={14} />
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              <X size={14} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="list-row">
        <span className="product-name">{productKey.replace(/_/g, ' ')}</span>
        <span>${product.costo}</span>
        <div className="actions">
          <button 
            className="edit-btn"
            onClick={() => startInlineEdit(productKey, 'extras')}
          >
            <Edit size={14} />
          </button>
          <button 
            className="delete-btn"
            onClick={() => deleteProduct(productKey, 'extras')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  // Modal para agregar nuevo producto
  const AddProductModal = () => {
    const [newProduct, setNewProduct] = useState({
      key: '',
      category: 'conectores',
      costo: 0,
      envio: 0,
      impuestos: 0,
      margenOp: 0,
      costoPorMetro: 0,
      descripcion: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!newProduct.key.trim()) {
        alert('Por favor ingrese un nombre para el producto');
        return;
      }

      const productData = {};
      if (newProduct.category === 'conectores') {
        productData.costo = newProduct.costo;
        productData.envio = newProduct.envio;
        productData.impuestos = newProduct.impuestos;
        productData.margenOp = newProduct.margenOp;
      } else if (newProduct.category === 'cables') {
        productData.costoPorMetro = newProduct.costoPorMetro;
        productData.descripcion = newProduct.descripcion;
      } else if (newProduct.category === 'extras') {
        productData.costo = newProduct.costo;
      }

      addNewProduct(newProduct.category, newProduct.key, productData);
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Agregar Nuevo Producto</h3>
            <button className="close-btn" onClick={() => setShowAddForm(false)}>
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label>Categoría:</label>
              <select 
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              >
                <option value="conectores">Conectores</option>
                <option value="cables">Cables</option>
                <option value="extras">Extras</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nombre del Producto:</label>
              <input
                type="text"
                value={newProduct.key}
                onChange={(e) => setNewProduct({...newProduct, key: e.target.value})}
                placeholder="Ej: SC/UPC_SM_Value"
                required
              />
            </div>

            {newProduct.category === 'conectores' && (
              <>
                <div className="form-group">
                  <label>Costo:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.costo}
                    onChange={(e) => setNewProduct({...newProduct, costo: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Envío:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.envio}
                    onChange={(e) => setNewProduct({...newProduct, envio: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Impuestos:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.impuestos}
                    onChange={(e) => setNewProduct({...newProduct, impuestos: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Margen Operativo:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.margenOp}
                    onChange={(e) => setNewProduct({...newProduct, margenOp: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </>
            )}

            {newProduct.category === 'cables' && (
              <>
                <div className="form-group">
                  <label>Descripción:</label>
                  <input
                    type="text"
                    value={newProduct.descripcion}
                    onChange={(e) => setNewProduct({...newProduct, descripcion: e.target.value})}
                    placeholder="Descripción del cable"
                  />
                </div>
                <div className="form-group">
                  <label>Costo por Metro:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.costoPorMetro}
                    onChange={(e) => setNewProduct({...newProduct, costoPorMetro: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </>
            )}

            {newProduct.category === 'extras' && (
              <div className="form-group">
                <label>Costo:</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.costo}
                  onChange={(e) => setNewProduct({...newProduct, costo: parseFloat(e.target.value) || 0})}
                />
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                Agregar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
