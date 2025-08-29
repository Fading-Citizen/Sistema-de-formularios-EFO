// API Configuration for OTDR Management
const OTDR_API_BASE_URL = 'http://localhost:3001/api/otdr';

// Base de datos de OTDR (simulada)
export const OTDR_DATABASE = [
  {
    id: 1,
    modelo: "OTDR GRANDWAY FHO1500 ULTIMA MILLA",
    modes: ["MONOMODO"],
    rangoDinamico: 7,
    distanciaAprox: "20 km ≈",
    distanciaNum: 20,
    fibraActiva: true,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/06/edf78fa506dea0dd291f70e8fc91f3fc_OTDR_GRANDWAY_FHO1500_51.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho1500/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 2,
    modelo: "OTDR GRANDWAY FHO3000L",
    modes: ["MONOMODO"],
    rangoDinamico: 26,
    distanciaAprox: "80 km ≈",
    distanciaNum: 80,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/02/OTRDFHO3000L-1-1.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho3000l/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 3,
    modelo: "OTDR GRANDWAY FHO5000-D35-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 35,
    distanciaAprox: "110 km ≈",
    distanciaNum: 110,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-d35/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 4,
    modelo: "OTDR GRANDWAY FHO5000-D43-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 43,
    distanciaAprox: "140km ≈",
    distanciaNum: 140,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-d43-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 5,
    modelo: "OTDR GRANDWAY FHO5000-D45-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 45,
    distanciaAprox: "145km ≈",
    distanciaNum: 145,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-d45-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 6,
    modelo: "OTDR GRANDWAY FHO5000-D50-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 50,
    distanciaAprox: "160km ≈",
    distanciaNum: 160,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-d50-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 7,
    modelo: "OTDR GRANDWAY FHO5000-M21-PRO",
    modes: ["MULTIMODO"],
    rangoDinamico: 19,
    distanciaAprox: "60km ≈",
    distanciaNum: 60,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-m21-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 8,
    modelo: "OTDR GRANDWAY FHO5000-MD21-PRO",
    modes: ["MONOMODO", "MULTIMODO"],
    rangoDinamico: 20,
    distanciaAprox: "60km ≈",
    distanciaNum: 60,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-md21-pro",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 9,
    modelo: "OTDR GRANDWAY FHO5000-MD22-PRO",
    modes: ["MONOMODO", "MULTIMODO"],
    rangoDinamico: 21,
    distanciaAprox: "60km ≈",
    distanciaNum: 60,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-md22-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 10,
    modelo: "OTDR GRANDWAY FHO5000-T40-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 40,
    distanciaAprox: "130km ≈",
    distanciaNum: 130,
    fibraActiva: true,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-t40-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 11,
    modelo: "OTDR GRANDWAY FHO5000-T43-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 43,
    distanciaAprox: "140km ≈",
    distanciaNum: 140,
    fibraActiva: true,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-t43-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 12,
    modelo: "OTDR GRANDWAY FHO5000-T45-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 45,
    distanciaAprox: "145km ≈",
    distanciaNum: 145,
    fibraActiva: true,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-t45-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 13,
    modelo: "OTDR GRANDWAY FHO5000-T50-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 50,
    distanciaAprox: "160km ≈",
    distanciaNum: 160,
    fibraActiva: true,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-t50-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 14,
    modelo: "OTDR GRANDWAY FHO5000-TP35-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 35,
    distanciaAprox: "110 km ≈",
    distanciaNum: 110,
    fibraActiva: true,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/04/ELECTROLFHO50001.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho5000-tp35-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 15,
    modelo: "OTDR GRANDWAY FHO-1000-D22",
    modes: ["MONOMODO"],
    rangoDinamico: 22,
    distanciaAprox: "70km ≈",
    distanciaNum: 70,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/06/b78ca74cd4de3314ee2665f3abd747c2_OTDR_GRANDWAY_FHO1000-SP20F_26.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho1000-d22/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 16,
    modelo: "OTDR GRANDWAY FHO-1000-SP20F",
    modes: ["MONOMODO"],
    rangoDinamico: 20,
    distanciaAprox: "60km ≈",
    distanciaNum: 60,
    fibraActiva: true,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/06/b78ca74cd4de3314ee2665f3abd747c2_OTDR_GRANDWAY_FHO1000-SP20F_26.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-fho1000-sp20f/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 17,
    modelo: "OTDR GRANDWAY M-1000D",
    modes: ["MONOMODO"],
    rangoDinamico: 22,
    distanciaAprox: "70km ≈",
    distanciaNum: 70,
    fibraActiva: false,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/02/ELECTROLOTDR-GRANDWAY-M1000D.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-m-1000d/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  },
  {
    id: 18,
    modelo: "OTDR GRANDWAY M-1000T-PRO",
    modes: ["MONOMODO"],
    rangoDinamico: 22,
    distanciaAprox: "70km ≈",
    distanciaNum: 70,
    fibraActiva: true,
    image: "https://electrolfibraoptica.com/wp-content/uploads/2025/02/ELECTROLOTDR-GRANDWAY-M1000D.webp",
    link: "https://electrolfibraoptica.com/categorias/producto/otdr-grandway-m-1000t-pro/",
    activo: true,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-25"
  }
];

