
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Receipt 
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // CORRECCIÓN QUIRÚRGICA: Limpieza total y redirección forzada
  const handleLogout = () => {
    try {
      // 1. Limpiamos TODO el rastro de la sesión
      localStorage.clear(); 
      sessionStorage.clear();
      
      // 2. Redirección usando replace: true para que no pueda volver atrás
      // IMPORTANTE: Verifica que en tu App.tsx la ruta sea exactamente "/login"
      navigate('/login', { replace: true });
      
      // 3. Forzar un pequeño refresco si el AuthGuard se queda pegado
      window.location.reload(); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Dashboard', to: '/dashboard' },
    { icon: <ShoppingCart size={22} />, label: 'Ventas POS', to: '/pos' },
    { icon: <Package size={22} />, label: 'Inventario', to: '/inventario' },
    { icon: <Receipt size={22} />, label: 'Registro de Gastos', to: '/egresos' }, 
    { icon: <Users size={22} />, label: 'Usuarios', to: '/usuarios' },
    { icon: <BarChart3 size={22} />, label: 'Reportes', to: '/reportes' },
    { icon: <Settings size={22} />, label: 'Configuración', to: '/configuracion' },
  ];

  return (
    <div className="h-screen w-full bg-deep-layers flex overflow-hidden">
      
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } glass-panel transition-all duration-300 flex flex-col h-full z-50 flex-shrink-0 shadow-2xl`}
      >
        {/* LOGO AREA */}
        <div className="p-6 flex items-center justify-between flex-shrink-0">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-glow rounded-lg shadow-[0_0_15px_rgba(255,107,53,0.5)]"></div>
              <span className="text-xl font-black italic tracking-tighter text-white uppercase">
                NEXO<span className="text-amber-glow">CORE</span>
              </span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-electric-cyan text-deep-layers shadow-[0_10px_20px_rgba(0,242,255,0.2)]' 
                    : 'text-silver-gray hover:bg-electric-cyan/10 hover:text-white'}
                `}
              >
                <div className={`${isActive ? 'text-deep-layers' : 'group-hover:text-electric-cyan'} transition-colors duration-300 flex-shrink-0`}>
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="font-bold uppercase tracking-widest text-[11px] italic whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {!isSidebarOpen && isActive && (
                   <div className="absolute left-0 w-1.5 h-6 bg-electric-cyan rounded-r-full shadow-[0_0_10px_rgba(0,242,255,0.8)]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/5 flex-shrink-0 bg-[#0a0f1a]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-silver-gray hover:bg-electric-cyan/10 hover:text-electric-cyan transition-all duration-300 italic font-bold text-xs uppercase tracking-widest group cursor-pointer"
          >
            <div className="group-hover:rotate-12 transition-transform">
              <LogOut size={22} />
            </div>
            {isSidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-deep-layers">
        <div className="relative z-10 p-6 md:p-8 pt-10"> 
          {children}
        </div>
        
        {/* Decoración de fondo */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-electric-cyan/5 blur-[150px] -z-10 rounded-full pointer-events-none"></div>
      </main>
    </div>
  );
};

export default MainLayout;

