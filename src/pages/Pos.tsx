import React, { useState } from 'react';

export default function Pos() {
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('Efectivo USD');

  // Métodos de pago según tu imagen
  const metodos = ['Efectivo USD', 'Efectivo Bs', 'Pago Móvil', 'Punto', 'Mixto'];

  return (
    <div className="flex h-screen bg-[#0a0f1a] text-white">
      {/* SECCIÓN IZQUIERDA: PRODUCTOS */}
      <div className="flex-1 p-6 flex flex-col gap-6">
        {/* Buscador Superior */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="w-full bg-[#161d2b] border border-white/5 p-3 pl-12 rounded-xl outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button className="bg-[#161d2b] border border-white/5 px-4 rounded-xl flex items-center gap-2 hover:bg-white/5">
             <span>🔗</span> Código...
          </button>
        </div>

        {/* Rejilla de Productos (Vacía por ahora) */}
        <div className="flex-1 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-600">
          <span className="text-4xl mb-2">📦</span>
          <p>No hay productos cargados</p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: CARRITO (Panel Oscuro) */}
      <div className="w-[400px] bg-[#111827] border-l border-white/5 p-6 flex flex-col">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          🛒 Carrito ({carrito.length})
        </h2>

        {/* Lista de productos en carrito */}
        <div className="flex-1 flex flex-col items-center justify-center text-gray-600 italic text-sm">
          Agrega productos al carrito
        </div>

        {/* Totales y Pagos */}
        <div className="mt-auto space-y-6 border-t border-white/5 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total USD</span>
              <span className="text-xl font-bold text-blue-400">USD 0,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Bs</span>
              <span className="text-xl font-bold">Bs.S 0,00</span>
            </div>
          </div>

          {/* Selector de Método de Pago */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Método de Pago</p>
            <div className="grid grid-cols-3 gap-2">
              {metodos.map((m) => (
                <button
                  key={m}
                  onClick={() => setMetodoPago(m)}
                  className={`py-2 px-1 rounded-lg text-[10px] font-bold transition-all border ${
                    metodoPago === m 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-[#161d2b] border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <textarea 
            placeholder="Notas (opcional)..."
            className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-xs outline-none focus:border-blue-500 h-20 resize-none"
          ></textarea>

          <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-sm">
            Confirmar Venta · USD 0,00
          </button>
        </div>
      </div>
    </div>
  );
}