import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  UserPlus, Store, Layout, 
  Package, ShoppingCart, BarChart3, Settings, 
  Users, Trash2, RefreshCw
} from 'lucide-react';

const Usuarios = () => {
  const [loading, setLoading] = useState(false);
  const [comercios, setComercios] = useState<any[]>([]);
  
  const vistasDisponibles = [
    { id: 'dashboard', label: 'Dashboard', icon: <Layout size={14}/> },
    { id: 'inventario', label: 'Inventario', icon: <Package size={14}/> },
    { id: 'pos', label: 'POS / Ventas', icon: <ShoppingCart size={14}/> },
    { id: 'usuarios', label: 'Usuarios', icon: <Users size={14}/> },
    { id: 'reportes', label: 'Reportes', icon: <BarChart3 size={14}/> },
    { id: 'configuracion', label: 'Configuración', icon: <Settings size={14}/> },
  ];

  const [formComercio, setFormComercio] = useState({
    nombre: '', rif: '', direccion: '', propietario: '', whatsapp: '',
    usuarioAdmin: '', passwordAdmin: ''
  });

  const [formUsuario, setFormUsuario] = useState({
    comercioId: '', nombreReal: '', usuario: '', password: '', 
    rol: 'Cajero', vistas: ['pos'] as string[]
  });

  useEffect(() => {
    cargarComercios();
  }, []);

  const cargarComercios = async () => {
    const { data } = await supabase.from('comercios').select('*').order('nombre');
    if (data) setComercios(data);
  };

  const eliminarComercio = async (id: string) => {
    if (!window.confirm("¿ESTÁS SEGURO? Se borrará el comercio y todos sus accesos asociados.")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('comercios').delete().eq('id', id);
      if (error) throw error;
      alert("✅ Comercio eliminado correctamente.");
      cargarComercios();
    } catch (err: any) {
      alert("❌ Error al eliminar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const registrarComercioYMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Registro del Comercio (Limpiando espacios y forzando mayúsculas en RIF)
      const { data: comercio, error: errC } = await supabase
        .from('comercios')
        .insert([{ 
          nombre: formComercio.nombre.trim().toUpperCase(), 
          rif: formComercio.rif.trim().toUpperCase(), 
          direccion: formComercio.direccion.trim(), 
          propietario: formComercio.propietario.trim(),
          whatsapp: formComercio.whatsapp.trim(), 
          plan: 'Basic', 
          estado: 'Activo'
        }]).select().single();

      if (errC) throw errC;

      // 2. Registro del Usuario Maestro (Usando 'password' como en tu Supabase)
      const { error: errU } = await supabase.from('usuarios_accesos').insert([{
        nombre_completo: formComercio.propietario.trim(),
        usuario: formComercio.usuarioAdmin.trim().toLowerCase(),
        password: formComercio.passwordAdmin.trim(), // Nombre de columna corregido
        comercio_id: comercio.id,
        rol: 'dueño',
        permisos_vistas: vistasDisponibles.map(v => v.id)
      }]);

      if (errU) throw errU;
      
      alert("✅ Comercio y Dueño registrados correctamente");
      setFormComercio({ nombre: '', rif: '', direccion: '', propietario: '', whatsapp: '', usuarioAdmin: '', passwordAdmin: '' });
      cargarComercios();
    } catch (err: any) { 
      alert("❌ Error: " + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const registrarSoloUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsuario.comercioId) return alert("Selecciona un comercio primero");
    setLoading(true);
    try {
      const { error } = await supabase.from('usuarios_accesos').insert([{
        nombre_completo: formUsuario.nombreReal.trim(),
        usuario: formUsuario.usuario.trim().toLowerCase(),
        password: formUsuario.password.trim(), // Nombre de columna corregido
        comercio_id: formUsuario.comercioId,
        rol: formUsuario.rol.trim(),
        permisos_vistas: formUsuario.vistas
      }]);
      if (error) throw error;
      alert("✅ Usuario de personal creado");
      setFormUsuario({ comercioId: '', nombreReal: '', usuario: '', password: '', rol: 'Cajero', vistas: ['pos'] });
    } catch (err: any) { 
      alert("❌ Error: " + err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="relative z-10 space-y-12 p-4 min-h-screen bg-transparent pb-20" translate="no">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL IZQUIERDO: COMERCIO */}
        <div className="bg-[#1e293b] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
          <h3 className="text-[#00d1ff] font-black uppercase tracking-widest flex items-center gap-2 italic border-b border-white/5 pb-4">
            <Store size={22}/> Nueva Entidad + Dueño
          </h3>
          <form onSubmit={registrarComercioYMaster} className="space-y-4" autoComplete="off" translate="no">
            {/* Truco contra autocompletado */}
            <input type="text" style={{display:'none'}} />
            <input type="password" style={{display:'none'}} />

            <input required placeholder="NOMBRE DEL COMERCIO" className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white text-xs font-bold uppercase outline-none focus:border-[#00d1ff]" 
              value={formComercio.nombre} onChange={e => setFormComercio({...formComercio, nombre: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="RIF" className="p-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white text-xs font-bold outline-none" 
                value={formComercio.rif} onChange={e => setFormComercio({...formComercio, rif: e.target.value})} />
              <input required placeholder="WHATSAPP" className="p-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white text-xs font-bold outline-none" 
                value={formComercio.whatsapp} onChange={e => setFormComercio({...formComercio, whatsapp: e.target.value})} />
            </div>
            
            <input required placeholder="NOMBRE DEL PROPIETARIO" className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white text-xs font-bold uppercase" 
              value={formComercio.propietario} onChange={e => setFormComercio({...formComercio, propietario: e.target.value})} />
            
            <div className="p-5 bg-[#00d1ff]/10 border border-[#00d1ff]/20 rounded-2xl space-y-4">
              <p className="text-[10px] font-black text-[#00d1ff] uppercase tracking-widest italic">Acceso Maestro</p>
              <input required placeholder="USUARIO MAESTRO" className="w-full p-4 bg-white border-none rounded-xl text-[#0f172a] font-black text-xs" 
                value={formComercio.usuarioAdmin} onChange={e => setFormComercio({...formComercio, usuarioAdmin: e.target.value})} autoComplete="new-password" />
              <input required type="password" placeholder="CONTRASEÑA" className="w-full p-4 bg-white border-none rounded-xl text-[#0f172a] font-black text-xs" 
                value={formComercio.passwordAdmin} onChange={e => setFormComercio({...formComercio, passwordAdmin: e.target.value})} autoComplete="new-password" />
            </div>

            <button disabled={loading} className="w-full py-5 bg-[#00d1ff] text-[#0f172a] font-black rounded-2xl uppercase text-xs tracking-widest hover:scale-[1.01] transition-transform">
              {loading ? 'REGISTRANDO...' : 'REGISTRAR TODO'}
            </button>
          </form>
        </div>

        {/* PANEL DERECHO: PERSONAL */}
        <div className="bg-[#1e293b] border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
          <h3 className="text-purple-400 font-black uppercase tracking-widest flex items-center gap-2 italic border-b border-white/5 pb-4">
            <UserPlus size={22}/> Accesos de Personal
          </h3>
          <form onSubmit={registrarSoloUsuario} className="space-y-4" autoComplete="off" translate="no">
            <input type="text" style={{display:'none'}} />
            <input type="password" style={{display:'none'}} />

            <select required className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white text-xs font-bold outline-none cursor-pointer" 
              value={formUsuario.comercioId} onChange={e => setFormUsuario({...formUsuario, comercioId: e.target.value})}>
              <option value="">SELECCIONAR COMERCIO</option>
              {comercios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            
            <input required placeholder="NOMBRE COMPLETO" className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white text-xs font-bold uppercase" 
              value={formUsuario.nombreReal} onChange={e => setFormUsuario({...formUsuario, nombreReal: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="USUARIO" className="p-4 bg-[#0f172a] border border-white/10 rounded-2xl text-white text-xs font-bold" 
                value={formUsuario.usuario} onChange={e => setFormUsuario({...formUsuario, usuario: e.target.value})} />
              <input required placeholder="ROL" className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-300 text-xs font-black uppercase" 
                value={formUsuario.rol} onChange={e => setFormUsuario({...formUsuario, rol: e.target.value})} />
            </div>
            
            <input required type="password" placeholder="CONTRASEÑA" className="w-full p-4 bg-white border-none rounded-xl text-[#0f172a] font-black text-xs" 
              value={formUsuario.password} onChange={e => setFormUsuario({...formUsuario, password: e.target.value})} autoComplete="new-password" />
            
            <button disabled={loading} className="w-full py-5 bg-purple-500 text-white font-black rounded-2xl uppercase text-xs tracking-widest shadow-lg shadow-purple-500/20">
              {loading ? 'CREANDO...' : 'CREAR USUARIO'}
            </button>
          </form>
        </div>
      </div>

      {/* TABLA DE GESTIÓN */}
      <div className="bg-[#1e293b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h3 className="text-[10px] font-black uppercase tracking-[4px] text-[#00d1ff] italic flex items-center gap-2">
            <Users size={16}/> Base de Datos: Clientes Nexo V3
          </h3>
          <button onClick={cargarComercios} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 transition-all"><RefreshCw size={14}/></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0f172a]/50">
                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Comercio / RIF</th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comercios.map((reg) => (
                <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase tracking-wider">{reg.nombre}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase">{reg.rif}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => eliminarComercio(reg.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;