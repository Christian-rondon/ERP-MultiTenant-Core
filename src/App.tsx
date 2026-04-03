import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// IMPORTACIONES CON MAYÚSCULAS (Como las renombramos arriba)
import Dashboard from './pages/Dashboard';
import Pos from './pages/Pos';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Usuarios from './pages/Usuarios';
import Configuracion from './pages/Configuracion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pos" element={<Pos />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/configuracion" element={<Configuracion />} />

        {/* Evita la pantalla blanca si el usuario escribe mal la URL */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;