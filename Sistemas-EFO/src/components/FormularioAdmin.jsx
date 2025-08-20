import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import logoEFO from '../assets/images/Logoefo.png';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  TrendingUp, 
  LogOut, 
  Calendar,
  Mail,
  Phone,
  User,
  Download,
  Search,
  Archive,
  ArchiveRestore,
  Trash2,
  Home,
  Paperclip,
  ExternalLink,
  FileIcon,
  Shield,
  Settings,
  Crown,
  Cable
} from 'lucide-react';
import './FormularioAdmin.css';

const FormularioAdmin = () => {
  const navigate = useNavigate();
  const { 
    user, 
    logout, 
    canEdit, 
    canDelete, 
    canArchive, 
    canExport,
    canAccessForm,
    canManageUsers,
    getUserRoleLabel,
    FORM_TYPES 
  } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    pending: 0,
    completed: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filterType, setFilterType] = useState('all'); // Nuevo filtro por tipo
  const [currentView, setCurrentView] = useState('active'); // 'active' o 'archived'
  const [archivedSubmissions, setArchivedSubmissions] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(''); // Para el dropdown

  // Función para obtener datos del backend
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // Reducir límite para carga más rápida inicial
      const url = `${API_ENDPOINTS.GET_SUBMISSIONS}&limit=20&form_type=${filterType !== 'all' ? filterType : ''}`;
      
      // Agregar timeout para evitar cuelgues
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const realSubmissions = result.data.submissions.map(sub => ({
            id: sub.id,
            nombre: sub.nombre,
            email: sub.email,
            telefono: sub.telefono,
            tipoCredito: sub.form_data.producto_tipo || 'N/A',
            tipoFormulario: sub.tipo === 'credito' ? 'Crédito' : 'General',
            montoSolicitado: sub.form_data.valor_activos || 'N/A',
            fecha: new Date(sub.fecha).toLocaleDateString(),
            estado: sub.estado.charAt(0).toUpperCase() + sub.estado.slice(1),
            empresa: sub.empresa,
            ingresos: sub.form_data.ingresos_operacionales || 'N/A',
            rawData: sub
          }));
          
          setSubmissions(realSubmissions);
          setStats({
            total: result.data.total,
            thisMonth: realSubmissions.length,
            pending: realSubmissions.filter(s => s.estado === 'Nuevo' || s.estado === 'Pendiente').length,
            completed: realSubmissions.filter(s => s.estado === 'Completado').length
          });
          setLoading(false);
          return;
        }
      }
      
      // Fallback a datos mock si no hay backend disponible
      useMockData();
      
    } catch (error) {
      console.error('Error fetching submissions:', error);
      useMockData();
    }
  };

  const useMockData = () => {
    const allMockSubmissions = [
      {
        id: 1,
        // Campos básicos para mostrar en tabla
        nombre: 'Tech Solutions Colombia SAS',
        email: 'gerencia@techsolutions.co',
        telefono: '3012345678',
        fecha: '2025-01-15',
        estado: 'Nuevo',
        tipoFormulario: 'Crédito',
        formType: FORM_TYPES.CREDIT,
        // Campos del formulario real
        producto_tipo: 'Crédito Empresarial',
        tercero_tipo: 'persona_juridica',
        identificacion_tipo: 'NIT',
        identificacion_num: '900123456',
        razon_social: 'Tech Solutions Colombia SAS',
        rep_ident_tipo: 'CC',
        rep_ident_num: '1234567890',
        rep_nombres: 'Juan Carlos Pérez Mendoza',
        direccion_oficina: 'Carrera 15 #85-32 Oficina 501',
        departamento_oficina: 'Cundinamarca',
        ciudad_oficina: 'Bogotá',
        telefono_oficina: '6012345678',
        direccion_sucursal: 'Calle 72 #10-15',
        departamento_sucursal: 'Cundinamarca',
        ciudad_sucursal: 'Bogotá',
        telefono_sucursal: '6019876543',
        email_rep: 'jcperez@techsolutions.co',
        ciudad_rep: 'Bogotá',
        departamento_rep: 'Cundinamarca',
        telefono_rep: '6012345678',
        celular_rep: '3012345678',
        sector: 'Tecnología',
        tipo_actividad: 'Desarrollo de Software',
        desc_actividad: 'Desarrollo de aplicaciones web y móviles para empresas',
        tipo_empresa: 'Privada',
        valor_activos: '850000000',
        valor_pasivos: '350000000',
        ingresos_operacionales: '1200000000',
        ingresos_noop: '50000000',
        detalle_noop: 'Inversiones financieras',
        // Contacto comercial
        nombre_comercial: 'Juan Carlos',
        apellido_comercial: 'Pérez Mendoza',
        telefono_comercial: '6012345678',
        celular_comercial: '3012345678',
        email_comercial: 'comercial@techsolutions.co',
        // Referencias bancarias
        entidad_banco: 'Banco de Bogotá',
        cuenta_banco: '123456789',
        sucursal_banco: 'Centro Internacional',
        ref_nombre: 'María González - Gerente Comercial',
        ref_telefono: '3019876543',
        autorizo_tratamiento: true,
        documentos: [
          { nombre: 'certificado_existencia.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'rut_empresa.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'cedula_representante.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'estados_financieros.xlsx', url: '#', tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
          { nombre: 'certificado_ingresos.pdf', url: '#', tipo: 'application/pdf' }
        ]
      },
      {
        id: 2,
        nombre: 'María Fernanda González López',
        email: 'mfgonzalez@gmail.com',
        telefono: '3198765432',
        fecha: '2025-01-14',
        estado: 'Pendiente',
        tipoFormulario: 'Crédito',
        formType: FORM_TYPES.CREDIT,
        producto_tipo: 'Crédito Personal',
        tercero_tipo: 'persona_natural',
        identificacion_tipo: 'CC',
        identificacion_num: '1098765432',
        razon_social: 'María Fernanda González López',
        rep_ident_tipo: 'CC',
        rep_ident_num: '1098765432',
        rep_nombres: 'María Fernanda González López',
        direccion_oficina: 'Carrera 70 #45-18 Apto 302',
        departamento_oficina: 'Antioquia',
        ciudad_oficina: 'Medellín',
        telefono_oficina: '6043456789',
        email_rep: 'mfgonzalez@gmail.com',
        ciudad_rep: 'Medellín',
        departamento_rep: 'Antioquia',
        telefono_rep: '6043456789',
        celular_rep: '3198765432',
        sector: 'Consultoría',
        tipo_actividad: 'Consultoría Empresarial',
        desc_actividad: 'Asesoría en gestión empresarial y procesos organizacionales',
        tipo_empresa: 'Independiente',
        valor_activos: '180000000',
        valor_pasivos: '80000000',
        ingresos_operacionales: '85000000',
        nombre_comercial: 'María Fernanda',
        apellido_comercial: 'González López',
        telefono_comercial: '6043456789',
        celular_comercial: '3198765432',
        email_comercial: 'mfgonzalez@gmail.com',
        entidad_banco: 'Bancolombia',
        cuenta_banco: '987654321',
        sucursal_banco: 'El Poblado',
        ref_nombre: 'Carlos Rodríguez - Contador',
        ref_telefono: '3177654321',
        autorizo_tratamiento: true,
        documentos: [
          { nombre: 'cedula_frente.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'cedula_reverso.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'certificado_ingresos.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'referencias_comerciales.pdf', url: '#', tipo: 'application/pdf' }
        ]
      },
      {
        id: 3,
        nombre: 'Industrias Manufactureras del Caribe SA',
        email: 'creditos@industriascaribe.co',
        telefono: '3055551234',
        fecha: '2025-01-13',
        estado: 'En proceso',
        tipoFormulario: 'Crédito',
        formType: FORM_TYPES.CREDIT,
        producto_tipo: 'Crédito de Capital de Trabajo',
        tercero_tipo: 'persona_juridica',
        identificacion_tipo: 'NIT',
        identificacion_num: '800456789',
        razon_social: 'Industrias Manufactureras del Caribe SA',
        rep_ident_tipo: 'CC',
        rep_ident_num: '1234509876',
        rep_nombres: 'Carlos Alberto Rodríguez Herrera',
        direccion_oficina: 'Zona Industrial Mamonal, Carrera 56 #28-15',
        departamento_oficina: 'Bolívar',
        ciudad_oficina: 'Cartagena',
        telefono_oficina: '6056781234',
        direccion_sucursal: 'Centro Histórico, Calle San Juan #4-62',
        departamento_sucursal: 'Bolívar',
        ciudad_sucursal: 'Cartagena',
        telefono_sucursal: '6055432109',
        email_rep: 'carlos.rodriguez@industriascaribe.co',
        ciudad_rep: 'Cartagena',
        departamento_rep: 'Bolívar',
        telefono_rep: '6056781234',
        celular_rep: '3055551234',
        sector: 'Industrial',
        tipo_actividad: 'Manufactura',
        desc_actividad: 'Producción de materiales para construcción y acabados industriales',
        tipo_empresa: 'Privada',
        valor_activos: '2500000000',
        valor_pasivos: '1200000000',
        ingresos_operacionales: '1800000000',
        ingresos_noop: '150000000',
        detalle_noop: 'Arrendamientos de maquinaria',
        nombre_comercial: 'Carlos Alberto',
        apellido_comercial: 'Rodríguez Herrera',
        telefono_comercial: '6056781234',
        celular_comercial: '3055551234',
        email_comercial: 'comercial@industriascaribe.co',
        entidad_banco: 'Banco Popular',
        cuenta_banco: '555666777',
        sucursal_banco: 'Bocagrande',
        ref_nombre: 'Ana López - Gerente Financiera',
        ref_telefono: '3154567890',
        autorizo_tratamiento: true,
        documentos: [
          { nombre: 'certificado_existencia.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'rut_empresa.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'cedula_representante.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'estados_financieros.xlsx', url: '#', tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
          { nombre: 'referencias_comerciales.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'flujo_caja.xlsx', url: '#', tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        ]
      },
      {
        id: 4,
        nombre: 'Ana Lucía López Vargas',
        email: 'analu.lopez@gmail.com',
        telefono: '3174567890',
        fecha: '2025-01-12',
        estado: 'Completado',
        tipoFormulario: 'Crédito',
        formType: FORM_TYPES.CREDIT,
        producto_tipo: 'Crédito Vehículo',
        tercero_tipo: 'persona_natural',
        identificacion_tipo: 'CC',
        identificacion_num: '1055667788',
        razon_social: 'Ana Lucía López Vargas',
        rep_ident_tipo: 'CC',
        rep_ident_num: '1055667788',
        rep_nombres: 'Ana Lucía López Vargas',
        direccion_oficina: 'Avenida 6N #23-45 Apto 801',
        departamento_oficina: 'Valle del Cauca',
        ciudad_oficina: 'Cali',
        telefono_oficina: '6023456789',
        email_rep: 'analu.lopez@gmail.com',
        ciudad_rep: 'Cali',
        departamento_rep: 'Valle del Cauca',
        telefono_rep: '6023456789',
        celular_rep: '3174567890',
        sector: 'Servicios',
        tipo_actividad: 'Servicios Profesionales',
        desc_actividad: 'Arquitectura y diseño interior',
        tipo_empresa: 'Independiente',
        valor_activos: '120000000',
        valor_pasivos: '40000000',
        ingresos_operacionales: '65000000',
        nombre_comercial: 'Ana Lucía',
        apellido_comercial: 'López Vargas',
        telefono_comercial: '6023456789',
        celular_comercial: '3174567890',
        email_comercial: 'analu.lopez@gmail.com',
        veh_marca: 'Toyota',
        veh_modelo: 'Corolla Cross 2024',
        veh_placa: 'ABC123',
        entidad_banco: 'Banco de Occidente',
        cuenta_banco: '777888999',
        sucursal_banco: 'Unicentro',
        ref_nombre: 'Roberto Silva - Ingeniero Civil',
        ref_telefono: '3166543210',
        autorizo_tratamiento: true,
        documentos: [
          { nombre: 'cedula_frente.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'cedula_reverso.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'certificado_ingresos.pdf', url: '#', tipo: 'application/pdf' },
          { nombre: 'referencias_personales.pdf', url: '#', tipo: 'application/pdf' }
        ]
      },
      {
        id: 5,
        nombre: 'Contacto General - Empresa XYZ',
        email: 'info@empresa-xyz.com',
        telefono: '3201234567',
        fecha: '2025-01-16',
        estado: 'Pendiente',
        tipoFormulario: 'General',
        formType: FORM_TYPES.GENERAL,
        razon_social: 'Empresa XYZ S.A.S.',
        sector: 'Comercio',
        mensaje: 'Consulta sobre servicios de fibra óptica para nuestra sede principal',
        documentos: []
      },
      {
        id: 6,
        nombre: 'Solicitud de Contacto - Ana Martínez',
        email: 'ana.martinez@email.com',
        telefono: '3187654321',
        fecha: '2025-01-17',
        estado: 'Nuevo',
        tipoFormulario: 'Contacto',
        formType: FORM_TYPES.CONTACT,
        razon_social: 'Ana Martínez',
        sector: 'Personal',
        mensaje: 'Información sobre planes residenciales de internet',
        documentos: []
      }
    ];

    // Filtrar formularios según permisos del usuario
    const allowedSubmissions = allMockSubmissions.filter(submission => 
      canAccessForm(submission.formType)
    );

    // Actualizar estado inmediatamente sin retraso artificial
    setSubmissions(allowedSubmissions);
    setStats({
      total: allowedSubmissions.length,
      thisMonth: allowedSubmissions.length,
      pending: allowedSubmissions.filter(s => s.estado === 'Pendiente').length,
      completed: allowedSubmissions.filter(s => s.estado === 'Completado').length
    });
    setLoading(false);
  };

  // Cargar datos al montar el componente y cuando cambia el filtro
  useEffect(() => {
    fetchSubmissions();
  }, [filterType]);

  // Funciones de archivado
  const archiveSubmission = (submissionId) => {
    const submissionToArchive = submissions.find(sub => sub.id === submissionId);
    if (submissionToArchive) {
      setArchivedSubmissions(prev => [...prev, submissionToArchive]);
      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    }
  };

  const restoreSubmission = (submissionId) => {
    const submissionToRestore = archivedSubmissions.find(sub => sub.id === submissionId);
    if (submissionToRestore) {
      setSubmissions(prev => [...prev, submissionToRestore]);
      setArchivedSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    }
  };

  const deleteSubmission = (submissionId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar permanentemente este formulario?')) {
      setArchivedSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    }
  };

  // Función para actualizar el estado de un formulario
  const updateSubmissionStatus = async (submissionId) => {
    if (!newStatus) {
      alert('Por favor selecciona un nuevo estado');
      return;
    }
    
    setIsUpdatingStatus(true);
    
    try {
      // Actualizar en la lista activa
      setSubmissions(prev => prev.map(sub => 
        sub.id === submissionId ? { ...sub, estado: newStatus } : sub
      ));
      
      // Actualizar el modal también
      if (selectedSubmission && selectedSubmission.id === submissionId) {
        setSelectedSubmission({ ...selectedSubmission, estado: newStatus });
      }
      
      // Aquí podrías hacer la llamada al backend para persistir el cambio
      // await updateStatusInBackend(submissionId, newStatus);
      
      alert('Estado actualizado correctamente');
      setNewStatus(''); // Limpiar el dropdown
    } catch (error) {
      alert('Error al actualizar el estado');
    }
    
    setIsUpdatingStatus(false);
  };

  // Función para generar PDF con información del formulario
  const generateFormPDF = (submission) => {
    // Crear contenido del PDF como HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Solicitud de Crédito - ${submission.nombre}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px;
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #006068; 
              padding-bottom: 20px; 
              margin-bottom: 30px;
            }
            .header h1 { 
              color: #006068; 
              margin: 0;
              font-size: 24px;
            }
            .header p { 
              color: #54595F; 
              margin: 5px 0 0 0;
            }
            .section { 
              margin-bottom: 25px; 
              padding: 15px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
            }
            .section h3 { 
              color: #006068; 
              margin-top: 0;
              border-bottom: 1px solid #87F7EE;
              padding-bottom: 5px;
            }
            .field { 
              margin: 8px 0;
              display: flex;
            }
            .field strong { 
              width: 250px; 
              color: #54595F;
            }
            .documents { 
              background: #f8f9fa; 
              padding: 10px; 
              border-radius: 5px;
            }
            .document-item { 
              margin: 5px 0; 
              padding: 5px;
              background: white;
              border-radius: 3px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>EFO - ENTIDAD FINANCIERA OBJETIVA</h1>
            <p>Solicitud de Crédito #${submission.id}</p>
            <p>Fecha: ${submission.fecha}</p>
          </div>
          
          <div class="section">
            <h3>Información Básica</h3>
            <div class="field"><strong>Tipo de Producto:</strong> ${submission.producto_tipo || 'N/A'}</div>
            <div class="field"><strong>Tipo de Tercero:</strong> ${submission.tercero_tipo === 'persona_juridica' ? 'Persona Jurídica' : 'Persona Natural'}</div>
            <div class="field"><strong>Estado:</strong> ${submission.estado}</div>
          </div>
          
          <div class="section">
            <h3>Identificación ${submission.tercero_tipo === 'persona_juridica' ? 'de la Empresa' : 'Personal'}</h3>
            <div class="field"><strong>Tipo de Identificación:</strong> ${submission.identificacion_tipo}</div>
            <div class="field"><strong>Número de Identificación:</strong> ${submission.identificacion_num}</div>
            <div class="field"><strong>${submission.tercero_tipo === 'persona_juridica' ? 'Razón Social' : 'Nombres'}:</strong> ${submission.razon_social}</div>
          </div>
          
          ${submission.tercero_tipo === 'persona_juridica' ? `
          <div class="section">
            <h3>Representante Legal</h3>
            <div class="field"><strong>Tipo de Identificación:</strong> ${submission.rep_ident_tipo}</div>
            <div class="field"><strong>Número de Identificación:</strong> ${submission.rep_ident_num}</div>
            <div class="field"><strong>Nombres:</strong> ${submission.rep_nombres}</div>
            <div class="field"><strong>Email:</strong> ${submission.email_rep}</div>
            <div class="field"><strong>Teléfono:</strong> ${submission.telefono_rep}</div>
            <div class="field"><strong>Celular:</strong> ${submission.celular_rep}</div>
            <div class="field"><strong>Ciudad:</strong> ${submission.ciudad_rep}</div>
            <div class="field"><strong>Departamento:</strong> ${submission.departamento_rep}</div>
          </div>
          ` : ''}
          
          <div class="section">
            <h3>Ubicación ${submission.tercero_tipo === 'persona_juridica' ? 'Oficina Principal' : 'Residencia'}</h3>
            <div class="field"><strong>Dirección:</strong> ${submission.direccion_oficina}</div>
            <div class="field"><strong>Ciudad:</strong> ${submission.ciudad_oficina}</div>
            <div class="field"><strong>Departamento:</strong> ${submission.departamento_oficina}</div>
            <div class="field"><strong>Teléfono:</strong> ${submission.telefono_oficina}</div>
          </div>
          
          ${submission.direccion_sucursal ? `
          <div class="section">
            <h3>Sucursal</h3>
            <div class="field"><strong>Dirección:</strong> ${submission.direccion_sucursal}</div>
            <div class="field"><strong>Ciudad:</strong> ${submission.ciudad_sucursal}</div>
            <div class="field"><strong>Departamento:</strong> ${submission.departamento_sucursal}</div>
            <div class="field"><strong>Teléfono:</strong> ${submission.telefono_sucursal}</div>
          </div>
          ` : ''}
          
          <div class="section">
            <h3>Información Económica</h3>
            <div class="field"><strong>Sector:</strong> ${submission.sector || 'N/A'}</div>
            <div class="field"><strong>Tipo de Actividad:</strong> ${submission.tipo_actividad || 'N/A'}</div>
            <div class="field"><strong>Descripción de Actividad:</strong> ${submission.desc_actividad || 'N/A'}</div>
            <div class="field"><strong>Tipo de Empresa:</strong> ${submission.tipo_empresa || 'N/A'}</div>
            ${submission.valor_activos ? `<div class="field"><strong>Valor Activos:</strong> $${parseInt(submission.valor_activos).toLocaleString('es-CO')}</div>` : ''}
            ${submission.valor_pasivos ? `<div class="field"><strong>Valor Pasivos:</strong> $${parseInt(submission.valor_pasivos).toLocaleString('es-CO')}</div>` : ''}
            ${submission.ingresos_operacionales ? `<div class="field"><strong>Ingresos Operacionales:</strong> $${parseInt(submission.ingresos_operacionales).toLocaleString('es-CO')}</div>` : ''}
            ${submission.ingresos_noop ? `<div class="field"><strong>Ingresos No Operacionales:</strong> $${parseInt(submission.ingresos_noop).toLocaleString('es-CO')}</div>` : ''}
            ${submission.detalle_noop ? `<div class="field"><strong>Detalle Ingresos No Op:</strong> ${submission.detalle_noop}</div>` : ''}
          </div>
          
          ${submission.veh_marca ? `
          <div class="section">
            <h3>Información del Vehículo</h3>
            <div class="field"><strong>Marca:</strong> ${submission.veh_marca}</div>
            <div class="field"><strong>Modelo:</strong> ${submission.veh_modelo}</div>
            <div class="field"><strong>Placa:</strong> ${submission.veh_placa}</div>
          </div>
          ` : ''}
          
          ${submission.entidad_banco ? `
          <div class="section">
            <h3>Referencias Bancarias</h3>
            <div class="field"><strong>Entidad Bancaria:</strong> ${submission.entidad_banco}</div>
            <div class="field"><strong>Número de Cuenta:</strong> ${submission.cuenta_banco}</div>
            <div class="field"><strong>Sucursal:</strong> ${submission.sucursal_banco}</div>
            ${submission.ref_nombre ? `<div class="field"><strong>Referencia Comercial:</strong> ${submission.ref_nombre}</div>` : ''}
            ${submission.ref_telefono ? `<div class="field"><strong>Teléfono Referencia:</strong> ${submission.ref_telefono}</div>` : ''}
          </div>
          ` : ''}
          
          ${submission.documentos && submission.documentos.length > 0 ? `
          <div class="section">
            <h3>Documentos Adjuntos</h3>
            <div class="documents">
              ${submission.documentos.map(doc => `
                <div class="document-item">📄 ${doc.nombre}</div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 40px; color: #54595F; font-size: 12px;">
            Documento generado el ${new Date().toLocaleDateString('es-CO')} a las ${new Date().toLocaleTimeString('es-CO')}
          </div>
        </body>
      </html>
    `;

    // Crear y descargar el archivo
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Solicitud_Credito_${submission.razon_social.replace(/\s+/g, '_')}_${submission.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('PDF generado para:', submission.razon_social);
  };

  // Función para descargar un documento individual
  const downloadDocument = (doc) => {
    console.log('Descargando documento:', doc.nombre);
    
    // Generar contenido simulado del documento
    let content = '';
    if (doc.tipo === 'application/pdf') {
      content = `Documento PDF simulado: ${doc.nombre}\n\nEste es un archivo de prueba generado por EFO.\nFecha: ${new Date().toLocaleDateString('es-CO')}\nHora: ${new Date().toLocaleTimeString('es-CO')}`;
    } else if (doc.tipo.includes('spreadsheet')) {
      content = `Documento Excel simulado: ${doc.nombre}\n\nEste archivo contendría información financiera en formato de hoja de cálculo.`;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nombre.replace('.pdf', '.txt').replace('.xlsx', '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Función para descargar todos los documentos de una solicitud
  const downloadAllDocuments = (submissionId) => {
    const submission = submissions.find(sub => sub.id === submissionId) || 
                      archivedSubmissions.find(sub => sub.id === submissionId);
    
    if (submission && submission.documentos && submission.documentos.length > 0) {
      console.log('Descargando todos los documentos para:', submission.nombre);
      
      // Generar archivo ZIP simulado con información de todos los documentos
      const zipContent = `PAQUETE DE DOCUMENTOS - ${submission.razon_social || submission.nombre}
Solicitud ID: ${submission.id}
Fecha de descarga: ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}

DOCUMENTOS INCLUIDOS:
${submission.documentos.map((doc, index) => `${index + 1}. ${doc.nombre}`).join('\n')}

========================================
INFORMACIÓN DE LA SOLICITUD:
========================================
${submission.tercero_tipo === 'persona_juridica' ? 'Razón Social' : 'Nombres'}: ${submission.razon_social || submission.nombre}
Email: ${submission.email_rep || submission.email}
Tipo de Producto: ${submission.producto_tipo}
Tipo de Tercero: ${submission.tercero_tipo === 'persona_juridica' ? 'Persona Jurídica' : 'Persona Natural'}
Estado: ${submission.estado}
Ciudad: ${submission.ciudad_oficina || submission.ciudad_rep}

Este archivo simula un paquete ZIP con todos los documentos de la solicitud.
En un entorno de producción, aquí se descargarían los archivos reales.`;

      const blob = new Blob([zipContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Documentos_${(submission.razon_social || submission.nombre).replace(/\s+/g, '_')}_${submission.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`✅ Descargados ${submission.documentos.length} documentos de ${submission.razon_social || submission.nombre}`);
    } else {
      alert('❌ No hay documentos disponibles para descargar');
    }
  };

  const currentSubmissions = currentView === 'active' ? submissions : archivedSubmissions;

  const filteredSubmissions = currentSubmissions.filter(submission => {
    const matchesSearch = submission.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.tipoCredito.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.tipoFormulario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || submission.tipoFormulario.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    logout();
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3>Cargando Dashboard</h3>
          <p>Obteniendo formularios más recientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <img src={logoEFO} alt="EFO Logo" className="logo-dashboard" />
              <div className="header-info">
                <h1>Panel de Control - Sistemas EFO</h1>
                <p>Gestión integral de subsistemas empresariales</p>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => window.open('https://electrolfibraoptica.com/', '_blank')}
              className="home-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Sitio Web
            </button>
            
            {user.role === 'super_admin' && (
              <button 
                className="super-admin-btn"
                onClick={() => navigate('/admin/super-admin')}
                title="Panel Super Admin"
              >
                <Crown size={16} />
                Super Admin
              </button>
            )}
            
            <div className="user-info-extended">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">
                  <Shield size={14} />
                  {getUserRoleLabel(user.role)}
                </span>
                <span className="user-department">{user.department}</span>
              </div>
            </div>
            
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="submissions-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Gestión de Formularios</h2>
              <div className="view-tabs">
                <button 
                  className={`tab-btn ${currentView === 'active' ? 'active' : ''}`}
                  onClick={() => setCurrentView('active')}
                >
                  <FileText size={16} />
                  Activos ({submissions.length})
                </button>
                <button 
                  className={`tab-btn ${currentView === 'archived' ? 'active' : ''}`}
                  onClick={() => setCurrentView('archived')}
                >
                  <Archive size={16} />
                  Archivados ({archivedSubmissions.length})
                </button>
              </div>
            </div>
            <div className="search-controls">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email, tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todos los formularios permitidos</option>
                {canAccessForm(FORM_TYPES.CREDIT) && (
                  <option value="credito">Formularios de Crédito</option>
                )}
                {canAccessForm(FORM_TYPES.GENERAL) && (
                  <option value="general">Formularios Generales</option>
                )}
                {canAccessForm(FORM_TYPES.CONTACT) && (
                  <option value="contacto">Formularios de Contacto</option>
                )}
              </select>
            </div>
          </div>

          <div className="submissions-table">
            <table>
              <thead>
                <tr>
                  <th>Solicitante</th>
                  <th>Contacto</th>
                  <th>Tipo de Formulario</th>
                  <th>Documentos</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>
                      <div className="user-cell">
                        <User size={16} />
                        <span>{submission.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <div><Mail size={14} /> {submission.email}</div>
                        <div><Phone size={14} /> {submission.telefono}</div>
                      </div>
                    </td>
                    <td>
                      <span className="form-type-badge">
                        {submission.tipoFormulario}
                      </span>
                    </td>
                    <td className="documents-cell">
                      {submission.documentos && submission.documentos.length > 0 ? (
                        <div className="document-count">
                          <Paperclip size={14} />
                          <span>{submission.documentos.length}</span>
                        </div>
                      ) : (
                        <span className="no-documents">-</span>
                      )}
                    </td>
                    <td>{submission.fecha}</td>
                    <td>
                      <span className={`status ${submission.estado.toLowerCase()}`}>
                        {submission.estado}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          onClick={() => handleViewDetails(submission)}
                          className="view-btn"
                          title="Ver detalles"
                        >
                          Ver
                        </button>
                        
                        {canExport() && (
                          <button 
                            className="download-btn" 
                            onClick={() => generateFormPDF(submission)}
                            title="Generar PDF de la solicitud"
                            style={{backgroundColor: '#10b981', borderColor: '#059669'}}
                          >
                            <FileText size={14} />
                          </button>
                        )}
                        
                        {canExport() && (
                          <button 
                            className="download-btn" 
                            onClick={() => downloadAllDocuments(submission.id)}
                            title="Descargar todos los documentos"
                          >
                            <Download size={14} />
                          </button>
                        )}
                        
                        {currentView === 'active' ? (
                          canArchive() && (
                            <button 
                              onClick={() => archiveSubmission(submission.id)}
                              className="archive-btn"
                              title="Archivar"
                            >
                              <Archive size={14} />
                            </button>
                          )
                        ) : (
                          <div className="archived-actions">
                            {canEdit() && (
                              <button 
                                onClick={() => restoreSubmission(submission.id)}
                                className="restore-btn"
                                title="Restaurar"
                              >
                                <ArchiveRestore size={14} />
                              </button>
                            )}
                            {canDelete() && (
                              <button 
                                onClick={() => deleteSubmission(submission.id)}
                                className="delete-btn"
                                title="Eliminar permanentemente"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedSubmission && (
          <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Detalles de Solicitud</h3>
                <button onClick={() => setSelectedSubmission(null)} className="close-btn">
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  {/* Información básica */}
                  <div className="detail-item">
                    <label>Tipo de Formulario:</label>
                    <span>{selectedSubmission.tipoFormulario}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nombre/Razón Social:</label>
                    <span>{selectedSubmission.razon_social || selectedSubmission.nombre}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tipo de Identificación:</label>
                    <span>{selectedSubmission.identificacion_tipo || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Número de Identificación:</label>
                    <span>{selectedSubmission.identificacion_num || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedSubmission.email_rep || selectedSubmission.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Teléfono:</label>
                    <span>{selectedSubmission.telefono_rep || selectedSubmission.telefono}</span>
                  </div>
                  <div className="detail-item">
                    <label>Celular:</label>
                    <span>{selectedSubmission.celular_rep || 'N/A'}</span>
                  </div>

                  {/* Información de crédito */}
                  {selectedSubmission.producto_tipo && (
                    <div className="detail-item">
                      <label>Tipo de Producto:</label>
                      <span>{selectedSubmission.producto_tipo}</span>
                    </div>
                  )}
                  
                  {/* Información de dirección */}
                  {selectedSubmission.direccion_oficina && (
                    <>
                      <div className="detail-item">
                        <label>Dirección Oficina:</label>
                        <span>{selectedSubmission.direccion_oficina}</span>
                      </div>
                      <div className="detail-item">
                        <label>Ciudad/Departamento:</label>
                        <span>{selectedSubmission.ciudad_oficina}, {selectedSubmission.departamento_oficina}</span>
                      </div>
                    </>
                  )}

                  {/* Información económica */}
                  {selectedSubmission.valor_activos && (
                    <div className="detail-item">
                      <label>Valor de Activos:</label>
                      <span className="amount">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedSubmission.valor_activos)}</span>
                    </div>
                  )}
                  {selectedSubmission.valor_pasivos && (
                    <div className="detail-item">
                      <label>Valor de Pasivos:</label>
                      <span className="amount">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedSubmission.valor_pasivos)}</span>
                    </div>
                  )}
                  {selectedSubmission.ingresos_operacionales && (
                    <div className="detail-item">
                      <label>Ingresos Operacionales:</label>
                      <span className="amount">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedSubmission.ingresos_operacionales)}</span>
                    </div>
                  )}

                  {/* Información de actividad económica */}
                  {selectedSubmission.sector && (
                    <div className="detail-item">
                      <label>Sector:</label>
                      <span>{selectedSubmission.sector}</span>
                    </div>
                  )}
                  {selectedSubmission.tipo_actividad && (
                    <div className="detail-item">
                      <label>Tipo de Actividad:</label>
                      <span>{selectedSubmission.tipo_actividad}</span>
                    </div>
                  )}
                  {selectedSubmission.desc_actividad && (
                    <div className="detail-item">
                      <label>Descripción de Actividad:</label>
                      <span>{selectedSubmission.desc_actividad}</span>
                    </div>
                  )}

                  {/* Información bancaria */}
                  {selectedSubmission.entidad_banco && (
                    <>
                      <div className="detail-item">
                        <label>Entidad Bancaria:</label>
                        <span>{selectedSubmission.entidad_banco}</span>
                      </div>
                      <div className="detail-item">
                        <label>Número de Cuenta:</label>
                        <span>{selectedSubmission.cuenta_banco}</span>
                      </div>
                      <div className="detail-item">
                        <label>Sucursal:</label>
                        <span>{selectedSubmission.sucursal_banco}</span>
                      </div>
                    </>
                  )}

                  {/* Información del representante legal (si es persona jurídica) */}
                  {selectedSubmission.tercero_tipo === 'persona_juridica' && selectedSubmission.rep_nombres && (
                    <>
                      <div className="detail-item">
                        <label>Representante Legal:</label>
                        <span>{selectedSubmission.rep_nombres}</span>
                      </div>
                      <div className="detail-item">
                        <label>Identificación Rep. Legal:</label>
                        <span>{selectedSubmission.rep_ident_tipo} {selectedSubmission.rep_ident_num}</span>
                      </div>
                    </>
                  )}

                  {/* Referencias */}
                  {selectedSubmission.ref_nombre && (
                    <>
                      <div className="detail-item">
                        <label>Referencia Comercial:</label>
                        <span>{selectedSubmission.ref_nombre}</span>
                      </div>
                      <div className="detail-item">
                        <label>Teléfono Referencia:</label>
                        <span>{selectedSubmission.ref_telefono}</span>
                      </div>
                    </>
                  )}

                  <div className="detail-item">
                    <label>Fecha de Solicitud:</label>
                    <span>{selectedSubmission.fecha}</span>
                  </div>
                  <div className="detail-item">
                    <label>Estado:</label>
                    <span className={`status ${selectedSubmission.estado.toLowerCase()}`}>
                      {selectedSubmission.estado}
                    </span>
                  </div>
                  
                  {/* Selector para cambiar estado - Solo si tiene permisos */}
                  {canEdit() && (
                    <div className="detail-item">
                      <label>Cambiar Estado:</label>
                      <select 
                        value={newStatus} 
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="status-select"
                      >
                        <option value="">Seleccionar nuevo estado</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Completado">Completado</option>
                      </select>
                    </div>
                  )}

                  {/* Documentos Adjuntos */}
                  {selectedSubmission.documentos && selectedSubmission.documentos.length > 0 && (
                    <div className="detail-item documents-section">
                      <label>Documentos Adjuntos:</label>
                      <div className="documents-list">
                        {selectedSubmission.documentos.map((doc, index) => (
                          <div key={index} className="document-item">
                            <div className="document-info">
                              <Paperclip size={16} />
                              <span className="document-name">{doc.nombre}</span>
                            </div>
                            {canExport() && (
                              <button 
                                className="download-document-btn"
                                onClick={() => downloadDocument(doc)}
                                title={`Descargar ${doc.nombre}`}
                              >
                                <Download size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setSelectedSubmission(null)}>
                  Cerrar
                </button>
                {canEdit() && (
                  <button 
                    className="btn-primary"
                    onClick={() => updateSubmissionStatus(selectedSubmission.id)}
                    disabled={isUpdatingStatus || !newStatus}
                  >
                    {isUpdatingStatus ? 'Actualizando...' : 'Actualizar Estado'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sección de Enlaces para Subsistemas - Movida al final */}
      <div className="client-links-section">
        <div className="client-links-container">
          <div className="client-links-header">
            <h3>
              <ExternalLink size={20} />
              Enlaces para Subsistemas
            </h3>
            <p>Comparte estos enlaces con tus clientes para que accedan a los subsistemas</p>
          </div>
          
          <div className="client-links-grid">
            {canAccessForm(FORM_TYPES.CREDIT) && (
              <div className="client-link-card">
                <div className="link-icon">
                  <FileText size={24} />
                </div>
                <div className="link-content">
                  <h4>Subsistema de Crédito</h4>
                  <p>Para solicitudes de crédito empresarial</p>
                  <div className="link-url">
                    <code>http://localhost:5173/</code>
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText('http://localhost:5173/');
                        alert('Enlace copiado al portapapeles');
                      }}
                      title="Copiar enlace"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {(user.role === 'super_admin' || user.role === 'credit_admin') && (
              <div className="client-link-card">
                <div className="link-icon">
                  <Cable size={24} />
                </div>
                <div className="link-content">
                  <h4>Subsistema de Patch Cords</h4>
                  <p>Para cotizar patch cords de fibra óptica</p>
                  <div className="link-url">
                    <code>http://localhost:5173/patch-cords</code>
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText('http://localhost:5173/patch-cords');
                        alert('Enlace copiado al portapapeles');
                      }}
                      title="Copiar enlace"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioAdmin;
