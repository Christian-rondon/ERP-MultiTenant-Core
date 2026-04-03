import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Inicializamos el GPS

  // Esta es la función que activa la entrada al sistema
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // IMPORTANTE: Esto detiene el refresco de la página
    
    console.log("Accediendo con:", email);
    
    // Aquí es donde ocurre la magia: saltamos al Dashboard
    navigate('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Fondo con efecto de luz Neón */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 bg-black/40 border border-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-[450px] text-center">
        {/* Logo NEXO */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <span className="text-black text-4xl font-black italic">N</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-1 uppercase">NEXO</h1>
        <p className="text-cyan-500 text-[10px] tracking-[0.4em] font-black mb-10 uppercase">Venezuela</p>

        {/* FORMULARIO CONECTADO */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-2 text-left">
            <input
              type="email"
              placeholder="Email de acceso"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 text-left">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Indicador de Tasa BCV (Estético) */}
          <div className="py-2">
            <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] text-cyan-500/80 font-bold uppercase tracking-widest">
                Tasa BCV: Conectando...
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

        <p className="mt-8 text-[8px] text-gray-700 uppercase tracking-[0.2em] font-medium">
          Multi-Tenant ERP • Santa Teresa del Tuy • v2.0
        </p>
      </div>
    </div>
  );
};

export default Login;