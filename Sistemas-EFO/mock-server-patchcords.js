// Mock server para sistema de Patch Cords EFO
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Datos mock de precios de patch cords
let patchCordPrices = {
  connectors: {
    'LC/UPC': { price: 5.50, description: 'Conector LC/UPC Simplex', category: 'standard' },
    'LC/APC': { price: 6.20, description: 'Conector LC/APC Simplex', category: 'standard' },
    'SC/UPC': { price: 4.80, description: 'Conector SC/UPC', category: 'standard' },
    'SC/APC': { price: 5.40, description: 'Conector SC/APC', category: 'standard' },
    'FC/UPC': { price: 7.10, description: 'Conector FC/UPC', category: 'premium' },
    'FC/APC': { price: 7.80, description: 'Conector FC/APC', category: 'premium' },
    'ST': { price: 6.50, description: 'Conector ST', category: 'standard' },
    'E2000/UPC': { price: 8.90, description: 'Conector E2000/UPC', category: 'premium' },
    'E2000/APC': { price: 9.60, description: 'Conector E2000/APC', category: 'premium' },
    'MTP/MPO-12': { price: 15.20, description: 'Conector MTP/MPO 12 fibras', category: 'premium' },
    'MTP/MPO-24': { price: 22.40, description: 'Conector MTP/MPO 24 fibras', category: 'premium' }
  },
  cables: {
    'SM G652D': { pricePerMeter: 0.85, description: 'Cable Single Mode G652D', category: 'singlemode' },
    'SM G657A1': { pricePerMeter: 1.20, description: 'Cable Single Mode G657A1 - Bend Insensitive', category: 'singlemode' },
    'SM G657A2': { pricePerMeter: 1.35, description: 'Cable Single Mode G657A2 - Ultra Bend Insensitive', category: 'singlemode' },
    'MM OM1': { pricePerMeter: 1.10, description: 'Cable Multimode OM1 62.5/125μm', category: 'multimode' },
    'MM OM2': { pricePerMeter: 1.25, description: 'Cable Multimode OM2 50/125μm', category: 'multimode' },
    'MM OM3': { pricePerMeter: 1.80, description: 'Cable Multimode OM3 50/125μm - 10Gb', category: 'multimode' },
    'MM OM4': { pricePerMeter: 2.40, description: 'Cable Multimode OM4 50/125μm - 40Gb/100Gb', category: 'multimode' },
    'MM OM5': { pricePerMeter: 3.20, description: 'Cable Multimode OM5 50/125μm - Wideband', category: 'multimode' },
    'DUPLEX-ZIPCORD': { pricePerMeter: 0.95, description: 'Cable Dúplex Zipcord 2.0mm', category: 'special' },
    'ARMORED-SM': { pricePerMeter: 2.15, description: 'Cable Single Mode Armado', category: 'special' },
    'ARMORED-MM': { pricePerMeter: 2.45, description: 'Cable Multimode Armado', category: 'special' }
  }
};

// Datos mock de cotizaciones generadas
let quotations = [];

// API Endpoints

// GET /api/patch-cords/prices - Obtener todos los precios
app.get('/api/patch-cords/prices', (req, res) => {
  res.json({
    success: true,
    data: patchCordPrices,
    timestamp: new Date().toISOString()
  });
});

