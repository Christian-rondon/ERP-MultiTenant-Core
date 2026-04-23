import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Settings, Users, 
  ShoppingCart, BarChart3, LogOut, Menu, X 
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  username?: any; 
}

const MainLayout = ({ children, username: propUsername }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Recuperamos la sesión
  const sessionData = propUsername || JSON.parse(localStorage.getItem('nexo_session') || 'null');
  const userRol = sessionData?.rol?.toLowerCase().trim() || '';
  const comercioId = sessionData?.comercio_id;

  // DEFINICIÓN DE ACCESOS (Superadmin mantiene TODO)
  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      // Superadmin va al Radar (Dashboard), Dueño va a su vista de tienda
      path: userRol === 'superadmin' ? '/dashboard' : `/admin/view/${comercioId}`,
      roles: ['superadmin', 'dueño'] 
    },
    { 
      name: 'POS / Ventas', 
      icon: <ShoppingCart size={20} />, 
      path: '/pos', 
      roles: ['superadmin', 'cajera'] 
    },
    { 
      name: 'Inventario', 
      icon: <Package size={20} />, 
      path: '/inventario', 
      roles: ['superadmin', 'dueño', 'cajera', 'depositario'] 
    },
    { 
      name: 'Reportes', 
      icon: <BarChart3 size={20} />, 
      path: '/reportes', 
      roles: ['superadmin', 'dueño'] 
    },
    { 
      name: 'Usuarios', 
      icon: <Users size={20} />, 
      path: '/usuarios', 
      roles: ['superadmin'] // Intocable para el resto
    },
    { 
      name: 'Configuración', 
      icon: <Settings size={20} />, 
      path: '/configuracion', 
      roles: ['superadmin'] // Intocable para el resto
    },
  ];

  // FILTRO: Si es superadmin, ve los 6 botones. Si no, solo los de su rol.
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(userRol));

  return (
    <div className="flex min-h-screen bg-[#050a15] text-white">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#10172a] border-r border-white/10 transition-transform lg:translate-x-0 lg:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Nexo</h1>
          <p className="text-[8px] text-[#00d1ff] font-bold uppercase tracking-[4px]">Venezuela V3</p>
          <div className="mt-2 inline-block px-2 py-0.5 bg-[#00d1ff]/10 rounded border border-[#00d1ff]/20">
            <span className="text-[7px] text-[#00d1ff] font-black uppercase tracking-widest">
              {sessionData?.rol || 'USUARIO'}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all uppercase tracking-wider group
                  ${isActive 
                    ? 'bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30 shadow-[0_0_15px_rgba(0,209,255,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-500 font-bold uppercase text-[10px] hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={18} /> Salir del Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-[#00d1ff] p-4 rounded-full text-[#050a15]"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default MainLayout;
