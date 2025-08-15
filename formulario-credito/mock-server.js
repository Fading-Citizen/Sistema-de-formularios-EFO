// Mock API Server para desarrollo local - Sistema independiente
import { createServer } from 'http';
import { parse } from 'url';

const mockDatabase = {
  submissions: [
    {
      id: 1,
      nombre: 'Tech Solutions Colombia SAS',
      email: 'gerencia@techsolutions.co',
      telefono: '3012345678',
      fecha: '2025-01-15',
      estado: 'nuevo',
      tipo: 'credito',
      empresa: 'Tech Solutions Colombia SAS',
      form_data: {
        producto_tipo: 'Crédito Comercial',
        tercero_tipo: 'persona_juridica',
        identificacion_tipo: 'NIT',
        identificacion_num: '900123456',
        razon_social: 'Tech Solutions Colombia SAS',
        valor_activos: '850000000',
        valor_pasivos: '350000000',
        ingresos_operacionales: '1200000000'
      }
    },
    {
      id: 2,
      nombre: 'María Fernanda González',
      email: 'mfgonzalez@gmail.com',
      telefono: '3198765432',
      fecha: '2025-01-14',
      estado: 'pendiente',
      tipo: 'credito',
      empresa: 'Independiente',
      form_data: {
        producto_tipo: 'Crédito Personal',
        tercero_tipo: 'persona_natural',
        identificacion_tipo: 'CC',
        identificacion_num: '52789654',
        razon_social: 'María Fernanda González López',
        valor_activos: '180000000',
        ingresos_operacionales: '85000000'
      }
    }
  ]
};

const server = createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const { pathname, query } = parse(req.url, true);
  
  // RESTful API Routes
  if (pathname === '/api/forms/submissions') {
    if (req.method === 'GET') {
      const limit = parseInt(query.limit) || 50;
      const formType = query.form_type || '';
      
      let submissions = mockDatabase.submissions;
      
      if (formType && formType !== '') {
        submissions = submissions.filter(sub => sub.tipo === formType);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        data: {
          submissions: submissions.slice(0, limit),
          total: submissions.length
        }
      }));
      return;
    }
  }
  
  if (pathname === '/api/forms/submit') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const newId = mockDatabase.submissions.length + 1;
          
          console.log('📝 Nuevo formulario recibido:', body.substring(0, 200) + '...');
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            data: {
              message: 'Formulario enviado exitosamente',
              id: newId
            }
          }));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            data: {
              message: 'Error al procesar el formulario'
            }
          }));
        }
      });
      return;
    }
  }
  
  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 EFO API Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   POST /api/forms/submit`);
  console.log(`   GET  /api/forms/submissions`);
});

export default server;
