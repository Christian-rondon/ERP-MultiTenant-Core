import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, User, ShieldCheck } from 'lucide-react';

export default function Login({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let usuarioEncontrado = null;

      // 1. Intentamos buscar en la tabla 'usuarios' (Donde está el SuperAdmin)
      const { data: dataAdmin, error: errAdmin } = await supabase
        .from('usuarios')
        .select('*')
        .eq('username', identificador.trim())
        .single();

      if (dataAdmin) {
        usuarioEncontrado = dataAdmin;
      } else {
        // 2. Si no está en 'usuarios', buscamos en 'usuarios_accesos'
        const { data: dataAcceso, error: errAcceso } = await supabase
          .from('usuarios_accesos')
          .select('*')
          .eq('username', identificador.trim())
          .single();
        
        if (dataAcceso) {
          usuarioEncontrado = dataAcceso;
        }
      }

      // 3. Verificación de existencia
      if (!usuarioEncontrado) {
        setError('EL USUARIO NO EXISTE EN EL SISTEMA');
        setLoading(false);
        return;
      }

      // 4. Verificación de contraseña (Comparación exacta)
      if (usuarioEncontrado.password !== password.trim()) {
        setError('LA CONTRASEÑA ES INCORRECTA');
        setLoading(false);
        return;
      }

      // Log de control para debug en consola
      console.log("✅ Acceso exitoso:", usuarioEncontrado.username, "Rol:", usuarioEncontrado.rol);
      
      // 5. Mandamos los datos al componente padre
      onLoginSuccess(usuarioEncontrado);

    } catch (err) {
      console.error("Error crítico en el proceso de login:", err);
      setError('ERROR DE CONEXIÓN CON EL SERVIDOR');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a15] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#10172a]/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-[0_0_100px_rgba(0,209,255,0.1)]">
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00d1ff] to-[#0057ff] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,209,255,0.4)]">
            <ShieldCheck size={40} className="text-[#050a15]" />
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-widest uppercase">
            Nexo Core <span className="text-[#00d1ff]">V3</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[4px] mt-2">
            Sistemas de Gestión Inteligente
          </p>
        </div>

        <form onSubmit={iniciarSesion} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">
              Nombre de Usuario / Username
            </label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00d1ff]" size={18} />
              <input 
                type="text" 
                className="w-full bg-[#050a15] border border-white/5 p-5 pl-14 rounded-2xl text-white font-bold outline-none focus:border-[#00d1ff]/50 transition-all"
                placeholder="USUARIO"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">
              Clave de Acceso
            </label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password" 
                className="w-full bg-[#050a15] border border-white/5 p-5 pl-14 rounded-2xl text-white font-bold outline-none focus:border-[#00d1ff]/50 transition-all text-xl"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-[9px] font-black uppercase text-center animate-pulse">
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-gradient-to-r from-[#0057ff] to-[#00d1ff] text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[4px] text-xs mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'AUTENTICANDO...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <p className="text-center text-[8px] text-gray-600 uppercase font-bold mt-10 tracking-widest">
          Desarrollado por Construcciones Express &copy; 2026
        </p>
      </div>
    </div>
  );
}