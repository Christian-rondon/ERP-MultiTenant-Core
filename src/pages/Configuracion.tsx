import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Settings, Globe, Shield, Bell, 
  Database, Zap, Save, RefreshCw,
  Percent, Building2, Smartphone, Monitor, CheckCircle, AlertTriangle
} from 'lucide-react';

const Configuracion = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [config, setConfig] = useState({
    tasa_dolar: 0,
    ajuste_proteccion: 0,
    razon_social: '',
    rif: '',
    telefono: '',
    direccion: '',
    updated_at: ''
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('configuracion')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      if (data) {
        setConfig({
          tasa_dolar: data.tasa_dolar || 0,
          ajuste_proteccion: data.ajuste_proteccion || 0,
          razon_social: data.razon_social || '',
          rif: data.rif || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          updated_at: data.updated_at || ''
        });
      }
    } catch (error) {
      console.error('Error al cargar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      
      const dataToUpdate = {
        tasa_dolar: Number(config.tasa_dolar),
        ajuste_proteccion: Number(config.ajuste_proteccion),
        razon_social: config.razon_social.trim(),
        rif: config.rif.trim(),
        telefono: config.telefono.trim(),
        direccion: config.direccion.trim(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('configuracion')
        .update(dataToUpdate)
        .eq('id', 1);

      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchConfig(); 
    } catch (error: any) {
      alert("Error al sincronizar con la base de datos");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-[#00d1ff] font-black animate-pulse uppercase tracking-[5px]">Accediendo al Núcleo...</div>;

  return (
    <div className="space-y-6 pb-20">
      
      {/* HEADER PRINCIPAL */}
      <div className="bg-[#10172a]/80 backdrop-blur-2xl border border-[#00d1ff]/20 p-8 rounded-3xl flex justify-between items-center shadow-[0_0_50px_rgba(0,209,255,0.1)]">
        <div>
          <h2 className="text-3xl font-black tracking-[4px] uppercase text-white italic">Panel de Control</h2>
          <p className="text-[10px] font-bold tracking-[3px] text-[#00d1ff] uppercase italic mt-1">Configuración Maestra Nexo V3</p>
        </div>
        
        {showSuccess && (
          <div className="flex items-center gap-2 text-green-400 font-black text-[10px] animate-pulse uppercase bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
            <CheckCircle size={14}/> ¡Sincronizado!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          
          {/* SECCIÓN DE TASA (EL CORAZÓN) */}
          <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black tracking-[3px] uppercase text-white flex items-center gap-2">
                <Zap size={16} className="text-[#00d1ff]" /> Parámetros Financieros
              </h3>
              <span className="text-[8px] bg-white/5 px-2 py-1 rounded text-gray-500 font-bold uppercase">ID de Registro: 001</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* INPUT TASA */}
              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tasa del Dólar (VES)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00d1ff] font-black text-sm">Bs.</div>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full pl-12 p-5 bg-black/40 border border-white/10 rounded-2xl text-white font-black focus:border-[#00d1ff] focus:ring-1 focus:ring-[#00d1ff]/50 outline-none transition-all text-2xl" 
                    value={config.tasa_dolar}
                    onChange={(e) => setConfig({...config, tasa_dolar: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              {/* INPUT AJUSTE */}
              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ajuste de Protección (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    type="number" 
                    className="w-full pl-12 p-5 bg-black/40 border border-white/10 rounded-2xl text-white font-black focus:border-[#00d1ff]/50 outline-none transition-all text-2xl" 
                    value={config.ajuste_proteccion}
                    onChange={(e) => setConfig({...config, ajuste_proteccion: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            {/* BOTÓN GUARDAR VISIBLE */}
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[4px] text-xs flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl ${
                saving 
                ? 'bg-gray-800 text-gray-500' 
                : 'bg-[#00d1ff] text-black hover:bg-[#00b8e6] shadow-[#00d1ff]/20'
              }`}
            >
              {saving ? (
                <> <RefreshCw size={20} className="animate-spin" /> Procesando... </>
              ) : (
                <> <Save size={20} /> Guardar y Sincronizar Cambios </>
              )}
            </button>
          </div>

          {/* PERFIL EMPRESA */}
          <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xs font-black tracking-[3px] uppercase text-white mb-8 flex items-center gap-2">
              <Building2 size={16} className="text-purple-500" /> Datos Fiscales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <p className="text-[8px] font-bold text-gray-600 uppercase ml-2">Nombre o Razón Social</p>
                 <input type="text" value={config.razon_social} onChange={(e) => setConfig({...config, razon_social: e.target.value.toUpperCase()})} className="w-full p-4 bg-black/20 border border-white/5 rounded-xl text-white text-[10px] font-bold uppercase focus:border-[#00d1ff]/50 outline-none" />
              </div>
              <div className="space-y-2">
                 <p className="text-[8px] font-bold text-gray-600 uppercase ml-2">RIF Jurídico</p>
                 <input type="text" value={config.rif} onChange={(e) => setConfig({...config, rif: e.target.value.toUpperCase()})} className="w-full p-4 bg-black/20 border border-white/5 rounded-xl text-white text-[10px] font-bold uppercase focus:border-[#00d1ff]/50 outline-none" />
              </div>
              <div className="space-y-2">
                 <p className="text-[8px] font-bold text-gray-600 uppercase ml-2">Teléfono Principal</p>
                 <input type="text" value={config.telefono} onChange={(e) => setConfig({...config, telefono: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-xl text-white text-[10px] font-bold uppercase focus:border-[#00d1ff]/50 outline-none" />
              </div>
              <div className="space-y-2">
                 <p className="text-[8px] font-bold text-gray-600 uppercase ml-2">Dirección de Sede</p>
                 <input type="text" value={config.direccion} onChange={(e) => setConfig({...config, direccion: e.target.value.toUpperCase()})} className="w-full p-4 bg-black/20 border border-white/5 rounded-xl text-white text-[10px] font-bold uppercase focus:border-[#00d1ff]/50 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* BARRA LATERAL */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Database size={20}/></div>
                <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Estado del Sistema</h4>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                   <span className="text-[8px] font-bold text-gray-500 uppercase">Latencia Cloud</span>
                   <span className="text-[8px] font-bold text-green-500">12ms - EXCELENTE</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                   <span className="text-[8px] font-bold text-gray-500 uppercase">Seguridad RLS</span>
                   <span className="text-[8px] font-bold text-[#00d1ff]">ACTIVA</span>
                </div>
             </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl">
             <h4 className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={16}/> Zona Crítica
             </h4>
             <button onClick={() => window.location.reload()} className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black rounded-xl hover:bg-red-500/20 transition-all uppercase text-[8px] tracking-widest">
                Reiniciar Servidor Local
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;