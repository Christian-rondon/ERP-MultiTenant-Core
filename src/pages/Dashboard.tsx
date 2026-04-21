import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import StoreDashboard from './StoreDashboard'; // Importamos tu componente existente
import { 
  Activity, Zap, AlertCircle, 
  TrendingUp, Globe, Server, 
  ExternalLink, ShieldCheck
} from 'lucide-react';

const Dashboard = () => {
  const [tasaBCV, setTasaBCV] = useState(45.12);
  const [comercios, setComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComercio, setSelectedComercio] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'superadmin' | 'remoto'>('superadmin');

  useEffect(() => {
    fetchComercios();
  }, []);

  const fetchComercios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('nombre', { ascending: true });
      if (error) throw error;
      setComercios(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Activa la vista de StoreDashboard con los datos del seleccionado
  const entrarADashboardRemoto = () => {
    if (selectedComercio) {
      setViewMode('remoto');
    }
  };

  // Si estamos en modo remoto, mostramos el StoreDashboard
  if (viewMode === 'remoto' && selectedComercio) {
    return (
      <div className="animate-in fade-in duration-500">
        <button 
          onClick={() => setViewMode('superadmin')}
          className="mb-4 text-[10px] font-black text-[#00d1ff] uppercase bg-[#00d1ff]/10 px-4 py-2 rounded-lg border border-[#00d1ff]/20 hover:bg-[#00d1ff]/20 transition-all"
        >
          ← Volver al Panel Central
        </button>
        <StoreDashboard 
          comercioId={selectedComercio.id}
          nombreComercio={selectedComercio.nombre}
          rif={selectedComercio.rif}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* PANELES SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl text-white">
          <p className="text-[9px] font-black tracking-[3px] text-gray-500 uppercase">SaaS MRR</p>
          <h3 className="text-2xl font-black italic">${comercios.length * 30}.00</h3>
        </div>
        <div className="bg-[#10172a]/60 border border-[#00d1ff]/20 p-5 rounded-2xl text-white text-center">
          <p className="text-[9px] font-black tracking-[3px] text-[#00d1ff] uppercase">Tasa BCV</p>
          <h3 className="text-2xl font-black italic">{tasaBCV}</h3>
        </div>
        <div className="bg-[#10172a]/60 border border-white/10 p-5 rounded-2xl text-white">
          <p className="text-[9px] font-black tracking-[3px] text-gray-500 uppercase">Infraestructura</p>
          <div className="w-full bg-white/5 h-1 rounded-full mt-4"><div className="bg-green-500 w-[95%] h-full"></div></div>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl text-white">
          <p className="text-[9px] font-black tracking-[3px] text-red-500 uppercase">Alertas</p>
          <p className="text-[9px] font-bold text-gray-300 animate-pulse">Vigilancia Activa</p>
        </div>
      </div>

      {/* RADAR Y MÓDULO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-[#10172a]/60 border border-white/10 rounded-3xl p-6">
          <h2 className="text-[10px] font-black tracking-[3px] uppercase text-white mb-6 flex items-center gap-2">
            <Activity size={14} className="text-[#00d1ff]" /> Radar Tenants
          </h2>
          <div className="space-y-3">
            {comercios.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedComercio(c)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedComercio?.id === c.id ? 'bg-[#00d1ff]/10 border-[#00d1ff]/50' : 'bg-white/5 border-transparent'}`}
              >
                <p className="text-[10px] font-black text-white uppercase">{c.nombre}</p>
                <p className="text-[8px] text-gray-500 uppercase">{c.rif}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#10172a]/60 border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[450px]">
          <ShieldCheck size={48} className="text-[#00d1ff] mb-4" />
          <h2 className="text-2xl font-black text-white italic uppercase tracking-widest">Impersonación</h2>
          <p className="text-[10px] text-gray-500 uppercase mb-8">{selectedComercio ? `LISTO: ${selectedComercio.nombre}` : 'Selecciona un comercio'}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
            <button 
              onClick={entrarADashboardRemoto}
              disabled={!selectedComercio}
              className="flex flex-col items-center gap-2 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-green-500/50 transition-all text-white disabled:opacity-20"
            >
              <Globe size={20} />
              <span className="text-[9px] font-black uppercase">Ver Dashboard Dueño</span>
            </button>
            <button 
              disabled={!selectedComercio}
              className="flex flex-col items-center gap-2 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00d1ff]/50 transition-all text-white disabled:opacity-20"
            >
              <Zap size={20} />
              <span className="text-[9px] font-black uppercase">Ver Terminal POS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;