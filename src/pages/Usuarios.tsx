import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, UserPlus, Trash2, ShieldAlert, Store, MapPin } from 'lucide-react';

export default function Usuarios() {
  const [comercios, setComercios] = useState<any[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [comercioData, setComercioData] = useState({
    nombre: '', rif: '', whatsapp: '', direccion: '',
    nombreDueno: '', emailDueno: '', passwordDueno: ''
  });

  const [personalData, setPersonalData] = useState({
    comercioId: '', nombre: '', email: '', rol: 'CAJERO', password: ''
  });

  useEffect(() => { fetchInitialData(); }, []);

  async function fetchInitialData() {
    const { data: cData } = await supabase.from('comercios').select('*');
    const { data: pData } = await supabase.from('usuarios_accesos').select('*, comercios(nombre)');
    if (cData) setComercios(cData);
    if (pData) setPersonal(pData);
  }

  const handleEliminarComercio = async (id: string) => {
    if (!confirm("¿Eliminar comercio y todos sus accesos?")) return;
    setLoading(true);
    try {
      await supabase.from('usuarios_accesos').delete().eq('comercio_id', id);
      await supabase.from('comercios').delete().eq('id', id);
      fetchInitialData();
    } catch (error: any) { alert(error.message); } 
    finally { setLoading(false); }
  };

  const handleRegistrarTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: nexC, error: errC } = await supabase
        .from('comercios')
        .insert([{ 
          nombre: comercioData.nombre, 
          rif: comercioData.rif, 
          direccion: comercioData.direccion,
          whatsapp: comercioData.whatsapp 
        }])
        .select().single();
      if (errC) throw errC;

      const { error: errU } = await supabase.from('usuarios').insert([{
        username: comercioData.emailDueno,
        password: comercioData.passwordDueno,
        rol: 'admin_tienda' 
      }]);
      if (errU) throw errU;

      alert("Entidad registrada");
      setComercioData({ nombre: '', rif: '', whatsapp: '', direccion: '', nombreDueno: '', emailDueno: '', passwordDueno: '' });
      fetchInitialData();
    } catch (error: any) { alert(error.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-5">
        
        {/* PANEL IZQUIERDO: ENTIDAD */}
        <div className="bg-[#1a2233] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <h2 className="text-[#00d1ff] font-bold flex items-center gap-2 uppercase tracking-tighter text-base italic">
            <Building2 size={18}/> Nueva Entidad
          </h2>
          <form onSubmit={handleRegistrarTodo} className="space-y-3">
            <input type="text" placeholder="NOMBRE DEL COMERCIO" value={comercioData.nombre} className="w-full bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold uppercase text-[10px]" 
              onChange={e => setComercioData({...comercioData, nombre: e.target.value})} required/>
            
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="RIF" value={comercioData.rif} className="bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold text-[10px]"
                onChange={e => setComercioData({...comercioData, rif: e.target.value})}/>
              <input type="text" placeholder="WHATSAPP" value={comercioData.whatsapp} className="bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold text-[10px]"
                onChange={e => setComercioData({...comercioData, whatsapp: e.target.value})}/>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-500" size={14}/>
              <input type="text" placeholder="DIRECCIÓN FÍSICA" value={comercioData.direccion} className="w-full bg-[#0f172a] border border-white/5 p-3 pl-9 rounded-lg text-white font-bold uppercase text-[10px]"
                onChange={e => setComercioData({...comercioData, direccion: e.target.value})} required/>
            </div>

            <div className="bg-[#111827] border border-[#00d1ff]/20 p-4 rounded-xl space-y-3">
              <label className="text-[#00d1ff] text-[9px] font-black uppercase tracking-widest">Acceso Maestro (Dueño)</label>
              <input type="email" placeholder="CORREO" value={comercioData.emailDueno} className="w-full bg-white/5 p-3 rounded-lg text-white text-[10px] font-bold"
                onChange={e => setComercioData({...comercioData, emailDueno: e.target.value})} required/>
              <input type="password" placeholder="CONTRASEÑA" value={comercioData.passwordDueno} className="w-full bg-white p-3 rounded-lg text-black font-bold text-[10px]"
                onChange={e => setComercioData({...comercioData, passwordDueno: e.target.value})} required/>
            </div>
            <button disabled={loading} className="w-full bg-[#00d1ff] text-black font-black py-3 rounded-xl hover:opacity-90 transition-all uppercase text-[11px]">
              {loading ? 'Cargando...' : 'Registrar'}
            </button>
          </form>
        </div>

        {/* PANEL DERECHO: PERSONAL */}
        <div className="bg-[#1a2233] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <h2 className="text-[#a855f7] font-bold flex items-center gap-2 uppercase tracking-tighter text-base italic">
            <UserPlus size={18}/> Acceso Personal
          </h2>
          <form onSubmit={(e) => { e.preventDefault(); alert("Personal Creado"); }} className="space-y-3">
            <select className="w-full bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold uppercase text-[10px]"
              value={personalData.comercioId} onChange={e => setPersonalData({...personalData, comercioId: e.target.value})} required>
              <option value="">SELECCIONAR COMERCIO</option>
              {comercios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <input type="text" placeholder="NOMBRE COMPLETO" className="w-full bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold uppercase text-[10px]" required/>
            <div className="grid grid-cols-2 gap-3">
              <input type="email" placeholder="CORREO" className="bg-white/5 p-3 rounded-lg text-white font-bold text-[10px]" required/>
              <div className="bg-[#2e1065] border border-[#a855f7]/30 p-3 rounded-lg text-[#a855f7] font-black text-center text-[9px] flex items-center justify-center uppercase">CAJERO</div>
            </div>
            <input type="password" placeholder="CLAVE TEMPORAL" className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white text-[10px]" required/>
            <button className="w-full bg-[#a855f7] text-white font-black py-3 rounded-xl hover:opacity-90 transition-all uppercase text-[11px]">Crear Acceso</button>
          </form>
        </div>
      </div>

      {/* SECCIÓN BAJAS (COMPACTA) */}
      <div className="bg-[#0f172a] border border-red-500/10 rounded-2xl p-5 shadow-xl">
        <h2 className="text-red-500 font-bold flex items-center gap-2 uppercase text-sm mb-4 italic">
          <ShieldAlert size={16}/> Control de Bajas
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scroll">
            {comercios.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-white font-bold text-[10px] uppercase truncate max-w-[150px]"><Store size={12} className="inline mr-2 text-gray-400"/>{c.nombre}</span>
                <button onClick={() => handleEliminarComercio(c.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
          <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scroll">
            {personal.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="text-[10px] uppercase"><span className="text-white font-bold">{p.nombre}</span> <span className="text-gray-500 block text-[8px]">{p.comercios?.nombre}</span></div>
                <button onClick={() => alert("Eliminar personal")} className="text-gray-500 hover:text-red-500"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}