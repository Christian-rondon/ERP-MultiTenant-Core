import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Activity, DollarSign, Zap, AlertCircle, 
  TrendingUp, Globe, Server, Database, 
  ExternalLink, ShieldCheck, RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasaBCV, setTasaBCV] = useState(0);
  const [comercios, setComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedComercio, setSelectedComercio] = useState<any>(null);

  // CARGA DE TASA BCV
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

  // CARGA DE COMERCIOS (NODOS)
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
    fetchTasaConfig();
    fetchComercios();

    const channel = supabase
      .channel('dashboard-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'configuracion' }, 
        (payload) => {
          if (payload.new && payload.new.tasa_dolar) {
            setTasaBCV(payload.new.tasa_dolar);
            setSyncing(true);
            setTimeout(() => setSyncing(false), 1500);
          }
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="space-y-6 pb-10 px-4">
      {/* PANELES SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(0,242,255,0.05)] neon-border">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[9px] font-black tracking-[3px] text-electric-cyan uppercase italic">Tasa Oficial BCV</p>
            <div className={`p-1.5 rounded-lg bg-electric-cyan/10 text-electric-cyan cursor-pointer transition-all duration-300 ${syncing ? 'animate-spin' : ''}`} onClick={fetchTasaConfig}>
              <RefreshCw size={12}/>
            </div>
          </div>
          <div className="flex items-end gap-2 text-white">
            <h3 className="text-4xl font-black italic tracking-tighter">
              {tasaBCV === 0 ? "..." : tasaBCV.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
            </h3>
            <div className="mb-1 text-[10px] font-black text-silver-gray uppercase leading-none">VES / USD</div>
          </div>
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-neon-emerald transition-all duration-1000 ${syncing ? 'w-full' : 'w-0'}`}></div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl text-white">
          <p className="text-[9px] font-black tracking-[3px] uppercase text-silver-gray mb-3">SaaS MRR (Mensual)</p>
          <h3 className="text-2xl font-black italic text-electric-cyan">${(comercios.length * 30).toFixed(2)}</h3>
          <p className="text-[8px] text-neon-emerald font-bold uppercase mt-1">RED DE {comercios.length} NODOS ACTIVOS</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl text-white">
          <p className="text-[9px] font-black tracking-[3px] text-silver-gray uppercase mb-3 text-center">Infraestructura</p>
          <div className="flex items-center gap-4">
            <Server size={16} className="text-electric-cyan" />
            <div className="flex-1">
              <div className="flex justify-between text-[8px] font-black uppercase mb-1">
                <span>API Status</span>
                <span className="text-electric-cyan">Online</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-electric-cyan w-[98%] h-full"></div></div>
            </div>
          </div>
        </div>

        <div className="bg-neon-emerald/5 border border-neon-emerald/20 p-5 rounded-2xl border-l-4 border-l-neon-emerald text-white">
          <p className="text-[9px] font-black tracking-[3px] text-neon-emerald uppercase mb-3">Notificaciones</p>
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-neon-emerald animate-pulse" />
            <p className="text-[9px] font-bold text-silver-gray uppercase italic">Superadmin Vigilando {comercios.length} instancias</p>
          </div>
        </div>
      </div>

      {/* RADAR Y CONSOLA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6 text-white text-[10px] font-black tracking-[3px] uppercase">
            <h2><Activity size={14} className="text-electric-cyan inline mr-2" /> Radar de Nodos</h2>
            <div className="px-2 py-1 bg-electric-cyan/10 rounded text-electric-cyan">{comercios.length}</div>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? <div className="text-center py-10 text-[9px] font-black text-silver-gray animate-pulse uppercase">Escaneando...</div> :
              comercios.map((comercio) => (
                <div 
                  key={comercio.id} 
                  onClick={() => setSelectedComercio(comercio)} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    selectedComercio?.id === comercio.id ? 'bg-electric-cyan/10 border-electric-cyan/50 shadow-[0_0_15px_rgba(0,242,255,0.1)]' : 'bg-white/5 border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${selectedComercio?.id === comercio.id ? 'bg-electric-cyan' : 'bg-neon-emerald'} shadow-[0_0_8px]`} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-white">{comercio.nombre}</p>
                      <p className="text-[8px] text-silver-gray uppercase italic">{comercio.rif}</p>
                    </div>
                  </div>
                  <ExternalLink size={14} className={selectedComercio?.id === comercio.id ? 'text-electric-cyan' : 'text-silver-gray'} />
                </div>
              ))
            }
          </div>
        </div>

        <div className="lg:col-span-8 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md w-full">
            <div className="w-16 h-16 bg-electric-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-electric-cyan/20">
              <ShieldCheck size={32} className="text-electric-cyan" />
            </div>
            <h2 className="text-xl font-black tracking-[4px] uppercase text-white mb-2 italic">Consola Maestra</h2>
            <p className="text-[9px] text-silver-gray tracking-[2px] uppercase mb-8 italic">
              {selectedComercio ? `Sincronizado: ${selectedComercio.nombre}` : 'Seleccione un nodo del radar'}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                disabled={!selectedComercio} 
                onClick={() => {
                  localStorage.setItem('nexo_current_comercio', JSON.stringify(selectedComercio));
                  navigate(`/admin/view/${selectedComercio.id}`);
                }}
                className="p-6 bg-electric-cyan/5 border border-electric-cyan/20 rounded-2xl text-white hover:bg-electric-cyan/20 disabled:opacity-20 uppercase font-black text-[8px] transition-all duration-300 hover:neon-glow"
              >
                Panel Control
              </button>

              <button 
                disabled={!selectedComercio} 
                onClick={() => {
                  localStorage.setItem('nexo_current_comercio', JSON.stringify(selectedComercio));
                  navigate('/pos');
                }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 disabled:opacity-20 uppercase font-black text-[8px] transition-all duration-300"
              >
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