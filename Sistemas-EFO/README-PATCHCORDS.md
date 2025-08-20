# 🔌 Sistema de Patch Cords EFO

Sistema simplificado para configuración, cotización y gestión de patch cords de fibra óptica para **ELECTROL FIBRA ÓPTICA SAS**.

## ✨ Características

- 🎛️ **Panel administrativo** para gestión de precios
- 🔧 **Configurador para clientes** con productos compuestos
- 💰 **Cálculo automático** de precios
- 📄 **Generación de PDF** con cotizaciones detalladas
- 📊 **Dashboard de gestión** de cotizaciones
- 🎨 **Diseño responsive** moderno

## 🚀 URLs del Sistema

### 🌐 Frontend para Clientes
- **Configurador:** `http://localhost:5174/patch-cords`
- Permite a los clientes configurar patch cords personalizados
- Cálculo automático de precios en tiempo real
- Generación de cotizaciones en PDF

### 🔧 Panel Administrativo
- **Login:** `http://localhost:5174/admin/login`
- **Dashboard:** `http://localhost:5174/admin/dashboard`
- **Gestión de Precios:** `http://localhost:5174/admin/patch-cords`

### 🗄️ API Mock Server
- **Base URL:** `http://localhost:3001/api/patch-cords/`
- Servidor de desarrollo con datos simulados

## 🔑 Credenciales de Acceso

Use las mismas credenciales del sistema principal:

### Super Admin (Acceso completo)
- **Usuario:** `superadmin`
- **Contraseña:** `efo2025super`

## 📋 Componentes del Sistema

### 1. 🎛️ Panel de Precios (`PatchCordsAdmin.jsx`)
- Gestión de precios de conectores y cables
- Interfaz intuitiva con tabs por categoría
- Guardado automático de cambios

### 2. 🔧 Configurador (`PatchCordsConfigurator.jsx`)
- Selección de conectores A y B
- Elección de tipo de cable y longitud
- Información del cliente
- Cálculo automático de precios

### 3. 🗄️ API de Datos (`patchCordsApi.js`)
- Gestión de precios y configuraciones
- Generación y almacenamiento de cotizaciones
- Estadísticas del sistema

## 💰 Estructura de Precios

### Conectores
- **Estándar:** LC/UPC, LC/APC, SC/UPC, SC/APC, ST
- **Premium:** FC/UPC, FC/APC, E2000/UPC, E2000/APC
- **Especiales:** MTP/MPO (12 y 24 fibras)

### Cables
- **Single Mode:** G652D, G657A1, G657A2
- **Multimode:** OM1, OM2, OM3, OM4, OM5
- **Especiales:** Dúplex, Armados

## 🚀 Instalación y Desarrollo

### Paso 1: Instalar dependencias
```bash
cd formulario-credito
npm install
```

### Paso 2: Iniciar el sistema completo
```bash
# Opción 1: Solo frontend
npm run dev

# Opción 2: Frontend + Mock server de patch cords
npm run dev:patchcords

# Opción 3: Sistema completo (formularios + patch cords)
npm run dev:full && node mock-server-patchcords.js
```

### Paso 3: Acceder al sistema
- **Frontend:** http://localhost:5174/patch-cords
- **Admin:** http://localhost:5174/admin/login
- **API:** http://localhost:3001/api/patch-cords/

## 📊 API Endpoints

### Gestión de Precios
```
GET    /api/patch-cords/prices           # Obtener todos los precios
PUT    /api/patch-cords/prices           # Actualizar precios
POST   /api/patch-cords/prices           # Agregar nuevo item
DELETE /api/patch-cords/prices/:cat/:key # Eliminar item
```

### Cotizaciones
```
POST   /api/patch-cords/quote            # Generar cotización
GET    /api/patch-cords/quotes           # Listar cotizaciones
GET    /api/patch-cords/quote/:id        # Obtener cotización específica
GET    /api/patch-cords/quote/:id/pdf    # Descargar PDF
```

### Estadísticas
```
GET    /api/patch-cords/stats            # Estadísticas del sistema
```

## 🎯 Flujo de Trabajo

### Para Clientes:
1. **Configurar** patch cord en `/patch-cords`
2. **Agregar** múltiples configuraciones al pedido
3. **Completar** información de contacto
4. **Generar** cotización en PDF
5. **Enviar** solicitud automáticamente

### Para Administradores:
1. **Gestionar precios** en `/admin/patch-cords`
2. **Revisar cotizaciones** en el dashboard
3. **Actualizar estados** de solicitudes
4. **Generar reportes** de ventas

## 📄 Generación de PDF

El sistema genera cotizaciones en PDF que incluyen:

- **Información del cliente**
- **Detalle de cada patch cord** configurado
- **Precios unitarios y totales**
- **Descuentos aplicados**
- **Términos y condiciones**
- **Información de contacto EFO**

## 🔧 Personalización

### Agregar Nuevos Conectores:
```javascript
// En mock-server-patchcords.js
connectors: {
  'NUEVO_CONECTOR': {
    price: 10.50,
    description: 'Descripción del nuevo conector',
    category: 'premium'
  }
}
```

### Agregar Nuevos Cables:
```javascript
cables: {
  'NUEVO_CABLE': {
    pricePerMeter: 2.50,
    description: 'Descripción del nuevo cable',
    category: 'special'
  }
}
```

### Modificar Descuentos:
```javascript
discounts: {
  '1000+': {
    discount: 25,
    description: '1000+ unidades - 25% descuento'
  }
}
```

## 🚨 Troubleshooting

### No se cargan los precios:
1. ✅ Verificar que el mock server esté corriendo en puerto 3001
2. ✅ Comprobar la consola del navegador para errores
3. ✅ Revisar la conexión a `http://localhost:3001/api/patch-cords/prices`

### No se genera el PDF:
1. ✅ Verificar que todos los campos obligatorios estén completos
2. ✅ Comprobar que hay al menos un patch cord configurado
3. ✅ Revisar la respuesta del API en la consola

### Panel de admin no guarda cambios:
1. ✅ Verificar la conexión al mock server
2. ✅ Comprobar que el usuario tiene permisos de edición
3. ✅ Revisar la consola para errores de red

## 📞 Soporte

Para problemas técnicos:

1. **Revisar logs** en la consola del navegador (F12)
2. **Verificar conexión** al mock server
3. **Comprobar permisos** de usuario
4. **Contactar** al equipo de desarrollo

---

## 📄 Licencia

© 2025 ELECTROL FIBRA ÓPTICA SAS. Todos los derechos reservados.

**Sistema desarrollado específicamente para EFO** - No redistribuir sin autorización.
