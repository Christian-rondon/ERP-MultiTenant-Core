import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Package, DollarSign, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface StoreDashboardProps {
  comercioId?: string;
  nombreComercio?: string;
  rif?: string;
}

export default function StoreDashboard({ comercioId, nombreComercio, rif }: StoreDashboardProps) {
  const [stats, setStats] = useState({ ventas: 0, productos: 0, stockBajo: 0 });

  useEffect(() => {
    if (comercioId) {
      fetchOwnerStats(comercioId);
    }
  }, [comercioId]);

  const fetchOwnerStats = async (id: string) => {
    // 1. Total productos
    const { count: prodCount } = await supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })
      .eq('comercio_id', id);

    // 2. Alerta Stock Bajo (< 5)
    const { count: lowStock } = await supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })
      .eq('comercio_id', id)
      .lt('stock', 5);

    // 3. Ventas totales
    const { data: sales } = await supabase
      .from('ventas')
      .select('total')
      .eq('comercio_id', id);

    setStats({
      ventas: sales?.reduce((acc, curr) => acc + curr.total, 0) || 0,
      productos: prodCount || 0,
      stockBajo: lowStock || 0
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          {nombreComercio || 'MI COMERCIO'}
        </h1>
        <div className="flex gap-3 mt-1">
          <span className="text-[10px] text-[#00d1ff] font-bold tracking-[4px] uppercase bg-[#00d1ff]/10 px-3 py-1 rounded-full border border-[#00d1ff]/20">
            RIF: {rif || 'J-00000000-0'}
          </span>
        </div>
      </header>

      {/* VISTA RESUMIDA PARA EL DUEÑO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TARJETA VENTAS */}
        <div className="bg-[#10172a] border border-white/5 p-6 rounded-[24px] relative overflow-hidden group">
          <DollarSign className="absolute -right-2 -top-2 w-20 h-20 text-white/5" />
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ventas Totales</p>
          <h2 className="text-3xl font-black text-white mt-1">${stats.ventas.toFixed(2)}</h2>
          <ArrowUpRight className="text-green-500 absolute top-6 right-6 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* TARJETA INVENTARIO */}
        <div className="bg-[#10172a] border border-white/5 p-6 rounded-[24px] relative overflow-hidden">
          <Package className="absolute -right-2 -top-2 w-20 h-20 text-white/5" />
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Inventario Total</p>
          <h2 className="text-3xl font-black text-white mt-1">{stats.productos}</h2>
        </div>

        {/* TARJETA ALERTAS */}
        <div className={`p-6 rounded-[24px] border relative overflow-hidden transition-all ${stats.stockBajo > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-[#10172a] border-white/5'}`}>
          <AlertTriangle className={`absolute -right-2 -top-2 w-20 h-20 ${stats.stockBajo > 0 ? 'text-red-500/20' : 'text-white/5'}`} />
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alertas de Stock</p>
          <h2 className={`text-3xl font-black mt-1 ${stats.stockBajo > 0 ? 'text-red-500' : 'text-white'}`}>
            {stats.stockBajo} <span className="text-xs font-bold text-gray-500 uppercase">Items Bajos</span>
          </h2>
        </div>
      </div>

      {/* ÁREA DE GRÁFICOS / REPORTES (SIN CONFIGURACIÓN NI USUARIOS) */}
      <div className="bg-[#10172a]/30 border-2 border-dashed border-white/5 rounded-[40px] py-20 flex flex-col items-center justify-center text-center">
        <p className="text-gray-600 font-bold uppercase tracking-[4px] text-[10px]">
          Resumen de actividad comercial
        </p>
      </div>
    </div>
  );
}