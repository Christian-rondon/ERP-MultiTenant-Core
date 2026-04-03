return (
  <div className="flex h-screen w-full bg-[#0a0f1a] text-white overflow-hidden text-left font-sans">
    
    {/* EL SIDEBAR: Copia exacta en cada archivo */}
    <div className="w-72 bg-[#111827] flex flex-col py-8 px-6 border-r border-white/5 flex-shrink-0 h-screen shadow-2xl">
      <div className="px-4 mb-10">
        <h2 className="text-2xl font-black tracking-tighter italic text-blue-500 uppercase leading-none">Nexo Core</h2>
        <p className="text-[9px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">Venezuela v1.0</p>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        <MenuBtn to="/dashboard" icon="📊" label="Dashboard" active={location.pathname === '/dashboard'} />
        <MenuBtn to="/pos" icon="🛒" label="Punto de Venta" active={location.pathname === '/pos'} />
        <MenuBtn to="/inventario" icon="📦" label="Inventario" active={location.pathname === '/inventario'} />
        <MenuBtn to="/ventas" icon="📋" label="Ventas" active={location.pathname === '/ventas'} />
        <MenuBtn to="/reportes" icon="📈" label="Reportes" active={location.pathname === '/reportes'} />
        <MenuBtn to="/usuarios" icon="👥" label="Usuarios" active={location.pathname === '/usuarios'} />
        <MenuBtn to="/configuracion" icon="⚙️" label="Configuración" active={location.pathname === '/configuracion'} />
      </nav>

      <Link to="/" className="flex items-center gap-4 px-6 py-4 rounded-2xl hover:bg-red-500/10 transition-all text-red-500 font-bold text-[10px] uppercase tracking-widest border border-transparent">
        <span>🚪</span> Cerrar Sesión
      </Link>
    </div>

    {/* EL CONTENIDO: Aquí es donde cambia cada página */}
    <div className="flex-1 overflow-y-auto p-12 bg-[#0a0f1a]">
       {/* AQUÍ VA EL CÓDIGO PROPIO DE DASHBOARD, POS O INVENTARIO */}
    </div>
  </div>
);