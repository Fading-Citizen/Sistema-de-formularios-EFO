import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SuperAdminProvider } from './contexts/SuperAdminContext'
import HomePage from './components/HomePage'
import Login from './components/Login'
import FormularioAdmin from './components/FormularioAdmin'
import SuperAdminPanel from './components/SuperAdminPanel'
import PatchCordsAdmin from './components/PatchCordsAdmin'
import CotizadorPatchCords from './components/CotizadorPatchCords'
import OTDRAdmin from './components/OTDRAdmin'
import SelectorOTDR from './components/SelectorOTDR'
import FormularioCredito from './components/FormularioCredito'
import SupabaseTest from './components/SupabaseTest'
import ConexionTest from './components/ConexionTest'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <SuperAdminProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Página de inicio */}
              <Route path="/" element={<HomePage />} />
              
              {/* Login */}
              <Route path="/admin/login" element={<Login />} />
              
              {/* Formulario público */}
              <Route path="/form/credito-efo" element={<FormularioCredito />} />
              
              {/* FormularioAdmin para admins regulares (credit, general, viewer) y super admin */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'user', 'superadmin']}>
                    <FormularioAdmin />
                  </ProtectedRoute>
                }
              />
              
              {/* Panel de Patch Cords - solo para super admin */}
              <Route 
                path="/admin/patch-cords" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <PatchCordsAdmin />
                  </ProtectedRoute>
                }
              />
              
              {/* Panel de OTDR - solo para super admin */}
              <Route 
                path="/admin/otdr" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <OTDRAdmin />
                  </ProtectedRoute>
                }
              />
              
              {/* Cotizador de Patch Cords - acceso público */}
              <Route path="/patch-cords" element={<CotizadorPatchCords />} />
              <Route path="/cotizador/patch-cords" element={<CotizadorPatchCords />} />
              
              {/* Selector de OTDR - acceso público */}
              <Route path="/otdr" element={<SelectorOTDR />} />
              <Route path="/selector/otdr" element={<SelectorOTDR />} />
              
              {/* Prueba de Supabase - acceso público */}
              <Route path="/test/supabase" element={<SupabaseTest />} />
              
              {/* Test de Conexión Dashboard - acceso público */}
              <Route path="/test/conexion" element={<ConexionTest />} />
              
              {/* Panel Super Admin - solo super admin */}
              <Route 
                path="/admin/super-admin" 
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <SuperAdminPanel />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirecciones */}
              <Route path="/admin" element={<Navigate to="/admin/login" />} />
            </Routes>
          </div>
        </Router>
      </SuperAdminProvider>
    </AuthProvider>
  )
}

export default App