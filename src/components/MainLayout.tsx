import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Settings, Users, 
  ShoppingCart, BarChart3, LogOut, Menu, X 
} from 'lucide-react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Inventario', icon: <Package size={20} />, path: '/inventario' },
    { name: 'POS / Ventas', icon: <ShoppingCart size={20} />, path: '/pos' },
    { name: 'Usuarios', icon: <Users size={20} />, path: '/usuarios' },
    { name: 'Reportes', icon: <BarChart3 size={20} />, path: '/reportes' },
    { name: 'Configuración', icon: <Settings size={20} />, path: '/configuracion' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Cierra el menú al hacer click en móviles
  };

  return (
    <div className="flex min-h-screen bg-[#050a15] text-white font-sans">
      
      {/* BOTÓN MÓVIL (Solo visible en pantallas pequeñas) */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-[60] bg-[#00d1ff] p-2 rounded-lg shadow-lg text-[#050a15]"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR RESPONSIVA */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#10172a]/95 backdrop-blur-2xl border-r border-white/10 
        transition-transform duration-300 ease-in-out transform
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="p-8 border-b border-white/5">
          <h1 className="text-2xl font-black tracking-[3px] text-white italic">NEXO</h1>
          <p className="text-[8px] tracking-[4px] text-[#00d1ff] font-bold uppercase">Venezuela V3</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-wider ${
                location.pathname === item.path
                  ? 'bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30 shadow-[0_0_15px_rgba(0,209,255,0.1)]'
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-wider"
          >
            <LogOut size={20} />
            Salir
          </button>
        </div>
      </aside>

      {/* OVERLAY PARA MÓVILES (Oscurece el fondo cuando el menú está abierto) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* CONTENIDO PRINCIPAL ADAPTABLE */}
      <main className="flex-1 w-full relative min-h-screen overflow-x-hidden p-4 md:p-8 lg:p-10">
        {/* Fondo sutil */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
