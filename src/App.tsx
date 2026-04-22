import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';

// IMPORTACIÓN DE PÁGINAS
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pos from './pages/Pos';
import Inventario from './pages/Inventario';
import Usuarios from './pages/Usuarios';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import StoreDashboard from './pages/StoreDashboard';

// 1. COMPONENTE DE PROTECCIÓN DE RUTAS
const RutaPrivada = ({ children, rolesPermitidos }: { children: React.ReactNode, rolesPermitidos: string[] }) => {
  // Intentamos recuperar la sesión del localStorage
  const session = JSON.parse(localStorage.getItem('nexo_session') || 'null');
  
  // Si no hay sesión, al login de inmediato
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  const userRol = session.rol?.toLowerCase().trim();

  // El Superadmin siempre pasa
  if (userRol === 'superadmin') return <>{children}</>;

  // Si el rol está permitido para esta página, pasa
  if (rolesPermitidos.includes(userRol)) {
    return <>{children}</>;
  }

  // Si no tiene permiso, lo mandamos a su "Home" correspondiente
  const redireccion: Record<string, string> = {
    dueño: `/admin/view/${session.comercio_id}`,
    cajera: '/pos',
    depositario: '/inventario'
  };

  return <Navigate to={redireccion[userRol] || '/login'} replace />;
};

function App() {
  // Estado para manejar la sesión globalmente
  const [userSession, setUserSession] = useState<any>(() => {
    const saved = localStorage.getItem('nexo_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Función para manejar el éxito del login
  const handleLoginSuccess = (data: any) => {
    localStorage.setItem('nexo_session', JSON.stringify(data));
    setUserSession(data);
  };

  return (
    <Router>
      <Routes>
        {/* RUTA PÚBLICA: LOGIN */}
        <Route path="/login" element={
          userSession ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
        } />
        
        {/* REDIRECCIÓN INICIAL SEGÚN ROL */}
        <Route path="/" element={
          userSession 
            ? (userSession.rol?.toLowerCase() === 'superadmin' 
                ? <Navigate to="/dashboard" replace /> 
                : <Navigate to={`/admin/view/${userSession.comercio_id}`} replace />)
            : <Navigate to="/login" replace />
        } />

        {/* --- RUTAS PROTEGIDAS --- */}

        {/* RADAR SaaS (SOLO SUPERADMIN) */}
        <Route path="/dashboard" element={
          <RutaPrivada rolesPermitidos={['superadmin']}>
            <MainLayout username={userSession}><Dashboard /></MainLayout>
          </RutaPrivada>
        } />

        {/* PUNTO DE VENTA (SUPERADMIN Y CAJERA) */}
        <Route path="/pos" element={
          <RutaPrivada rolesPermitidos={['superadmin', 'cajera']}>
            <MainLayout username={userSession}><Pos /></MainLayout>
          </RutaPrivada>
        } />

        {/* INVENTARIO (TODOS LOS ROLES TIENEN ACCESO) */}
        <Route path="/inventario" element={
          <RutaPrivada rolesPermitidos={['superadmin', 'dueño', 'cajera', 'depositario']}>
            <MainLayout username={userSession}><Inventario /></MainLayout>
          </RutaPrivada>
        } />

        {/* REPORTES (SUPERADMIN Y DUEÑO) */}
        <Route path="/reportes" element={
          <RutaPrivada rolesPermitidos={['superadmin', 'dueño']}>
            <MainLayout username={userSession}><Reportes /></MainLayout>
          </RutaPrivada>
        } />

        {/* GESTIÓN DE USUARIOS DEL SaaS (SOLO SUPERADMIN) */}
        <Route path="/usuarios" element={
          <RutaPrivada rolesPermitidos={['superadmin']}>
            <MainLayout username={userSession}><Usuarios /></MainLayout>
          </RutaPrivada>
        } />

        {/* CONFIGURACIÓN GLOBAL (SOLO SUPERADMIN) */}
        <Route path="/configuracion" element={
          <RutaPrivada rolesPermitidos={['superadmin']}>
            <MainLayout username={userSession}><Configuracion /></MainLayout>
          </RutaPrivada>
        } />

        {/* DASHBOARD ESPECÍFICO DEL COMERCIO (DUEÑO Y SUPERADMIN) */}
        <Route path="/admin/view/:id" element={
          <RutaPrivada rolesPermitidos={['superadmin', 'dueño']}>
            <MainLayout username={userSession}><StoreDashboard /></MainLayout>
          </RutaPrivada>
        } />

        {/* CAPTURA DE RUTAS NO EXISTENTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;