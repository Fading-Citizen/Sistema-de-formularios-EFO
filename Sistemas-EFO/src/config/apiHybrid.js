// Configuración híbrida: API tradicional + Supabase
import { supabase } from './supabase.js';

const config = {
  development: {
    API_BASE_URL: 'http://localhost:3002',
    USE_SUPABASE: false, // Cambiar a true para usar Supabase en desarrollo
    API_ENDPOINTS: {
      SUBMIT_FORM: 'http://localhost:3002/api/forms/submit',
      GET_SUBMISSIONS: 'http://localhost:3002/api/forms/submissions',
      UPDATE_SUBMISSION: 'http://localhost:3002/api/forms/update',
      DELETE_SUBMISSION: 'http://localhost:3002/api/forms/delete',
      AUTH_LOGIN: 'http://localhost:3002/api/auth/login',
      AUTH_PROFILE: 'http://localhost:3002/api/auth/profile'
    }
  },
  production: {
    API_BASE_URL: '', // No necesario con Supabase
    USE_SUPABASE: true, // Usar Supabase en producción
    API_ENDPOINTS: {
      // Los endpoints se manejan directamente con Supabase
    }
  }
};

const environment = import.meta.env.MODE || 'development';
const currentConfig = config[environment];

// API Wrapper que decide si usar Supabase o API tradicional
export const api = {
  // Formularios
  async submitForm(formData) {
    if (currentConfig.USE_SUPABASE) {
      const { data, error } = await supabase
        .from('formularios')
        .insert(formData)
        .select();
      
      if (error) throw error;
      return data[0];
    } else {
      const response = await fetch(currentConfig.API_ENDPOINTS.SUBMIT_FORM, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      return response.json();
    }
  },

  async getSubmissions() {
    if (currentConfig.USE_SUPABASE) {
      const { data, error } = await supabase
        .from('formularios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } else {
      const response = await fetch(currentConfig.API_ENDPOINTS.GET_SUBMISSIONS);
      return response.json();
    }
  },

  async updateSubmission(id, updates) {
    if (currentConfig.USE_SUPABASE) {
      const { data, error } = await supabase
        .from('formularios')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } else {
      const response = await fetch(currentConfig.API_ENDPOINTS.UPDATE_SUBMISSION, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      return response.json();
    }
  },

  async deleteSubmission(id) {
    if (currentConfig.USE_SUPABASE) {
      const { error } = await supabase
        .from('formularios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } else {
      const response = await fetch(currentConfig.API_ENDPOINTS.DELETE_SUBMISSION, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return response.json();
    }
  },

  // Cotizaciones
  async saveCotizacion(cotizacionData) {
    if (currentConfig.USE_SUPABASE) {
      const { data, error } = await supabase
        .from('cotizaciones')
        .insert(cotizacionData)
        .select();
      
      if (error) throw error;
      return data[0];
    } else {
      // Fallback a API local o mock
      return cotizacionData;
    }
  },

  async getCotizaciones() {
    if (currentConfig.USE_SUPABASE) {
      const { data, error } = await supabase
        .from('cotizaciones')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } else {
      return [];
    }
  },

  // Productos (Patch Cords)
  async getProductos() {
    if (currentConfig.USE_SUPABASE) {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('disponible', true)
        .order('categoria', { ascending: true });
      
      if (error) throw error;
      return data;
    } else {
      // Usar datos mock locales
      const response = await fetch('/mock-data/productos.json');
      return response.json();
    }
  },

  // Equipos OTDR
  async getEquiposOTDR() {
    if (currentConfig.USE_SUPABASE) {
      const { data, error } = await supabase
        .from('equipos_otdr')
        .select('*')
        .eq('disponible', true)
        .order('marca', { ascending: true });
      
      if (error) throw error;
      return data;
    } else {
      // Usar datos mock locales
      const response = await fetch('/mock-data/equipos-otdr.json');
      return response.json();
    }
  },

  // Autenticación
  async login(email, password) {
    if (currentConfig.USE_SUPABASE) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } else {
      const response = await fetch(currentConfig.API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return response.json();
    }
  },

  async logout() {
    if (currentConfig.USE_SUPABASE) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    // En API tradicional no hay logout específico
  },

  async getCurrentUser() {
    if (currentConfig.USE_SUPABASE) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } else {
      const response = await fetch(currentConfig.API_ENDPOINTS.AUTH_PROFILE);
      return response.json();
    }
  }
};

// Mantener compatibilidad con código existente
export const API_ENDPOINTS = currentConfig.API_ENDPOINTS;
export const isDevelopment = environment === 'development';
export const API_BASE_URL = currentConfig.API_BASE_URL;
export const USE_SUPABASE = currentConfig.USE_SUPABASE;

export default currentConfig;
