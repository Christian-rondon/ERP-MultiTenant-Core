import React from 'react';

export default function Reportes() {
  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      {/* HEADER CON FILTRO DE FECHAS */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes y Análisis</h1>
          <p className="text-gray-500 text-sm mt-1">Métricas de rendimiento del negocio.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-[#161d2b] p-2 rounded-xl border border-white/5">
          <input type="date" className="bg-transparent text-xs outline-none text-gray-400 p-1 cursor-pointer" />
          <span className="text-gray-600">-</span>
          <input type="date" className="bg-transparent text-xs outline-none text-gray-400 p-1 cursor-pointer" />
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#161d2b] p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
          <p className="text-sm font-medium text-gray-400">Ingresos Totales (USD)</p>
          <h3 className="text-4xl font-bold mt-2 text-blue-500">USD 0,00</h3>
          <p className="text-xs text-gray-500 mt-2">~ Bs.S 0,00</p>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-6xl italic">$</span>
          </div>
        </div>

        <div className="bg-[#161d2b] p-8 rounded-3xl border border-white/5 shadow-xl group">
          <p className="text-sm font-medium text-gray-400">Volumen de Ventas</p>
          <h3 className="text-4xl font-bold mt-2">0</h3>
          <p className="text-xs text-gray-500 mt-2">Transacciones completadas</p>
        </div>

        <div className="bg-[#161d2b] p-8 rounded-3xl border border-white/5 shadow-xl group">
          <p className="text-sm font-medium text-gray-400">Ticket Promedio (USD)</p>
          <h3 className="text-4xl font-bold mt-2">USD 0,00</h3>
          <p className="text-xs text-gray-500 mt-2">Por transacción</p>
        </div>
      </div>

      {/* SECCIÓN DE GRÁFICAS / TABLAS INFERIORES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productos más vendidos */}
        <div className="bg-[#111827] border border-white/5 p-8 rounded-[2rem] min-h-[350px] flex flex-col">
          <h4 className="text-lg font-bold mb-4">Productos más vendidos</h4>
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl">
            <span className="text-gray-700 italic">Sin datos</span>
          </div>
        </div>

        {/* Distribución por Método de Pago */}
        <div className="bg-[#111827] border border-white/5 p-8 rounded-[2rem] min-h-[350px] flex flex-col">
          <h4 className="text-lg font-bold mb-4">Distribución por Método de Pago</h4>
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl">
            <span className="text-gray-700 italic">Sin datos</span>
          </div>
        </div>
      </div>
    </div>
  );
}