# Guía Paso a Paso - ReactPress

## 🚀 Implementación del Formulario en ReactPress

### Paso 1: Preparar el proyecto

1. **Copiar la carpeta completa:**
   ```
   Copiar: formulario-credito/
   Destino: /opt/bitnami/wordpress/wp-content/reactpress/apps/
   ```

2. **Instalar dependencias:**
   ```bash
   cd /opt/bitnami/wordpress/wp-content/reactpress/apps/formulario-credito
   npm install
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

### Paso 2: Subir a servidor (si es diferente)

**Solo necesitas subir la carpeta `dist`:**
```
Local: formulario-credito/dist/
Servidor: /wp-content/reactpress/formulario-credito/
```

### Paso 3: Configurar WordPress

**Agregar este código al `functions.php` de tu tema activo:**

```php
<?php
// Manejador del formulario de crédito
add_action('wp_ajax_submit_credito_form', 'handle_credito_form_submission');
add_action('wp_ajax_nopriv_submit_credito_form', 'handle_credito_form_submission');

function handle_credito_form_submission() {
    // Sanitizar datos
    $data = array();
    foreach ($_POST as $key => $value) {
        if ($key !== 'action' && $key !== 'nonce') {
            $data[$key] = sanitize_text_field($value);
        }
    }

    // Procesar archivos
    $attachments = array();
    if (!empty($_FILES)) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        
        foreach ($_FILES as $key => $file) {
            if ($file['error'] === UPLOAD_ERR_OK) {
                $upload = wp_handle_upload($file, array('test_form' => false));
                if ($upload && !isset($upload['error'])) {
                    $attachments[$key] = $upload['url'];
                }
            }
        }
    }

    // ⚠️ CAMBIAR ESTOS EMAILS ⚠️
    $emails = array(
        get_option('admin_email'),
        'creditos@electrolfibra.com',
        'administracion@electrolfibra.com'
    );

    $subject = 'Nueva Solicitud de Crédito';
    $message = "Nueva solicitud recibida:\n\n";
    
    foreach ($data as $key => $value) {
        $message .= ucfirst(str_replace('_', ' ', $key)) . ": " . $value . "\n";
    }
    
    if ($attachments) {
        $message .= "\nArchivos adjuntos:\n";
        foreach ($attachments as $key => $url) {
            $message .= "- " . $key . ": " . $url . "\n";
        }
    }

    $sent = wp_mail($emails, $subject, $message);
    
    if ($sent) {
        wp_send_json_success(array('message' => 'Formulario enviado exitosamente'));
    } else {
        wp_send_json_error(array('message' => 'Error al enviar'));
    }
}

// Permitir PDFs
function allow_pdf_uploads($mimes) {
    $mimes['pdf'] = 'application/pdf';
    return $mimes;
}
add_filter('upload_mimes', 'allow_pdf_uploads');
?>
```

### Paso 4: Configurar ReactPress

1. **En WordPress Admin:**
   - Ve a `ReactPress` en el menú
   - Haz click en "Reload" o actualiza la página
   - Deberías ver "formulario-credito" en la lista

2. **Crear página:**
   - Click en "Add Page" junto a "formulario-credito"
   - Asignar URL (ej: `/solicitud-credito`)
   - Guardar

### Paso 5: Probar

1. **Visitar la página:** `tudominio.com/solicitud-credito`
2. **Llenar el formulario** con datos de prueba
3. **Verificar que llegue el email**
4. **Probar subida de archivos**

---

## 🔧 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Compilar para producción
npm run build

# Ver la aplicación
npm run preview
```

---

## 📁 Estructura final en el servidor

```
/wp-content/reactpress/
└── formulario-credito/
    ├── index.html
    └── assets/
        ├── index-[hash].js
        └── index-[hash].css
```

---

## ⚙️ Configuraciones adicionales

### Aumentar límite de archivos (wp-config.php):
```php
@ini_set('upload_max_size', '32M');
@ini_set('post_max_size', '32M');
```

### Configurar SMTP (recomendado):
- Instalar plugin "WP Mail SMTP"
- Configurar con Gmail, SendGrid, etc.

---

## ✅ Lista de verificación

- [ ] Carpeta copiada a reactpress/apps/
- [ ] npm install ejecutado
- [ ] npm run build ejecutado
- [ ] Código PHP agregado a functions.php
- [ ] Emails configurados correctamente
- [ ] ReactPress actualizado
- [ ] Página creada en ReactPress
- [ ] Formulario probado y funcional
- [ ] Emails llegando correctamente

---

## 🆘 Problemas comunes

**App no aparece en ReactPress:**
- Verificar ubicación de archivos
- Recargar página ReactPress
- Comprobar permisos

**Formulario no envía:**
- Verificar functions.php
- Revisar logs de WordPress
- Comprobar configuración AJAX

**Emails no llegan:**
- Instalar plugin SMTP
- Verificar spam
- Comprobar configuración servidor
