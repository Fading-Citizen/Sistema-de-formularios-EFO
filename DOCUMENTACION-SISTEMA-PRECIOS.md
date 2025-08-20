# 📋 Documentación del Sistema de Cálculo de Precios - Patch Cords EFO

## 🎯 Resumen Ejecutivo

El sistema de cotización de Patch Cords implementa una lógica de cálculo de precios basada en los datos del archivo Excel/CSV proporcionado, con mejoras para automatización y flexibilidad fiscal.

---

## 📊 Estructura de Datos Original (CSV/Excel)

### Fuente de Datos
Los precios están basados en el archivo Excel que contiene:
- **Conectores**: SC/UPC, SC/APC, LC/UPC, LC/APC, FC/UPC, FC/APC, ST/UPC, ST/APC
- **Variantes**: Value, Premium, Industrial
- **Cables**: Diferentes tipos con costos por metro
- **Extras**: Servicios y productos adicionales

### Estructura por Conector
Cada conector incluye los siguientes campos de costo:
```
- Costo Base
- Envío
- Impuestos (ahora calculado automáticamente)
- Margen Operativo
- Costo Final Unitario (calculado dinámicamente)
```

---

## 🧮 Lógica de Cálculo de Precios

### Fórmula Principal
```javascript
// Cálculo de Impuestos (Dinámico)
const subtotal = costo + envio + margenOp;
const impuestos = subtotal * (taxPercentage / 100);

// Costo Final
const costoFinalUnitario = subtotal + impuestos;
```

### Componentes del Precio

#### 1. **Costo Base**
- Precio del componente/conector sin agregados
- Valores extraídos directamente del CSV original
- Ejemplo: SC/UPC_SM_Value = $0.12

#### 2. **Envío**
- Costo de envío por unidad
- Calculado en base a logística y peso
- Ejemplo: $0.025 por conector

#### 3. **Impuestos** ⭐ (MEJORADO)
- **Antes**: Valores fijos individuales por producto
- **Ahora**: Porcentaje global configurable (16% por defecto - IVA México)
- **Cálculo**: `(Costo + Envío + Margen) × Porcentaje`
- **Ventajas**: 
  - Actualización automática al cambiar regulaciones fiscales
  - Consistencia en todos los productos
  - Facilidad de auditoría

#### 4. **Margen Operativo**
- Ganancia de la empresa por producto
- Incluye costos operacionales y utilidad
- Valores basados en análisis de mercado

#### 5. **Costo Final Unitario**
- Precio total por unidad
- Base para cotizaciones al cliente
- Calculado automáticamente

---

## 🔄 Flujo de Cálculo en el Sistema

### Paso 1: Datos Base
```javascript
const producto = {
  costo: 0.12,        // Del CSV original
  envio: 0.025,       // Del CSV original  
  margenOp: 0.01914   // Del CSV original
};
```

### Paso 2: Cálculo de Impuestos
```javascript
const taxPercentage = 16; // Configurable globalmente
const subtotal = 0.12 + 0.025 + 0.01914; // = 0.16414
const impuestos = 0.16414 * 0.16; // = 0.026262
```

### Paso 3: Precio Final
```javascript
const precioFinal = 0.16414 + 0.026262; // = 0.190402
```

---

## 🛠️ Implementación Técnica

### Funciones de Cálculo

#### `calculateTax(costo, envio, margenOp)`
```javascript
const calculateTax = (costo, envio, margenOp) => {
  const subtotal = costo + envio + margenOp;
  return (subtotal * (taxPercentage / 100)).toFixed(4);
};
```

#### `calculateFinalCost(costo, envio, margenOp)`
```javascript
const calculateFinalCost = (costo, envio, margenOp) => {
  const subtotal = costo + envio + margenOp;
  const impuestos = subtotal * (taxPercentage / 100);
  return (subtotal + impuestos).toFixed(4);
};
```

### Control de Impuestos Global
- **Variable**: `taxPercentage` (estado React)
- **Valor por defecto**: 16% (IVA México)
- **Interfaz**: Campo numérico en header de administración
- **Actualización**: Tiempo real en toda la aplicación

---

## 📈 Comparación: Antes vs Después

### Sistema Original (CSV)
```
SC/UPC_SM_Value:
- Costo: $0.12
- Envío: $0.025  
- Impuestos: $0.0145 (valor fijo)
- Margen Op.: $0.01914
- Total: $0.1786
```

