import React, { useState } from 'react';
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
import Egresos from './pages/Egresos'; // <--- AGREGAMOS ESTA IMPORTACIÓN

function App() {
  // Estado para manejar la sesión
  const [userSession, setUserSession] = useState(() => {
    const saved = localStorage.getItem('nexo_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (data: any) => {
    localStorage.setItem('nexo_session', JSON.stringify(data));
    setUserSession(data);
  };

  return (
    <Router>
      <Routes>
        {/* Si hay sesión, el login redirige al inicio */}
        <Route path="/login" element={
          userSession ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
        } />
        
        {/* Redirección automática según sesión */}
        <Route path="/" element={
          userSession ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />

        {/* TODAS LAS RUTAS OPERATIVAS CON EL MENÚ NEÓN */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/pos" element={<MainLayout><Pos /></MainLayout>} />
        <Route path="/inventario" element={<MainLayout><Inventario /></MainLayout>} />
        
        {/* NUEVA RUTA DE EGRESOS ESTILO POS */}
        <Route path="/egresos" element={<MainLayout><Egresos /></MainLayout>} />
        
        <Route path="/usuarios" element={<MainLayout><Usuarios /></MainLayout>} />
        <Route path="/reportes" element={<MainLayout><Reportes /></MainLayout>} />
        <Route path="/configuracion" element={<MainLayout><Configuracion /></MainLayout>} />

        {/* Captura de rutas no existentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;