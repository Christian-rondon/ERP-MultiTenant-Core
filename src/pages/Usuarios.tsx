import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Store, UserPlus, ShieldCheck, CheckCircle, X } from 'lucide-react';

const Usuarios = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Estado para la notificación
  const [formData, setFormData] = useState({
    nombre: '',
    rif: '', 
    direccion: '',
    propietario: '',
    whatsapp: '',
    usuarioAcceso: '', 
    passwordAcceso: ''
  });

  // Efecto para ocultar la notificación automáticamente
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const registrarTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: comercio, error: errComercio } = await supabase
        .from('comercios')
        .insert([{ 
          nombre: formData.nombre,
          rif: formData.rif,
          direccion: formData.direccion,
          propietario: formData.propietario,
          whatsapp: formData.whatsapp,
          plan: 'Basic', 
          estado: 'Activo' 
        }])
        .select().single();

      if (errComercio) throw errComercio;

      const { error: errAcceso } = await supabase
        .from('usuarios_accesos')
        .insert([{
          usuario: formData.usuarioAcceso,
          password: formData.passwordAcceso,
          comercio_id: comercio.id,
          rol: 'dueño'
        }]);

      if (errAcceso) throw errAcceso;

      // ACTIVAR NOTIFICACIÓN VISUAL
      setShowSuccess(true);
      
      setFormData({ 
        nombre: '', rif: '', direccion: '', 
        propietario: '', whatsapp: '', 
        usuarioAcceso: '', passwordAcceso: '' 
      });

    } catch (err: any) {
      console.error("Error:", err);
      alert("ERROR: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#00d1ff] text-[#10172a] px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,209,255,0.3)] flex items-center gap-4 border-2 border-white/20">
            <div className="bg-white/20 p-2 rounded-full">
              <CheckCircle size={24} className="animate-bounce" />
            </div>
            <div>
              <p className="font-black uppercase tracking-tighter text-sm">Comercio Registrado con éxito</p>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Instancia Nexo V3 desplegada</p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="ml-4 hover:rotate-90 transition-transform">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#10172a]/90 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-white font-black uppercase tracking-[4px] flex items-center gap-3 italic">
            <UserPlus className="text-[#00d1ff]" /> Alta de Cliente Nexo V3
          </h3>
          <div className="px-4 py-1 bg-[#00d1ff]/10 border border-[#00d1ff]/20 rounded-full">
            <span className="text-[9px] font-black text-[#00d1ff] uppercase tracking-widest">Configuración de Instancia</span>
          </div>
        </div>
        
        <form onSubmit={registrarTodo} className="grid grid-cols-1 md:grid-cols-2 gap-8" autoComplete="off">
          
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase italic ml-1">Nombre de la Entidad</label>
              <input required type="text" placeholder="EJ: FERRETERÍA BIKTORYNO" className="w-full p-4 bg-[#050a15] border border-white/10 rounded-2xl text-white font-bold uppercase outline-none focus:border-[#00d1ff]/50 transition-all" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase italic ml-1 text-[#00d1ff]">RIF Fiscal</label>
                <input required type="text" placeholder="J-12345678" className="w-full p-4 bg-[#050a15] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-[#00d1ff]/50 transition-all" value={formData.rif} onChange={e => setFormData({...formData, rif: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase italic ml-1">WhatsApp</label>
                <input required type="text" placeholder="04120000000" className="w-full p-4 bg-[#050a15] border border-white/10 rounded-2xl text-white font-bold outline-none focus:border-[#00d1ff]/50 transition-all" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase italic ml-1">Propietario / Representante</label>
              <input required type="text" placeholder="NOMBRE COMPLETO" className="w-full p-4 bg-[#050a15] border border-white/10 rounded-2xl text-white font-bold uppercase outline-none focus:border-[#00d1ff]/50 transition-all" value={formData.propietario} onChange={e => setFormData({...formData, propietario: e.target.value})} />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase italic ml-1">Dirección Geográfica</label>
              <textarea required placeholder="UBICACIÓN DEL COMERCIO" className="w-full p-4 bg-[#050a15] border border-white/10 rounded-2xl text-white font-bold uppercase h-[105px] outline-none focus:border-[#00d1ff]/50 resize-none transition-all" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#00d1ff] uppercase italic ml-1">ID de Acceso</label>
                <input required type="text" autoComplete="new-password" placeholder="USUARIO" className="w-full p-4 bg-white border border-[#00d1ff]/20 rounded-2xl text-black font-black outline-none" value={formData.usuarioAcceso} onChange={e => setFormData({...formData, usuarioAcceso: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase italic ml-1">Key Temporal</label>
                <input required type="password" autoComplete="new-password" placeholder="****" className="w-full p-4 bg-white border border-white/10 rounded-2xl text-black font-black outline-none" value={formData.passwordAcceso} onChange={e => setFormData({...formData, passwordAcceso: e.target.value})} />
              </div>
            </div>
          </div>

          <button 
            disabled={loading} 
            className="md:col-span-2 w-full py-5 bg-[#00d1ff] text-[#050a15] font-black rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-[3px] shadow-[0_10px_30px_rgba(0,209,255,0.2)] disabled:opacity-50 disabled:cursor-wait mt-4"
          >
            {loading ? 'Sincronizando con Supabase...' : 'Ejecutar Registro de Comercio'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Usuarios;