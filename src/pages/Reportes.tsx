import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Smartphone, 
  CreditCard, 
  Coins, 
  DollarSign,
  TrendingUp,
  Layers,      // <--- IMPORTADO
  Activity,    // <--- IMPORTADO
  ArrowUpRight // <--- IMPORTADO
} from 'lucide-react';

export default function Reportes() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [resumen, setResumen] = useState({
    usd: 0,
    bs: 0,
    pago_movil: 0,
    punto: 0,
    mixto: 0,
  });

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('bi-realtime-master')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ventas' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchData() {
    // Como Superadmin, traemos TODO para ver la red global
    const { data } = await supabase.from('ventas').select('*');

    if (data) {
      const stats = data.reduce((acc, v) => {
        acc.usd += Number(v.total_usd || 0);
        acc.bs += Number(v.total_bs || 0);
        if (v.metodo_pago === 'pago_movil') acc.pago_movil += Number(v.total_bs || 0);
        if (v.metodo_pago === 'punto') acc.punto += Number(v.total_bs || 0);
        if (v.metodo_pago === 'mixto') acc.mixto += Number(v.total_usd || 0);
        return acc;
      }, { usd: 0, bs: 0, pago_movil: 0, punto: 0, mixto: 0 });

      setResumen(stats);
      setVentas(data);
    }
  }

  return (
    <div className="p-6 space-y-8 bg-[#0a0f1a] min-h-screen text-white">
      {/* HEADER IDÉNTICO A TU CAPTURA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Business Intelligence</h1>
          <p className="text-[#00d1ff] text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">
            Auditoría Remota de Operaciones Master
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#111827] px-6 py-2.5 rounded-xl border border-white/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
            <Calendar size={14} className="text-gray-400"/> Filtrar Fecha
          </button>
          <button className="bg-[#00d1ff] px-6 py-2.5 rounded-xl text-black flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,209,255,0.4)] hover:brightness-110 transition-all">
            <Download size={14}/> Exportar PDF
          </button>
        </div>
      </div>

      {/* MÉTRICAS DE RED (TARJETAS) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Efectivo USD" val={`$ ${resumen.usd.toLocaleString()}`} color="text-green-400" icon={<DollarSign size={16}/>} />
        <StatCard title="Efectivo BS" val={`Bs. ${resumen.bs.toLocaleString()}`} color="text-white" icon={<Coins size={16}/>} />
        <StatCard title="Pago Móvil" val={`Bs. ${resumen.pago_movil.toLocaleString()}`} color="text-[#00d1ff]" icon={<Smartphone size={16}/>} />
        <StatCard title="Punto de Venta" val={`Bs. ${resumen.punto.toLocaleString()}`} color="text-purple-400" icon={<CreditCard size={16}/>} />
        <StatCard title="Pagos Mixtos" val={`$ ${resumen.mixto.toLocaleString()}`} color="text-orange-400" icon={<Layers size={16}/>} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* GRÁFICO DE RENDIMIENTO SEMANAL */}
        <div className="lg:col-span-2 bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black uppercase italic flex items-center gap-2 tracking-widest">
              <BarChart3 size={16} className="text-[#00d1ff]"/> Rendimiento Semanal Global
            </h3>
            <div className="flex gap-4 text-[8px] font-black uppercase italic tracking-widest">
              <span className="text-[#00d1ff]">Ventas Reales</span>
              <span className="text-gray-600">Vs Semana Anterior</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end h-64 px-2">
            {[35, 65, 45, 95, 55, 85, 40].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-4 w-full group">
                <div className="relative w-14 flex items-end justify-center">
                  <div className="absolute w-full bg-white/[0.02] rounded-t-2xl h-full border-t border-x border-white/5"></div>
                  <div 
                    className="w-full bg-gradient-to-t from-[#00d1ff] to-blue-600 rounded-t-2xl transition-all duration-1000 shadow-[0_0_25px_rgba(0,209,255,0.2)] group-hover:shadow-[0_0_35px_rgba(0,209,255,0.4)]"
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
                <span className="text-[9px] font-black text-gray-600 uppercase italic">Día 0{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: MIX Y AUDITORÍA */}
        <div className="space-y-6">
          <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-xs font-black uppercase italic mb-8 tracking-widest flex items-center gap-2">
               Mix de Cobro en Red
            </h3>
            <div className="space-y-7">
              <ProgressItem label="Digital (Punto/PM)" val="65%" color="bg-[#00d1ff]" />
              <ProgressItem label="Efectivo (USD/BS)" val="25%" color="bg-green-500" />
              <ProgressItem label="Mixto" val="10%" color="bg-orange-500" />
            </div>
          </div>

          <div className="bg-[#111827] p-6 rounded-[2rem] border border-[#00d1ff]/10 bg-gradient-to-br from-[#111827] to-[#0a0f1a]">
            <h4 className="text-[10px] font-black text-[#00d1ff] uppercase italic flex items-center gap-2">
              <Activity size={14}/> Auditoría Master Activa
            </h4>
            <p className="text-[9px] text-gray-500 font-bold leading-relaxed mt-3 italic uppercase tracking-tighter">
              Modo Superadmin: Estás auditando el tráfico global de la red Nexo Core V3 sin interferir en los cierres de caja locales de los comercios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENTES AUXILIARES
function StatCard({ title, val, color, icon }: any) {
  return (
    <div className="bg-[#111827] p-5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
      <div className={`absolute top-4 right-4 ${color} opacity-10 group-hover:opacity-30 transition-opacity`}>{icon}</div>
      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{title}</p>
      <h2 className={`text-2xl font-black italic tracking-tighter ${color}`}>{val}</h2>
      <div className="mt-3 flex justify-end">
        <div className="p-1.5 bg-white/5 rounded-lg text-gray-600 group-hover:text-white transition-colors">
          <ArrowUpRight size={10}/>
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, val, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase italic tracking-tighter">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{val}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div className={`h-full ${color} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`} style={{ width: val }}></div>
      </div>
    </div>
  );
}