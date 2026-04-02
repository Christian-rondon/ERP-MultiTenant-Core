import React, { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWelcome(true);
  };

  // 1. PANTALLA DE BIENVENIDA (Post-Login)
  if (showWelcome && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-[30px] border border-white/20 shadow-2xl text-center max-w-sm w-full mx-4">
          <h2 className="text-white text-3xl font-bold mb-2 uppercase tracking-tighter">Sesión Iniciada</h2>
          <p className="text-white/80 mb-8 text-lg">Bienvenido al núcleo de Nexo.</p>
          <button 
            onClick={() => setIsLoggedIn(true)}
            className="w-full bg-[#00d2ff] hover:bg-[#00b2d9] text-black font-black py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 text-lg uppercase"
          >
            Ingresar al Panel
          </button>
        </div>
      </div>
    );
  }

  // 2. PANTALLA DE LOGIN (Principal con NUEVO FONDO)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans"
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="bg-[#0f172a]/95 backdrop-blur-sm p-10 rounded-[40px] shadow-2xl w-full max-w-md mx-4 border border-slate-700">
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 rounded-full bg-[#0d1117] border-4 border-[#00d2ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.3)] mb-6 overflow-hidden">
              <img src="/logo-nexo.png" alt="Logo" className="w-20 h-20 object-contain" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=N"; }} />
            </div>
            <h1 className="text-white text-6xl font-black tracking-tighter mb-1">NEXO</h1>
            <p className="text-[#00d2ff] font-bold tracking-[0.3em] uppercase text-xs">Venezuela</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuario" className="w-full bg-[#0d1117] text-white border border-slate-700 rounded-2xl p-5 outline-none focus:border-[#00d2ff] transition-all" required />
            <input type="password" placeholder="Contraseña" className="w-full bg-[#0d1117] text-white border border-slate-700 rounded-2xl p-5 outline-none focus:border-[#00d2ff] transition-all" required />
            <button type="submit" className="w-full bg-[#00d2ff] text-black font-black text-xl py-5 rounded-2xl shadow-lg mt-6 hover:brightness-110 active:scale-95 transition-all uppercase">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. EL PANEL DE CONTROL (Dashboard)
  return (
    <div className="min-h-screen bg-[#06090f] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-[#00d2ff]">NEXO ERP <span className="text-white/30 text-sm font-normal ml-2 tracking-widest">SISTEMA CORE</span></h1>
          <button onClick={() => { setIsLoggedIn(false); setShowWelcome(false); }} className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase font-bold text-xs">Cerrar Sesión</button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-[#161b22] p-10 rounded-[35px] border border-slate-800">
            <p className="text-slate-500 font-bold uppercase text-xs mb-2">Tasa BCV</p>
            <h3 className="text-5xl font-black text-green-400">45.00 <span className="text-xl">Bs</span></h3>
          </div>
          <div className="bg-[#161b22] p-10 rounded-[35px] border border-slate-800 flex flex-col justify-center">
             <p className="text-slate-500 font-bold uppercase text-xs mb-2">Estado</p>
             <h3 className="text-2xl font-black text-[#00d2ff]">CONECTADO</h3>
          </div>
          <div className="bg-[#161b22] p-10 rounded-[35px] border border-slate-800 flex flex-col justify-center">
             <p className="text-slate-500 font-bold uppercase text-xs mb-2">Módulos</p>
             <h3 className="text-2xl font-black text-white">ACTIVOS</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
