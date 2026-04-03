import React, { useEffect, useState } from 'react'; // Arregla el error de useEffect
import { supabase } from '../lib/supabase';        // Arregla el error de supabase

const TASA_BCV = 450.00;

export default function Dashboard() {
  // Definimos los estados (Arregla errores de "No se encuentra el nombre")
  const [ingresosHoy, setIngresosHoy] = useState(0);
  const [contadorVentas, setContadorVentas] = useState(0);
  const [stockCritico, setStockCritico] = useState(0);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const hoy = new Date().toISOString().split('T')[0];

        // 1. Traer todas las ventas de hoy para el gráfico y totales
        const { data: ventasHoy, error: errorVentas } = await supabase
          .from('ventas')
          .select('total')
          .gte('created_at', hoy);

        if (errorVentas) throw errorVentas;

        if (ventasHoy) {
          const suma = ventasHoy.reduce((acc: number, v: any) => acc + v.total, 0);
          setIngresosHoy(suma);
          setContadorVentas(ventasHoy.length);
        }

        // 2. Contar productos con poco stock
        const { count, error: errorStock } = await supabase
          .from('productos')
          .select('*', { count: 'exact', head: true })
          .lt('stock', 5);

        if (errorStock) throw errorStock;
        setStockCritico(count || 0);

      } catch (err) {
        console.error("Error cargando dashboard:", err);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white font-sans">
      <header className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Panel de Control</h1>
        <p className="text-gray-500 font-bold tracking-widest text-xs mt-2">RESUMEN DE OPERACIONES EN TIEMPO REAL</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* TARJETA INGRESOS */}
        <div className="bg-[#161d2b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 group-hover:bg-[#00df9a] transition-all"></div>
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Ingresos de Hoy</p>
          <p className="text-5xl font-black mb-2">${ingresosHoy.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</p>
          <p className="text-[#00df9a] text-xl font-mono font-black">
            Bs.S {(ingresosHoy * TASA_BCV).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* TARJETA TRANSACCIONES */}
        <div className="bg-[#161d2b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Ventas Realizadas</p>
          <p className="text-6xl font-black mb-2">{contadorVentas}</p>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Transacciones hoy</p>
        </div>

        {/* TARJETA STOCK */}
        <div className="bg-[#161d2b] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Stock Crítico</p>
          <p className="text-6xl font-black mb-2 text-white">{stockCritico}</p>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Productos por agotarse</p>
        </div>
      </div>
    </div>
  );
}
function MenuBtn({ to, icon, label, active }: { to: string, icon: string, label: string, active: boolean }) {
  return (
    <Link to={to} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm border ${active ? 'bg-blue-600/10 border-blue-600/20 text-blue-500 shadow-lg shadow-blue-900/10' : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
      <span className="text-xl w-6 text-center">{icon}</span>
      {label}
    </Link>
  );
}