import React, { useState, useEffect } from 'react';
import { api } from '../config/apiHybrid';

const ConexionTest = () => {
  const [testResults, setTestResults] = useState({
    formularios: { status: 'pending', data: [], error: null },
    cotizaciones: { status: 'pending', data: [], error: null },
    productos: { status: 'pending', data: [], error: null }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    runAllTests();
  }, []);

  const runAllTests = async () => {
    setIsLoading(true);

    // Test 1: Obtener formularios
    try {
      const formularios = await api.getSubmissions();
      setTestResults(prev => ({
        ...prev,
        formularios: { status: 'success', data: formularios, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        formularios: { status: 'error', data: [], error: error.message }
      }));
    }

    // Test 2: Obtener cotizaciones
    try {
      const cotizaciones = await api.getCotizaciones();
      setTestResults(prev => ({
        ...prev,
        cotizaciones: { status: 'success', data: cotizaciones, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        cotizaciones: { status: 'error', data: [], error: error.message }
      }));
    }

    // Test 3: Obtener productos
    try {
      const productos = await api.getProductos();
      setTestResults(prev => ({
        ...prev,
        productos: { status: 'success', data: productos, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        productos: { status: 'error', data: [], error: error.message }
      }));
    }

    setIsLoading(false);
  };

  const createTestFormulario = async () => {
    try {
      const testData = {
        tipo_formulario: 'credito',
        nombre_cliente: 'Cliente de Prueba Dashboard',
        email_cliente: 'prueba.dashboard@test.com',
        telefono_cliente: '300-123-4567',
        empresa: 'Empresa Test Dashboard',
        monto_solicitado: 250000.00,
        plazo_pago: 12,
        garantias: JSON.stringify({
          inmueble: { direccion: 'Calle 123 #45-67', ciudad: 'Bogotá' },
          vehiculo: { marca: 'Toyota', modelo: '2020', placa: 'ABC123' }
        }),
        referencias_comerciales: JSON.stringify({
          entidad_banco: 'Banco de Prueba',
          cuenta_banco: '1234567890'
        }),
        estado: 'pendiente',
        notas: JSON.stringify({
          datos_completos: { sector: 'Tecnología', tipo_actividad: 'Servicios' },
          archivos_adjuntos: 0,
          asesor: 'Sistema Automático'
        })
      };

      const result = await api.submitForm(testData);
      alert('✅ Formulario de prueba creado exitosamente');
      runAllTests(); // Recargar datos
      return result;
    } catch (error) {
      alert(`❌ Error creando formulario: ${error.message}`);
    }
  };

  const createTestCotizacion = async () => {
    try {
      const testData = {
        nombre_cliente: 'Cliente Cotización Test',
        email_cliente: 'cotizacion.test@empresa.com',
        telefono_cliente: '301-987-6543',
        empresa: 'TechCorp Solutions',
        linea_producto: 'Value',
        descuento_porcentaje: 5.0,
        impuesto_porcentaje: 16.0,
        subtotal: 150.75,
        descuento_monto: 7.54,
        impuesto_monto: 22.91,
        total: 166.12,
        items: [
          {
            codigo: 'PC-SC-LC-SM-2M',
            descripcion: 'Patch Cord SC/LC Monomodo 2m',
            cantidad: 5,
            precio_unitario: 18.75,
            total: 93.75
          },
          {
            codigo: 'PC-LC-LC-SM-3M',
            descripcion: 'Patch Cord LC/LC Monomodo 3m',
            cantidad: 3,
            precio_unitario: 19.00,
            total: 57.00
          }
        ],
        estado: 'borrador',
        notas: 'Cotización generada desde el test de conexión'
      };

      const result = await api.saveCotizacion(testData);
      alert('✅ Cotización de prueba creada exitosamente');
      runAllTests(); // Recargar datos
      return result;
    } catch (error) {
      alert(`❌ Error creando cotización: ${error.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1>🔗 Test de Conexión Dashboard ↔ Supabase</h1>
      <p>Esta página verifica que el dashboard esté correctamente conectado con Supabase.</p>

      {/* Botones de acción */}
      <div style={{ 
        marginBottom: '30px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={runAllTests}
          style={{
            padding: '10px 20px',
            backgroundColor: '#006068',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Recargar Tests
        </button>
        <button 
          onClick={createTestFormulario}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Crear Formulario Test
        </button>
        <button 
          onClick={createTestCotizacion}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Crear Cotización Test
        </button>
      </div>

      {/* Resumen de estados */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {Object.entries(testResults).map(([key, result]) => (
          <div key={key} style={{
            border: `2px solid ${getStatusColor(result.status)}`,
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ 
              margin: '0 0 10px 0',
              color: getStatusColor(result.status),
              textTransform: 'capitalize'
            }}>
              {getStatusIcon(result.status)} {key}
            </h3>
            <p><strong>Estado:</strong> {result.status}</p>
            <p><strong>Registros:</strong> {result.data.length}</p>
            {result.error && (
              <p style={{ color: '#dc3545', fontSize: '0.9em' }}>
                <strong>Error:</strong> {result.error}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Datos detallados */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Formularios */}
        <div>
          <h3>📋 Formularios ({testResults.formularios.data.length})</h3>
          <div style={{ 
            maxHeight: '400px', 
            overflow: 'auto',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}>
            {testResults.formularios.data.length > 0 ? (
              testResults.formularios.data.map((form, index) => (
                <div key={form.id || index} style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  fontSize: '0.9em'
                }}>
                  <strong>{form.nombre_cliente}</strong><br />
                  <span>{form.email_cliente}</span><br />
                  <span>💰 ${form.monto_solicitado}</span><br />
                  <span style={{ color: '#666' }}>
                    {new Date(form.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No hay formularios
              </div>
            )}
          </div>
        </div>

        {/* Cotizaciones */}
        <div>
          <h3>💰 Cotizaciones ({testResults.cotizaciones.data.length})</h3>
          <div style={{ 
            maxHeight: '400px', 
            overflow: 'auto',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}>
            {testResults.cotizaciones.data.length > 0 ? (
              testResults.cotizaciones.data.map((cot, index) => (
                <div key={cot.id || index} style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  fontSize: '0.9em'
                }}>
                  <strong>{cot.nombre_cliente}</strong><br />
                  <span>{cot.empresa}</span><br />
                  <span>💵 ${cot.total}</span><br />
                  <span style={{ color: '#666' }}>
                    {new Date(cot.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No hay cotizaciones
              </div>
            )}
          </div>
        </div>

        {/* Productos */}
        <div>
          <h3>📦 Productos ({testResults.productos.data.length})</h3>
          <div style={{ 
            maxHeight: '400px', 
            overflow: 'auto',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}>
            {testResults.productos.data.length > 0 ? (
              testResults.productos.data.slice(0, 10).map((prod, index) => (
                <div key={prod.id || index} style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  fontSize: '0.9em'
                }}>
                  <strong>{prod.codigo}</strong><br />
                  <span>{prod.nombre}</span><br />
                  <span>💲 ${prod.precio_value}</span><br />
                  <span style={{ color: '#666' }}>{prod.categoria}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No hay productos
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información de conexión */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h4>ℹ️ Información de Conexión</h4>
        <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
        <p><strong>API Híbrida:</strong> Activa</p>
        <p><strong>Estado de Carga:</strong> {isLoading ? 'Cargando...' : 'Completado'}</p>
      </div>
    </div>
  );
};

export default ConexionTest;
