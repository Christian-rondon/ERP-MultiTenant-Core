import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pos from './pages/Pos';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Usuarios from './pages/Usuarios';
import Reportes from './pages/Reportes';
import Configuracion from './pages/Configuracion';
import StoreDashboard from './pages/StoreDashboard'; // El que creamos recién

// Manejador de Login para redirección automática
const LoginWrapper = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const navigate = useNavigate();

  const handleLoginSuccess = (user: any) => {
    onLogin(user);
    // Si es superadmin va al dashboard general, si no, a su tienda
    if (user.rol === 'superadmin') {
      navigate('/dashboard');
    } else {
      navigate(`/admin/view/${user.comercio_id}`);
    }
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

function App() {
  const [user, setUser] = React.useState<any>(null);

  return (
    <Router>
      <Routes>
        {/* Ruta de Login */}
        <Route path="/login" element={<LoginWrapper onLogin={setUser} />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas Protegidas con Layout */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/pos" element={<MainLayout><Pos /></MainLayout>} />
        <Route path="/inventario" element={<MainLayout><Inventario /></MainLayout>} />
        <Route path="/ventas" element={<MainLayout><Ventas /></MainLayout>} />
        <Route path="/usuarios" element={<MainLayout><Usuarios /></MainLayout>} />
        <Route path="/reportes" element={<MainLayout><Reportes /></MainLayout>} />
        <Route path="/configuracion" element={<MainLayout><Configuracion /></MainLayout>} />
        
        {/* Nueva ruta para ver el Dashboard de un comercio específico */}
        <Route path="/admin/view/:id" element={<MainLayout><StoreDashboard /></MainLayout>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;