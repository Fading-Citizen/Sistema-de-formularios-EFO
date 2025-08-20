# Sistemas EFO - Plataforma Integrada

Esta es una plataforma de gestión de sistemas para ELECTROL FIBRA ÓPTICA SAS, desarrollada con React + Vite.

## 🌟 Subsistemas Incluidos

### 📋 Subsistema de Crédito
- Formulario de solicitud de crédito completo
- Validación de datos en tiempo real
- Envío automático de documentos

### 🔌 Subsistema de Patch Cords
- Configurador de patch cords personalizados
- Cotizador automático de precios
- Panel administrativo para gestión de productos

## Instalación

### Paso 1: Preparar la aplicación

1. **En tu servidor/comando:**
   ```bash
   cd /opt/bitnami/wordpress/wp-content/reactpress/apps
   # Copia toda la carpeta 'Sistemas-EFO' aquí
   ```

2. **Instalar dependencias:**
   ```bash
   cd Sistemas-EFO
   npm install
   ```

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

### Paso 2: Subir a producción

1. **Subir solo la carpeta `dist`** a tu servidor:
   ```
   /wp-content/reactpress/sistemas-efo/dist/
   ```

2. **En WordPress admin:**
   - Ve a ReactPress
   - Hacer reload/refresh de la página
   - Crear nueva página para el formulario

### Paso 3: Configurar el backend

Agregar al `functions.php` de tu tema:

```php
<?php
// Manejador del formulario de crédito para WordPress
add_action('wp_ajax_submit_credito_form', 'handle_credito_form_submission');
add_action('wp_ajax_nopriv_submit_credito_form', 'handle_credito_form_submission');

function handle_credito_form_submission() {
    // Sanitizar todos los datos recibidos
    $data = array();
    $excluded_keys = array('action', 'nonce');
    
    foreach ($_POST as $key => $value) {
        if (!in_array($key, $excluded_keys)) {
            if (is_array($value)) {
                $data[$key] = array_map('sanitize_text_field', $value);
            } else {
                $data[$key] = sanitize_text_field($value);
            }
        }
    }

    // Procesar archivos adjuntos
    $attachments = array();
    if (!empty($_FILES)) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        
        foreach ($_FILES as $key => $file) {
            if ($file['error'] === UPLOAD_ERR_OK) {
                $upload_overrides = array('test_form' => false);
                $upload = wp_handle_upload($file, $upload_overrides);
                
                if ($upload && !isset($upload['error'])) {
                    $attachments[$key] = array(
                        'url' => $upload['url'],
                        'file' => $upload['file'],
                        'type' => $upload['type']
                    );
                }
            }
        }
    }

    // Configurar emails
    $admin_email = get_option('admin_email');
    $to = array($admin_email);
    
    // CAMBIAR ESTOS EMAILS POR LOS REALES
    $additional_emails = array(
        'creditos@electrolfibra.com',
        'administracion@electrolfibra.com'
    );
    $to = array_merge($to, $additional_emails);

    $subject = 'Nueva Solicitud de Crédito - ELECTROL FIBRA ÓPTICA SAS';
    
    // Crear contenido del email
    $message = create_email_content($data, $attachments);
    
    // Headers para email HTML
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . get_bloginfo('name') . ' <' . $admin_email . '>',
    );

    // Preparar archivos adjuntos
    $wp_attachments = array();
    foreach ($attachments as $key => $attachment) {
        $wp_attachments[] = $attachment['file'];
    }

    // Enviar email
    $sent = wp_mail($to, $subject, $message, $headers, $wp_attachments);
    
    // Guardar en base de datos (opcional)
    save_form_submission($data, $attachments);
    
    if ($sent) {
        wp_send_json_success(array(
            'message' => 'Formulario enviado exitosamente. Nos contactaremos pronto.'
        ));
    } else {
        wp_send_json_error(array(
            'message' => 'Error al enviar el formulario. Intente nuevamente.'
        ));
    }
}

function create_email_content($data, $attachments) {
    $content = '
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #0b5fff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 25px; }
            .section-title { background: #f0f4ff; padding: 10px; font-weight: bold; margin-bottom: 10px; }
            .field { margin-bottom: 8px; }
            .field-label { font-weight: bold; color: #555; }
            .attachments { background: #f9f9f9; padding: 15px; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Nueva Solicitud de Crédito</h1>
            <p>ELECTROL FIBRA ÓPTICA SAS</p>
        </div>
        
        <div class="content">
            <p><strong>Fecha de solicitud:</strong> ' . date('d/m/Y H:i:s') . '</p>
    ';

    // Información básica
    if (!empty($data['producto_tipo'])) {
        $content .= '
        <div class="section">
            <div class="section-title">PRODUCTO O SERVICIO SOLICITADO</div>
            <div class="field"><span class="field-label">Tipo:</span> ' . esc_html($data['producto_tipo']) . '</div>
        </div>';
    }

    // Información del tercero
    $content .= '
    <div class="section">
        <div class="section-title">INFORMACIÓN DEL TERCERO</div>
        <div class="field"><span class="field-label">Tipo:</span> ' . esc_html($data['tercero_tipo'] ?? '') . '</div>
        <div class="field"><span class="field-label">Identificación:</span> ' . esc_html($data['identificacion_tipo'] ?? '') . ' ' . esc_html($data['identificacion_num'] ?? '') . '</div>
        <div class="field"><span class="field-label">Razón Social:</span> ' . esc_html($data['razon_social'] ?? '') . '</div>
    </div>';

    // Contacto
    $content .= '
    <div class="section">
        <div class="section-title">CONTACTO</div>
        <div class="field"><span class="field-label">Email:</span> ' . esc_html($data['email_comercial'] ?? '') . '</div>
        <div class="field"><span class="field-label">Teléfono:</span> ' . esc_html($data['telefono_comercial'] ?? '') . '</div>
        <div class="field"><span class="field-label">Celular:</span> ' . esc_html($data['celular_comercial'] ?? '') . '</div>';
    
    if (!empty($data['asesor'])) {
        $content .= '<div class="field"><span class="field-label">Asesor:</span> ' . esc_html($data['asesor']) . '</div>';
    }
    $content .= '</div>';

    // Archivos adjuntos
    if (!empty($attachments)) {
        $content .= '
        <div class="attachments">
            <div class="section-title">DOCUMENTOS ADJUNTOS</div>';
        
        foreach ($attachments as $key => $attachment) {
            $file_name = basename($attachment['url']);
            $content .= '<div class="field">• ' . ucfirst(str_replace('_', ' ', $key)) . ': <a href="' . esc_url($attachment['url']) . '">' . esc_html($file_name) . '</a></div>';
        }
        $content .= '</div>';
    }

    $content .= '
        </div>
    </body>
    </html>';

    return $content;
}

function save_form_submission($data, $attachments) {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'credito_submissions';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id int(11) NOT NULL AUTO_INCREMENT,
        submission_date datetime DEFAULT CURRENT_TIMESTAMP,
        form_data longtext NOT NULL,
        attachments longtext,
        ip_address varchar(45),
        status varchar(20) DEFAULT 'pending',
        PRIMARY KEY (id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    $wpdb->insert(
        $table_name,
        array(
            'form_data' => json_encode($data),
            'attachments' => json_encode($attachments),
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? ''
        ),
        array('%s', '%s', '%s')
    );
}

// Permitir subida de PDFs
function allow_pdf_uploads($mimes) {
    $mimes['pdf'] = 'application/pdf';
    return $mimes;
}
add_filter('upload_mimes', 'allow_pdf_uploads');
?>
```

