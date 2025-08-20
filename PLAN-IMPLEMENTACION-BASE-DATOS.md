# 🏗️ Plan de Implementación con Base de Datos

## 🎯 Objetivo
Implementar persistencia completa del porcentaje de impuestos y productos en base de datos.

## 📋 Esquema de Base de Datos Propuesto

### Tabla: `configuracion_sistema`
```sql
CREATE TABLE configuracion_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(50) UNIQUE NOT NULL,
    valor VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    usuario_modificacion VARCHAR(100)
);

-- Insertar configuración por defecto
INSERT INTO configuracion_sistema (clave, valor, descripcion) 
VALUES ('porcentaje_impuestos', '16', 'Porcentaje de IVA aplicado a todos los productos');
```

### Tabla: `productos_conectores`
```sql
CREATE TABLE productos_conectores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    costo DECIMAL(10,4) NOT NULL,
    envio DECIMAL(10,4) NOT NULL,
    margen_operativo DECIMAL(10,4) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla: `productos_cables`
```sql
CREATE TABLE productos_cables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo_por_metro DECIMAL(10,4) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla: `productos_extras`
```sql
CREATE TABLE productos_extras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10,4) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla: `historial_cambios_impuestos`
```sql
CREATE TABLE historial_cambios_impuestos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    porcentaje_anterior DECIMAL(5,2),
    porcentaje_nuevo DECIMAL(5,2),
    usuario VARCHAR(100),
    razon TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ API Endpoints Necesarios

### 1. Configuración de Impuestos
```javascript
// GET /api/configuracion/impuestos
{
  "porcentaje": 16,
  "fecha_modificacion": "2025-08-20T10:30:00Z",
  "usuario_modificacion": "admin@efo.com"
}

// PUT /api/configuracion/impuestos
{
  "porcentaje": 18,
  "razon": "Cambio de regulación fiscal"
}
```

### 2. Productos CRUD
```javascript
// GET /api/productos/conectores
// POST /api/productos/conectores
// PUT /api/productos/conectores/:id
// DELETE /api/productos/conectores/:id

// GET /api/productos/cables
// POST /api/productos/cables
// PUT /api/productos/cables/:id
// DELETE /api/productos/cables/:id

// GET /api/productos/extras
// POST /api/productos/extras
// PUT /api/productos/extras/:id
// DELETE /api/productos/extras/:id
```

### 3. Historial
```javascript
// GET /api/historial/impuestos
[
  {
    "id": 1,
    "porcentaje_anterior": 16,
    "porcentaje_nuevo": 18,
    "usuario": "admin@efo.com",
    "razon": "Cambio regulatorio",
    "fecha_cambio": "2025-08-20T10:30:00Z"
  }
]
```

## 🔧 Modificaciones en el Frontend

### 1. Hook Personalizado para Configuración
```javascript
// hooks/useSystemConfig.js
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useSystemConfig = () => {
  const [taxPercentage, setTaxPercentage] = useState(16);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTaxPercentage();
  }, []);

  const loadTaxPercentage = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/configuracion/impuestos');
      setTaxPercentage(response.data.porcentaje);
    } catch (err) {
      setError('Error cargando configuración');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaxPercentage = async (newPercentage, reason = '') => {
    try {
      setLoading(true);
      await apiService.put('/configuracion/impuestos', {
        porcentaje: newPercentage,
        razon: reason
      });
      setTaxPercentage(newPercentage);
      return { success: true };
    } catch (err) {
      setError('Error actualizando configuración');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    taxPercentage,
    updateTaxPercentage,
    loading,
    error
  };
};
```

### 2. Hook para Productos
```javascript
// hooks/useProducts.js
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState({
    conectores: {},
    cables: {},
    extras: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const [conectores, cables, extras] = await Promise.all([
        apiService.get('/productos/conectores'),
        apiService.get('/productos/cables'),
        apiService.get('/productos/extras')
      ]);

      setProducts({
        conectores: conectores.data,
        cables: cables.data,
        extras: extras.data
      });
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (category, productData) => {
    try {
      const response = await apiService.post(`/productos/${category}`, productData);
      setProducts(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [response.data.codigo]: response.data
        }
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (category, id, productData) => {
    try {
      await apiService.put(`/productos/${category}/${id}`, productData);
      await loadAllProducts(); // Recargar productos
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (category, id) => {
    try {
      await apiService.delete(`/productos/${category}/${id}`);
      await loadAllProducts(); // Recargar productos
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refresh: loadAllProducts
  };
};
```

