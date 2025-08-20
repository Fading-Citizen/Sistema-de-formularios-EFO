# 🏢 Sistemas EFO - Plataforma Completa

Plataforma completa de gestión de sistemas para **ELECTROL FIBRA ÓPTICA SAS** con React + Vite.

## ✨ Características

- � **Subsistema de Crédito**: Formularios de solicitud completos
- 🔌 **Subsistema de Patch Cords**: Configurador y cotizador
- 📊 **Dashboard administrativo** con control completo
- 🔐 **Sistema de autenticación** multinivel
- 📧 **Envío automático de emails** con archivos adjuntos
- 🎨 **Diseño responsive** moderno
- ⚡ **Tiempo real** - gestión instantánea

## 🚀 Instalación Completa

### Paso 1: Instalar la Aplicación

1. **Copiar archivos al servidor:**
   ```bash
   # Copiar toda la carpeta al servidor web
   cp -r Sistemas-EFO/ /var/www/html/
   ```

2. **Instalar dependencias y compilar:**
   ```bash
   cd /var/www/html/Sistemas-EFO
   npm install
   npm run build
   ```

### Paso 2: 🗄️ Configurar Base de Datos

El sistema requiere una base de datos MySQL/MariaDB. Crear la tabla necesaria:

```sql
CREATE TABLE efo_form_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    form_type VARCHAR(50) NOT NULL,
    form_data JSON NOT NULL,
    attachments TEXT,
    ip_address VARCHAR(45),
    status ENUM('nuevo', 'pendiente', 'completado') DEFAULT 'nuevo',
    admin_notes TEXT
);
```

### Paso 3: 📧 Configurar Emails

**Cambiar estos emails en el código del backend:**

```javascript
const additionalEmails = [
    'creditos@electrolfibra.com',        // ✏️ CAMBIAR POR EMAIL REAL
    'administracion@electrolfibra.com',  // ✏️ CAMBIAR POR EMAIL REAL
    'formularios@electrolfibra.com'      // ✏️ CAMBIAR POR EMAIL REAL
];
```

### Paso 4: � Configurar Servidor Web

1. Configurar el servidor web (Apache/Nginx) para servir la aplicación
2. Asegurar que el directorio `dist/` sea accesible públicamente
3. Configurar las rutas para SPA (Single Page Application)

## 🔐 Acceso Administrativo

### Credenciales por defecto:
- **Usuario:** `admin`
- **Contraseña:** `efo2025`

### URLs importantes:
- **📝 Formularios públicos:** `tudominio.com/formularios-efo`
- **🔑 Login admin:** `tudominio.com/formularios-efo/admin/login`
- **📊 Dashboard:** `tudominio.com/formularios-efo/admin/dashboard`

## 🗄️ Base de Datos

El sistema utiliza una tabla principal:
```sql
efo_form_submissions
├── id (Primary Key)
├── submission_date 
├── form_type (credito, contacto, soporte)
├── form_data (JSON completo)
├── attachments (URLs de archivos)
├── ip_address
├── status (nuevo, pendiente, completado)
└── admin_notes
```

## 📱 Tipos de Formularios Soportados

### 1. 💳 Formulario de Crédito
- **Ruta:** `/form/credito-efo`
- **Campos:** Información empresarial completa
- **Archivos:** Estados financieros, documentos legales

### 2. 📞 Formulario de Contacto (Futuro)
- **Ruta:** `/form/contacto`
- **Campos:** Datos básicos de contacto

### 3. 🛠️ Formulario de Soporte (Futuro)
- **Ruta:** `/form/soporte`
- **Campos:** Información técnica

## 🎯 Dashboard - Funcionalidades

### Filtros Avanzados
- ✅ **Por tipo**: Todos, Crédito, Contacto, Soporte
- ✅ **Por búsqueda**: Nombre, email, empresa
- ✅ **Por estado**: Nuevo, Pendiente, Completado

### Gestión de Formularios
- 👁️ **Vista detallada** de cada formulario
- 📥 **Descarga de archivos** adjuntos
- 🔄 **Actualización de estados**
- 📊 **Estadísticas en tiempo real**

## 🔧 Desarrollo Local

```bash
# Clonar repositorio
git clone [repository-url]
cd formulario-credito

# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📋 Estructura del Proyecto

```
formulario-credito/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── FormularioCredito.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/           # Context API
│   │   └── AuthContext.jsx
│   └── App.jsx            # App principal
├── backend/               # Backend API
│   └── formulario-efo-handler.php
├── dist/                  # Build de producción
└── package.json
```

## 🚨 Troubleshooting

### Formularios no se envían:
1. ✅ Verificar que el backend esté configurado correctamente
2. ✅ Comprobar permisos de archivos
3. ✅ Revisar logs del servidor web

### Dashboard vacío:
1. ✅ Verificar que el backend esté funcionando
2. ✅ Comprobar la conexión a la base de datos
3. ✅ Revisar la consola del navegador (F12)

### Archivos no suben:
1. ✅ Verificar permisos del directorio de uploads
2. ✅ Aumentar límites del servidor si es necesario
3. ✅ Comprobar tipos de archivo permitidos

## 📞 Soporte Técnico

Para problemas técnicos:

1. **Revisar consola del navegador** (F12) para errores JavaScript
2. **Verificar logs del servidor** para errores del backend
3. **Comprobar configuración de la base de datos**
4. **Verificar permisos de archivos** en el servidor

## 🔄 Próximas Actualizaciones

### Versión 1.1 (Próximamente)
- [ ] **Múltiples formularios**: Contacto y Soporte
- [ ] **Exportación PDF**: Reportes automatizados  
- [ ] **Notificaciones push**: Alertas en tiempo real
- [ ] **Métricas avanzadas**: Gráficos y análisis
- [ ] **Roles de usuario**: Diferentes niveles de acceso

### Versión 1.2 (Futuro)
- [ ] **API REST**: Integración con sistemas externos
- [ ] **Validación avanzada**: Reglas de negocio complejas
- [ ] **Workflow**: Estados automáticos de formularios
- [ ] **Integración CRM**: Conexión con sistemas de ventas

---

## 📄 Licencia

© 2025 ELECTROL FIBRA ÓPTICA SAS. Todos los derechos reservados.

**Sistema desarrollado específicamente para EFO** - No redistribuir sin autorización.


Login: http://localhost:5174/admin/login
Dashboard: http://localhost:5174/admin/dashboard
Super Admin Panel: http://localhost:5174/admin/super-admin
Formularios públicos: http://localhost:5174/


Colores del sistema
Principal
#006068

Secundario
#54595F

Texto
#FFFFFF (si el fondo es oscuro)
#006068 (si el fondo es claro)

Énfasis
#F8FA00

Colores personalizados
Detalles y bordes
#87F7EE

fondo
#E9FFFE
