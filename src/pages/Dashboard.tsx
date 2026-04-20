import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Activity, DollarSign, Zap, AlertCircle, 
  TrendingUp, Globe, Server, Database, 
  ExternalLink, ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const [tasaBCV, setTasaBCV] = useState(45.12);
  const [comercios, setComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el comercio seleccionado
  const [selectedComercio, setSelectedComercio] = useState<any>(null);

  const fetchComercios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('creado_en', { ascending: false });

      if (error) throw error;
      setComercios(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComercios();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      
      {/* SECCIÓN 1: PANELES SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl group hover:border-green-500/30 transition-all text-white">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[9px] font-black tracking-[3px] text-gray-500 uppercase">SaaS MRR (Mensual)</p>
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><TrendingUp size={14}/></div>
          </div>
          <h3 className="text-2xl font-black italic">${comercios.length * 30}.00</h3>
          <p className="text-[8px] text-green-500 font-bold uppercase mt-1">BASADO EN {comercios.length} NODOS</p>
        </div>

        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-[#00d1ff]/20 p-5 rounded-2xl relative overflow-hidden group text-white">
          <p className="text-[9px] font-black tracking-[3px] text-[#00d1ff] uppercase mb-3">Monitor Tasa BCV</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black italic">{tasaBCV}</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Bs / USD</span>
          </div>
          <button className="text-[8px] font-bold text-gray-500 hover:text-[#00d1ff] uppercase mt-2 tracking-widest flex items-center gap-1 transition-colors">
             Sincronizar Manualmente <Zap size={8}/>
          </button>
        </div>

        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-white">
          <p className="text-[9px] font-black tracking-[3px] text-gray-500 uppercase mb-3">Infraestructura (API/DB)</p>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Server size={14} className="text-green-500" />
              <span className="text-[7px] font-bold text-gray-600 uppercase">Cloud</span>
            </div>
            <div className="h-8 w-[1px] bg-white/5"></div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-[8px] font-bold uppercase">Supabase Latency</span>
                <span className="text-[8px] text-green-500 font-bold">24ms</span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-green-500 w-[95%] h-full shadow-[0_0_8px_#22c55e]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 p-5 rounded-2xl border-l-4 border-l-red-500 text-white">
          <p className="text-[9px] font-black tracking-[3px] text-red-500 uppercase mb-3">Alertas del Sistema</p>
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 animate-pulse" />
            <p className="text-[9px] font-bold text-gray-300 leading-tight uppercase">
              Vigilancia requerida en suscripciones <br/> próximas a vencer
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: RADAR Y CONSOLA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RADAR DINÁMICO */}
        <div className="lg:col-span-4 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6 text-white">
            <h2 className="text-[10px] font-black tracking-[3px] uppercase flex items-center gap-2">
              <Activity size={14} className="text-[#00d1ff]" /> Radar Multi-Tenant
            </h2>
            <div className="px-2 py-1 bg-[#00d1ff]/10 rounded text-[8px] font-bold text-[#00d1ff]">
              {comercios.length} ACTIVOS
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-10 text-[9px] font-black text-gray-500 animate-pulse uppercase">Escaneando...</div>
            ) : (
              comercios.map((comercio) => (
                <div 
                  key={comercio.id} 
                  onClick={() => setSelectedComercio(comercio)}
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedComercio?.id === comercio.id 
                    ? 'bg-[#00d1ff]/10 border-[#00d1ff]/50 shadow-[0_0_15px_rgba(0,209,255,0.1)]' 
                    : 'bg-white/5 border-transparent hover:border-[#00d1ff]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${comercio.estado === 'Activo' ? 'bg-green-500 shadow-green-500' : 'bg-red-500 shadow-red-500'}`} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-white">{comercio.nombre}</p>
                      <p className="text-[8px] text-gray-500 tracking-[2px] uppercase">{comercio.rif} • {comercio.plan}</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className={selectedComercio?.id === comercio.id ? 'text-[#00d1ff]' : 'text-gray-500'} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* CONSOLA DE IMPERSONACIÓN CON RUTAS ACTIVAS */}
        <div className="lg:col-span-8 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
          <div className="relative z-10 w-full max-w-md text-center">
            <div className="w-20 h-20 bg-[#00d1ff]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#00d1ff]/20">
              <ShieldCheck size={40} className="text-[#00d1ff]" />
            </div>
            
            <h2 className="text-2xl font-black tracking-[4px] uppercase text-white mb-4 italic">Módulo de Impersonación</h2>
            <p className="text-[10px] text-gray-500 tracking-[2px] uppercase mb-10 leading-relaxed">
              {selectedComercio 
                ? `SESIÓN LISTA: ${selectedComercio.nombre}` 
                : 'Selecciona un comercio del radar para habilitar el acceso remoto.'
              }
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* BOTÓN DASHBOARD DUEÑO */}
              <button 
                onClick={() => selectedComercio && window.open(`/admin/view/${selectedComercio.id}`, '_blank')}
                disabled={!selectedComercio}
                className="group flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-green-500/50 hover:bg-green-500/5 transition-all text-white disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Globe size={20} className="text-gray-500 group-hover:text-green-500 transition-colors" />
                <span className="text-[9px] font-black tracking-[2px] uppercase">Ver Dashboard Dueño</span>
              </button>

              {/* BOTÓN TERMINAL POS */}
              <button 
                onClick={() => selectedComercio && window.open(`/pos/${selectedComercio.id}`, '_blank')}
                disabled={!selectedComercio}
                className="group flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00d1ff]/50 hover:bg-[#00d1ff]/5 transition-all text-white disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Zap size={20} className="text-gray-500 group-hover:text-[#00d1ff] transition-colors" />
                <span className="text-[9px] font-black tracking-[2px] uppercase">Ver Terminal POS</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;