### 3. Componente Actualizado
```javascript
// PatchCordsAdmin.jsx (versión con base de datos)
import React from 'react';
import { useSystemConfig } from '../hooks/useSystemConfig';
import { useProducts } from '../hooks/useProducts';

const PatchCordsAdmin = () => {
  const { 
    taxPercentage, 
    updateTaxPercentage, 
    loading: configLoading 
  } = useSystemConfig();
  
  const { 
    products, 
    loading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct 
  } = useProducts();

  // Control de impuestos con persistencia
  const handleTaxChange = async (newPercentage) => {
    const reason = prompt('Razón del cambio de porcentaje de impuestos:');
    if (reason !== null) {
      const result = await updateTaxPercentage(newPercentage, reason);
      if (!result.success) {
        alert('Error actualizando porcentaje de impuestos');
      }
    }
  };

  // Funciones de cálculo (sin cambios)
  const calculateTax = (costo, envio, margenOp) => {
    const subtotal = costo + envio + margenOp;
    return (subtotal * (taxPercentage / 100)).toFixed(4);
  };

  const calculateFinalCost = (costo, envio, margenOp) => {
    const subtotal = costo + envio + margenOp;
    const impuestos = subtotal * (taxPercentage / 100);
    return (subtotal + impuestos).toFixed(4);
  };

  if (configLoading || productsLoading) {
    return <div>Cargando configuración del sistema...</div>;
  }

  return (
    <div className="patch-cords-admin">
      {/* Control de impuestos con persistencia */}
      <div className="tax-control">
        <label>% Impuestos:</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={taxPercentage}
          onChange={(e) => handleTaxChange(parseFloat(e.target.value) || 0)}
          className="tax-input"
        />
        <span>%</span>
      </div>

      {/* Resto del componente sin cambios */}
      {/* ... */}
    </div>
  );
};
```

## 🔄 Flujo de Datos con Base de Datos

### 1. Carga Inicial
```
Usuario abre aplicación
↓
Hook useSystemConfig se ejecuta
↓
API call: GET /api/configuracion/impuestos
↓
Estado se actualiza con valor de BD
↓
Componentes se renderizan con valor correcto
```

### 2. Cambio de Porcentaje
```
Usuario cambia porcentaje
↓
Prompt solicita razón del cambio
↓
API call: PUT /api/configuracion/impuestos
↓
Base de datos se actualiza
↓
Historial de cambios se registra
↓
Estado local se actualiza
↓
Todos los cálculos se actualizan
```

### 3. Operaciones CRUD de Productos
```
Usuario agrega/edita producto
↓
API call correspondiente
↓
Base de datos se actualiza
↓
Estado se sincroniza
↓
Interfaz se actualiza automáticamente
```

## 🔒 Consideraciones de Seguridad

### 1. Validación Backend
```javascript
// Validación de porcentaje de impuestos
const validateTaxPercentage = (percentage) => {
  if (typeof percentage !== 'number') return false;
  if (percentage < 0 || percentage > 100) return false;
  return true;
};

// Middleware de autorización
const requireAdminRole = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};
```

### 2. Auditoría
```javascript
// Registrar todos los cambios
const logConfigChange = async (userId, oldValue, newValue, reason) => {
  await db.query(`
    INSERT INTO historial_cambios_impuestos 
    (porcentaje_anterior, porcentaje_nuevo, usuario, razon)
    VALUES (?, ?, ?, ?)
  `, [oldValue, newValue, userId, reason]);
};
```

## 📊 Monitoreo y Alertas

### 1. Notificaciones de Cambios
```javascript
// Notificar cambios importantes
const notifyTaxChange = async (oldPercentage, newPercentage, user) => {
  await emailService.send({
    to: 'admin@efo.com',
    subject: 'Cambio de Porcentaje de Impuestos',
    body: `
      El usuario ${user} cambió el porcentaje de impuestos 
      de ${oldPercentage}% a ${newPercentage}%
    `
  });
};
```

### 2. Dashboard de Métricas
```javascript
// Endpoint para métricas
// GET /api/metrics/configuracion
{
  "ultimo_cambio_impuestos": "2025-08-20T10:30:00Z",
  "total_productos": 150,
  "productos_por_categoria": {
    "conectores": 50,
    "cables": 75,
    "extras": 25
  }
}
```

## 🚀 Plan de Migración

### Fase 1: Configuración
1. Crear tabla `configuracion_sistema`
2. Insertar porcentaje actual (16%)
3. Implementar API de configuración
4. Actualizar frontend para usar API

### Fase 2: Productos
1. Crear tablas de productos
2. Migrar datos actuales
3. Implementar CRUD APIs
4. Actualizar frontend para persistencia

### Fase 3: Auditoría
1. Implementar historial de cambios
2. Agregar logs de actividad
3. Crear dashboard de métricas
4. Configurar alertas

### Fase 4: Optimización
1. Implementar caché
2. Optimizar consultas
3. Agregar índices de BD
4. Configurar backups automáticos

## ✅ Checklist de Implementación

- [ ] Diseño de base de datos
- [ ] APIs REST para configuración
- [ ] APIs CRUD para productos  
- [ ] Hooks personalizados de React
- [ ] Componentes actualizados
- [ ] Validación y seguridad
- [ ] Sistema de auditoría
- [ ] Testing completo
- [ ] Documentación
- [ ] Plan de migración

---

**Resultado**: Sistema completamente persistente con historial de cambios, auditoría completa y sincronización automática entre frontend y backend.
