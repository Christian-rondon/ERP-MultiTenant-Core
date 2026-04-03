import React, { useState } from 'react';

export default function Usuarios() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm">Administra los accesos y roles de tu equipo.</p>
        </div>
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* MODAL (El diseño de tu imagen) */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#161d2b] w-full max-w-md p-8 rounded-[2rem] border border-white/5 shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Nuevo Usuario</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre Completo *</label>
                <input type="text" placeholder="Juan Pérez" className="w-full bg-black/20 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Usuario *</label>
                  <input type="text" placeholder="juanp" className="w-full bg-black/20 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Clave *</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-black/20 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Cargo / Rol (texto libre) *</label>
                <input type="text" placeholder="Cajero, Vendedor..." className="w-full bg-black/20 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Módulos con Acceso</label>
                <div className="grid grid-cols-2 gap-3">
                  {['POS Pro', 'Inventario', 'Reportes', 'Ajustes'].map((mod) => (
                    <label key={mod} className="flex items-center gap-3 bg-black/20 border border-white/5 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-gray-300">{mod}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={() => setModalAbierto(false)}
                className="bg-white/5 hover:bg-white/10 text-gray-400 py-4 rounded-2xl font-bold transition-all"
              >
                Cancelar
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all">
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de usuarios (vacía por ahora) */}
      <div className="bg-[#111827] rounded-3xl border border-white/5 p-12 text-center">
        <p className="text-gray-600 italic">No hay usuarios registrados aparte del administrador.</p>
      </div>
    </div>
  );
}