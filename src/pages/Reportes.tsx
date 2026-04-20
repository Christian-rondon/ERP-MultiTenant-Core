import React from 'react';
import { 
  BarChart3, TrendingUp, PieChart, Download, 
  Calendar, DollarSign, Wallet, CreditCard, 
  Smartphone, Layers, ArrowRight
} from 'lucide-react';

const Reportes = () => {
  // Datos simulados para los métodos de pago
  const balanceCaja = [
    { metodo: 'Efectivo USD', monto: '1,250.00', color: 'text-green-500', icon: <DollarSign size={14}/> },
    { metodo: 'Efectivo Bs', monto: '15,420.00', color: 'text-yellow-600', icon: <Wallet size={14}/> },
    { metodo: 'Pago Móvil', monto: '8,200.00', color: 'text-[#00d1ff]', icon: <Smartphone size={14}/> },
    { metodo: 'Punto de Venta', monto: '12,100.00', color: 'text-purple-500', icon: <CreditCard size={14}/> },
    { metodo: 'Pagos Mixtos', monto: '3,450.00', color: 'text-orange-500', icon: <Layers size={14}/> },
  ];

  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER DE REPORTES */}
      <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_0_50px_rgba(0,209,255,0.05)]">
        <div>
          <h2 className="text-3xl font-black tracking-[4px] uppercase text-white italic">Business Intelligence</h2>
          <p className="text-[10px] font-bold tracking-[3px] text-[#00d1ff] uppercase mt-2 italic">Balance de Caja y Operaciones</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-[10px] tracking-widest uppercase">
            <Calendar size={16} /> Filtrar Fecha
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#00d1ff] text-[#050a15] font-black rounded-2xl hover:scale-105 transition-all text-[10px] tracking-widest uppercase">
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* SECCIÓN DE BALANCE DE CAJA POR MÉTODOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {balanceCaja.map((item, i) => (
          <div key={i} className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl group hover:border-[#00d1ff]/30 transition-all">
            <div className="flex justify-between items-center mb-3">
              <div className={`p-2 bg-white/5 rounded-lg ${item.color}`}>{item.icon}</div>
              <ArrowRight size={12} className="text-gray-700 group-hover:text-[#00d1ff] transition-colors" />
            </div>
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{item.metodo}</p>
            <h3 className="text-lg font-black text-white italic mt-1">
              {item.metodo.includes('USD') ? '$' : 'Bs.'} {item.monto}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICO DE FLUJO DE CAJA SEMANAL */}
        <div className="lg:col-span-8 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black tracking-[3px] uppercase text-white flex items-center gap-2">
              <BarChart3 size={16} className="text-[#00d1ff]" /> Rendimiento Semanal
            </h3>
            <div className="flex gap-4 italic font-black text-[8px] uppercase tracking-widest">
              <span className="text-[#00d1ff]">Ventas</span>
              <span className="text-gray-600 text-nowrap">vs Semana Anterior</span>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-3 px-4">
            {[30, 85, 45, 100, 60, 75, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full bg-white/5 rounded-t-xl relative overflow-hidden flex items-end h-64">
                   <div 
                    style={{ height: `${h}%` }} 
                    className="w-full bg-gradient-to-t from-[#0057ff] to-[#00d1ff] rounded-t-xl group-hover:brightness-125 transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)]"
                   ></div>
                </div>
                <span className="text-[9px] font-black text-gray-600 uppercase">Día {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MÉTRICAS DE MÉTODOS MIXTOS Y CATEGORÍAS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xs font-black tracking-[3px] uppercase text-white mb-8 flex items-center gap-2">
              <PieChart size={16} className="text-purple-500" /> Mix de Cobro
            </h3>
            
            <div className="space-y-6">
              {[
                { name: 'Digital (Punto/PM)', val: 65, color: 'bg-[#00d1ff]' },
                { name: 'Efectivo (USD/Bs)', val: 25, color: 'bg-green-500' },
                { name: 'Mixto', val: 10, color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-gray-400 tracking-widest">{item.name}</span>
                    <span className="text-white">{item.val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div style={{ width: `${item.val}%` }} className={`h-full ${item.color} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-[#00d1ff]/5 border border-[#00d1ff]/20 rounded-3xl">
            <p className="text-[9px] font-black text-[#00d1ff] uppercase tracking-[2px] mb-2 flex items-center gap-2">
              <TrendingUp size={12}/> Auditoría de Caja
            </p>
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed italic">
              "Se detectó un incremento del 20% en **Pagos Mixtos**. Asegúrate de que los cajeros estén validando correctamente la tasa BCV al recibir Bs."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reportes;