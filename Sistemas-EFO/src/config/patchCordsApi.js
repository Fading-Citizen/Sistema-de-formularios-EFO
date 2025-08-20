// Configuración de API para Patch Cords EFO
const API_BASE_URL = 'http://localhost:3001/api';

class PatchCordsAPI {
  // Obtener todos los precios
  static async getPrices() {
    try {
      const response = await fetch(`${API_BASE_URL}/patch-cords/prices`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo precios:', error);
      return { success: false, error: error.message };
    }
  }

  // Actualizar precios
  static async updatePrice(category, itemKey, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/patch-cords/prices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, itemKey, updates })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error actualizando precio:', error);
      return { success: false, error: error.message };
    }
  }

  // Agregar nuevo item
  static async addItem(category, itemKey, itemData) {
    try {
      const response = await fetch(`${API_BASE_URL}/patch-cords/prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, itemKey, itemData })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error agregando item:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar item
  static async deleteItem(category, itemKey) {
    try {
      const response = await fetch(`${API_BASE_URL}/patch-cords/prices/${category}/${itemKey}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error eliminando item:', error);
      return { success: false, error: error.message };
    }
  }

  // Generar cotización
  static async generateQuote(quotationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/patch-cords/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generando cotización:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener cotizaciones
  static async getQuotes(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/patch-cords/quotes${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo cotizaciones:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener cotización específica
  static async getQuote(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/patch-cords/quote/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo cotización:', error);
      return { success: false, error: error.message };
    }
  }

  // Descargar PDF de cotización
  static async downloadQuotePDF(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/patch-cords/quote/${id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return { success: true };
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error descargando PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener estadísticas
  static async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/patch-cords/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { success: false, error: error.message };
    }
  }
}

export default PatchCordsAPI;
