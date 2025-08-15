import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SuperAdminProvider } from './contexts/SuperAdminContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import SuperAdminPanel from './components/SuperAdminPanel'
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
              {/* Ruta pública para el formulario */}
              <Route path="/form/credito-efo" element={<FormularioCredito />} />
              
              {/* Rutas de administración */}
              <Route path="/admin/login" element={<Login />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta Super Admin */}
              <Route 
                path="/super-admin" 
                element={
                  <ProtectedRoute requiredRole="super_admin">
                    <SuperAdminPanel />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirecciones */}
              <Route path="/" element={<Navigate to="/form/credito-efo" />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </SuperAdminProvider>
    </AuthProvider>
  )
}

export default App