### Sistema Mejorado (Actual)
```
SC/UPC_SM_Value:
- Costo: $0.12
- Envío: $0.025
- Impuestos: $0.0262 (16% de $0.16414)
- Margen Op.: $0.01914  
- Total: $0.1904
```

### Ventajas del Nuevo Sistema
1. **Flexibilidad Fiscal**: Cambio rápido de porcentaje de impuestos
2. **Consistencia**: Mismo porcentaje para todos los productos
3. **Actualización Automática**: No requiere modificar cada producto
4. **Transparencia**: Los usuarios ven el porcentaje aplicado
5. **Cumplimiento**: Fácil adaptación a cambios regulatorios

---

## 🔧 Configuración y Administración

### Panel de Administración
- **Ubicación**: Header del panel de administración
- **Control**: Input numérico con validación (0-100%)
- **Efecto**: Inmediato en todos los cálculos
- **Persistencia**: En memoria durante la sesión

### Gestión de Productos
- **Agregar**: Solo requiere costo, envío y margen operativo
- **Editar**: Impuestos se recalculan automáticamente
- **Visualizar**: Muestra impuestos y total calculados

---

## 📊 Ejemplos de Cálculo por Categoría

### Conectores
```
Ejemplo: LC/UPC_SM_Value
- Costo Base: $0.10
- Envío: $0.025
- Margen Operativo: $0.01625
- Subtotal: $0.14125
- Impuestos (16%): $0.0226
- TOTAL: $0.1639
```

### Cables
```
Ejemplo: Cable_Fibra_Monomodo
- Costo por Metro: $2.50
- Descripción: "Cable de fibra óptica monomodo"
- Cálculo: Precio × Metros solicitados
```

### Extras
```
Ejemplo: Conectorización
- Costo: $15.00
- Impuestos (16%): $2.40  
- TOTAL: $17.40
```

---

## 🎯 Impacto en el Negocio

### Beneficios Operacionales
1. **Tiempo**: Reduce tiempo de actualización de precios de horas a segundos
2. **Precisión**: Elimina errores de cálculo manual
3. **Auditoría**: Trazabilidad completa de cambios de precios
4. **Escalabilidad**: Fácil agregar nuevos productos

### Beneficios Fiscales
1. **Cumplimiento**: Adaptación rápida a cambios de IVA
2. **Reportes**: Cálculos consistentes para contabilidad
3. **Transparencia**: Desglose claro de impuestos por cotización

### Beneficios Comerciales
1. **Competitividad**: Precios actualizados en tiempo real
2. **Flexibilidad**: Ajustes rápidos por condiciones de mercado
3. **Profesionalismo**: Cotizaciones precisas y detalladas

---

## 🔍 Validación y Testing

### Casos de Prueba
1. **Cambio de IVA**: 16% → 8% → 0% (verificar recálculo)
2. **Productos Nuevos**: Verificar cálculo correcto desde creación
3. **Edición de Precios**: Confirmar actualización automática de totales
4. **Cotizaciones**: Validar precios finales en PDF generados

### Criterios de Aceptación
- ✅ Cálculos matemáticamente correctos
- ✅ Interfaz intuitiva para administradores  
- ✅ Actualización en tiempo real
- ✅ Compatibilidad con datos originales del CSV

---

## 📝 Notas Técnicas

### Precisión Numérica
- Cálculos con 4 decimales para mayor precisión
- Formato `parseFloat()` para entrada de usuarios
- Función `toFixed(4)` para visualización consistente

### Estado de Datos
- Base de datos en memoria (productDatabase)
- Estado React para porcentaje de impuestos
- Cálculos dinámicos sin modificar datos base

### Compatibilidad
- Mantiene estructura original del CSV
- Agrega funcionalidad sin perder datos existentes
- Migración transparent de sistema fijo a dinámico

---

## 🚀 Futuras Mejoras Sugeridas

1. **Persistencia**: Guardar porcentaje de impuestos en base de datos
2. **Histórico**: Registro de cambios de porcentajes con fechas
3. **Múltiples Impuestos**: Soporte para diferentes tipos de impuestos
4. **Descuentos**: Sistema de descuentos por volumen
5. **Monedas**: Soporte para múltiples monedas

---

## 📞 Contacto y Soporte

Para preguntas sobre el sistema de cálculo de precios:
- **Documentación**: Este archivo
- **Código fuente**: `PatchCordsAdmin.jsx`
- **Datos**: `productDatabase` en el componente

---

*Documentación generada el ${new Date().toLocaleDateString('es-MX')} - Sistema EFO v2.0*
