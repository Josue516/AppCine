import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './componentes/layout/ProtectedRoute'
import DashboardLayout from './componentes/layout/DashboardLayout'

import Login from './paginas/Login'
import Dashboard from './paginas/Dashboard'
import Peliculas from './paginas/Peliculas'
import Funciones from './paginas/Funciones'
import Sedes from './paginas/Sedes'
import Usuarios from './paginas/Usuarios'
import Reservas from './paginas/Reservas'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas — cualquier usuario autenticado */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout><Dashboard /></DashboardLayout>
        </ProtectedRoute>
      }/>
      <Route path="/peliculas" element={
        <ProtectedRoute>
          <DashboardLayout><Peliculas /></DashboardLayout>
        </ProtectedRoute>
      }/>
      <Route path="/funciones" element={
        <ProtectedRoute>
          <DashboardLayout><Funciones /></DashboardLayout>
        </ProtectedRoute>
      }/>
      <Route path="/sedes" element={
        <ProtectedRoute>
          <DashboardLayout><Sedes /></DashboardLayout>
        </ProtectedRoute>
      }/>
      <Route path="/reservas" element={
        <ProtectedRoute>
          <DashboardLayout><Reservas /></DashboardLayout>
        </ProtectedRoute>
      }/>

      {/* Solo admins */}
      <Route path="/usuarios" element={
        <ProtectedRoute adminOnly>
          <DashboardLayout><Usuarios /></DashboardLayout>
        </ProtectedRoute>
      }/>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  )
}
