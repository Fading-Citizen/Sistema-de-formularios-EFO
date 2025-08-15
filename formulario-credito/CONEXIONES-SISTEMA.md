# 🔗 Guía de Conexiones del Sistema EFO

## 📋 Estado Actual de Conexiones

### ✅ **Conexiones Funcionando:**

#### **Frontend Architecture**
- **React 18** con Vite
- **React Router** para navegación
- **Multi-context** (Auth + SuperAdmin)
- **Lucide React** para iconos
- **CSS Modular** para estilos

#### **Authentication System**
- **4 roles** de usuario implementados
- **Protección de rutas** por rol
- **Contexto global** de autenticación
- **Permisos granulares** por componente

#### **Data Flow**
```
FormularioCredito → Mock API Server → Dashboard
     ↓                    ↓              ↓
  Envía datos        Almacena temp    Muestra lista
```

### 🔧 **Configuración de Desarrollo**

#### **1. URLs Configuradas:**
- **Frontend**: `http://localhost:5173`
- **Mock API**: `http://localhost:3001`
- **WordPress Simulation**: `http://localhost:3001/wp-admin/admin-ajax.php`

#### **2. Scripts Disponibles:**
```bash
npm run dev              # Solo frontend
npm run mock-server      # Solo API mock
npm run dev:full         # Frontend + API mock juntos
```

#### **3. Endpoints API Mock:**
- `GET /wp-admin/admin-ajax.php?action=get_form_submissions`
- `POST /wp-admin/admin-ajax.php` (submit form)

### 📊 **Flujo de Datos**

#### **Envío de Formulario:**
```javascript
FormularioCredito.jsx
  ↓ handleSubmit()
  ↓ fetch(API_ENDPOINTS.SUBMIT_FORM)
  ↓ Mock Server receives data
  ↓ Returns success response
  ↓ Form shows success message
```

#### **Carga de Dashboard:**
```javascript
Dashboard.jsx
  ↓ useEffect() calls fetchSubmissions()
  ↓ fetch(API_ENDPOINTS.GET_SUBMISSIONS)
  ↓ Mock Server returns data
  ↓ setSubmissions(data)
  ↓ UI updates with submissions list
```

### 🎛️ **Componentes y Sus Conexiones**

#### **App.jsx**
```javascript
AuthProvider
  ↓ SuperAdminProvider
    ↓ Router
      ↓ Routes (Login, Dashboard, SuperAdmin, Form)
        ↓ ProtectedRoute (role validation)
```

#### **Dashboard.jsx**
- **Conecta con**: AuthContext, API_ENDPOINTS
- **Recibe**: Lista de formularios del mock server
- **Muestra**: Tabla filtrable por permisos de usuario
- **Funciones**: Ver, archivar, exportar, actualizar estado

#### **SuperAdminPanel.jsx**
- **Conecta con**: AuthContext, SuperAdminContext
- **Gestiona**: Sistemas mock, métricas, navegación
- **Muestra**: Overview, gestión de sistemas, usuarios

#### **FormularioCredito.jsx**
- **Conecta con**: API_ENDPOINTS
- **Envía**: Datos del formulario al mock server
- **Validación**: Frontend completa
- **Archivos**: Soporte para subida (simulado)

### 🔐 **Sistema de Autenticación**

#### **Usuarios de Prueba:**
```javascript
superadmin / efo2025super     // Acceso completo
creditadmin / efo2025credit   // Solo créditos
generaladmin / efo2025general // Formularios generales
viewer / efo2025view          // Solo lectura
```

#### **Permisos por Rol:**
- **Super Admin**: Todo + Super Admin Panel
- **Credit Admin**: Solo formularios de crédito
- **General Admin**: Formularios generales y contacto
- **Viewer**: Solo visualización, sin edición

### 🚀 **Para Ejecutar el Sistema Completo:**

#### **Opción 1: Todo en uno**
```bash
npm install
npm run dev:full
```

#### **Opción 2: Separado**
```bash
# Terminal 1 - Mock API
npm run mock-server

# Terminal 2 - Frontend
npm run dev
```

### 📱 **Testing de Conexiones**

#### **1. Probar Formulario:**
1. Ir a `http://localhost:5173/form/credito-efo`
2. Llenar el formulario
3. Verificar en consola del mock server el log
4. Confirmar mensaje de éxito

#### **2. Probar Dashboard:**
1. Login con cualquier usuario
2. Verificar que aparecen formularios
3. Probar filtros y búsqueda
4. Verificar permisos según rol

#### **3. Probar Super Admin:**
1. Login como `superadmin`
2. Acceder al Super Admin Panel
3. Verificar métricas y sistemas
4. Probar cambios de estado de sistemas

### 🔧 **Próximos Pasos para Backend Real:**

#### **1. Reemplazar Mock Server con:**
- Express.js + MongoDB
- Node.js + PostgreSQL
- PHP + MySQL (WordPress)
- Python + Django/FastAPI

#### **2. Mantener mismo API Contract:**
- Mismos endpoints
- Misma estructura de respuesta
- Solo cambiar URL en `src/config/api.js`

### 🐛 **Debugging**

#### **Si no aparecen datos:**
1. Verificar que mock server esté corriendo en puerto 3001
2. Comprobar consola del navegador por errores CORS
3. Verificar Network tab para ver requests
4. Confirmar que `src/config/api.js` apunta a localhost:3001

#### **Si falla autenticación:**
1. Verificar que usuarios están en AuthContext
2. Comprobar localStorage para sesión persistente
3. Verificar permisos de rol en AuthContext

#### **Si falla navegación:**
1. Verificar rutas en App.jsx
2. Comprobar ProtectedRoute
3. Verificar que useNavigate se importa correctamente

---

## 📞 **Soporte**

Este sistema está listo para desarrollo y testing. Todas las conexiones entre componentes están funcionando correctamente con datos mock. Para migrar a producción, solo necesitas reemplazar el mock server con un backend real manteniendo el mismo contrato de API.
