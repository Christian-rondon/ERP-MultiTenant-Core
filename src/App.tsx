import React, { useState, ReactNode } from 'react';
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
import Egresos from './pages/Egresos';

// DEFINICIÓN DE TIPOS
interface ProtectedRouteProps {
  user: any; // Puedes cambiar 'any' por la interfaz de tu usuario si la tienes
  children: ReactNode;
}

// COMPONENTE PARA PROTEGER RUTAS (Versión TSX)
const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  // Estado para manejar la sesión con tipo dinámico
  const [userSession, setUserSession] = useState<any>(() => {
    const saved = localStorage.getItem('nexo_session');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Error al parsear la sesión:", error);
      return null;
    }
  });

  const handleLoginSuccess = (data: any) => {
    localStorage.setItem('nexo_session', JSON.stringify(data));
    setUserSession(data);
  };

  return (
    <Router>
      <Routes>
        {/* RUTA DE LOGIN */}
        <Route 
          path="/login" 
          element={
            userSession ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />
        
        {/* RAIZ: Redirección automática */}
        <Route 
          path="/" 
          element={<Navigate to={userSession ? "/dashboard" : "/login"} replace />} 
        />

        {/* RUTAS OPERATIVAS PROTEGIDAS */}
        <Route path="/dashboard" element={<ProtectedRoute user={userSession}><Dashboard /></ProtectedRoute>} />
        <Route path="/pos" element={<ProtectedRoute user={userSession}><Pos /></ProtectedRoute>} />
        <Route path="/inventario" element={<ProtectedRoute user={userSession}><Inventario /></ProtectedRoute>} />
        <Route path="/egresos" element={<ProtectedRoute user={userSession}><Egresos /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute user={userSession}><Usuarios /></ProtectedRoute>} />
        <Route path="/reportes" element={<ProtectedRoute user={userSession}><Reportes /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute user={userSession}><Configuracion /></ProtectedRoute>} />

        {/* Captura de rutas no existentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;