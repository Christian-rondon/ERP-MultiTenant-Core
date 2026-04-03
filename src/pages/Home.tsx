import React from 'react';

export default function Home() {
  const fecha = new Date().toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      {/* Header - Restaurado */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm capitalize font-medium">{fecha}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all font-medium text-xs uppercase tracking-widest">
          <span>+</span> Nueva Venta
        </button>
      </div>

      {/* Tarjetas Superiores - Corregidas (4 tarjetas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-600 p-6 rounded-2xl relative shadow-xl overflow-hidden group">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Ingresos Hoy</p>
          <h3 className="text-3xl font-bold mt-1">USD 0,00</h3>
          <p className="text-xs opacity-70 mt-1">Bs. 0,00</p>
          <span className="absolute top-4 right-6 opacity-40 text-xl group-hover:scale-110 transition-transform">$</span>
        </div>

        <div className="bg-[#161d2b] p-6 rounded-2xl border border-white/5 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Transacciones</p>
          <h3 className="text-3xl font-bold mt-1">0</h3>
          <p className="text-xs text-gray-500 mt-1">Ticket: USD 0,00</p>
        </div>

        <div className="bg-[#161d2b] p-6 rounded-2xl border border-white/5 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tasa BCV</p>
          <h3 className="text-3xl font-bold mt-1">47.17</h3>
          <p className="text-[9px] text-blue-400 font-bold uppercase mt-1 tracking-widest">Automática</p>
        </div>

        {/* TARJETA DE INVENTARIO - RESTAURADA */}
        <div className="bg-[#161d2b] p-6 rounded-2xl border border-white/5 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Artículos Inventario</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-200">25</h3>
          <p className="text-xs text-yellow-500 mt-1 font-medium">5 en alerta baja</p>
        </div>
      </div>

      {/* Cuerpo Central - GRÁFICAS RESTAURADAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfica de Ventas - Restaurada */}
        <div className="lg:col-span-2 bg-[#111827] border border-white/5 p-8 rounded-3xl min-h-[300px] flex flex-col shadow-2xl">
          <h4 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">Ventas Últimos 14 Días</h4>
          <div className="flex-1 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-gray-600">
             <span className="italic text-sm">Cargando datos históricos...</span>
          </div>
        </div>

        {/* Gráfica de Métodos de Pago - Restaurada */}
        <div className="bg-[#111827] border border-white/5 p-8 rounded-3xl min-h-[300px] flex flex-col shadow-2xl">
          <h4 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">Métodos de Pago</h4>
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-2 border border-dashed border-white/5 rounded-2xl">
            <span className="text-xs bg-white/5 p-2 rounded-full">Sin ventas hoy</span>
          </div>
        </div>
      </div>

      {/* Botones de Acceso Rápido - RESTAURADOS Y MEJORADOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Nueva Venta', icon: '🛍️', color: 'blue' },
          { name: 'Inventario', icon: '📦', color: 'purple' },
          { name: 'Historial', icon: '📈', color: 'green' },
          { name: 'Reportes', icon: '📊', color: 'orange' },
        ].map(btn => (
          <button key={btn.name} className={`bg-[#161d2b] p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-${btn.color}-500/10 hover:border-${btn.color}-500/20 transition group shadow-lg`}>
            <span className="text-2xl group-hover:scale-110 transition-transform">{btn.icon}</span>
            <span className={`text-${btn.color}-500 font-bold text-[10px] uppercase tracking-wider`}>{btn.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}