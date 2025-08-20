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
import FormularioCredito from './components/FormularioCredito'
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
                  <ProtectedRoute allowedRoles={['credit', 'general', 'viewer', 'super_admin']}>
                    <FormularioAdmin />
                  </ProtectedRoute>
                }
              />
              
              {/* Panel de Patch Cords - solo para super admin */}
              <Route 
                path="/admin/patch-cords" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <PatchCordsAdmin />
                  </ProtectedRoute>
                }
              />
              
              {/* Cotizador de Patch Cords - acceso público */}
              <Route path="/patch-cords" element={<CotizadorPatchCords />} />
              <Route path="/cotizador/patch-cords" element={<CotizadorPatchCords />} />
              
              {/* Panel Super Admin - solo super admin */}
              <Route 
                path="/admin/super-admin" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
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