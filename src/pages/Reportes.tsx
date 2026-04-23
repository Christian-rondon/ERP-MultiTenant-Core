import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  BarChart3, 
  Calendar, 
  Smartphone, 
  CreditCard, 
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet2,
  FileText,
  Activity,
  TrendingUp,
  ArrowUpRight,
  Target
} from 'lucide-react';

export default function Reportes() {
  const [loading, setLoading] = useState(true);
  const [userRol, setUserRol] = useState('');
  const [stats, setStats] = useState({
    ingresos_usd: 0,
    ingresos_bs: 0,
    egresos_usd: 0,
    egresos_bs: 0,
    balance_neto_usd: 0,
    pm_bs: 0,
    punto_bs: 0
  });

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('nexo_session') || 'null');
    const rol = session?.rol?.toLowerCase() || '';
    const id = session?.comercio_id || '';
    setUserRol(rol);
    fetchFinanzas(id, rol);
  }, []);

  async function fetchFinanzas(id: string, rol: string) {
    try {
      setLoading(true);
      
      // Consultas paralelas a Supabase
      let ventasQuery = supabase.from('ventas').select('*');
      let gastosQuery = supabase.from('gastos').select('*');

      // Si no es superadmin, filtramos por el comercio del dueño
      if (rol !== 'superadmin') {
        ventasQuery = ventasQuery.eq('comercio_id', id);
        gastosQuery = gastosQuery.eq('comercio_id', id);
      }

      const [ventasRes, gastosRes] = await Promise.all([ventasQuery, gastosQuery]);

      // Calcular Ingresos por método de pago
      const tIngresos = ventasRes.data?.reduce((acc, v) => {
        acc.usd += Number(v.total_usd || 0);
        acc.bs += Number(v.total_bs || 0);
        if (v.metodo_pago === 'pago_movil') acc.pm += Number(v.total_bs || 0);
        if (v.metodo_pago === 'punto') acc.punto += Number(v.total_bs || 0);
        return acc;
      }, { usd: 0, bs: 0, pm: 0, punto: 0 }) || { usd: 0, bs: 0, pm: 0, punto: 0 };

      // Calcular Egresos (Salidas)
      const tEgresos = gastosRes.data?.reduce((acc, g) => {
        acc.usd += Number(g.monto_usd || 0);
        acc.bs += Number(g.monto_bs || 0);
        return acc;
      }, { usd: 0, bs: 0 }) || { usd: 0, bs: 0 };

      setStats({
        ingresos_usd: tIngresos.usd,
        ingresos_bs: tIngresos.bs,
        egresos_usd: tEgresos.usd,
        egresos_bs: tEgresos.bs,
        balance_neto_usd: tIngresos.usd - tEgresos.usd,
        pm_bs: tIngresos.pm,
        punto_bs: tIngresos.punto
      });
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="p-20 text-center">
      <Activity className="mx-auto text-[#00d1ff] animate-spin mb-4" size={40} />
      <p className="text-[#00d1ff] font-black uppercase italic tracking-widest">Sincronizando Auditoría Master...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-[#0a0f1a] min-h-screen text-white animate-in fade-in duration-700">
      
      {/* HEADER DINÁMICO */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            {userRol === 'superadmin' ? 'Master BI' : 'Auditoría Real'}
          </h1>
          <p className="text-[#00d1ff] text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Análisis de Flujo de Caja y Rendimiento Operativo
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-[10px] font-bold uppercase">{new Date().toLocaleDateString()}</span>
          </div>
          <button className="bg-[#00d1ff] text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(0,209,255,0.3)] hover:scale-105 transition-transform">
            <FileText size={14}/> PDF Report
          </button>
        </div>
      </header>

      {/* MÉTRICAS PRINCIPALES (BALANCE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Ingresos (Entradas)" 
          val={`$${stats.ingresos_usd.toLocaleString()}`} 
          color="text-green-400" 
          icon={<ArrowUpCircle/>} 
          sub={`Bs. ${stats.ingresos_bs.toLocaleString()}`} 
        />
        <StatCard 
          label="Egresos (Salidas)" 
          val={`$${stats.egresos_usd.toLocaleString()}`} 
          color="text-red-400" 
          icon={<ArrowDownCircle/>} 
          sub={`Bs. ${stats.egresos_bs.toLocaleString()}`} 
        />
        <StatCard 
          label="Utilidad Neta" 
          val={`$${stats.balance_neto_usd.toLocaleString()}`} 
          color="text-[#00d1ff]" 
          icon={<Wallet2/>} 
          sub="Balance Real en USD" 
          highlight 
        />
      </div>

      {/* DESGLOSE POR MÉTODOS DE PAGO (SOLO DUEÑO/ADMIN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard label="Pago Móvil" val={`Bs. ${stats.pm_bs.toLocaleString()}`} icon={<Smartphone size={14}/>} />
        <MiniCard label="Punto de Venta" val={`Bs. ${stats.punto_bs.toLocaleString()}`} icon={<CreditCard size={14}/>} />
        <MiniCard label="Efectivo USD" val={`$${stats.ingresos_usd.toLocaleString()}`} icon={<DollarSign size={14}/>} />
        <MiniCard label="Tasa Aplicada" val="BCV" icon={<TrendingUp size={14}/>} />
      </div>

      {/* ÁREA DE GRÁFICOS Y ANÁLISIS */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-white/5 p-8 rounded-[2.5rem] min-h-[350px] relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black uppercase italic tracking-widest flex items-center gap-2">
              <BarChart3 size={16} className="text-[#00d1ff]"/> Rendimiento Semanal
            </h3>
            <ArrowUpRight className="text-gray-700" />
          </div>
          
          {/* Gráfico Visual (Placeholder dinámico) */}
          <div className="flex items-end justify-between h-48 px-4 border-b border-white/5 pb-2">
            {[40, 65, 35, 90, 55, 70, 45].map((h, i) => (
              <div 
                key={i} 
                className="w-12 bg-gradient-to-t from-[#00d1ff]/5 to-[#00d1ff]/40 rounded-t-xl hover:to-[#00d1ff] transition-all cursor-pointer group relative"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#00d1ff] text-black text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[8px] font-black text-gray-600 uppercase tracking-widest">
            <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#111827] to-[#0a0f1a] border border-white/5 p-8 rounded-[2.5rem]">
           <div className="flex items-center gap-2 mb-6">
             <Target size={16} className="text-[#00d1ff]"/>
             <h3 className="text-xs font-black uppercase italic tracking-widest">Estado Operativo</h3>
           </div>
           <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] font-black text-gray-500 uppercase">Estatus de Caja</p>
                <p className="text-xl font-black text-green-400 italic mt-1 uppercase">Cuadrada</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[8px] font-black text-gray-500 uppercase">Nivel de Gastos</p>
                <p className={`text-xl font-black italic mt-1 uppercase ${stats.egresos_usd > stats.ingresos_usd / 2 ? 'text-red-500' : 'text-white'}`}>
                  {stats.egresos_usd > stats.ingresos_usd / 2 ? 'Crítico' : 'Estable'}
                </p>
              </div>
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic transition-all">
                Ver Detalles de Auditoría
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

// Componentes de soporte
function StatCard({ label, val, color, icon, sub, highlight }: any) {
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] ${highlight ? 'bg-[#00d1ff]/5 border-[#00d1ff]/30 shadow-[0_0_50px_rgba(0,209,255,0.05)]' : 'bg-[#111827] border-white/5 shadow-2xl'}`}>
      <div className="flex justify-between items-center mb-6">
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">{label}</span>
        <div className={`${color} p-2 bg-white/5 rounded-lg`}>{icon}</div>
      </div>
      <h2 className={`text-4xl font-black italic tracking-tighter leading-none ${color}`}>{val}</h2>
      <p className="text-[10px] font-bold text-gray-600 uppercase italic mt-4 tracking-tighter">{sub}</p>
    </div>
  );
}

function MiniCard({ label, val, icon }: any) {
  return (
    <div className="bg-[#111827] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-lg text-[#00d1ff]">{icon}</div>
      <div>
        <p className="text-[8px] font-black text-gray-500 uppercase leading-none mb-1">{label}</p>
        <p className="text-xs font-black text-white italic">{val}</p>
      </div>
    </div>
  );
}