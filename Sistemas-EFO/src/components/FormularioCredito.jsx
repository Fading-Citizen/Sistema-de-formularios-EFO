import React, { useState } from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import logoEFO from '../assets/images/Logoefo.png';
import './FormularioCredito.css';

const FormularioCredito = () => {
  const [formData, setFormData] = useState({
    producto_tipo: '',
    tercero_tipo: 'persona_juridica',
    identificacion_tipo: 'NIT',
    identificacion_num: '',
    razon_social: '',
    rep_ident_tipo: 'CC',
    rep_ident_num: '',
    rep_nombres: '',
    direccion_oficina: '',
    departamento_oficina: '',
    ciudad_oficina: '',
    telefono_oficina: '',
    direccion_sucursal: '',
    departamento_sucursal: '',
    ciudad_sucursal: '',
    telefono_sucursal: '',
    email_rep: '',
    ciudad_rep: '',
    departamento_rep: '',
    telefono_rep: '',
    celular_rep: '',
    sector: '',
    tipo_actividad: '',
    desc_actividad: '',
    tipo_empresa: 'Privada',
    valor_activos: '',
    valor_pasivos: '',
    ingresos_operacionales: '',
    ingresos_noop: '',
    detalle_noop: '',
    // Accionistas
    acc1_tipo_ident: 'NIT',
    acc1_num: '',
    acc1_razon: '',
    acc1_rep_tipo: 'NIT',
    acc1_rep_num: '',
    acc1_rep_name: '',
    acc2_tipo_ident: 'NIT',
    acc2_num: '',
    acc2_razon: '',
    acc2_rep_tipo: 'NIT',
    acc2_rep_num: '',
    acc2_rep_name: '',
    acc3_tipo_ident: 'NIT',
    acc3_num: '',
    acc3_razon: '',
    acc3_rep_tipo: 'NIT',
    acc3_rep_num: '',
    acc3_rep_name: '',
    // Bienes
    inmueble_direccion: '',
    inmueble_ciudad: '',
    matricula: '',
    valor_comercial: '',
    valor_hipoteca: '',
    veh_marca: '',
    veh_modelo: '',
    veh_placa: '',
    prenda_favor: '',
    autorizo_datos: 'no',
    // Contacto
    nombre_comercial: '',
    apellido_comercial: '',
    telefono_comercial: '',
    celular_comercial: '',
    email_comercial: '',
    pago_nombre: '',
    pago_apellido: '',
    pago_telefono: '',
    pago_celular: '',
    pago_email: '',
    // Referencias
    entidad_banco: '',
    cuenta_banco: '',
    sucursal_banco: '',
    ref_nombre: '',
    ref_telefono: '',
    autorizo_tratamiento: false,
    asesor: ''
  });

  const [files, setFiles] = useState({
    cert_existencia: null,
    rut: null,
    cc: null,
    estados: null,
    cert_ingresos: null,
    referencias: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.includes('_num') && value.replace(/[^0-9]/g, '') !== value) {
      // Solo números para campos de identificación
      setFormData(prev => ({
        ...prev,
        [name]: value.replace(/[^0-9]/g, '')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: fileList[0]
    }));
  };

  const validateForm = () => {
    // Solo términos y condiciones obligatorios
    if (!formData.autorizo_tratamiento) {
      setSubmitMessage('Debe autorizar el tratamiento de datos personales');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formDataToSend = new FormData();
      
      // Agregar datos del formulario
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Agregar archivos
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formDataToSend.append(`file_${key}`, files[key]);
        }
      });

      const response = await fetch(API_ENDPOINTS.SUBMIT_FORM, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage('Formulario enviado exitosamente. Nos contactaremos pronto.');
        // Reset form
        setFormData({
          producto_tipo: '',
          tercero_tipo: 'persona_juridica',
          identificacion_tipo: 'NIT',
          identificacion_num: '',
          razon_social: '',
          rep_ident_tipo: 'CC',
          rep_ident_num: '',
          rep_nombres: '',
          direccion_oficina: '',
          departamento_oficina: '',
          ciudad_oficina: '',
          telefono_oficina: '',
          direccion_sucursal: '',
          departamento_sucursal: '',
          ciudad_sucursal: '',
          telefono_sucursal: '',
          email_rep: '',
          ciudad_rep: '',
          departamento_rep: '',
          telefono_rep: '',
          celular_rep: '',
          sector: '',
          tipo_actividad: '',
          desc_actividad: '',
          tipo_empresa: 'Privada',
          valor_activos: '',
          valor_pasivos: '',
          ingresos_operacionales: '',
          ingresos_noop: '',
          detalle_noop: '',
          acc1_tipo_ident: 'NIT',
          acc1_num: '',
          acc1_razon: '',
          acc1_rep_tipo: 'NIT',
          acc1_rep_num: '',
          acc1_rep_name: '',
          acc2_tipo_ident: 'NIT',
          acc2_num: '',
          acc2_razon: '',
          acc2_rep_tipo: 'NIT',
          acc2_rep_num: '',
          acc2_rep_name: '',
          acc3_tipo_ident: 'NIT',
          acc3_num: '',
          acc3_razon: '',
          acc3_rep_tipo: 'NIT',
          acc3_rep_num: '',
          acc3_rep_name: '',
          inmueble_direccion: '',
          inmueble_ciudad: '',
          matricula: '',
          valor_comercial: '',
          valor_hipoteca: '',
          veh_marca: '',
          veh_modelo: '',
          veh_placa: '',
          prenda_favor: '',
          autorizo_datos: 'no',
          nombre_comercial: '',
          apellido_comercial: '',
          telefono_comercial: '',
          celular_comercial: '',
          email_comercial: '',
          pago_nombre: '',
          pago_apellido: '',
          pago_telefono: '',
          pago_celular: '',
          pago_email: '',
          entidad_banco: '',
          cuenta_banco: '',
          sucursal_banco: '',
          ref_nombre: '',
          ref_telefono: '',
          autorizo_tratamiento: false,
          asesor: ''
        });
        setFiles({
          cert_existencia: null,
          rut: null,
          cc: null,
          estados: null,
          cert_ingresos: null,
          referencias: null
        });
      } else {
        setSubmitMessage(result.data?.message || 'Error al enviar el formulario. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('Error de conexión. Verifique su internet e intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="formulario-credito">
      {/* Header EFO Estilizado */}
      <div className="efo-header-compact">
        <div className="header-content-compact">
          <div className="logo-section">
            <img src={logoEFO} alt="EFO Logo" className="logo-img" />
            <div className="company-info">
              <h1>ELECTROL FIBRA ÓPTICA SAS</h1>
              <p>Subsistema de Crédito - Sistemas EFO</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => window.open('https://electrolfibraoptica.com/', '_blank')}
            className="site-web-btn"
          >
            <Home size={14} />
            Sitio Web
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        
        {/* Producto o Servicio */}
        <div className="card">
          <h2>PRODUCTO O SERVICIO SOLICITADO</h2>
          <label htmlFor="producto_tipo">Tipo de producto o servicio *</label>
          <input
            id="producto_tipo"
            name="producto_tipo"
            type="text"
            value={formData.producto_tipo}
            onChange={handleInputChange}
            placeholder="Escriba el tipo de producto o servicio"
          />
        </div>

        {/* Información Tercero */}
        <div className="card">
          <div className="section-title">INFORMACIÓN TERCERO</div>
          
          <label htmlFor="tercero_tipo">Tipo de tercero</label>
          <select
            id="tercero_tipo"
            name="tercero_tipo"
            value={formData.tercero_tipo}
            onChange={handleInputChange}
          >
            <option value="persona_juridica">Persona Jurídica</option>
            <option value="persona_natural">Persona Natural</option>
          </select>

          <div className="row">
            <div className="col">
              <label htmlFor="identificacion_tipo">Tipo de Identificación</label>
              <select
                id="identificacion_tipo"
                name="identificacion_tipo"
                value={formData.identificacion_tipo}
                onChange={handleInputChange}
              >
                <option value="NIT">NIT</option>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
              </select>
            </div>
            <div className="col">
              <label htmlFor="identificacion_num">N° Identificación (Solo números) *</label>
              <input
                id="identificacion_num"
                name="identificacion_num"
                type="text"
                value={formData.identificacion_num}
                onChange={handleInputChange}
                placeholder="1234567890"
              />
            </div>
          </div>

          <label htmlFor="razon_social">Razón Social / Nombres *</label>
          <input
            id="razon_social"
            name="razon_social"
            type="text"
            value={formData.razon_social}
            onChange={handleInputChange}
            placeholder="Razón social o nombres"
          />

          {/* Representante Legal - Siempre requerido */}
          <div className="representante-section">
            <div className="section-title">Representante Legal</div>
            <div className="row">
              <div className="col">
                <label htmlFor="rep_ident_tipo">Tipo de Identificación</label>
                <select
                  id="rep_ident_tipo"
                  name="rep_ident_tipo"
                  value={formData.rep_ident_tipo}
                  onChange={handleInputChange}
                >
                  <option value="CC">CC</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">CE</option>
                </select>
              </div>
              <div className="col">
                <label htmlFor="rep_ident_num">N° Identificación (Solo números)</label>
                <input
                  id="rep_ident_num"
                  name="rep_ident_num"
                  type="text"
                  value={formData.rep_ident_num}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <label htmlFor="rep_nombres">Nombres y apellidos del Representante Legal</label>
            <input
              id="rep_nombres"
              name="rep_nombres"
              type="text"
              value={formData.rep_nombres}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Información de Ubicación - Oficina principal */}
        <div className="card">
          <div className="section-title">INFORMACIÓN UBICACIÓN - Oficina principal</div>
          <label htmlFor="direccion_oficina">Dirección</label>
          <input
            id="direccion_oficina"
            name="direccion_oficina"
            type="text"
            value={formData.direccion_oficina}
            onChange={handleInputChange}
          />

          <div className="row">
            <div className="col">
              <label htmlFor="departamento_oficina">Departamento</label>
              <input
                id="departamento_oficina"
                name="departamento_oficina"
                type="text"
                value={formData.departamento_oficina}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="ciudad_oficina">Ciudad</label>
              <input
                id="ciudad_oficina"
                name="ciudad_oficina"
                type="text"
                value={formData.ciudad_oficina}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <label htmlFor="telefono_oficina">Teléfono</label>
          <input
            id="telefono_oficina"
            name="telefono_oficina"
            type="tel"
            value={formData.telefono_oficina}
            onChange={handleInputChange}
          />

          {/* Dirección Sucursal */}
          <div className="section-title">Dirección Sucursal (si aplica)</div>
          <label htmlFor="direccion_sucursal">Dirección</label>
          <input
            id="direccion_sucursal"
            name="direccion_sucursal"
            type="text"
            value={formData.direccion_sucursal}
            onChange={handleInputChange}
          />

          <div className="row">
            <div className="col">
              <label htmlFor="departamento_sucursal">Departamento</label>
              <input
                id="departamento_sucursal"
                name="departamento_sucursal"
                type="text"
                value={formData.departamento_sucursal}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="ciudad_sucursal">Ciudad</label>
              <input
                id="ciudad_sucursal"
                name="ciudad_sucursal"
                type="text"
                value={formData.ciudad_sucursal}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <label htmlFor="telefono_sucursal">Teléfono</label>
          <input
            id="telefono_sucursal"
            name="telefono_sucursal"
            type="tel"
            value={formData.telefono_sucursal}
            onChange={handleInputChange}
          />

          {/* Información Representante Legal (contacto) */}
          <div className="section-title">Información Representante Legal (contacto)</div>
          <label htmlFor="email_rep">Correo electrónico</label>
          <input
            id="email_rep"
            name="email_rep"
            type="email"
            value={formData.email_rep}
            onChange={handleInputChange}
          />

          <div className="row">
            <div className="col">
              <label htmlFor="ciudad_rep">Ciudad R. Legal</label>
              <input
                id="ciudad_rep"
                name="ciudad_rep"
                type="text"
                value={formData.ciudad_rep}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="departamento_rep">Departamento</label>
              <input
                id="departamento_rep"
                name="departamento_rep"
                type="text"
                value={formData.departamento_rep}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="telefono_rep">Teléfono</label>
              <input
                id="telefono_rep"
                name="telefono_rep"
                type="tel"
                value={formData.telefono_rep}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="celular_rep">Celular</label>
              <input
                id="celular_rep"
                name="celular_rep"
                type="tel"
                value={formData.celular_rep}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Información Actividad Económica */}
        <div className="card">
          <div className="section-title">INFORMACIÓN ACTIVIDAD ECONÓMICA</div>
          <label htmlFor="sector">Sector</label>
          <input
            id="sector"
            name="sector"
            type="text"
            value={formData.sector}
            onChange={handleInputChange}
          />

          <label htmlFor="tipo_actividad">Tipo de actividad</label>
          <input
            id="tipo_actividad"
            name="tipo_actividad"
            type="text"
            value={formData.tipo_actividad}
            onChange={handleInputChange}
          />

          <label htmlFor="desc_actividad">Descripción actividad económica</label>
          <textarea
            id="desc_actividad"
            name="desc_actividad"
            value={formData.desc_actividad}
            onChange={handleInputChange}
          />

          <label>Tipo de empresa</label>
          <div className="row">
            <label className="inline">
              <input
                type="radio"
                name="tipo_empresa"
                value="Privada"
                checked={formData.tipo_empresa === 'Privada'}
                onChange={handleInputChange}
              /> Privada
            </label>
            <label className="inline">
              <input
                type="radio"
                name="tipo_empresa"
                value="Pública"
                checked={formData.tipo_empresa === 'Pública'}
                onChange={handleInputChange}
              /> Pública
            </label>
            <label className="inline">
              <input
                type="radio"
                name="tipo_empresa"
                value="Mixta"
                checked={formData.tipo_empresa === 'Mixta'}
                onChange={handleInputChange}
              /> Mixta
            </label>
          </div>
        </div>

        {/* Información Financiera */}
        <div className="card">
          <div className="section-title">INFORMACIÓN FINANCIERA (último corte)</div>
          <label htmlFor="valor_activos">Valor activos o posesiones</label>
          <input
            id="valor_activos"
            name="valor_activos"
            type="text"
            value={formData.valor_activos}
            onChange={handleInputChange}
          />

          <label htmlFor="valor_pasivos">Valor pasivos o deudas</label>
          <input
            id="valor_pasivos"
            name="valor_pasivos"
            type="text"
            value={formData.valor_pasivos}
            onChange={handleInputChange}
          />

          <label htmlFor="ingresos_operacionales">Ingresos operacionales</label>
          <input
            id="ingresos_operacionales"
            name="ingresos_operacionales"
            type="text"
            value={formData.ingresos_operacionales}
            onChange={handleInputChange}
          />

          <label htmlFor="ingresos_noop">Ingresos no operacionales</label>
          <input
            id="ingresos_noop"
            name="ingresos_noop"
            type="text"
            value={formData.ingresos_noop}
            onChange={handleInputChange}
          />

          <label htmlFor="detalle_noop">Detalle por qué concepto son estos ingresos no operacionales</label>
          <textarea
            id="detalle_noop"
            name="detalle_noop"
            value={formData.detalle_noop}
            onChange={handleInputChange}
          />

          {/* Accionistas */}
          <div style={{marginTop: '12px'}}>
            <label>Identificación de los 3 accionistas o asociados con mayor participación</label>

            {/* Accionista 1 */}
            <div className="card">
              <strong>Accionista 1</strong>
              <div className="row">
                <div className="col">
                  <label htmlFor="acc1_tipo_ident">Tipo de Identificación</label>
                  <select
                    id="acc1_tipo_ident"
                    name="acc1_tipo_ident"
                    value={formData.acc1_tipo_ident}
                    onChange={handleInputChange}
                  >
                    <option value="NIT">NIT</option>
                    <option value="CC">CC</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="acc1_num">N° Identificación</label>
                  <input
                    id="acc1_num"
                    name="acc1_num"
                    type="text"
                    value={formData.acc1_num}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <label htmlFor="acc1_razon">Razón social primer accionista</label>
              <input
                id="acc1_razon"
                name="acc1_razon"
                type="text"
                value={formData.acc1_razon}
                onChange={handleInputChange}
              />

              <div style={{marginTop: '8px'}}>
                <label>Representante legal del primer accionista (si aplica)</label>
                <div className="row">
                  <div className="col">
                    <label htmlFor="acc1_rep_tipo">Tipo de identificación</label>
                    <select
                      id="acc1_rep_tipo"
                      name="acc1_rep_tipo"
                      value={formData.acc1_rep_tipo}
                      onChange={handleInputChange}
                    >
                      <option value="NIT">NIT</option>
                      <option value="CC">CC</option>
                    </select>
                  </div>
                  <div className="col">
                    <label htmlFor="acc1_rep_num">N° Identificación</label>
                    <input
                      id="acc1_rep_num"
                      name="acc1_rep_num"
                      type="text"
                      value={formData.acc1_rep_num}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <label htmlFor="acc1_rep_name">Nombre y apellidos representante legal</label>
                <input
                  id="acc1_rep_name"
                  name="acc1_rep_name"
                  type="text"
                  value={formData.acc1_rep_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Accionista 2 */}
            <div className="card">
              <strong>Accionista 2</strong>
              <div className="row">
                <div className="col">
                  <label htmlFor="acc2_tipo_ident">Tipo de Identificación</label>
                  <select
                    id="acc2_tipo_ident"
                    name="acc2_tipo_ident"
                    value={formData.acc2_tipo_ident}
                    onChange={handleInputChange}
                  >
                    <option value="NIT">NIT</option>
                    <option value="CC">CC</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="acc2_num">N° Identificación</label>
                  <input
                    id="acc2_num"
                    name="acc2_num"
                    type="text"
                    value={formData.acc2_num}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <label htmlFor="acc2_razon">Razón social segundo accionista</label>
              <input
                id="acc2_razon"
                name="acc2_razon"
                type="text"
                value={formData.acc2_razon}
                onChange={handleInputChange}
              />

              <div style={{marginTop: '8px'}}>
                <label>Representante legal del segundo accionista (si aplica)</label>
                <div className="row">
                  <div className="col">
                    <label htmlFor="acc2_rep_tipo">Tipo de identificación</label>
                    <select
                      id="acc2_rep_tipo"
                      name="acc2_rep_tipo"
                      value={formData.acc2_rep_tipo}
                      onChange={handleInputChange}
                    >
                      <option value="NIT">NIT</option>
                      <option value="CC">CC</option>
                    </select>
                  </div>
                  <div className="col">
                    <label htmlFor="acc2_rep_num">N° Identificación</label>
                    <input
                      id="acc2_rep_num"
                      name="acc2_rep_num"
                      type="text"
                      value={formData.acc2_rep_num}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <label htmlFor="acc2_rep_name">Nombre y apellidos representante legal</label>
                <input
                  id="acc2_rep_name"
                  name="acc2_rep_name"
                  type="text"
                  value={formData.acc2_rep_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Accionista 3 */}
            <div className="card">
              <strong>Accionista 3</strong>
              <div className="row">
                <div className="col">
                  <label htmlFor="acc3_tipo_ident">Tipo de Identificación</label>
                  <select
                    id="acc3_tipo_ident"
                    name="acc3_tipo_ident"
                    value={formData.acc3_tipo_ident}
                    onChange={handleInputChange}
                  >
                    <option value="NIT">NIT</option>
                    <option value="CC">CC</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="acc3_num">N° Identificación</label>
                  <input
                    id="acc3_num"
                    name="acc3_num"
                    type="text"
                    value={formData.acc3_num}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <label htmlFor="acc3_razon">Razón social tercer accionista</label>
              <input
                id="acc3_razon"
                name="acc3_razon"
                type="text"
                value={formData.acc3_razon}
                onChange={handleInputChange}
              />

              <div style={{marginTop: '8px'}}>
                <label>Representante legal del tercer accionista (si aplica)</label>
                <div className="row">
                  <div className="col">
                    <label htmlFor="acc3_rep_tipo">Tipo de identificación</label>
                    <select
                      id="acc3_rep_tipo"
                      name="acc3_rep_tipo"
                      value={formData.acc3_rep_tipo}
                      onChange={handleInputChange}
                    >
                      <option value="NIT">NIT</option>
                      <option value="CC">CC</option>
                    </select>
                  </div>
                  <div className="col">
                    <label htmlFor="acc3_rep_num">N° Identificación</label>
                    <input
                      id="acc3_rep_num"
                      name="acc3_rep_num"
                      type="text"
                      value={formData.acc3_rep_num}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <label htmlFor="acc3_rep_name">Nombre y apellidos representante legal</label>
                <input
                  id="acc3_rep_name"
                  name="acc3_rep_name"
                  type="text"
                  value={formData.acc3_rep_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Información de Bienes */}
        <div className="card">
          <div className="section-title">INFORMACIÓN DE BIENES DE SU PROPIEDAD</div>
          <label htmlFor="inmueble_direccion">Dirección del inmueble</label>
          <input
            id="inmueble_direccion"
            name="inmueble_direccion"
            type="text"
            value={formData.inmueble_direccion}
            onChange={handleInputChange}
          />

          <label htmlFor="inmueble_ciudad">Ciudad</label>
          <input
            id="inmueble_ciudad"
            name="inmueble_ciudad"
            type="text"
            value={formData.inmueble_ciudad}
            onChange={handleInputChange}
          />

          <label htmlFor="matricula">No Matricula inmobiliaria</label>
          <input
            id="matricula"
            name="matricula"
            type="text"
            value={formData.matricula}
            onChange={handleInputChange}
          />

          <label htmlFor="valor_comercial">Valor comercial</label>
          <input
            id="valor_comercial"
            name="valor_comercial"
            type="text"
            value={formData.valor_comercial}
            onChange={handleInputChange}
          />

          <label htmlFor="valor_hipoteca">Valor hipoteca</label>
          <input
            id="valor_hipoteca"
            name="valor_hipoteca"
            type="text"
            value={formData.valor_hipoteca}
            onChange={handleInputChange}
          />

          <div style={{marginTop: '10px'}}>
            <label htmlFor="veh_marca">Marca vehículo</label>
            <input
              id="veh_marca"
              name="veh_marca"
              type="text"
              value={formData.veh_marca}
              onChange={handleInputChange}
            />

            <div className="row">
              <div className="col">
                <label htmlFor="veh_modelo">Modelo</label>
                <input
                  id="veh_modelo"
                  name="veh_modelo"
                  type="text"
                  value={formData.veh_modelo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col">
                <label htmlFor="veh_placa">Placa</label>
                <input
                  id="veh_placa"
                  name="veh_placa"
                  type="text"
                  value={formData.veh_placa}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <label htmlFor="prenda_favor">Prenda a favor</label>
            <input
              id="prenda_favor"
              name="prenda_favor"
              type="text"
              value={formData.prenda_favor}
              onChange={handleInputChange}
            />
          </div>

          <label className="muted" style={{marginTop: '12px'}}>
            Declaro que la información reportada en este formulario concuerda con la realidad y es mi responsabilidad la veracidad de la misma. Declaro que los recursos propios o que entrego no provienen de ninguna actividad ilícita. También autorizo el tratamiento de mis datos según la normativa indicada.
          </label>
          <div style={{marginTop: '8px'}}>
            <label className="inline">
              <input
                type="radio"
                name="autorizo_datos"
                value="si"
                checked={formData.autorizo_datos === 'si'}
                onChange={handleInputChange}
              /> SI y autorizo tratamiento de datos
            </label>
            <label className="inline">
              <input
                type="radio"
                name="autorizo_datos"
                value="no"
                checked={formData.autorizo_datos === 'no'}
                onChange={handleInputChange}
              /> No
            </label>
          </div>
        </div>

        {/* Documentos */}
        <div className="card">
          <div className="section-title">DOCUMENTOS A ADJUNTAR</div>
          
          <label>Certificado de existencia y representación (No mayor a 3 meses)</label>
          <input
            name="cert_existencia"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="files"
          />
          
          <label>RUT</label>
          <input
            name="rut"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="files"
          />
          
          <label>CC Representante Legal o persona natural</label>
          <input
            name="cc"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="files"
          />

          <label>Estados Financieros (últimos dos años)</label>
          <input
            name="estados"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="files"
          />

          <label>Certificación de ingresos (expedido por contador)</label>
          <input
            name="cert_ingresos"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="files"
          />

          <label>Referencias comerciales (Mínimo 1)</label>
          <input
            name="referencias"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="files"
          />

          <label htmlFor="asesor">Elige tu asesor comercial</label>
          <input
            id="asesor"
            name="asesor"
            type="text"
            value={formData.asesor}
            onChange={handleInputChange}
            placeholder="Nombre del asesor comercial"
          />
        </div>

        {/* Información de Contacto */}
        <div className="card">
          <div className="section-title">INFORMACIÓN DE CONTACTO</div>
          
          <div className="row">
            <div className="col">
              <label htmlFor="nombre_comercial">Nombre comercial</label>
              <input
                id="nombre_comercial"
                name="nombre_comercial"
                type="text"
                value={formData.nombre_comercial}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="apellido_comercial">Apellidos comercial</label>
              <input
                id="apellido_comercial"
                name="apellido_comercial"
                type="text"
                value={formData.apellido_comercial}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="telefono_comercial">Teléfono comercial</label>
              <input
                id="telefono_comercial"
                name="telefono_comercial"
                type="tel"
                value={formData.telefono_comercial}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="celular_comercial">Celular comercial</label>
              <input
                id="celular_comercial"
                name="celular_comercial"
                type="tel"
                value={formData.celular_comercial}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <label htmlFor="email_comercial">Correo electrónico *</label>
          <input
            id="email_comercial"
            name="email_comercial"
            type="email"
            value={formData.email_comercial}
            onChange={handleInputChange}
          />

          <h3 className="small" style={{marginTop: '10px'}}>Contacto pagos a proveedores</h3>
          
          <label htmlFor="pago_nombre">Nombre para pago a proveedores</label>
          <input
            id="pago_nombre"
            name="pago_nombre"
            type="text"
            value={formData.pago_nombre}
            onChange={handleInputChange}
          />

          <label htmlFor="pago_apellido">Apellidos para pago a proveedores</label>
          <input
            id="pago_apellido"
            name="pago_apellido"
            type="text"
            value={formData.pago_apellido}
            onChange={handleInputChange}
          />

          <label htmlFor="pago_telefono">Teléfono pago a proveedores</label>
          <input
            id="pago_telefono"
            name="pago_telefono"
            type="tel"
            value={formData.pago_telefono}
            onChange={handleInputChange}
          />

          <label htmlFor="pago_celular">Celular pago a proveedores</label>
          <input
            id="pago_celular"
            name="pago_celular"
            type="tel"
            value={formData.pago_celular}
            onChange={handleInputChange}
          />

          <label htmlFor="pago_email">Correo electrónico pago a proveedores</label>
          <input
            id="pago_email"
            name="pago_email"
            type="email"
            value={formData.pago_email}
            onChange={handleInputChange}
          />
        </div>

        {/* Referencias */}
        <div className="card">
          <div className="section-title">REFERENCIAS</div>
          
          <h4 className="small">Bancos o corporaciones</h4>
          <div className="row">
            <div className="col">
              <label htmlFor="entidad_banco">Entidad</label>
              <input
                id="entidad_banco"
                name="entidad_banco"
                type="text"
                value={formData.entidad_banco}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="cuenta_banco">N° Cuenta</label>
              <input
                id="cuenta_banco"
                name="cuenta_banco"
                type="text"
                value={formData.cuenta_banco}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="sucursal_banco">Sucursal</label>
              <input
                id="sucursal_banco"
                name="sucursal_banco"
                type="text"
                value={formData.sucursal_banco}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <h4 className="small">Particulares o comerciales</h4>
          <div className="row">
            <div className="col">
              <label htmlFor="ref_nombre">Nombre</label>
              <input
                id="ref_nombre"
                name="ref_nombre"
                type="text"
                value={formData.ref_nombre}
                onChange={handleInputChange}
              />
            </div>
            <div className="col">
              <label htmlFor="ref_telefono">Teléfono</label>
              <input
                id="ref_telefono"
                name="ref_telefono"
                type="tel"
                value={formData.ref_telefono}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{marginTop: '12px'}}>
            <label className="muted">
              Autorizo a ELECTROL FIBRA ÓPTICA SAS para la recolección y almacenamiento y uso de mis datos personales para los fines relacionados con la solicitud de crédito y servicios ofrecidos por la empresa.
            </label>
            <div style={{marginTop: '8px'}}>
              <label className="inline">
                <input
                  type="checkbox"
                  name="autorizo_tratamiento"
                  checked={formData.autorizo_tratamiento}
                  onChange={handleInputChange}
                  required
                />
                SI y autorizo tratamiento de datos *
              </label>
            </div>
          </div>
        </div>

        {/* Mensaje de estado */}
        {submitMessage && (
          <div className={`message ${submitMessage.includes('exitosamente') ? 'success' : 'error'}`}>
            {submitMessage}
          </div>
        )}

        {/* Botón de envío */}
        <div className="actions">
          <button 
            className="btn" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar formulario'}
          </button>
        </div>

      </form>

      {/* Footer */}
      <div className="footer">
        <div className="container">
          <p>&copy; 2025 ELECTROL FIBRA ÓPTICA SAS. Todos los derechos reservados.</p>
          <p>Para soporte técnico, contacte al administrador del sistema.</p>
        </div>
      </div>
    </div>
  );
};

export default FormularioCredito;
