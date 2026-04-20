import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ShoppingBag, Users, Package, 
  ArrowUpRight, ArrowDownRight, LayoutDashboard 
} from 'lucide-react';

const StoreDashboard = () => {
  const { id } = useParams();
  const [comercio, setComercio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStoreData = async () => {
      try {
        const { data, error } = await supabase
          .from('comercios')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setComercio(data);
      } catch (err) {
        console.error("Error cargando comercio:", err);
      } finally {
        setLoading(false);
      }
    };
    getStoreData();
  }, [id]);

  if (loading) return <div className="p-10 text-white animate-pulse">Cargando Instancia...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* CABECERA DE INSTANCIA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            {comercio?.nombre || 'Panel de Comercio'}
          </h1>
          <p className="text-[10px] text-gray-500 font-bold tracking-[3px] uppercase">
            ID: {id?.slice(0, 8)}... • RIF: {comercio?.rif}
          </p>
        </div>
        <div className="px-4 py-2 bg-[#00d1ff]/10 border border-[#00d1ff]/20 rounded-xl">
          <span className="text-[10px] font-black text-[#00d1ff] uppercase">Sesión de Auditoría Activa</span>
        </div>
      </div>

      {/* KPI CARDS PARA EL DUEÑO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#10172a]/60 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between text-gray-500 mb-4">
            <ShoppingBag size={20} />
            <ArrowUpRight size={16} className="text-green-500" />
          </div>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Ventas Totales</p>
          <h3 className="text-3xl font-black text-white mt-1 italic">$0.00</h3>
        </div>

        <div className="bg-[#10172a]/60 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between text-gray-500 mb-4">
            <Package size={20} />
            <span className="text-[10px] font-bold text-orange-500 uppercase">Stock Bajo</span>
          </div>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Productos</p>
          <h3 className="text-3xl font-black text-white mt-1 italic">0</h3>
        </div>

        <div className="bg-[#10172a]/60 border border-white/10 p-6 rounded-2xl">
          <div className="flex justify-between text-gray-500 mb-4">
            <Users size={20} />
          </div>
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Clientes</p>
          <h3 className="text-3xl font-black text-white mt-1 italic">0</h3>
        </div>
      </div>

      {/* ÁREA DE TRABAJO (TABLAS DE INVENTARIO O VENTAS) */}
      <div className="bg-[#10172a]/60 border border-white/10 rounded-3xl p-8 min-h-[300px] flex items-center justify-center border-dashed">
         <div className="text-center">
            <LayoutDashboard size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-xs text-gray-600 font-bold uppercase tracking-[2px]">Módulo de datos en construcción</p>
         </div>
      </div>
    </div>
  );
};

export default StoreDashboard;