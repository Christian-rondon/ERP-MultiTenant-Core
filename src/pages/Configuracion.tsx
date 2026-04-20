import React from 'react';
import { 
  Settings, Globe, Shield, Bell, 
  Database, Zap, Save, RefreshCw,
  Percent, Building2, Smartphone, Monitor
} from 'lucide-react';

const Configuracion = () => {
  return (
    <div className="space-y-6 pb-10">
      
      {/* HEADER DE CONFIGURACIÓN */}
      <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex justify-between items-center shadow-[0_0_50px_rgba(0,209,255,0.05)]">
        <div>
          <h2 className="text-3xl font-black tracking-[4px] uppercase text-white italic">System Settings</h2>
          <p className="text-[10px] font-bold tracking-[3px] text-[#00d1ff] uppercase mt-2 italic">Configuración Global Nexo V3</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00d1ff] to-[#0057ff] text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)] uppercase text-[10px] tracking-widest">
          <Save size={18} /> Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL IZQUIERDO: AJUSTES FINANCIEROS */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xs font-black tracking-[3px] uppercase text-white mb-8 flex items-center gap-2">
              <RefreshCw size={16} className="text-[#00d1ff]" /> Parámetros de Moneda (BCV)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Tasa de Cambio Actual (Bs/$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00d1ff] font-bold">Bs.</span>
                  <input type="number" defaultValue="45.12" className="w-full pl-12 p-4 bg-[#050a15]/60 border border-white/10 rounded-2xl text-white font-black focus:border-[#00d1ff]/50 outline-none" />
                </div>
                <p className="text-[8px] text-gray-600 font-bold italic uppercase tracking-tighter">Última actualización: Hoy 08:30 AM</p>
              </div>
              
              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ajuste de Protección (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input type="number" defaultValue="2" className="w-full pl-12 p-4 bg-[#050a15]/60 border border-white/10 rounded-2xl text-white font-black focus:border-[#00d1ff]/50 outline-none" />
                </div>
                <p className="text-[8px] text-gray-600 font-bold italic uppercase tracking-tighter">Margen de seguridad sobre la tasa oficial.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xs font-black tracking-[3px] uppercase text-white mb-8 flex items-center gap-2">
              <Building2 size={16} className="text-purple-500" /> Perfil de Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="RAZÓN SOCIAL" className="p-4 bg-[#050a15]/60 border border-white/10 rounded-2xl text-white text-[10px] font-bold uppercase focus:border-[#00d1ff]/50 outline-none" />
              <input type="text" placeholder="RIF (J-00000000-0)" className="p-4 bg-[#050a15]/60 border border-white/10 rounded-2xl text-white text-[10px] font-bold uppercase focus:border-[#00d1ff]/50 outline-none" />
              <input type="text" placeholder="TELÉFONO DE CONTACTO" className="p-4 bg-[#050a15]/60 border border-white/10 rounded-2xl text-white text-[10px] font-bold uppercase focus:border-[#00d1ff]/50 outline-none" />
              <input type="text" placeholder="DIRECCIÓN FISCAL" className="p-4 bg-[#050a15]/60 border border-white/10 rounded-2xl text-white text-[10px] font-bold uppercase focus:border-[#00d1ff]/50 outline-none" />
            </div>
          </div>
        </div>

        {/* PANEL DERECHO: OPCIONES DE SISTEMA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xs font-black tracking-[3px] uppercase text-white mb-6">Módulos Activos</h3>
            <div className="space-y-4">
              {[
                { label: 'Facturación IGTF', icon: <Shield size={14}/>, active: true },
                { label: 'Alertas WhatsApp', icon: <Smartphone size={14}/>, active: false },
                { label: 'Sincronización Cloud', icon: <Zap size={14}/>, active: true },
              ].map((mod, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[#00d1ff]">{mod.icon}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{mod.label}</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${mod.active ? 'bg-[#00d1ff]' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${mod.active ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-3xl">
            <h3 className="text-[10px] font-black tracking-[3px] uppercase text-orange-500 mb-4 flex items-center gap-2">
              <Database size={16} /> Mantenimiento
            </h3>
            <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase text-[9px] tracking-widest mb-3">
              Limpiar Caché
            </button>
            <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase text-[9px] tracking-widest">
              Backup de Base de Datos
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Configuracion;