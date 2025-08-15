<?php
/**
 * Backend Handler para Formularios EFO
 * Conecta React con WordPress para procesar y guardar formularios
 */

// Manejador principal del formulario de crédito
add_action('wp_ajax_submit_credito_form', 'handle_credito_form_submission');
add_action('wp_ajax_nopriv_submit_credito_form', 'handle_credito_form_submission');

function handle_credito_form_submission() {
    // Verificar método de solicitud
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        wp_send_json_error(array('message' => 'Método no permitido'));
        return;
    }

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
            if ($file['error'] === UPLOAD_ERR_OK && !empty($file['tmp_name'])) {
                $upload_overrides = array('test_form' => false);
                $upload = wp_handle_upload($file, $upload_overrides);
                
                if ($upload && !isset($upload['error'])) {
                    $attachments[$key] = array(
                        'url' => $upload['url'],
                        'file' => $upload['file'],
                        'type' => $upload['type'],
                        'size' => $file['size']
                    );
                }
            }
        }
    }

    // Configurar emails de destino
    $admin_email = get_option('admin_email');
    $to = array($admin_email);
    
    // CAMBIAR ESTOS EMAILS POR LOS REALES DE EFO
    $additional_emails = array(
        'creditos@electrolfibra.com',
        'administracion@electrolfibra.com',
        'formularios@electrolfibra.com'
    );
    $to = array_merge($to, $additional_emails);

    $subject = 'Nueva Solicitud de Formulario - ELECTROL FIBRA ÓPTICA SAS';
    
    // Crear contenido del email
    $message = create_email_content($data, $attachments);
    
    // Headers para email HTML
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . get_bloginfo('name') . ' <' . $admin_email . '>',
    );

    // Preparar archivos adjuntos para email
    $wp_attachments = array();
    foreach ($attachments as $attachment) {
        if (isset($attachment['file']) && file_exists($attachment['file'])) {
            $wp_attachments[] = $attachment['file'];
        }
    }

    // Enviar email
    $sent = wp_mail($to, $subject, $message, $headers, $wp_attachments);
    
    // Guardar en base de datos
    $saved = save_form_submission($data, $attachments);
    
    if ($sent && $saved) {
        wp_send_json_success(array(
            'message' => 'Formulario enviado exitosamente. Nos contactaremos pronto.',
            'submission_id' => $saved
        ));
    } else {
        wp_send_json_error(array(
            'message' => 'Error al procesar el formulario. Intente nuevamente.',
            'debug' => array(
                'email_sent' => $sent,
                'db_saved' => $saved
            )
        ));
    }
}

