import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden p-10 border border-white/20">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-blue-500/50 shadow-lg transform -rotate-6">
            <span className="text-white text-3xl font-black italic">CE</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Construcciones Express</h2>
          <p className="text-slate-500 font-medium mt-2">ERP Venezuela • Gestión Inteligente</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email de Acceso</label>
            <input type="email" placeholder="admin@erp.com" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all bg-slate-50 text-slate-900 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Contraseña</label>
            <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all bg-slate-50 text-slate-900 font-medium" />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all transform active:scale-95 text-lg">
            Ingresar al Sistema
          </button>
        </form>
        
        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">© 2026 ERP Multi-Tenant Venezuela</p>
        </div>
      </div>
    </div>
  );
}
