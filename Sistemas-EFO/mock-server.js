// Mock API Server para desarrollo local - Sistemas EFO
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
  
  // Auth endpoints
  if (pathname === '/api/auth/login') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          const { username, password } = JSON.parse(body);
          
          // Mock users
          const users = {
            'superadmin': { 
              password: 'efo2025super', 
              role: 'super_admin', 
              name: 'Super Administrador',
              department: 'TI'
            },
            'creditadmin': { 
              password: 'efo2025credit', 
              role: 'credit_admin', 
              name: 'Admin Crédito',
              department: 'Crédito'
            },
            'viewer': { 
              password: 'efo2025view', 
              role: 'viewer', 
              name: 'Consultor',
              department: 'Consulta'
            }
          };
          
          if (users[username] && users[username].password === password) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: username,
                username: username,
                name: users[username].name,
                role: users[username].role,
                department: users[username].department
              }
            }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: false,
              message: 'Credenciales inválidas'
            }));
          }
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Error en el formato de datos'
          }));
        }
      });
      return;
    }
  }
  
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

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`🚀 EFO API Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   POST /api/forms/submit`);
  console.log(`   GET  /api/forms/submissions`);
});

export default server;
