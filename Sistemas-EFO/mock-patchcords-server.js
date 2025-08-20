import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Datos de precios iniciales basados en el Excel
let patchCordPrices = {
  connectorsValue: {
    'lc-upc': {
      name: 'LC UPC Value',
      description: 'Conector LC UPC calidad estándar',
      baseCost: 2.50,
      shipping: 0.30,
      taxes: 0.25,
      operatingMargin: 1.20,
      finalPrice: 4.25,
      stock: 100
    },
    'sc-upc': {
      name: 'SC UPC Value',
      description: 'Conector SC UPC calidad estándar',
      baseCost: 2.80,
      shipping: 0.30,
      taxes: 0.28,
      operatingMargin: 1.35,
      finalPrice: 4.73,
      stock: 80
    }
  },
  connectorsPremium: {
    'lc-apc': {
      name: 'LC APC Premium',
      description: 'Conector LC APC alta calidad',
      baseCost: 4.50,
      shipping: 0.35,
      taxes: 0.45,
      operatingMargin: 2.25,
      finalPrice: 7.55,
      stock: 60
    },
    'sc-apc': {
      name: 'SC APC Premium',
      description: 'Conector SC APC alta calidad',
      baseCost: 4.80,
      shipping: 0.35,
      taxes: 0.48,
      operatingMargin: 2.40,
      finalPrice: 8.03,
      stock: 50
    }
  },
  cablesSM: {
    'sm-g652d': {
      name: 'SM G.652.D',
      description: 'Cable monomodo G.652.D estándar',
      baseCost: 0.85,
      shipping: 0.10,
      taxes: 0.09,
      operatingMargin: 0.45,
      finalPrice: 1.49,
      stock: 1000
    },
    'sm-g657a2': {
      name: 'SM G.657.A2',
      description: 'Cable monomodo G.657.A2 bend-insensitive',
      baseCost: 1.20,
      shipping: 0.12,
      taxes: 0.12,
      operatingMargin: 0.65,
      finalPrice: 2.09,
      stock: 800
    }
  },
  cablesMM: {
    'mm-om1': {
      name: 'MM OM1',
      description: 'Cable multimodo OM1 62.5/125µm',
      baseCost: 1.10,
      shipping: 0.10,
      taxes: 0.11,
      operatingMargin: 0.55,
      finalPrice: 1.86,
      stock: 600
    },
    'mm-om3': {
      name: 'MM OM3',
      description: 'Cable multimodo OM3 50/125µm',
      baseCost: 1.45,
      shipping: 0.12,
      taxes: 0.15,
      operatingMargin: 0.75,
      finalPrice: 2.47,
      stock: 700
    },
    'mm-om4': {
      name: 'MM OM4',
      description: 'Cable multimodo OM4 50/125µm alta velocidad',
      baseCost: 2.20,
      shipping: 0.15,
      taxes: 0.22,
      operatingMargin: 1.15,
      finalPrice: 3.72,
      stock: 400
    }
  },
  extras: {
    'labor': {
      name: 'Mano de Obra',
      description: 'Costo de ensamblaje por patch cord',
      baseCost: 3.50,
      shipping: 0.00,
      taxes: 0.35,
      operatingMargin: 1.75,
      finalPrice: 5.60,
      stock: 0
    },
    'testing': {
      name: 'Pruebas IL/RL',
      description: 'Pruebas de pérdida de inserción y retorno',
      baseCost: 1.20,
      shipping: 0.00,
      taxes: 0.12,
      operatingMargin: 0.60,
      finalPrice: 1.92,
      stock: 0
    },
    'packaging': {
      name: 'Empaque Individual',
      description: 'Empaque protector individual',
      baseCost: 0.35,
      shipping: 0.05,
      taxes: 0.04,
      operatingMargin: 0.20,
      finalPrice: 0.64,
      stock: 500
    }
  },
  quantityDiscounts: {
    tier1: {
      range: '1-9',
      min: 1,
      max: 9,
      discount: 1.50, // 150% (sin descuento, precio premium)
      description: 'Precio individual - sin descuento'
    },
    tier2: {
      range: '10-49',
      min: 10,
      max: 49,
      discount: 1.25, // 125%
      description: 'Descuento por volumen pequeño'
    },
    tier3: {
      range: '50-99',
      min: 50,
      max: 99,
      discount: 1.00, // 100% (precio base)
      description: 'Precio estándar'
    },
    tier4: {
      range: '100-499',
      min: 100,
      max: 499,
      discount: 0.85, // 85%
      description: 'Descuento por volumen medio'
    },
    tier5: {
      range: '500-999',
      min: 500,
      max: 999,
      discount: 0.70, // 70%
      description: 'Descuento por volumen alto'
    },
    tier6: {
      range: '1000+',
      min: 1000,
      max: 999999,
      discount: 0.55, // 55%
      description: 'Descuento máximo por volumen'
    }
  }
};

