import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTAMOS EL NAVEGADOR

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 2. INICIALIZAMOS EL NAVEGADOR

  // 3. ESTA FUNCIÓN MANEJA EL CLIC EN EL BOTÓN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Intentando acceder...");
    
    // Aquí podrías validar el usuario, pero por ahora vamos directo al éxito
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 bg-black/40 border border-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-[450px] text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <span className="text-black text-4xl font-black italic">N</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-1">NEXO</h1>
        <p className="text-cyan-500 text-xs tracking-[0.3em] font-bold mb-10 uppercase">Venezuela</p>

        {/* 4. CONECTAMOS EL FORMULARIO A LA FUNCIÓN */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email de acceso"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="py-2">
            <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-cyan-500/80 font-bold uppercase tracking-widest">
                Tasa BCV: 45.10 Bs/USD
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(6,182,212,0.3)] transition-all active:scale-95 uppercase tracking-wider text-sm"
          >
            Acceder al Sistema Core
          </button>
        </form>

        <p className="mt-8 text-[9px] text-gray-600 uppercase tracking-widest">
          Santa Teresa del Tuy • Multi-Tenant v2.0
        </p>
      </div>
    </div>
  );
};

export default Login;