import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Home from './Home';
import Pos from './Pos';
import Inventario from './Inventario';
import Ventas from './Ventas';
import Reportes from './Reportes';
import Usuarios from './Usuarios';
import Configuracion from './Configuracion';
import MasterConfig from './MasterConfig'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [tabActual, setTabActual] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: '⊞' },
    { name: 'Config. Maestra', icon: '💎' }, 
    { name: 'Punto de Venta', icon: '🛒' },
    { name: 'Inventario', icon: '📦' },
    { name: 'Ventas', icon: '💵' },
    { name: 'Reportes', icon: '📊' },
    { name: 'Usuarios', icon: '👥' },
    { name: 'Configuración', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex">
      {/* SIDEBAR LATERAL - CORREGIDO */}
      <aside className="w-72 bg-[#161d2b] p-6 flex flex-col justify-between shadow-xl border-r border-white/5 h-screen sticky top-0">
        
        {/* Parte Superior: Logo + Menú */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-lg font-black text-xs">NC</div>
            <h2 className="font-bold tracking-tighter uppercase text-sm">Nexo Core ERP</h2>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setTabActual(item.name)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  tabActual === item.name 
                  ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/20' 
                  : 'hover:bg-white/5 text-gray-400 font-medium'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Parte Inferior: Botón Cerrar Sesión (Siempre abajo) */}
        <button 
          onClick={async () => { await supabase.auth.signOut(); navigate('/'); }}
          className="w-full text-gray-500 hover:text-red-400 hover:bg-red-500/5 p-3 text-[10px] font-black uppercase tracking-widest transition-all text-center border border-white/5 rounded-xl mt-6"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 bg-[#0f172a] overflow-y-auto">
        {tabActual === 'Dashboard' && <Home />}
        {tabActual === 'Config. Maestra' && <MasterConfig />} 
        {tabActual === 'Punto de Venta' && <Pos />}
        {tabActual === 'Inventario' && <Inventario />}
        {tabActual === 'Ventas' && <Ventas />}
        {tabActual === 'Reportes' && <Reportes />}
        {tabActual === 'Usuarios' && <Usuarios />}
        {tabActual === 'Configuración' && <Configuracion />}
      </main>
    </div>
  );
}