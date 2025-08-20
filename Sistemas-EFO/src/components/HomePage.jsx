import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoEFO from '../assets/images/Logoefo.png';
import { 
  FileText, 
  Cable, 
  Users, 
  Settings, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Globe
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-container">
          <div className="logo-section">
            <img src={logoEFO} alt="EFO Logo" className="home-logo" />
            <div className="company-info">
              <h1>ELECTROL FIBRA ÓPTICA SAS</h1>
              <p>Soluciones integrales en fibra óptica y telecomunicaciones</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate('/admin/login')}
              className="admin-access-btn"
            >
              <Settings size={18} />
              Acceso Admin
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h2>Sistemas EFO</h2>
            <p>Plataforma integral de gestión empresarial y cotizaciones</p>
            
            <div className="system-stats">
              <div className="stat-card">
                <Users size={24} />
                <div className="stat-info">
                  <span className="stat-number">4</span>
                  <span className="stat-label">Usuarios</span>
                </div>
              </div>
              <div className="stat-card">
                <Globe size={24} />
                <div className="stat-info">
                  <span className="stat-number">1.0.0</span>
                  <span className="stat-label">Versión</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-container">
          <h3>Subsistemas Disponibles</h3>
          <div className="services-grid">
            
            {/* Formulario de Crédito */}
            <div className="service-card">
              <div className="service-icon">
                <FileText size={48} />
              </div>
              <div className="service-content">
                <h4>Subsistema de Crédito</h4>
                <p>Módulo especializado para gestión de solicitudes de crédito empresarial y personal</p>
                <ul>
                  <li>Proceso 100% digital</li>
                  <li>Evaluación rápida</li>
                  <li>Documentación segura</li>
                </ul>
                <button 
                  onClick={() => navigate('/form/credito-efo')}
                  className="service-btn primary"
                >
                  Acceder
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Configurador de Patch Cords */}
            <div className="service-card">
              <div className="service-icon">
                <Cable size={48} />
              </div>
              <div className="service-content">
                <h4>Subsistema de Patch Cords</h4>
                <p>Módulo especializado para configuración y cotización de patch cords de fibra óptica</p>
                <ul>
                  <li>Configuración personalizada</li>
                  <li>Cálculo automático de precios</li>
                  <li>Generación de cotizaciones</li>
                </ul>
                <button 
                  onClick={() => navigate('/patch-cords')}
                  className="service-btn secondary"
                >
                  Configurar
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          <h3>Información de Contacto</h3>
          <div className="contact-grid">
            <div className="contact-item">
              <Phone size={20} />
              <span>+57 (1) 234-5678</span>
            </div>
            <div className="contact-item">
              <Mail size={20} />
              <span>info@electrolfibraoptica.com</span>
            </div>
            <div className="contact-item">
              <MapPin size={20} />
              <span>Bogotá, Colombia</span>
            </div>
            <div className="contact-item">
              <Globe size={20} />
              <span>www.electrolfibraoptica.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-container">
          <p>&copy; 2025 ELECTROL FIBRA ÓPTICA SAS. Todos los derechos reservados.</p>
          <p>Sistemas EFO - Plataforma integral de gestión empresarial desarrollada para optimizar procesos.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
