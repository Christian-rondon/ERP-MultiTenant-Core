import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Caja de Login con Efecto Cristal */}
      <div className="bg-gray-950/70 border border-cyan-900/40 backdrop-blur-xl p-10 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.15)] w-full max-w-xl text-center">
        {/* Logo NEXO */}
        <div className="flex justify-center mb-6">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Círculo Cian Brillante de Fondo */}
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-40"></div>
            {/* Logo Circular Moderno */}
            <div className="relative w-28 h-28 bg-gray-900 border-2 border-cyan-400 rounded-full p-4 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
              <img src="/assets/index-BkrekC4M.css" alt="Nexo Logo" className="w-full h-full object-contain" />
            </div>
          }
        </div>

        {/* Texto NEXO Venezuela */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          NEXO
        </h1>
        <p className="text-cyan-400 text-sm font-medium tracking-wide mb-10">
          VENEZUELA
        </p>

        {/* Formulario */}
        <form className="space-y-6">
          {/* Email con Icono */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-700">
              {/* Icono de Usuario Simple */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-gray-900/80 border border-cyan-800/40 p-4 pl-12 rounded-xl text-cyan-200 placeholder-cyan-900 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>

          {/* Password con Icono */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-700">
              {/* Icono de Candado Simple */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-gray-900/80 border border-cyan-800/40 p-4 pl-12 rounded-xl text-cyan-200 placeholder-cyan-900 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>

          {/* Información Tasa BCV */}
          <div className="bg-cyan-950/30 border border-cyan-800/20 p-4 rounded-xl flex items-center justify-center gap-3 text-cyan-400 text-xs shadow-inner">
            <span className="text-green-400">
              {/* Icono de Flecha Subiendo */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span>TASA BCV | ESTADO: ACTIVO</span>
            <span className="text-green-300 font-medium">| VALOR: 45.00 Bs/USD</span>
          </div>

          {/* Botón de Acceso */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold p-4 rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.4)] transition duration-200"
          >
            ACCEDER AL SISTEMA CORE
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-cyan-800 text-[10px] tracking-widest">
          SISTEMA CONECTADO | SANTA TERESA DEL TUY | MULTI-TENANT v1.0
        </div>
      </div>
    </div>
  );
};

export default Login;