// Rutas de la API
app.get('/api/patch-cords/prices', (req, res) => {
  res.json(patchCordPrices);
});

app.put('/api/patch-cords/prices', (req, res) => {
  patchCordPrices = req.body;
  res.json({ success: true, message: 'Precios actualizados correctamente' });
});

app.get('/api/patch-cords/calculate', (req, res) => {
  const { 
    connectorA, 
    connectorB, 
    cable, 
    length, 
    quantity = 1, 
    includeLabor = false, 
    includeTesting = false, 
    includePackaging = false 
  } = req.query;

  try {
    // Buscar componentes en todas las categorías
    const findComponent = (code) => {
      for (const category of Object.values(patchCordPrices)) {
        if (category[code]) return category[code];
      }
      return null;
    };

    const connectorAData = findComponent(connectorA);
    const connectorBData = findComponent(connectorB);
    const cableData = findComponent(cable);

    if (!connectorAData || !connectorBData || !cableData) {
      return res.status(400).json({ 
        error: 'Componentes no encontrados',
        missing: {
          connectorA: !connectorAData,
          connectorB: !connectorBData,
          cable: !cableData
        }
      });
    }

    // Calcular precio base por unidad
    let unitPrice = connectorAData.finalPrice + connectorBData.finalPrice + 
                   (cableData.finalPrice * parseFloat(length));

    // Agregar extras si están seleccionados
    if (includeLabor && patchCordPrices.extras.labor) {
      unitPrice += patchCordPrices.extras.labor.finalPrice;
    }
    if (includeTesting && patchCordPrices.extras.testing) {
      unitPrice += patchCordPrices.extras.testing.finalPrice;
    }
    if (includePackaging && patchCordPrices.extras.packaging) {
      unitPrice += patchCordPrices.extras.packaging.finalPrice;
    }

    // Aplicar descuento por cantidad
    const qty = parseInt(quantity);
    let discountMultiplier = 1.0;
    
    for (const tier of Object.values(patchCordPrices.quantityDiscounts)) {
      if (qty >= tier.min && qty <= tier.max) {
        discountMultiplier = tier.discount;
        break;
      }
    }

    const finalUnitPrice = unitPrice * discountMultiplier;
    const totalPrice = finalUnitPrice * qty;

    res.json({
      unitPrice: unitPrice.toFixed(4),
      discountMultiplier: discountMultiplier,
      finalUnitPrice: finalUnitPrice.toFixed(4),
      totalPrice: totalPrice.toFixed(2),
      breakdown: {
        connectorA: { name: connectorAData.name, price: connectorAData.finalPrice },
        connectorB: { name: connectorBData.name, price: connectorBData.finalPrice },
        cable: { name: cableData.name, pricePerMeter: cableData.finalPrice, meters: length },
        extras: {
          labor: includeLabor ? patchCordPrices.extras.labor?.finalPrice || 0 : 0,
          testing: includeTesting ? patchCordPrices.extras.testing?.finalPrice || 0 : 0,
          packaging: includePackaging ? patchCordPrices.extras.packaging?.finalPrice || 0 : 0
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error en el cálculo', details: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor Mock Patch Cords ejecutándose en puerto ${PORT}`);
  console.log(`📊 API disponible en: http://localhost:${PORT}/api/patch-cords/`);
});
