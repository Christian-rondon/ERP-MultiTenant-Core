// Ejemplo de App.tsx
import Dashboard from './pages/Dashboard';
import Pos from './pages/Pos';
import Usuarios from './pages/Usuarios';
import Configuracion from './pages/Configuracion';
// ... otras importaciones

<Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/pos" element={<Pos />} />
  <Route path="/usuarios" element={<Usuarios />} />
  <Route path="/configuracion" element={<Configuracion />} />
</Routes>