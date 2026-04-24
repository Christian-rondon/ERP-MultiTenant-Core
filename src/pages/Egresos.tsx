import React from 'react';
import PanelGastos from '../components/PanelGastos';

const Egresos = () => {
  return (
    <div className="p-6 md:p-8 bg-[#050810] min-h-screen">
      {/* TÍTULO */}
      <div className="mb-10 pl-2">
        <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
          Administración de Gastos
        </h1>
        <div className="h-1 w-20 bg-red-600 mt-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]"></div>
      </div>
      
      {/* GRID 50/50 PERFECTO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-[1400px]">
        
        {/* LADO IZQUIERDO: REGISTRO */}
        <div className="w-full flex">
          <PanelGastos />
        </div>

        {/* LADO DERECHO: HISTORIAL (Ajustado para ser gemelo del panel) */}
        <div className="w-full bg-[#0a0f1a] border-2 border-red-500/20 rounded-[2rem] flex flex-col relative overflow-hidden shadow-2xl h-full min-h-[580px]">
          
          {/* HEADER DEL HISTORIAL - Estilo POS */}
          <div className="p-5 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-2.5 rounded-xl">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <div>
                <h3 className="text-lg font-black uppercase italic text-white tracking-tighter">Historial</h3>
                <p className="text-[9px] text-red-500 font-bold uppercase tracking-[3px] opacity-70">Activity Log</p>
              </div>
            </div>
            <span className="text-[9px] bg-red-600/20 text-red-500 border border-red-500/40 px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse mr-2">
              En Vivo
            </span>
          </div>
          
          {/* CUERPO DEL HISTORIAL */}
          <div className="flex-1 overflow-y-auto p-8 relative z-10 flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-2 border-dashed border-red-600/50 rounded-full mb-4 animate-spin-slow"></div>
             <p className="text-white text-xs font-bold uppercase tracking-[4px] text-center opacity-40">
               Sincronizando...
             </p>
          </div>

          {/* Decoración neón de fondo */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/5 blur-3xl rounded-full"></div>
        </div>

      </div>
    </div>
  );
};

export default Egresos;