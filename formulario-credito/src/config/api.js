// Configuración de API para desarrollo y producción en AWS
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001',
    API_ENDPOINTS: {
      SUBMIT_FORM: 'http://localhost:3001/api/forms/submit',
      GET_SUBMISSIONS: 'http://localhost:3001/api/forms/submissions',
      UPDATE_SUBMISSION: 'http://localhost:3001/api/forms/update',
      DELETE_SUBMISSION: 'http://localhost:3001/api/forms/delete',
      AUTH_LOGIN: 'http://localhost:3001/api/auth/login',
      AUTH_PROFILE: 'http://localhost:3001/api/auth/profile'
    }
  },
  production: {
    API_BASE_URL: 'https://api.formularios-efo.com', // Tu dominio en AWS
    API_ENDPOINTS: {
      SUBMIT_FORM: 'https://api.formularios-efo.com/api/forms/submit',
      GET_SUBMISSIONS: 'https://api.formularios-efo.com/api/forms/submissions',
      UPDATE_SUBMISSION: 'https://api.formularios-efo.com/api/forms/update',
      DELETE_SUBMISSION: 'https://api.formularios-efo.com/api/forms/delete',
      AUTH_LOGIN: 'https://api.formularios-efo.com/api/auth/login',
      AUTH_PROFILE: 'https://api.formularios-efo.com/api/auth/profile'
    }
  }
};

const environment = import.meta.env.MODE || 'development';
const currentConfig = config[environment];

export const API_ENDPOINTS = {
  SUBMIT_FORM: currentConfig.API_ENDPOINTS.SUBMIT_FORM,
  GET_SUBMISSIONS: currentConfig.API_ENDPOINTS.GET_SUBMISSIONS,
  UPDATE_SUBMISSION: currentConfig.API_ENDPOINTS.UPDATE_SUBMISSION,
  DELETE_SUBMISSION: currentConfig.API_ENDPOINTS.DELETE_SUBMISSION,
  AUTH_LOGIN: currentConfig.API_ENDPOINTS.AUTH_LOGIN,
  AUTH_PROFILE: currentConfig.API_ENDPOINTS.AUTH_PROFILE
};

export const isDevelopment = environment === 'development';
export const API_BASE_URL = currentConfig.API_BASE_URL;

export default currentConfig;
