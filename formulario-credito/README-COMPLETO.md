# 📋 Formularios EFO - Sistema Completo

Sistema completo de gestión de formularios para **ELECTROL FIBRA ÓPTICA SAS** con React + WordPress.

## ✨ Características

- 📝 **Formularios múltiples**: Crédito, contacto, soporte
- 📊 **Dashboard administrativo** con filtros avanzados
- 🔐 **Sistema de autenticación** para administradores
- 💾 **Base de datos integrada** con WordPress
- 📧 **Envío automático de emails** con archivos adjuntos
- 🎨 **Diseño responsive** moderno
- ⚡ **Tiempo real** - ve los formularios al instante

## 🚀 Instalación Completa

### Paso 1: Instalar la App React

1. **Copiar archivos al servidor:**
   ```bash
   # Copiar toda la carpeta a ReactPress
   cp -r formulario-credito/ /wp-content/reactpress/apps/
   ```

2. **Instalar dependencias y compilar:**
   ```bash
   cd /wp-content/reactpress/apps/formulario-credito
   npm install
   npm run build
   ```

### Paso 2: 🔧 Configurar Backend WordPress

**IMPORTANTE**: Agregar este código completo al `functions.php` de tu tema:

```php
<?php
// Copiar todo el contenido del archivo: backend/formulario-efo-handler.php
// Y pegarlo en functions.php de tu tema activo

// O incluir el archivo directamente:
require_once get_template_directory() . '/formulario-efo-handler.php';
?>
```

### Paso 3: 📧 Configurar Emails

**Cambiar estos emails en el código PHP:**

```php
$additional_emails = array(
    'creditos@electrolfibra.com',        // ✏️ CAMBIAR POR EMAIL REAL
    'administracion@electrolfibra.com',  // ✏️ CAMBIAR POR EMAIL REAL
    'formularios@electrolfibra.com'      // ✏️ CAMBIAR POR EMAIL REAL
);
```

### Paso 4: 🎛️ Configurar ReactPress

1. En WordPress Admin: `ReactPress` → `Reload`
2. Click `Add Page` junto a "formulario-credito"
3. Asignar URL: `/formularios-efo`
4. Guardar

## 🔐 Acceso Administrativo

### Credenciales por defecto:
- **Usuario:** `admin`
- **Contraseña:** `efo2025`

### URLs importantes:
- **📝 Formularios públicos:** `tudominio.com/formularios-efo`
- **🔑 Login admin:** `tudominio.com/formularios-efo/admin/login`
- **📊 Dashboard:** `tudominio.com/formularios-efo/admin/dashboard`

## 🗄️ Base de Datos

El sistema crea automáticamente la tabla:
```sql
wp_efo_form_submissions
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
├── backend/               # Backend PHP
│   └── formulario-efo-handler.php
├── dist/                  # Build de producción
└── package.json
```

## 🚨 Troubleshooting

### Formularios no se envían:
1. ✅ Verificar que el archivo PHP esté en `functions.php`
2. ✅ Comprobar permisos de archivos
3. ✅ Revisar logs de WordPress: `/wp-content/debug.log`

### Dashboard vacío:
1. ✅ Verificar que el backend esté configurado
2. ✅ Comprobar la conexión AJAX
3. ✅ Revisar la consola del navegador (F12)

### Archivos no suben:
1. ✅ Verificar permisos de `/wp-content/uploads/`
2. ✅ Aumentar límites PHP si es necesario
3. ✅ Comprobar tipos de archivo permitidos

## 📞 Soporte Técnico

Para problemas técnicos:

1. **Revisar consola del navegador** (F12) para errores JavaScript
2. **Verificar logs de WordPress** en `/wp-content/debug.log`
3. **Comprobar configuración ReactPress** en WordPress admin
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
