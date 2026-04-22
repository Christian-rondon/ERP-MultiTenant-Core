import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Activity, DollarSign, Zap, AlertCircle, 
  TrendingUp, Globe, Server, Database, 
  ExternalLink, ShieldCheck, RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [tasaBCV, setTasaBCV] = useState(0);
  const [comercios, setComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState<any>(null);

  // 1. CARGA INICIAL DE DATOS
  const fetchTasaConfig = async () => {
    try {
      setSyncing(true);
      const { data, error } = await supabase
        .from('configuracion')
        .select('tasa_dolar')
        .eq('id', 1)
        .single();

      if (error) throw error;
      if (data) setTasaBCV(data.tasa_dolar);
    } catch (error) {
      console.error("Error al obtener tasa:", error);
    } finally {
      setSyncing(false);
    }
  };

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

  // 2. EFECTO PARA CARGA Y TIEMPO REAL
  useEffect(() => {
    fetchTasaConfig();
    fetchComercios();

    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'configuracion'
        },
        (payload) => {
          if (payload.new && payload.new.tasa_dolar) {
            setTasaBCV(payload.new.tasa_dolar);
            setSyncing(true);
            setTimeout(() => setSyncing(false), 1500);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6 pb-10 px-4">
      
      {/* PANELES SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* WIDGET TASA (REALTIME) */}
        <div className="bg-gradient-to-br from-[#10172a] to-[#0f172a] border border-[#00d1ff]/30 p-5 rounded-2xl relative overflow-hidden group shadow-[0_0_20px_rgba(0,209,255,0.05)]">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[9px] font-black tracking-[3px] text-[#00d1ff] uppercase italic">Tasa Oficial BCV</p>
            <div 
              className={`p-1.5 rounded-lg bg-[#00d1ff]/10 text-[#00d1ff] cursor-pointer transition-all ${syncing ? 'animate-spin' : ''}`} 
              onClick={fetchTasaConfig} 
            >
              <RefreshCw size={12}/>
            </div>
          </div>
          
          <div className="flex items-end gap-2 text-white">
            <h3 className="text-4xl font-black italic tracking-tighter">
              {tasaBCV === 0 ? "..." : tasaBCV.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </h3>
            <div className="mb-1">
              <p className="text-[10px] font-black text-gray-500 uppercase leading-none">VES / USD</p>
              <p className="text-[8px] font-bold text-green-500 uppercase flex items-center gap-1 mt-1">
                <TrendingUp size={8}/> Sincronizado
              </p>
            </div>
          </div>

          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-[#00d1ff] transition-all duration-1000 shadow-[0_0_10px_#00d1ff] ${syncing ? 'w-full' : 'w-0'}`}></div>
          </div>
        </div>

        {/* SaaS MRR */}
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-white">
          <div className="flex justify-between items-start mb-3 text-gray-500">
            <p className="text-[9px] font-black tracking-[3px] uppercase">SaaS MRR (Mensual)</p>
            <TrendingUp size={14} className="text-green-500"/>
          </div>
          <h3 className="text-2xl font-black italic">${(comercios.length * 30).toFixed(2)}</h3>
          <p className="text-[8px] text-green-500 font-bold uppercase mt-1 tracking-widest">RED DE {comercios.length} NODOS</p>
        </div>

        {/* INFRAESTRUCTURA */}
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-white">
          <p className="text-[9px] font-black tracking-[3px] text-gray-500 uppercase mb-3 text-center">Infraestructura Master</p>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Server size={16} className="text-[#00d1ff]" />
              <span className="text-[7px] font-black text-gray-600 uppercase">Cloud</span>
            </div>
            <div className="h-10 w-[1px] bg-white/10"></div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-[8px] font-black uppercase italic">API Status</span>
                <span className="text-[8px] text-[#00d1ff] font-bold">Online</span>
              </div>
              {/* CORRECCIÓN LÍNEA 143: Añadido cierre de comillas y div */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00d1ff] w-[98%] h-full shadow-[0_0_8px_#00d1ff]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTAS */}
        <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 p-5 rounded-2xl border-l-4 border-l-red-500 text-white">
          <p className="text-[9px] font-black tracking-[3px] text-red-500 uppercase mb-3">Notificaciones</p>
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500 animate-pulse" />
            <p className="text-[9px] font-bold text-gray-300 leading-tight uppercase italic">
              Superadmin Activo: <br/> Vigilando {comercios.length} instancias
            </p>
          </div>
        </div>
      </div>

      {/* RADAR Y CONSOLA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6 text-white text-[10px] font-black tracking-[3px] uppercase">
              <h2><Activity size={14} className="text-[#00d1ff] inline mr-2" /> Radar Multi-Tenant</h2>
              <div className="px-2 py-1 bg-[#00d1ff]/10 rounded text-[#00d1ff]">{comercios.length} NODOS</div>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-10 text-[9px] font-black text-gray-500 animate-pulse uppercase italic">Escaneando...</div>
            ) : (
              comercios.map((comercio) => (
                <div 
                  key={comercio.id} 
                  onClick={() => setSelectedComercio(comercio)} 
                  className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedComercio?.id === comercio.id 
                    ? 'bg-[#00d1ff]/10 border-[#00d1ff]/50' 
                    : 'bg-white/5 border-transparent hover:border-[#00d1ff]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-white tracking-wider">{comercio.nombre}</p>
                      <p className="text-[8px] text-gray-500 uppercase italic">{comercio.rif}</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className={selectedComercio?.id === comercio.id ? 'text-[#00d1ff]' : 'text-gray-500'} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md w-full">
            <div className="w-16 h-16 bg-[#00d1ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#00d1ff]/20">
              <ShieldCheck size={32} className="text-[#00d1ff]" />
            </div>
            <h2 className="text-xl font-black tracking-[4px] uppercase text-white mb-2 italic">Consola de Superadmin</h2>
            <p className="text-[9px] text-gray-500 tracking-[2px] uppercase mb-8 italic">
              {selectedComercio ? `Sincronizado con: ${selectedComercio.nombre}` : 'Seleccione un nodo del radar'}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button disabled={!selectedComercio} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-white disabled:opacity-20 uppercase font-black text-[8px]">
                Panel Control
              </button>
              <button disabled={!selectedComercio} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-white disabled:opacity-20 uppercase font-black text-[8px]">
                Terminal TPV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;