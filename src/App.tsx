import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pos from './pages/Pos';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Usuarios from './pages/Usuarios';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import StoreDashboard from './pages/StoreDashboard';

// Componente de protección que respeta tu lógica de Superadmin y Dueño
const RutaPrivada = ({ children, vistaId, permisos, user }: any) => {
  if (!user) return <Navigate to="/login" replace />;
  
  // 1. Superadmin tiene pase libre
  // 2. Si es una vista autorizada en el array de permisos, pasa
  // 3. El Dashboard de la tienda (:id) siempre es accesible para el dueño
  if (
    user.rol === 'superadmin' || 
    permisos.includes(vistaId) || 
    vistaId === 'store_view' 
  ) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

const LoginWrapper = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (user: any) => {
    onLogin(user);
    if (user.rol === 'superadmin') {
      navigate('/dashboard');
    } else {
      // El dueño va directo a su StoreDashboard
      navigate(`/admin/view/${user.comercio_id}`);
    }
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

function App() {
  const [user, setUser] = React.useState<any>(null);
  const [permisos, setPermisos] = useState<string[]>([]);

  // Cargamos los permisos sin bloquear el renderizado inicial
  useEffect(() => {
    if (user) {
      const fetchAcceso = async () => {
        const { data } = await supabase
          .from('usuarios_acceso')
          .select('vistas_permitidas')
          .eq('email', user.email)
          .single();
        
        if (data) {
          setPermisos(data.vistas_permitidas || []);
        } else if (user.rol !== 'superadmin') {
          // Si es dueño (no está en la tabla de empleados), vistas por default
          setPermisos(['dashboard', 'inventario', 'reportes']);
        }
      };
      fetchAcceso();
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginWrapper onLogin={setUser} />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas con tu estructura original, ahora protegidas */}
        <Route path="/dashboard" element={
          <RutaPrivada vistaId="dashboard" permisos={permisos} user={user}>
            <MainLayout><Dashboard /></MainLayout>
          </RutaPrivada>
        } />

        <Route path="/pos" element={
          <RutaPrivada vistaId="pos" permisos={permisos} user={user}>
            <MainLayout><Pos /></MainLayout>
          </RutaPrivada>
        } />

        <Route path="/inventario" element={
          <RutaPrivada vistaId="inventario" permisos={permisos} user={user}>
            <MainLayout><Inventario /></MainLayout>
          </RutaPrivada>
        } />

        <Route path="/ventas" element={
          <RutaPrivada vistaId="ventas" permisos={permisos} user={user}>
            <MainLayout><Ventas /></MainLayout>
          </RutaPrivada>
        } />

        <Route path="/usuarios" element={
          <RutaPrivada vistaId="usuarios" permisos={permisos} user={user}>
            <MainLayout><Usuarios /></MainLayout>
          </RutaPrivada>
        } />

        <Route path="/reportes" element={
          <RutaPrivada vistaId="reportes" permisos={permisos} user={user}>
            <MainLayout><Reportes /></MainLayout>
          </RutaPrivada>
        } />

        <Route path="/configuracion" element={
          <RutaPrivada vistaId="configuracion" permisos={permisos} user={user}>
            <MainLayout><Configuracion /></MainLayout>
          </RutaPrivada>
        } />
        
        {/* Tu ruta de StoreDashboard para los dueños */}
        <Route path="/admin/view/:id" element={
          <RutaPrivada vistaId="store_view" permisos={permisos} user={user}>
            <MainLayout><StoreDashboard /></MainLayout>
          </RutaPrivada>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;