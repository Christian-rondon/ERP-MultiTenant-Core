import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, Shield, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Vista {
  id: string;
  nombre: string;
}

const vistasDisponibles: Vista[] = [
  { id: 'dashboard', nombre: 'Dashboard' },
  { id: 'inventario', nombre: 'Inventario' },
  { id: 'ventas', nombre: 'Ventas' },
  { id: 'reportes', nombre: 'Reportes' },
  { id: 'configuracion', nombre: 'Configuración' }
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    rol: 'vendedor',
    vistasPermitidas: [] as string[]
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    try {
      const { data, error } = await supabase
        .from('usuarios_erp')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleVista = (id: string) => {
    setFormData(prev => ({
      ...prev,
      vistasPermitidas: prev.vistasPermitidas.includes(id)
        ? prev.vistasPermitidas.filter(v => v !== id)
        : [...prev.vistasPermitidas, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría tu lógica de registro en Supabase Auth y la tabla usuarios_erp
    console.log('Guardando usuario:', formData);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">GESTIÓN DE USUARIOS</h1>
          <p className="text-gray-400 text-sm">Control de acceso y permisos de Nexo Core</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Formulario de Registro */}
        <div className="lg:col-span-1 bg-[#121212] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <UserPlus className="text-[#00d1ff]" /> Nuevo Usuario
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Nombre Completo</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00d1ff] outline-none transition-all"
                placeholder="Ej. Juan Perez"
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00d1ff] outline-none transition-all"
                placeholder="usuario@nexo.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Contraseña</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00d1ff] outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Accesos Permitidos</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {vistasDisponibles.map(v => (
                  <button 
                    key={v.id} 
                    type="button" 
                    onClick={() => toggleVista(v.id)} 
                    className={`flex items-center gap-2 p-3 rounded-xl border text-[9px] font-black uppercase transition-all ${
                      formData.vistasPermitidas.includes(v.id) 
                        ? 'bg-[#00d1ff]/20 border-[#00d1ff] text-[#00d1ff]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${formData.vistasPermitidas.includes(v.id) ? 'bg-[#00d1ff] shadow-[0_0_8px_#00d1ff]' : 'bg-gray-600'}`} />
                    {v.nombre}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#00d1ff] text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase text-sm shadow-[0_0_20px_rgba(0,209,255,0.3)]">
              Registrar Usuario
            </button>
          </form>
        </div>

        {/* Lista de Usuarios */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-white text-center py-10">Cargando usuarios...</div>
          ) : (
            usuarios.map((user) => (
              <div key={user.id} className="bg-[#121212] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00d1ff] to-[#0055ff] rounded-full flex items-center justify-center font-black text-black">
                    {user.nombre?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{user.nombre}</h3>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400">
                      {user.rol}
                    </span>
                  </div>
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}