function create_email_content($data, $attachments) {
    $content = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .email-container { max-width: 800px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0 0 0; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .section { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .section:last-child { border-bottom: none; }
            .section-title { background: #f8fafc; padding: 12px 16px; font-weight: bold; margin-bottom: 15px; border-left: 4px solid #667eea; }
            .field { margin-bottom: 10px; display: flex; }
            .field-label { font-weight: bold; color: #555; min-width: 200px; }
            .field-value { color: #333; flex: 1; }
            .attachments { background: #f9f9f9; padding: 20px; border-radius: 8px; }
            .attachment-item { margin-bottom: 8px; }
            .attachment-item a { color: #667eea; text-decoration: none; }
            .attachment-item a:hover { text-decoration: underline; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Nueva Solicitud de Formulario</h1>
                <p>ELECTROL FIBRA ÓPTICA SAS</p>
                <p>Fecha: ' . date('d/m/Y H:i:s') . '</p>
            </div>
            
            <div class="content">';

    // Determinar tipo de formulario
    $form_type = 'Formulario General';
    if (!empty($data['producto_tipo']) || !empty($data['tercero_tipo'])) {
        $form_type = 'Formulario de Crédito';
    }
    
    $content .= '<div class="section">
        <div class="section-title">TIPO DE FORMULARIO</div>
        <div class="field">
            <div class="field-label">Tipo:</div>
            <div class="field-value">' . esc_html($form_type) . '</div>
        </div>
    </div>';

    // Información básica del formulario de crédito
    if (!empty($data['producto_tipo'])) {
        $content .= '
        <div class="section">
            <div class="section-title">PRODUCTO O SERVICIO SOLICITADO</div>
            <div class="field"><div class="field-label">Tipo:</div><div class="field-value">' . esc_html($data['producto_tipo']) . '</div></div>
        </div>';
    }

    // Información del tercero
    if (!empty($data['tercero_tipo'])) {
        $content .= '
        <div class="section">
            <div class="section-title">INFORMACIÓN DEL TERCERO</div>
            <div class="field"><div class="field-label">Tipo:</div><div class="field-value">' . esc_html($data['tercero_tipo'] ?? '') . '</div></div>
            <div class="field"><div class="field-label">Identificación:</div><div class="field-value">' . esc_html($data['identificacion_tipo'] ?? '') . ' ' . esc_html($data['identificacion_num'] ?? '') . '</div></div>
            <div class="field"><div class="field-label">Razón Social:</div><div class="field-value">' . esc_html($data['razon_social'] ?? '') . '</div></div>';
        
        if (!empty($data['rep_nombres'])) {
            $content .= '<div class="field"><div class="field-label">Representante Legal:</div><div class="field-value">' . esc_html($data['rep_nombres']) . '</div></div>';
        }
        $content .= '</div>';
    }

    // Información de contacto
    $content .= '
    <div class="section">
        <div class="section-title">INFORMACIÓN DE CONTACTO</div>';
    
    if (!empty($data['email_comercial'])) {
        $content .= '<div class="field"><div class="field-label">Email Comercial:</div><div class="field-value">' . esc_html($data['email_comercial']) . '</div></div>';
    }
    if (!empty($data['telefono_comercial'])) {
        $content .= '<div class="field"><div class="field-label">Teléfono:</div><div class="field-value">' . esc_html($data['telefono_comercial']) . '</div></div>';
    }
    if (!empty($data['celular_comercial'])) {
        $content .= '<div class="field"><div class="field-label">Celular:</div><div class="field-value">' . esc_html($data['celular_comercial']) . '</div></div>';
    }
    if (!empty($data['nombre_comercial']) && !empty($data['apellido_comercial'])) {
        $content .= '<div class="field"><div class="field-label">Nombre Completo:</div><div class="field-value">' . esc_html($data['nombre_comercial'] . ' ' . $data['apellido_comercial']) . '</div></div>';
    }
    if (!empty($data['asesor'])) {
        $content .= '<div class="field"><div class="field-label">Asesor:</div><div class="field-value">' . esc_html($data['asesor']) . '</div></div>';
    }
    $content .= '</div>';

    // Información financiera (si existe)
    if (!empty($data['valor_activos']) || !empty($data['ingresos_operacionales'])) {
        $content .= '
        <div class="section">
            <div class="section-title">INFORMACIÓN FINANCIERA</div>';
        
        if (!empty($data['valor_activos'])) {
            $content .= '<div class="field"><div class="field-label">Valor Activos:</div><div class="field-value">' . esc_html($data['valor_activos']) . '</div></div>';
        }
        if (!empty($data['ingresos_operacionales'])) {
            $content .= '<div class="field"><div class="field-label">Ingresos Operacionales:</div><div class="field-value">' . esc_html($data['ingresos_operacionales']) . '</div></div>';
        }
        
        $content .= '</div>';
    }

    // Archivos adjuntos
    if (!empty($attachments)) {
        $content .= '
        <div class="section">
            <div class="section-title">DOCUMENTOS ADJUNTOS</div>
            <div class="attachments">';
        
        foreach ($attachments as $key => $attachment) {
            $file_name = basename($attachment['url']);
            $file_size = isset($attachment['size']) ? ' (' . size_format($attachment['size']) . ')' : '';
            $content .= '<div class="attachment-item">• <strong>' . ucfirst(str_replace('_', ' ', $key)) . ':</strong> <a href="' . esc_url($attachment['url']) . '">' . esc_html($file_name) . '</a>' . $file_size . '</div>';
        }
        $content .= '</div></div>';
    }

    $content .= '
            </div>
            <div class="footer">
                <p><strong>ELECTROL FIBRA ÓPTICA SAS</strong></p>
                <p>Este formulario fue enviado desde el sitio web corporativo.</p>
                <p>Para consultas, contacte al administrador del sistema.</p>
            </div>
        </div>
    </body>
    </html>';

    return $content;
}

function save_form_submission($data, $attachments) {
    global $wpdb;
    
    // Crear tabla si no existe
    $table_name = $wpdb->prefix . 'efo_form_submissions';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id int(11) NOT NULL AUTO_INCREMENT,
        submission_date datetime DEFAULT CURRENT_TIMESTAMP,
        form_type varchar(50) DEFAULT 'credito',
        form_data longtext NOT NULL,
        attachments longtext,
        ip_address varchar(45),
        user_agent varchar(500),
        status varchar(20) DEFAULT 'nuevo',
        admin_notes text,
        processed_date datetime NULL,
        PRIMARY KEY (id),
        KEY submission_date (submission_date),
        KEY form_type (form_type),
        KEY status (status)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    // Determinar tipo de formulario
    $form_type = 'general';
    if (!empty($data['producto_tipo']) || !empty($data['tercero_tipo'])) {
        $form_type = 'credito';
    }
    
    // Insertar datos
    $result = $wpdb->insert(
        $table_name,
        array(
            'form_type' => $form_type,
            'form_data' => json_encode($data, JSON_UNESCAPED_UNICODE),
            'attachments' => json_encode($attachments, JSON_UNESCAPED_UNICODE),
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
        ),
        array('%s', '%s', '%s', '%s', '%s')
    );
    
    if ($result === false) {
        error_log('Error al guardar formulario en BD: ' . $wpdb->last_error);
        return false;
    }
    
    return $wpdb->insert_id;
}

// API para obtener formularios (para el dashboard)
add_action('wp_ajax_get_form_submissions', 'get_form_submissions');
add_action('wp_ajax_nopriv_get_form_submissions', 'get_form_submissions');

function get_form_submissions() {
    global $wpdb;
    
    // Verificar permisos (opcional: solo admins)
    // if (!current_user_can('manage_options')) {
    //     wp_send_json_error(array('message' => 'Permisos insuficientes'));
    //     return;
    // }
    
    $table_name = $wpdb->prefix . 'efo_form_submissions';
    
    // Parámetros de consulta
    $limit = intval($_GET['limit'] ?? 50);
    $offset = intval($_GET['offset'] ?? 0);
    $form_type = sanitize_text_field($_GET['form_type'] ?? '');
    $status = sanitize_text_field($_GET['status'] ?? '');
    
    // Construir WHERE clause
    $where_conditions = array();
    $where_values = array();
    
    if (!empty($form_type)) {
        $where_conditions[] = "form_type = %s";
        $where_values[] = $form_type;
    }
    
    if (!empty($status)) {
        $where_conditions[] = "status = %s";
        $where_values[] = $status;
    }
    
    $where_clause = '';
    if (!empty($where_conditions)) {
        $where_clause = 'WHERE ' . implode(' AND ', $where_conditions);
    }
    
    // Consulta principal
    $sql = "SELECT * FROM $table_name $where_clause ORDER BY submission_date DESC LIMIT %d OFFSET %d";
    $where_values[] = $limit;
    $where_values[] = $offset;
    
    $submissions = $wpdb->get_results($wpdb->prepare($sql, $where_values));
    
    // Contar total
    $count_sql = "SELECT COUNT(*) FROM $table_name $where_clause";
    $total_count = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name $where_clause", array_slice($where_values, 0, -2)));
    
    // Procesar resultados
    $processed_submissions = array();
    foreach ($submissions as $submission) {
        $form_data = json_decode($submission->form_data, true);
        $attachments = json_decode($submission->attachments, true);
        
        $processed_submissions[] = array(
            'id' => $submission->id,
            'fecha' => $submission->submission_date,
            'tipo' => $submission->form_type,
            'estado' => $submission->status,
            'nombre' => $form_data['nombre_comercial'] ?? $form_data['razon_social'] ?? 'Sin nombre',
            'email' => $form_data['email_comercial'] ?? $form_data['email_rep'] ?? '',
            'telefono' => $form_data['telefono_comercial'] ?? $form_data['celular_comercial'] ?? '',
            'empresa' => $form_data['razon_social'] ?? '',
            'form_data' => $form_data,
            'attachments' => $attachments,
            'ip' => $submission->ip_address
        );
    }
    
    wp_send_json_success(array(
        'submissions' => $processed_submissions,
        'total' => $total_count,
        'limit' => $limit,
        'offset' => $offset
    ));
}

// Permitir subida de archivos PDF y otros documentos
function allow_document_uploads($mimes) {
    $mimes['pdf'] = 'application/pdf';
    $mimes['doc'] = 'application/msword';
    $mimes['docx'] = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    $mimes['xls'] = 'application/excel';
    $mimes['xlsx'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return $mimes;
}
add_filter('upload_mimes', 'allow_document_uploads');

// Aumentar límite de subida
function increase_upload_limit() {
    if (!ini_get('file_uploads')) {
        return;
    }
    
    $max_size = '32M';
    
    if (ini_get('upload_max_filesize') !== $max_size) {
        ini_set('upload_max_filesize', $max_size);
    }
    
    if (ini_get('post_max_size') !== $max_size) {
        ini_set('post_max_size', $max_size);
    }
}
add_action('init', 'increase_upload_limit');

?>
