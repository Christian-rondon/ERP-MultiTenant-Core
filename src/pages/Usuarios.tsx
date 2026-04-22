import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, UserPlus, Trash2, ShieldAlert, Store, MapPin } from 'lucide-react';

export default function Usuarios() {
  const [comercios, setComercios] = useState<any[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [comercioData, setComercioData] = useState({
    nombre: '', 
    rif: '', 
    whatsapp: '', 
    direccion: '',
    nombreDueno: '', 
    emailDueno: '', 
    passwordDueno: ''
  });

  const [personalData, setPersonalData] = useState({
    comercioId: '', 
    nombre: '', 
    email: '', 
    rol: 'CAJERO', 
    password: ''
  });

  useEffect(() => { 
    fetchInitialData(); 
  }, []);

  async function fetchInitialData() {
    const { data: cData } = await supabase.from('comercios').select('*').order('nombre', { ascending: true });
    const { data: pData } = await supabase.from('usuarios_accesos').select('*, comercios(nombre)');
    if (cData) setComercios(cData);
    if (pData) setPersonal(pData);
  }

  const handleEliminarComercio = async (id: string) => {
    if (!confirm("¿ESTÁS SEGURO? Se eliminará el comercio y todos sus usuarios asociados.")) return;
    setLoading(true);
    try {
      // Primero eliminamos los accesos por la restricción de llave foránea
      await supabase.from('usuarios_accesos').delete().eq('comercio_id', id);
      await supabase.from('comercios').delete().eq('id', id);
      fetchInitialData();
    } catch (error: any) { 
      alert("Error al eliminar: " + error.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleRegistrarTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. REGISTRAR EL COMERCIO
      const { data: nexC, error: errC } = await supabase
        .from('comercios')
        .insert([{ 
          nombre: comercioData.nombre.toUpperCase(), 
          rif: comercioData.rif.toUpperCase(), 
          direccion: comercioData.direccion.toUpperCase(),
          whatsapp: comercioData.whatsapp 
        }])
        .select()
        .single();

      if (errC) throw errC;

      // 2. REGISTRAR AL DUEÑO (Usando el ID del comercio recién creado)
      const { error: errU } = await supabase
        .from('usuarios_accesos')
        .insert([{
          username: comercioData.emailDueno.trim().toLowerCase(),
          password: comercioData.passwordDueno.trim(),
          nombre: comercioData.nombreDueno.toUpperCase() || comercioData.nombre.toUpperCase(),
          rol: 'DUEÑO',
          comercio_id: nexC.id // VINCULACIÓN CRÍTICA
        }]);

      if (errU) throw errU;

      alert("ENTIDAD Y DUEÑO REGISTRADOS CON ÉXITO");
      
      // Limpiar formulario
      setComercioData({ 
        nombre: '', rif: '', whatsapp: '', direccion: '', 
        nombreDueno: '', emailDueno: '', passwordDueno: '' 
      });
      
      fetchInitialData();

    } catch (error: any) { 
      alert("ERROR: " + error.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleCrearAccesoPersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('usuarios_accesos')
        .insert([{
          username: personalData.email.trim().toLowerCase(),
          password: personalData.password.trim(),
          nombre: personalData.nombre.toUpperCase(),
          rol: personalData.rol.toUpperCase(),
          comercio_id: personalData.comercioId
        }]);

      if (error) throw error;

      alert(`Acceso creado para ${personalData.nombre}`);
      setPersonalData({ comercioId: '', nombre: '', email: '', rol: 'CAJERO', password: '' });
      fetchInitialData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto pb-20">
      <div className="grid lg:grid-cols-2 gap-5">
        
        {/* PANEL IZQUIERDO: NUEVA ENTIDAD */}
        <div className="bg-[#1a2233] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <h2 className="text-[#00d1ff] font-bold flex items-center gap-2 uppercase tracking-tighter text-base italic">
            <Building2 size={18}/> Registro de Comercio y Dueño
          </h2>
          <form onSubmit={handleRegistrarTodo} className="space-y-3">
            <input type="text" placeholder="NOMBRE DEL COMERCIO" value={comercioData.nombre} className="w-full bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold uppercase text-[10px] outline-none focus:border-[#00d1ff]/50" 
              onChange={e => setComercioData({...comercioData, nombre: e.target.value})} required/>
            
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="RIF (J-12345678)" value={comercioData.rif} className="bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold text-[10px] outline-none focus:border-[#00d1ff]/50"
                onChange={e => setComercioData({...comercioData, rif: e.target.value})} required/>
              <input type="text" placeholder="WHATSAPP" value={comercioData.whatsapp} className="bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold text-[10px] outline-none focus:border-[#00d1ff]/50"
                onChange={e => setComercioData({...comercioData, whatsapp: e.target.value})} required/>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-500" size={14}/>
              <input type="text" placeholder="DIRECCIÓN FÍSICA" value={comercioData.direccion} className="w-full bg-[#0f172a] border border-white/5 p-3 pl-9 rounded-lg text-white font-bold uppercase text-[10px] outline-none focus:border-[#00d1ff]/50"
                onChange={e => setComercioData({...comercioData, direccion: e.target.value})} required/>
            </div>

            <div className="bg-[#111827] border border-[#00d1ff]/20 p-4 rounded-xl space-y-3">
              <label className="text-[#00d1ff] text-[9px] font-black uppercase tracking-widest">Credenciales del Dueño</label>
              <input type="text" placeholder="NOMBRE DEL DUEÑO" value={comercioData.nombreDueno} className="w-full bg-white/5 p-3 rounded-lg text-white text-[10px] font-bold outline-none"
                onChange={e => setComercioData({...comercioData, nombreDueno: e.target.value})} required/>
              <input type="text" placeholder="USERNAME / CORREO" value={comercioData.emailDueno} className="w-full bg-white/5 p-3 rounded-lg text-white text-[10px] font-bold outline-none"
                onChange={e => setComercioData({...comercioData, emailDueno: e.target.value})} required/>
              <input type="password" placeholder="CONTRASEÑA" value={comercioData.passwordDueno} className="w-full bg-white p-3 rounded-lg text-black font-bold text-[10px] outline-none"
                onChange={e => setComercioData({...comercioData, passwordDueno: e.target.value})} required/>
            </div>
            <button disabled={loading} className="w-full bg-[#00d1ff] text-black font-black py-4 rounded-xl hover:scale-[1.01] active:scale-95 transition-all uppercase text-[11px] shadow-lg shadow-[#00d1ff]/20">
              {loading ? 'PROCESANDO...' : 'REGISTRAR TODO'}
            </button>
          </form>
        </div>

        {/* PANEL DERECHO: ACCESO PERSONAL */}
        <div className="bg-[#1a2233] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
          <h2 className="text-[#a855f7] font-bold flex items-center gap-2 uppercase tracking-tighter text-base italic">
            <UserPlus size={18}/> Nuevo Acceso (Personal)
          </h2>
          <form onSubmit={handleCrearAccesoPersonal} className="space-y-3">
            <select 
              className="w-full bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold uppercase text-[10px] outline-none"
              value={personalData.comercioId} 
              onChange={e => setPersonalData({...personalData, comercioId: e.target.value})} 
              required
            >
              <option value="">SELECCIONAR COMERCIO DESTINO</option>
              {comercios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>

            <input 
              type="text" 
              placeholder="NOMBRE DEL EMPLEADO" 
              className="w-full bg-[#0f172a] border border-white/5 p-3 rounded-lg text-white font-bold uppercase text-[10px] outline-none" 
              value={personalData.nombre}
              onChange={e => setPersonalData({...personalData, nombre: e.target.value})}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="USERNAME" 
                className="bg-white/5 p-3 rounded-lg text-white font-bold text-[10px] outline-none" 
                value={personalData.email}
                onChange={e => setPersonalData({...personalData, email: e.target.value})}
                required
              />
              <input 
                type="text" 
                placeholder="ROL (CAJERO, VENDEDOR)" 
                className="bg-[#2e1065] border border-[#a855f7]/30 p-3 rounded-lg text-[#a855f7] font-black text-center text-[9px] uppercase outline-none"
                value={personalData.rol}
                onChange={e => setPersonalData({...personalData, rol: e.target.value})}
                required
              />
            </div>

            <input 
              type="password" 
              placeholder="CLAVE DE ACCESO" 
              className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white text-[10px] font-bold outline-none" 
              value={personalData.password}
              onChange={e => setPersonalData({...personalData, password: e.target.value})}
              required
            />

            <button disabled={loading} className="w-full bg-[#a855f7] text-white font-black py-4 rounded-xl hover:scale-[1.01] active:scale-95 transition-all uppercase text-[11px] shadow-lg shadow-[#a855f7]/20">
              {loading ? 'CREANDO...' : 'CREAR ACCESO PERSONAL'}
            </button>
          </form>
        </div>
      </div>

      {/* SECCIÓN DE MONITOREO Y BAJAS */}
      <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-5 shadow-xl">
        <h2 className="text-gray-400 font-bold flex items-center gap-2 uppercase text-xs mb-6 tracking-[3px]">
          <ShieldAlert size={16} className="text-red-500"/> Gestión de Base de Datos
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* LISTA COMERCIOS */}
          <div>
            <label className="text-[9px] font-black text-gray-600 uppercase mb-3 block">Comercios Activos</label>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scroll">
              {comercios.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 hover:border-[#00d1ff]/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#00d1ff]/10 rounded-lg flex items-center justify-center text-[#00d1ff]">
                      <Store size={14}/>
                    </div>
                    <div>
                      <span className="text-white font-bold text-[11px] uppercase block">{c.nombre}</span>
                      <span className="text-gray-500 text-[9px] font-medium">{c.rif}</span>
                    </div>
                  </div>
                  <button onClick={() => handleEliminarComercio(c.id)} className="text-gray-600 group-hover:text-red-500 transition-colors p-2">
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LISTA USUARIOS */}
          <div>
            <label className="text-[9px] font-black text-gray-600 uppercase mb-3 block">Accesos Registrados</label>
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scroll">
              {personal.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-[11px] uppercase">{p.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#a855f7] text-[8px] font-black uppercase bg-[#a855f7]/10 px-2 py-0.5 rounded">{p.rol}</span>
                      <span className="text-gray-500 text-[9px] italic">{p.comercios?.nombre}</span>
                    </div>
                  </div>
                  <button onClick={() => alert("Función para eliminar usuario individual")} className="text-gray-700 hover:text-red-500 p-2">
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}