// PUT /api/patch-cords/prices - Actualizar precios
app.put('/api/patch-cords/prices', (req, res) => {
  try {
    const { category, itemKey, updates } = req.body;
    
    if (!patchCordPrices[category] || !patchCordPrices[category][itemKey]) {
      return res.status(404).json({
        success: false,
        error: 'Item no encontrado'
      });
    }
    
    patchCordPrices[category][itemKey] = {
      ...patchCordPrices[category][itemKey],
      ...updates
    };
    
    res.json({
      success: true,
      message: 'Precios actualizados correctamente',
      data: patchCordPrices[category][itemKey]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/patch-cords/prices - Agregar nuevo item
app.post('/api/patch-cords/prices', (req, res) => {
  try {
    const { category, itemKey, itemData } = req.body;
    
    if (!patchCordPrices[category]) {
      return res.status(400).json({
        success: false,
        error: 'Categoría no válida'
      });
    }
    
    if (patchCordPrices[category][itemKey]) {
      return res.status(409).json({
        success: false,
        error: 'El item ya existe'
      });
    }
    
    patchCordPrices[category][itemKey] = itemData;
    
    res.json({
      success: true,
      message: 'Item agregado correctamente',
      data: patchCordPrices[category][itemKey]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/patch-cords/prices/:category/:itemKey - Eliminar item
app.delete('/api/patch-cords/prices/:category/:itemKey', (req, res) => {
  try {
    const { category, itemKey } = req.params;
    
    if (!patchCordPrices[category] || !patchCordPrices[category][itemKey]) {
      return res.status(404).json({
        success: false,
        error: 'Item no encontrado'
      });
    }
    
    delete patchCordPrices[category][itemKey];
    
    res.json({
      success: true,
      message: 'Item eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/patch-cords/quote - Generar cotización
app.post('/api/patch-cords/quote', (req, res) => {
  try {
    const quotationData = req.body;
    const quotationId = `EFO-PC-${Date.now()}`;
    
    const quotation = {
      id: quotationId,
      ...quotationData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    quotations.push(quotation);
    
    // Simular generación de PDF
    const pdfInfo = {
      fileName: `${quotationId}.pdf`,
      size: Math.floor(Math.random() * 500) + 100 + 'KB',
      downloadUrl: `/api/patch-cords/quote/${quotationId}/pdf`
    };
    
    res.json({
      success: true,
      message: 'Cotización generada correctamente',
      data: {
        quotation,
        pdf: pdfInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/patch-cords/quotes - Obtener todas las cotizaciones
app.get('/api/patch-cords/quotes', (req, res) => {
  const { status, customer, dateFrom, dateTo } = req.query;
  
  let filteredQuotations = [...quotations];
  
  if (status) {
    filteredQuotations = filteredQuotations.filter(q => q.status === status);
  }
  
  if (customer) {
    filteredQuotations = filteredQuotations.filter(q => 
      q.customer.company.toLowerCase().includes(customer.toLowerCase()) ||
      q.customer.contact.toLowerCase().includes(customer.toLowerCase())
    );
  }
  
  if (dateFrom) {
    filteredQuotations = filteredQuotations.filter(q => 
      new Date(q.createdAt) >= new Date(dateFrom)
    );
  }
  
  if (dateTo) {
    filteredQuotations = filteredQuotations.filter(q => 
      new Date(q.createdAt) <= new Date(dateTo)
    );
  }
  
  res.json({
    success: true,
    data: filteredQuotations.reverse(), // Más recientes primero
    total: filteredQuotations.length
  });
});

// GET /api/patch-cords/quote/:id - Obtener cotización específica
app.get('/api/patch-cords/quote/:id', (req, res) => {
  const quotation = quotations.find(q => q.id === req.params.id);
  
  if (!quotation) {
    return res.status(404).json({
      success: false,
      error: 'Cotización no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: quotation
  });
});

// GET /api/patch-cords/quote/:id/pdf - Descargar PDF de cotización
app.get('/api/patch-cords/quote/:id/pdf', (req, res) => {
  const quotation = quotations.find(q => q.id === req.params.id);
  
  if (!quotation) {
    return res.status(404).json({
      success: false,
      error: 'Cotización no encontrada'
    });
  }
  
  // Simular descarga de PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}.pdf"`);
  res.send(`PDF simulado para cotización ${req.params.id}`);
});

// GET /api/patch-cords/stats - Estadísticas del sistema
app.get('/api/patch-cords/stats', (req, res) => {
  const stats = {
    totalQuotations: quotations.length,
    quotationsByStatus: {
      pending: quotations.filter(q => q.status === 'pending').length,
      approved: quotations.filter(q => q.status === 'approved').length,
      rejected: quotations.filter(q => q.status === 'rejected').length
    },
    totalConnectors: Object.keys(patchCordPrices.connectors).length,
    totalCables: Object.keys(patchCordPrices.cables).length,
    totalServices: Object.keys(patchCordPrices.services).length,
    recentQuotations: quotations.slice(-5).reverse()
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Mock Server de Patch Cords EFO iniciado en puerto ${PORT}`);
  console.log(`📋 API disponible en: http://localhost:${PORT}/api/patch-cords/`);
  console.log(`\n📊 Endpoints disponibles:`);
  console.log(`   GET  /api/patch-cords/prices - Obtener precios`);
  console.log(`   PUT  /api/patch-cords/prices - Actualizar precios`);
  console.log(`   POST /api/patch-cords/prices - Agregar item`);
  console.log(`   DEL  /api/patch-cords/prices/:category/:itemKey - Eliminar item`);
  console.log(`   POST /api/patch-cords/quote - Generar cotización`);
  console.log(`   GET  /api/patch-cords/quotes - Listar cotizaciones`);
  console.log(`   GET  /api/patch-cords/quote/:id - Obtener cotización`);
  console.log(`   GET  /api/patch-cords/stats - Estadísticas`);
});
