import React, { useState } from 'react';

export default function Configuracion() {
  const [modoMantenimiento, setModoMantenimiento] = useState(false);

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Configuración de Sistema</h1>
        <p className="text-gray-500 text-sm mt-1 font-medium uppercase tracking-widest text-[10px]">
          Panel exclusivo para el Desarrollador (Super Admin)
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. ESTADO DEL SISTEMA Y MANTENIMIENTO */}
        <div className="bg-[#161d2b] p-8 rounded-[2rem] border border-red-500/10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-red-400 uppercase tracking-widest">🛡️ Control de Infraestructura</h3>
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white">Modo Mantenimiento</p>
                <p className="text-[10px] text-gray-500">Bloquea el acceso a todos los usuarios</p>
              </div>
              <button 
                onClick={() => setModoMantenimiento(!modoMantenimiento)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${
                  modoMantenimiento ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
                }`}
              >
                {modoMantenimiento ? 'ACTIVO' : 'INACTIVO'}
              </button>
            </div>

            <button className="w-full bg-white/5 hover:bg-white/10 text-gray-300 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
              Descargar Backup de Base de Datos (JSON)
            </button>
          </div>
        </div>

        {/* 2. GESTIÓN DE SUSCRIPCIONES (TENANTS) */}
        <div className="bg-[#161d2b] p-8 rounded-[2rem] border border-blue-500/10 shadow-2xl">
          <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-8">💳 Control de Pagos</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400">Próximo Vencimiento</span>
                <span className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded">Activo</span>
              </div>
              <p className="text-sm font-bold">Repuestos El Turbo, C.A.</p>
              <p className="text-[10px] text-gray-500 mt-1">Vence: 15 de Abril, 2026</p>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
              Gestionar Planes de Clientes
            </button>
          </div>
        </div>

        {/* 3. LOGS DE SEGURIDAD */}
        <div className="lg:col-span-2 bg-[#111827] p-8 rounded-[2rem] border border-white/5">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">📝 Actividad Reciente del Servidor</h3>
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex gap-4 p-2 border-b border-white/5 text-gray-500">
              <span className="text-green-500">[OK]</span>
              <span>2026-04-02 22:30:12</span>
              <span>Conexión exitosa a Supabase</span>
            </div>
            <div className="flex gap-4 p-2 border-b border-white/5 text-gray-500">
              <span className="text-yellow-500">[WARN]</span>
              <span>2026-04-02 21:15:05</span>
              <span>Tasa BCV actualizada por SuperAdmin</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}