// Funciones de API simuladas
export const otdrApi = {
  // Obtener todos los OTDR
  getAllOTDR: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: OTDR_DATABASE,
          total: OTDR_DATABASE.length
        });
      }, 500);
    });
  },

  // Obtener OTDR activos para el selector público
  getActiveOTDR: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activeOTDR = OTDR_DATABASE.filter(otdr => otdr.activo);
        resolve({
          success: true,
          data: activeOTDR,
          total: activeOTDR.length
        });
      }, 300);
    });
  },

  // Crear nuevo OTDR
  createOTDR: async (otdrData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOTDR = {
          ...otdrData,
          id: Math.max(...OTDR_DATABASE.map(o => o.id)) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        OTDR_DATABASE.push(newOTDR);
        resolve({
          success: true,
          data: newOTDR,
          message: 'OTDR creado exitosamente'
        });
      }, 1000);
    });
  },

  // Actualizar OTDR
  updateOTDR: async (id, otdrData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = OTDR_DATABASE.findIndex(o => o.id === id);
        if (index !== -1) {
          OTDR_DATABASE[index] = {
            ...OTDR_DATABASE[index],
            ...otdrData,
            updatedAt: new Date().toISOString()
          };
          resolve({
            success: true,
            data: OTDR_DATABASE[index],
            message: 'OTDR actualizado exitosamente'
          });
        } else {
          resolve({
            success: false,
            message: 'OTDR no encontrado'
          });
        }
      }, 1000);
    });
  },

  // Eliminar OTDR
  deleteOTDR: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = OTDR_DATABASE.findIndex(o => o.id === id);
        if (index !== -1) {
          OTDR_DATABASE.splice(index, 1);
          resolve({
            success: true,
            message: 'OTDR eliminado exitosamente'
          });
        } else {
          resolve({
            success: false,
            message: 'OTDR no encontrado'
          });
        }
      }, 500);
    });
  },

  // Toggle estado activo/inactivo
  toggleOTDRStatus: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = OTDR_DATABASE.findIndex(o => o.id === id);
        if (index !== -1) {
          OTDR_DATABASE[index].activo = !OTDR_DATABASE[index].activo;
          OTDR_DATABASE[index].updatedAt = new Date().toISOString();
          resolve({
            success: true,
            data: OTDR_DATABASE[index],
            message: `OTDR ${OTDR_DATABASE[index].activo ? 'activado' : 'desactivado'} exitosamente`
          });
        } else {
          resolve({
            success: false,
            message: 'OTDR no encontrado'
          });
        }
      }, 300);
    });
  }
};

export default otdrApi;
