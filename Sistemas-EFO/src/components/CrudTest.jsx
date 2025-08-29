import React, { useState, useEffect } from 'react';
import { api } from '../config/apiHybrid.js';
import './Shared.css';

const CrudTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testFormulario, setTestFormulario] = useState(null);

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Crear formulario
      await testCreateForm();
      
      // Esperar un poco para que se procese
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test 2: Obtener formularios
      await testGetSubmissions();
      
      // Test 3: Actualizar formulario (si tenemos uno)
      if (testFormulario) {
        await testUpdateSubmission();
        await testArchiveSubmission();
        await testGetArchivedSubmissions();
        await testRestoreSubmission();
        await testDeleteSubmission();
      }
      
    } catch (error) {
      addResult('ERROR GENERAL', false, error.message);
    }
    
    setIsRunning(false);
  };

  const testCreateForm = async () => {
    try {
      const formData = {
        tipo_formulario: 'credito',
        nombre_cliente: 'Test Usuario CRUD',
        email_cliente: 'test.crud@example.com',
        telefono_cliente: '123456789',
        empresa: 'Test Company CRUD',
        monto_solicitado: 50000,
        plazo_pago: 12,
        garantias: JSON.stringify({
          tipo: 'inmueble',
          valor: 100000
        }),
        referencias_comerciales: JSON.stringify({
          referencia1: {
            empresa: 'Test Ref 1',
            telefono: '111111111'
          }
        }),
        notas: JSON.stringify({
          datos_completos: {
            identificacion_num: '123456789',
            sector: 'Tecnología'
          }
        }),
        estado: 'pendiente'
      };
      
      const result = await api.submitForm(formData);
      setTestFormulario(result);
      addResult('CREATE', true, 'Formulario creado exitosamente', result);
      
    } catch (error) {
      addResult('CREATE', false, `Error creando formulario: ${error.message}`);
    }
  };

  const testGetSubmissions = async () => {
    try {
      const submissions = await api.getSubmissions();
      addResult('GET', true, `Obtenidos ${submissions?.length || 0} formularios activos`, submissions);
    } catch (error) {
      addResult('GET', false, `Error obteniendo formularios: ${error.message}`);
    }
  };

  const testGetArchivedSubmissions = async () => {
    try {
      const archived = await api.getArchivedSubmissions();
      addResult('GET_ARCHIVED', true, `Obtenidos ${archived?.length || 0} formularios archivados`, archived);
    } catch (error) {
      addResult('GET_ARCHIVED', false, `Error obteniendo archivados: ${error.message}`);
    }
  };

  const testUpdateSubmission = async () => {
    try {
      const updates = { estado: 'en_revision' };
      const result = await api.updateSubmission(testFormulario.id, updates);
      addResult('UPDATE', true, 'Estado actualizado a "en_revision"', result);
    } catch (error) {
      addResult('UPDATE', false, `Error actualizando: ${error.message}`);
    }
  };

  const testArchiveSubmission = async () => {
    try {
      const result = await api.archiveSubmission(testFormulario.id);
      addResult('ARCHIVE', true, 'Formulario archivado exitosamente', result);
    } catch (error) {
      addResult('ARCHIVE', false, `Error archivando: ${error.message}`);
    }
  };

  const testRestoreSubmission = async () => {
    try {
      const result = await api.restoreSubmission(testFormulario.id);
      addResult('RESTORE', true, 'Formulario restaurado exitosamente', result);
    } catch (error) {
      addResult('RESTORE', false, `Error restaurando: ${error.message}`);
    }
  };

  const testDeleteSubmission = async () => {
    try {
      const result = await api.deleteSubmission(testFormulario.id);
      addResult('DELETE', true, 'Formulario eliminado exitosamente', result);
      setTestFormulario(null);
    } catch (error) {
      addResult('DELETE', false, `Error eliminando: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setTestFormulario(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>🧪 Test CRUD - Sistema EFO</h1>
        <p>Prueba todas las operaciones CRUD con Supabase</p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={runAllTests} 
            disabled={isRunning}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isRunning ? 'not-allowed' : 'pointer'
            }}
          >
            {isRunning ? '🔄 Ejecutando...' : '▶️ Ejecutar Todos los Tests'}
          </button>
          
          <button 
            onClick={clearResults}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Limpiar Resultados
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h3>📊 Resultados de Tests ({testResults.length})</h3>
        
        {testResults.length === 0 && (
          <p style={{ color: '#666' }}>No hay resultados aún. Ejecuta los tests para ver los resultados.</p>
        )}
        
        {testResults.map((result, index) => (
          <div 
            key={index}
            style={{
              padding: '10px',
              margin: '10px 0',
              borderRadius: '4px',
              backgroundColor: result.success ? '#d4edda' : '#f8d7da',
              borderLeft: `4px solid ${result.success ? '#28a745' : '#dc3545'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>
                {result.success ? '✅' : '❌'} {result.test}
              </strong>
              <span style={{ fontSize: '12px', color: '#666' }}>
                {result.timestamp}
              </span>
            </div>
            <div style={{ marginTop: '5px' }}>
              {result.message}
            </div>
            {result.data && (
              <details style={{ marginTop: '10px' }}>
                <summary style={{ cursor: 'pointer' }}>Ver datos</summary>
                <pre style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {testFormulario && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px' 
        }}>
          <h4>🎯 Formulario de Test Activo</h4>
          <p><strong>ID:</strong> {testFormulario.id}</p>
          <p><strong>Email:</strong> {testFormulario.email_cliente}</p>
          <p><strong>Estado:</strong> {testFormulario.estado}</p>
        </div>
      )}
    </div>
  );
};

export default CrudTest;
