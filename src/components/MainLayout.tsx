import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function MainLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const location = useLocation();
  const MenuBtn = ({ to, icon, label, active }: any) => (
    <Link to={to} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm border ${active ? 'bg-blue-600/10 border-blue-600/20 text-blue-500 shadow-lg shadow-blue-900/10' : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
      <span className="text-xl w-6 text-center">{icon}</span>
      {label}
    </Link>
  );

  return (
    <div className="flex h-screen w-full bg-[#0a0f1a] text-white overflow-hidden text-left font-sans">
      <div className="w-72 bg-[#111827] flex flex-col py-8 px-6 border-r border-white/5 flex-shrink-0 h-screen shadow-2xl">
        <div className="px-4 mb-10">
          <h2 className="text-2xl font-black tracking-tighter italic text-blue-500 uppercase">Nexo Core</h2>
          <p className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">Venezuela v1.0</p>
        </div>
        <nav className="flex flex-col gap-1.5 flex-1">
          <MenuBtn to="/dashboard" icon="📊" label="Dashboard" active={location.pathname === '/dashboard'} />
          <MenuBtn to="/pos" icon="🛒" label="Punto de Venta" active={location.pathname === '/pos'} />
          <MenuBtn to="/inventario" icon="📦" label="Inventario" active={location.pathname === '/inventario'} />
          <MenuBtn to="/ventas" icon="📋" label="Ventas" active={location.pathname === '/ventas'} />
          <MenuBtn to="/usuarios" icon="👥" label="Usuarios" active={location.pathname === '/usuarios'} />
          <MenuBtn to="/configuracion" icon="⚙️" label="Configuración" active={location.pathname === '/configuracion'} />
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto p-12 bg-[#0a0f1a]">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-8">{title}</h1>
        {children}
      </div>
    </div>
  );
}