## Desarrollo

### Para desarrollar localmente:

```bash
cd formulario-credito
npm install
npm run dev
```

Esto iniciará el servidor de desarrollo en `http://localhost:5173`

### Para compilar:

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Estructura del proyecto

```
formulario-credito/
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── components/
│       ├── FormularioCredito.jsx
│       └── FormularioCredito.css
└── dist/ (después de npm run build)
    ├── index.html
    └── assets/
        ├── index-[hash].js
        └── index-[hash].css
```

## Características

- ✅ **Formulario completo** con todos los campos
- ✅ **Validación en tiempo real**
- ✅ **Subida de archivos** (PDFs, imágenes)
- ✅ **Envío por email** con formato HTML
- ✅ **Responsive design**
- ✅ **Integración WordPress** vía AJAX
- ✅ **Base de datos** para respaldo

## Configuración de emails

**IMPORTANTE:** Cambiar estos emails en `functions.php`:

```php
$additional_emails = array(
    'creditos@tudominio.com',      // Email del departamento
    'administracion@tudominio.com', // Email administración
);
```

## Troubleshooting

### La app no aparece en ReactPress:
- Verificar que la carpeta `dist` esté en la ubicación correcta
- Recargar la página de ReactPress en WordPress admin

### Formulario no envía:
- Verificar que el código PHP esté en `functions.php`
- Comprobar errores en el log de WordPress
- Instalar plugin SMTP para emails

### Archivos no suben:
- Verificar permisos de carpeta `uploads`
- Aumentar límites PHP si es necesario

## Soporte

Para problemas, revisar:
1. Consola del navegador (F12)
2. Logs de WordPress
3. Configuración de ReactPress
4. Permisos de archivos
