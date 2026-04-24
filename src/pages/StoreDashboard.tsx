import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  ArrowUpRight,
  Calendar
} from 'lucide-react';

// CORRECCIÓN DE RUTA: Según tu captura, subes un nivel desde pages/ para entrar a lib/
import { supabase } from '../lib/supabase'; 

const StoreDashboard = () => {
  const [metrics, setMetrics] = useState({
    ventasHoy: 0,
    clientesNuevos: 0,
    utilidadEstimada: 0,
    operaciones: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        // El aislamiento comienza aquí: pronto filtraremos por el store_id del usuario
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Placeholder para la data del comercio
          setMetrics({
            ventasHoy: 0.00,
            clientesNuevos: 0,
            utilidadEstimada: 0.00,
            operaciones: 0
          });
        }
      } catch (error) {
        console.error("Error en Dashboard de Dueño:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  return (
    <div className="space-y-8 p-4">
      {/* HEADER EXCLUSIVO DUEÑO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black italic uppercase text-white tracking-tighter">
            Panel de Control <span className="text-red-600">Comercio</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Métricas de rendimiento de tu negocio
          </p>
        </div>
        
        <div className="bg-[#0a0f1a] border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
          <Calendar size={16} className="text-red-600" />
          <span className="text-xs font-bold text-white uppercase italic">
            {new Date().toLocaleDateString('es-VE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
      </div>

      {/* KPIs PARA EL DUEÑO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ventas de Hoy', val: `$ ${metrics.ventasHoy.toFixed(2)}`, icon: <DollarSign />, color: 'green' },
          { label: 'Utilidad Neta', val: `$ ${metrics.utilidadEstimada.toFixed(2)}`, icon: <TrendingUp />, color: 'blue' },
          { label: 'Operaciones', val: metrics.operaciones, icon: <Activity />, color: 'red' },
          { label: 'Clientes', val: metrics.clientesNuevos, icon: <Users />, color: 'purple' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#0a0f1a] border border-white/5 p-6 rounded-[2rem] hover:border-red-600/30 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-2xl text-white group-hover:text-red-600 transition-colors">
                {kpi.icon}
              </div>
              <ArrowUpRight size={14} className="text-gray-700" />
            </div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[3px] mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-white italic">{loading ? '...' : kpi.val}</h3>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-red-600/5 blur-3xl rounded-full"></div>
          </div>
        ))}
      </div>

      {/* ESPACIO PARA GRÁFICOS PERSONALIZADOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0a0f1a] border border-white/5 p-8 rounded-[3rem] min-h-[350px] flex flex-col justify-center items-center shadow-2xl">
            <Activity size={40} className="text-gray-800 mb-4 animate-pulse" />
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[5px] text-center">
              Radar de Operaciones <br/> <span className="text-red-600/40">Filtro de Seguridad Activo</span>
            </p>
        </div>

        <div className="bg-[#0a0f1a] border border-white/5 p-8 rounded-[2.5rem] shadow-xl">
          <h2 className="text-xs font-black text-white uppercase italic mb-6 border-b border-white/5 pb-4 tracking-widest text-center">
            Estado de Tienda
          </h2>
          <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]"></div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">En Línea</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;