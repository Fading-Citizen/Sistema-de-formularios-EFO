import React, { useState, useEffect } from 'react';
import { Calculator, Check, Package, Plus, Trash2, FileText } from 'lucide-react';
import logoEFO from '../assets/images/Logoefo.png';
import './CotizadorPatchCords.css';
import './Shared.css';

const CotizadorPatchCords = () => {
  const [configuracion, setConfiguracion] = useState({
    tipoConector1: '',
    tipoConector2: '',
    lineaProducto: 'Value',
    tipoFibra: '',
    longitud: '',
    tipoJacket: '',
    cantidad: 1
  });

  const [patchCordsList, setPatchCordsList] = useState([]);
  
  const [preciosCalculados, setPreciosCalculados] = useState({
    costoTotal: 0,
    envio: 0,
    impuestos: 0,
    margenOperativo: 0,
    precioFinal: 0
  });

  const [cotizacionGenerada, setCotizacionGenerada] = useState(false);

  // Base de datos de productos
  const productDatabase = {
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
  };

  const opciones = {
    tiposConector: [
      { value: 'SC/UPC', label: 'SC/UPC', description: 'Conector estándar para single mode' },
      { value: 'SC/APC', label: 'SC/APC', description: 'Conector angular para single mode' },
      { value: 'LC/UPC', label: 'LC/UPC', description: 'Conector compacto para single mode' },
      { value: 'LC/APC', label: 'LC/APC', description: 'Conector compacto angular' },
      { value: 'FC/UPC', label: 'FC/UPC', description: 'Conector roscado para single mode' },
      { value: 'FC/APC', label: 'FC/APC', description: 'Conector roscado angular' },
      { value: 'ST/UPC', label: 'ST/UPC', description: 'Conector bayoneta para single mode' },
      { value: 'ST/APC', label: 'ST/APC', description: 'Conector bayoneta angular' },
      { value: 'SC/PC', label: 'SC/PC (MM)', description: 'Conector para multimode' },
      { value: 'LC/PC', label: 'LC/PC (MM)', description: 'Conector compacto multimode' },
      { value: 'FC/PC', label: 'FC/PC (MM)', description: 'Conector roscado multimode' },
      { value: 'ST/PC', label: 'ST/PC (MM)', description: 'Conector bayoneta multimode' }
    ],
    lineasProducto: [
      { value: 'Value', label: 'Value Line', description: 'Calidad estándar - Económico' },
      { value: 'Premium', label: 'Premium Line', description: 'Alta calidad - Profesional' }
    ],
    tiposFibra: [
      { value: 'SM', label: 'Single Mode (9/125)', description: 'Para largas distancias' },
      { value: 'MM_62.5', label: 'Multimode (62.5/125)', description: 'Para distancias medias' },
      { value: 'MM_50', label: 'Multimode (50/125)', description: 'Para altas velocidades' }
    ],
    tiposJacket: [
      { value: 'Indoor', label: 'Indoor (OFNR)', description: 'Para uso interior' },
      { value: 'Outdoor', label: 'Outdoor (OSP)', description: 'Para exteriores' },
      { value: 'Armored', label: 'Armored', description: 'Protección extra' }
    ],
    longitudes: [
      { value: '1', label: '1 metro' },
      { value: '2', label: '2 metros' },
      { value: '3', label: '3 metros' },
      { value: '5', label: '5 metros' },
      { value: '10', label: '10 metros' },
      { value: '15', label: '15 metros' },
      { value: '20', label: '20 metros' },
      { value: 'custom', label: 'Longitud personalizada' }
    ]
  };

  const calcularPrecios = () => {
    if (!configuracion.tipoConector1 || !configuracion.tipoConector2 || 
        !configuracion.tipoFibra || 
        !configuracion.longitud || !configuracion.tipoJacket) {
      return;
    }

    const tipoFibraKey = configuracion.tipoFibra === 'SM' ? 'SM' : 'MM';
    const lineaKey = 'Value'; // Siempre usar Value
    
    const keyConector1 = `${configuracion.tipoConector1}_${tipoFibraKey}_${lineaKey}`;
    const keyConector2 = `${configuracion.tipoConector2}_${tipoFibraKey}_${lineaKey}`;
    
    const conector1 = productDatabase.conectores[keyConector1];
    const conector2 = productDatabase.conectores[keyConector2];
    
    if (!conector1 || !conector2) {
      console.error('Conectores no encontrados:', keyConector1, keyConector2);
      return;
    }

    const tipoFibraComplete = configuracion.tipoFibra === 'SM' ? 'SM_9/125' : 
                             configuracion.tipoFibra === 'MM_62.5' ? 'MM_62.5/125' : 'MM_50/125';
    const keyCable = `${tipoFibraComplete}_${configuracion.tipoJacket}`;
    const cable = productDatabase.cables[keyCable];
    
    if (!cable) {
      console.error('Cable no encontrado:', keyCable);
      return;
    }

    const longitud = parseFloat(configuracion.longitud) || 1;
    const cantidad = parseInt(configuracion.cantidad) || 1;
    
    const costoConectores = (conector1.costo + conector2.costo) * cantidad;
    const costoCable = cable.costoPorMetro * longitud * cantidad;
    
    const costoTotal = costoConectores + costoCable;
    const envio = costoTotal * 0.10;
    const impuestos = costoTotal * 0.13;
    const margenOperativo = costoTotal * 0.15;
    const precioFinal = costoTotal + envio + impuestos + margenOperativo;

    setPreciosCalculados({
      costoTotal: costoTotal.toFixed(2),
      envio: envio.toFixed(2),
      impuestos: impuestos.toFixed(2),
      margenOperativo: margenOperativo.toFixed(2),
      precioFinal: precioFinal.toFixed(2)
    });
  };

  useEffect(() => {
    calcularPrecios();
  }, [configuracion]);

  const handleConfigChange = (field, value) => {
    setConfiguracion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funciones para manejar múltiples patch cords
  const agregarPatchCord = () => {
    if (isConfigurationComplete()) {
      const nuevoPatchCord = {
        id: Date.now(),
        configuracion: { ...configuracion },
        precios: { ...preciosCalculados }
      };
      setPatchCordsList([...patchCordsList, nuevoPatchCord]);
      
      // Resetear configuración para nuevo patch cord
      setConfiguracion({
        tipoConector1: '',
        tipoConector2: '',
        lineaProducto: 'Value',
        tipoFibra: '',
        longitud: '',
        tipoJacket: '',
        cantidad: 1
      });
    }
  };

  const eliminarPatchCord = (id) => {
    setPatchCordsList(patchCordsList.filter(item => item.id !== id));
  };

  const isConfigurationComplete = () => {
    return configuracion.tipoConector1 && 
           configuracion.tipoConector2 && 
           configuracion.tipoFibra && 
           configuracion.longitud && 
           configuracion.tipoJacket &&
           preciosCalculados.precioFinal > 0;
  };

  const calcularTotalCotizacion = () => {
    return patchCordsList.reduce((total, item) => total + parseFloat(item.precios.precioFinal), 0);
  };

  const generarPDF = () => {
    const totalGeneral = calcularTotalCotizacion();
    const fecha = new Date().toLocaleDateString('es-ES');
    
    // Crear contenido del PDF
    let contenidoPDF = `
COTIZACIÓN DE PATCH CORDS - EFO
Fecha: ${fecha}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRODUCTOS COTIZADOS:
`;

    patchCordsList.forEach((item, index) => {
      contenidoPDF += `
${index + 1}. ${item.configuracion.tipoConector1} a ${item.configuracion.tipoConector2}
   - Fibra: ${item.configuracion.tipoFibra}
   - Longitud: ${item.configuracion.longitud}m
   - Jacket: ${item.configuracion.tipoJacket}
   - Cantidad: ${item.configuracion.cantidad}
   - Precio: $${item.precios.precioFinal}
`;
    });

    contenidoPDF += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL GENERAL: $${totalGeneral.toFixed(2)}

Válido por 30 días desde la fecha de emisión.
Para procesar su pedido, contacte a EFO.
    `;

    // Crear y descargar el archivo
    const blob = new Blob([contenidoPDF], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cotizacion_PatchCords_${fecha.replace(/\//g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setCotizacionGenerada(true);
    setTimeout(() => setCotizacionGenerada(false), 3000);
  };

  const generarCotizacion = async () => {
    setCotizacionGenerada(true);
    
    // Feedback visual
    setTimeout(() => setCotizacionGenerada(false), 3000);
  };

  return (
    <div className="cotizador-patch-cords">
      <div className="system-header">
        <img src={logoEFO} alt="EFO" className="efo-logo" />
        <div className="header-text">
          <h1>Cotizador de Patch Cords</h1>
          <p>Configure su patch cord personalizado y obtenga una cotización instantánea</p>
        </div>
      </div>
      
      <div className="cotizador-container">
        {/* Panel de Configuración */}
        <div className="config-panel">
          <div className="step-header">
            <span className="step-number">1</span>
            <h3>Configuración del Producto</h3>
          </div>

          {/* Conectores */}
          <div className="config-section">
            <h4><Package size={18} /> Conectores</h4>
            <div className="connectors-grid">
              <div className="connector-config">
                <label>Conector Lado A</label>
                <select 
                  value={configuracion.tipoConector1}
                  onChange={(e) => handleConfigChange('tipoConector1', e.target.value)}
                  className="config-select"
                >
                  <option value="">Seleccionar conector...</option>
                  {opciones.tiposConector.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - {opt.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="connector-separator">⟷</div>
              
              <div className="connector-config">
                <label>Conector Lado B</label>
                <select 
                  value={configuracion.tipoConector2}
                  onChange={(e) => handleConfigChange('tipoConector2', e.target.value)}
                  className="config-select"
                >
                  <option value="">Seleccionar conector...</option>
                  {opciones.tiposConector.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - {opt.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Especificaciones */}
          <div className="config-section">
            <h4>Especificaciones del Cable</h4>
            <div className="specs-grid">
              <div className="spec-field">
                <label>Tipo de Fibra</label>
                <select 
                  value={configuracion.tipoFibra}
                  onChange={(e) => handleConfigChange('tipoFibra', e.target.value)}
                  className="config-select"
                >
                  <option value="">Seleccionar tipo...</option>
                  {opciones.tiposFibra.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - {opt.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="spec-field">
                <label>Tipo de Jacket</label>
                <select 
                  value={configuracion.tipoJacket}
                  onChange={(e) => handleConfigChange('tipoJacket', e.target.value)}
                  className="config-select"
                >
                  <option value="">Seleccionar jacket...</option>
                  {opciones.tiposJacket.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} - {opt.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dimensiones */}
          <div className="config-section">
            <h4>Dimensiones y Cantidad</h4>
            <div className="dimensions-grid">
              <div className="dimension-field">
                <label>Longitud</label>
                <select 
                  value={configuracion.longitud}
                  onChange={(e) => handleConfigChange('longitud', e.target.value)}
                  className="config-select"
                >
                  <option value="">Seleccionar longitud...</option>
                  {opciones.longitudes.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="dimension-field">
                <label>Cantidad</label>
                <div className="quantity-selector">
                  <button 
                    type="button"
                    onClick={() => handleConfigChange('cantidad', Math.max(1, configuracion.cantidad - 1))}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    value={configuracion.cantidad}
                    onChange={(e) => handleConfigChange('cantidad', parseInt(e.target.value) || 1)}
                    className="qty-input"
                  />
                  <button 
                    type="button"
                    onClick={() => handleConfigChange('cantidad', configuracion.cantidad + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Cotización */}
        <div className="quote-panel">
          <div className="step-header">
            <span className="step-number">2</span>
            <h3>Resumen y Cotización</h3>
          </div>

          <div className="quote-summary">
            <div className="product-preview">
              <h4>Configuración Actual</h4>
              <div className="config-summary">
                <div className="summary-item">
                  <span>Conectores:</span>
                  <span>{configuracion.tipoConector1} ⟷ {configuracion.tipoConector2}</span>
                </div>
                <div className="summary-item">
                  <span>Fibra:</span>
                  <span>{opciones.tiposFibra.find(f => f.value === configuracion.tipoFibra)?.label}</span>
                </div>
                <div className="summary-item">
                  <span>Jacket:</span>
                  <span>{opciones.tiposJacket.find(j => j.value === configuracion.tipoJacket)?.label}</span>
                </div>
                <div className="summary-item">
                  <span>Longitud:</span>
                  <span>{configuracion.longitud} metro(s)</span>
                </div>
                <div className="summary-item">
                  <span>Cantidad:</span>
                  <span>{configuracion.cantidad} unidad(es)</span>
                </div>
              </div>
              
              {/* Botón para agregar patch cord */}
              <button 
                className="add-patchcord-btn"
                onClick={agregarPatchCord}
                disabled={!isConfigurationComplete()}
              >
                <Plus size={16} />
                Agregar Patch Cord
              </button>
            </div>

            {/* Lista de patch cords agregados */}
            {patchCordsList.length > 0 && (
              <div className="patchcords-list">
                <h4>Patch Cords en Cotización ({patchCordsList.length})</h4>
                {patchCordsList.map((item, index) => (
                  <div key={item.id} className="patchcord-item">
                    <div className="patchcord-info">
                      <span className="patchcord-title">
                        {index + 1}. {item.configuracion.tipoConector1} ⟷ {item.configuracion.tipoConector2}
                      </span>
                      <span className="patchcord-details">
                        {item.configuracion.longitud}m • {item.configuracion.cantidad} uds
                      </span>
                      <span className="patchcord-price">${item.precios.precioFinal}</span>
                    </div>
                    <button 
                      className="remove-patchcord-btn"
                      onClick={() => eliminarPatchCord(item.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <div className="total-cotizacion">
                  <span>Total General:</span>
                  <span>${calcularTotalCotizacion().toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="price-breakdown">
              <h4>Precio Actual</h4>
              <div className="price-item">
                <span>Costo de componentes:</span>
                <span>${preciosCalculados.costoTotal}</span>
              </div>
              <div className="price-item">
                <span>Envío (10%):</span>
                <span>${preciosCalculados.envio}</span>
              </div>
              <div className="price-item">
                <span>Impuestos (13%):</span>
                <span>${preciosCalculados.impuestos}</span>
              </div>
              <div className="price-item">
                <span>Margen operativo (15%):</span>
                <span>${preciosCalculados.margenOperativo}</span>
              </div>
              <div className="price-total">
                <span>Total:</span>
                <span>${preciosCalculados.precioFinal}</span>
              </div>
            </div>

            <div className="quote-actions">
              <button 
                className={`quote-btn ${cotizacionGenerada ? 'success' : ''}`}
                onClick={generarPDF}
                disabled={patchCordsList.length === 0}
              >
                {cotizacionGenerada ? (
                  <>
                    <Check size={18} />
                    ¡PDF Generado!
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Generar PDF Cotización
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CotizadorPatchCords;
