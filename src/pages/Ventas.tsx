import React from 'react';

export default function Ventas() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white italic">Historial de Ventas</h2>
      <div className="bg-[#161d2b] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/20 text-gray-400 text-xs uppercase tracking-widest">
              <th className="p-4">Fecha</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-white/5 text-gray-500"><td className="p-4" colSpan={4}>No hay ventas registradas hoy.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}