import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase.js';
import { api } from '../config/apiHybrid.js';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Probando...');
  const [productos, setProductos] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [testResults, setTestResults] = useState({
    connection: null,
    readProducts: null,
    createCotizacion: null,
    readCotizaciones: null
  });

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      // Test 1: Conexión básica
      setConnectionStatus('Probando conexión...');
      const { data, error } = await supabase.from('productos').select('count');
      
      if (error) {
        setConnectionStatus(`Error: ${error.message}`);
        setTestResults(prev => ({ ...prev, connection: false }));
        return;
      }

      setConnectionStatus('✅ Conectado a Supabase');
      setTestResults(prev => ({ ...prev, connection: true }));

      // Test 2: Leer productos
      await testReadProducts();
      
      // Test 3: Crear cotización de prueba
      await testCreateCotizacion();
      
      // Test 4: Leer cotizaciones
      await testReadCotizaciones();

    } catch (error) {
      setConnectionStatus(`Error de conexión: ${error.message}`);
      setTestResults(prev => ({ ...prev, connection: false }));
    }
  };

  const testReadProducts = async () => {
    try {
      const productos = await api.getProductos();
      setProductos(productos.slice(0, 3)); // Solo mostrar los primeros 3
      setTestResults(prev => ({ ...prev, readProducts: true }));
    } catch (error) {
      console.error('Error leyendo productos:', error);
      setTestResults(prev => ({ ...prev, readProducts: false }));
    }
  };

  const testCreateCotizacion = async () => {
    try {
      const cotizacionPrueba = {
        nombre_cliente: 'Cliente de Prueba',
        email_cliente: 'prueba@test.com',
        telefono_cliente: '555-1234',
        empresa: 'Empresa Test',
        linea_producto: 'Value',
        subtotal: 100.00,
        impuesto_monto: 16.00,
        total: 116.00,
        items: [
          {
            codigo: 'PC-SC-SC-SM-1M',
            nombre: 'Patch Cord SC/SC Monomodo 1m',
            cantidad: 2,
            precio: 15.50,
            total: 31.00
          }
        ],
        estado: 'prueba'
      };

      await api.saveCotizacion(cotizacionPrueba);
      setTestResults(prev => ({ ...prev, createCotizacion: true }));
    } catch (error) {
      console.error('Error creando cotización:', error);
      setTestResults(prev => ({ ...prev, createCotizacion: false }));
    }
  };

  const testReadCotizaciones = async () => {
    try {
      const cotizaciones = await api.getCotizaciones();
      setCotizaciones(cotizaciones.slice(0, 2)); // Solo mostrar las primeras 2
      setTestResults(prev => ({ ...prev, readCotizaciones: true }));
    } catch (error) {
      console.error('Error leyendo cotizaciones:', error);
      setTestResults(prev => ({ ...prev, readCotizaciones: false }));
    }
  };

  const getStatusIcon = (status) => {
    if (status === null) return '⏳';
    return status ? '✅' : '❌';
  };

  const getStatusText = (status) => {
    if (status === null) return 'Esperando...';
    return status ? 'Exitoso' : 'Error';
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2>🧪 Prueba de Conexión Supabase</h2>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Estado de Conexión</h3>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{connectionStatus}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>📊 Resultados de Pruebas</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#006068', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Prueba</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Estado</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Conexión a Base de Datos</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                {getStatusIcon(testResults.connection)}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {getStatusText(testResults.connection)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Leer Productos</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                {getStatusIcon(testResults.readProducts)}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {getStatusText(testResults.readProducts)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Crear Cotización</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                {getStatusIcon(testResults.createCotizacion)}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {getStatusText(testResults.createCotizacion)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Leer Cotizaciones</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                {getStatusIcon(testResults.readCotizaciones)}
              </td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {getStatusText(testResults.readCotizaciones)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {productos.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>📦 Productos de Ejemplo (desde Supabase)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
            {productos.map(producto => (
              <div key={producto.id} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                borderRadius: '5px',
                backgroundColor: 'white'
              }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#006068' }}>{producto.nombre}</h4>
                <p style={{ margin: '2px 0', fontSize: '14px' }}>
                  <strong>Código:</strong> {producto.codigo}
                </p>
                <p style={{ margin: '2px 0', fontSize: '14px' }}>
                  <strong>Precio Value:</strong> ${producto.precio_value}
                </p>
                <p style={{ margin: '2px 0', fontSize: '14px' }}>
                  <strong>Categoría:</strong> {producto.categoria}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cotizaciones.length > 0 && (
        <div>
          <h3>💰 Cotizaciones Recientes (desde Supabase)</h3>
          {cotizaciones.map(cotizacion => (
            <div key={cotizacion.id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '5px',
              backgroundColor: 'white',
              marginBottom: '10px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#006068' }}>
                {cotizacion.nombre_cliente} - {cotizacion.empresa}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                <p><strong>Email:</strong> {cotizacion.email_cliente}</p>
                <p><strong>Total:</strong> ${cotizacion.total}</p>
                <p><strong>Estado:</strong> {cotizacion.estado}</p>
                <p><strong>Fecha:</strong> {new Date(cotizacion.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#e6f7ff', 
        borderRadius: '5px' 
      }}>
        <h4>ℹ️ Información</h4>
        <p>Esta página prueba la conexión con Supabase y las operaciones básicas de la base de datos.</p>
        <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
        <p><strong>Estado:</strong> {testResults.connection ? 'Conectado' : 'Desconectado'}</p>
      </div>
    </div>
  );
};

export default SupabaseTest;
