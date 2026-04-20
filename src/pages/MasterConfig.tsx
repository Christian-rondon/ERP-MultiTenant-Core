import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Store, ShieldCheck, UserPlus, Smartphone, Hash, MapPin, Lock } from 'lucide-react';

export default function RegistroComercioMaestro() {
  const [formData, setFormData] = useState({
    nombreComercio: '',
    rif: '',
    direccion: '',
    nombrePropietario: '',
    whatsapp: '',
    usuario: '',
    password: '',
    tipoNegocio: 'Ferretería'
  });
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    try {
      // 1. REGISTRO DEL COMERCIO (TENANT)
      // El ID se genera automáticamente en Supabase por ser clave primaria UUID
      const { data: tenant, error: tError } = await supabase
        .from('tenants')
        .insert([{
          name: formData.nombreComercio,
          rif: formData.rif,
          direccion: formData.direccion,
          propietario: formData.nombrePropietario,
          whatsapp: formData.whatsapp,
          type: formData.tipoNegocio
        }])
        .select()
        .single();

      if (tError) throw tError;

      // 2. CREACIÓN DE CREDENCIALES DE ACCESO
      // Vinculamos el usuario directamente al ID del comercio recién creado
      const { error: uError } = await supabase
        .from('usuarios')
        .insert([{
          username: formData.usuario,
          password: formData.password, // En producción usaríamos hashing
          role: 'owner',
          tenant_id: tenant.id, // VÍNCULO VITAL
          nombre_real: formData.nombrePropietario
        }]);

      if (uError) throw uError;

      alert(`✅ Sistema Activado para ${formData.nombreComercio}. ID Generado: ${tenant.id}`);
      
      // Limpiar campos
      setFormData({
        nombreComercio: '', rif: '', direccion: '', 
        nombrePropietario: '', whatsapp: '', usuario: '', 
        password: '', tipoNegocio: 'Ferretería'
      });

    } catch (error: any) {
      alert("Error en el despliegue: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
      <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
        <div className="p-3 bg-[#00d1ff]/10 rounded-2xl text-[#00d1ff]">
          <Store size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-white italic">Alta de Nuevo Cliente</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[3px]">Configuración de Instancia Nexo V3</p>
        </div>
      </div>

      <form onSubmit={handleRegistro} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* DATOS FISCALES */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-[#00d1ff] uppercase tracking-widest flex items-center gap-2">
            <Hash size={14} /> Información Legal
          </h3>
          <input 
            required
            placeholder="NOMBRE DEL COMERCIO"
            className="w-full bg-[#050a15] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#00d1ff]/50"
            onChange={(e) => setFormData({...formData, nombreComercio: e.target.value})}
            value={formData.nombreComercio}
          />
          <input 
            required
            placeholder="RIF (Ej: J-12345678-9)"
            className="w-full bg-[#050a15] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-[#00d1ff]/50"
            onChange={(e) => setFormData({...formData, rif: e.target.value})}
            value={formData.rif}
          />
          <textarea 
            required
            placeholder="DIRECCIÓN FÍSICA"
            className="w-full bg-[#050a15] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none h-24 focus:border-[#00d1ff]/50"
            onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            value={formData.direccion}
          />
        </div>

        {/* DATOS DE ACCESO Y CONTACTO */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Seguridad y Contacto
          </h3>
          <input 
            required
            placeholder="NOMBRE DEL PROPIETARIO"
            className="w-full bg-[#050a15] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-purple-500/50"
            onChange={(e) => setFormData({...formData, nombrePropietario: e.target.value})}
            value={formData.nombrePropietario}
          />
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              required
              placeholder="WHATSAPP (Ej: 0412...)"
              className="w-full bg-[#050a15] border border-white/10 pl-12 p-4 rounded-2xl text-white font-bold outline-none focus:border-purple-500/50"
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              value={formData.whatsapp}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <input 
              required
              placeholder="USUARIO"
              className="w-full bg-[#050a15] border border-white/10 p-4 rounded-2xl text-[#00d1ff] font-black outline-none focus:border-[#00d1ff]"
              onChange={(e) => setFormData({...formData, usuario: e.target.value})}
              value={formData.usuario}
            />
            <input 
              required
              type="password"
              placeholder="CONTRASEÑA"
              className="w-full bg-[#050a15] border border-white/10 p-4 rounded-2xl text-white font-bold outline-none focus:border-red-500/50"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              value={formData.password}
            />
          </div>
        </div>

        <button 
          disabled={cargando}
          className="md:col-span-2 w-full py-5 bg-gradient-to-r from-[#0057ff] to-[#00d1ff] text-white font-black rounded-2xl shadow-xl hover:scale-[1.01] transition-all uppercase tracking-[4px] text-xs"
        >
          {cargando ? 'DESPLEGANDO INSTANCIA...' : 'FINALIZAR REGISTRO Y ACTIVAR ID'}
        </button>
      </form>
    </div>
  );
}