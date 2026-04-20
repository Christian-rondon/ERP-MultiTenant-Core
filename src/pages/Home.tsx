import React from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  PieChart, 
  Plus,
  ArrowUpRight
} from 'lucide-react';

export default function Home() {
  const fecha = new Date().toLocaleDateString('es-VE', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-8 pb-10">
      
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,209,255,0.05)]">
        <div>
          <h1 className="text-3xl font-black tracking-[4px] uppercase text-white italic">Dashboard</h1>
          <p className="text-[10px] font-bold tracking-[3px] text-[#00d1ff] uppercase mt-2 italic">{fecha}</p>
        </div>
        <button className="w-full md:w-auto bg-[#00d1ff] text-[#050a15] px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,209,255,0.3)] transition-all hover:scale-105 font-black text-[10px] uppercase tracking-widest">
          <Plus size={18} /> Nueva Venta
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Ingresos */}
        <div className="bg-gradient-to-br from-[#0057ff] to-[#00d1ff] p-6 rounded-3xl relative overflow-hidden group shadow-lg">
          <p className="text-[9px] font-black uppercase tracking-[2px] text-white/80">Ingresos Hoy</p>
          <h3 className="text-2xl font-black text-white mt-1 italic">$ 0.00</h3>
          <p className="text-[10px] font-bold text-white/60 mt-1 italic tracking-widest">Bs. 0.00</p>
          <TrendingUp className="absolute top-4 right-6 text-white/20 group-hover:scale-110 transition-transform" size={40} />
        </div>

        {/* Transacciones */}
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:border-[#00d1ff]/30 transition-all">
          <p className="text-[9px] font-black uppercase tracking-[2px] text-gray-500">Transacciones</p>
          <h3 className="text-2xl font-black text-white mt-1 italic">0</h3>
          <div className="flex items-center gap-1 mt-1">
             <span className="text-[9px] text-[#00d1ff] font-bold uppercase italic">Ticket Promedio: $0.00</span>
          </div>
        </div>

        {/* Tasa BCV */}
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:border-[#00d1ff]/30 transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[9px] font-black uppercase tracking-[2px] text-gray-500">Tasa BCV</p>
            <RefreshCw size={14} className="text-[#00d1ff] animate-spin-slow" />
          </div>
          <h3 className="text-2xl font-black text-white mt-1 italic">47.17</h3>
          <span className="text-[8px] px-2 py-0.5 bg-[#00d1ff]/10 text-[#00d1ff] font-black rounded uppercase tracking-widest mt-2 inline-block">Automática</span>
        </div>

        {/* Inventario */}
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:border-yellow-500/30 transition-all">
          <p className="text-[9px] font-black uppercase tracking-[2px] text-gray-500">Inventario</p>
          <h3 className="text-2xl font-black text-white mt-1 italic">25</h3>
          <p className="text-[9px] text-yellow-500 font-bold uppercase mt-1 tracking-widest animate-pulse">5 en alerta baja</p>
        </div>
      </div>

      {/* ÁREA CENTRAL: GRÁFICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfica Principal */}
        <div className="lg:col-span-2 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl min-h-[350px] flex flex-col group">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[3px] flex items-center gap-2 italic">
              <BarChart3 size={16} className="text-[#00d1ff]" /> Ventas (14 Días)
            </h4>
            <ArrowUpRight size={18} className="text-gray-700 group-hover:text-[#00d1ff] transition-colors" />
          </div>
          <div className="flex-1 border border-dashed border-white/5 rounded-2xl flex items-center justify-center bg-white/[0.02]">
             <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Sincronizando con base de datos...</span>
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl min-h-[350px] flex flex-col group">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xs font-black text-white uppercase tracking-[3px] flex items-center gap-2 italic">
              <PieChart size={16} className="text-purple-500" /> Métodos
            </h4>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.02] gap-3">
             <div className="w-20 h-20 rounded-full border-4 border-white/5 border-t-[#00d1ff] animate-spin"></div>
             <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Esperando facturación</span>
          </div>
        </div>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Nueva Venta', icon: <ShoppingCart size={20}/>, color: 'text-[#00d1ff]', hover: 'hover:border-[#00d1ff]/40' },
          { name: 'Inventario', icon: <Package size={20}/>, color: 'text-purple-500', hover: 'hover:border-purple-500/40' },
          { name: 'Historial', icon: <TrendingUp size={20}/>, color: 'text-green-500', hover: 'hover:border-green-500/40' },
          { name: 'Reportes', icon: <BarChart3 size={20}/>, color: 'text-orange-500', hover: 'hover:border-orange-500/40' },
        ].map((btn, i) => (
          <button key={i} className={`bg-[#10172a]/60 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col items-center gap-3 transition-all group ${btn.hover} hover:bg-white/[0.03]`}>
            <span className={`${btn.color} transition-transform group-hover:scale-110`}>{btn.icon}</span>
            <span className="text-[9px] font-black text-white uppercase tracking-[2px]">{btn.name}</span>
          </button>
        ))}
      </div>

    </div>
  );
}