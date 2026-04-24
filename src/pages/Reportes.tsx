import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Download, 
  Filter, 
  RefreshCw 
} from 'lucide-react';
// IMPORTANTE: Asegúrate de que esta ruta sea la correcta en tu proyecto
import { supabase } from '../lib/supabase'; 

const Reportes = () => {
  const [tasaBCV, setTasaBCV] = useState<number>(0);
  const [loadingTasa, setLoadingTasa] = useState(true);

  // FUNCIÓN PARA BUSCAR LA TASA REAL EN CONFIGURACIÓN
  const obtenerTasaReal = async () => {
    try {
      setLoadingTasa(true);
      
      // Consultamos la tabla 'configuracion' y la columna 'tasa_dolar'
      const { data, error } = await supabase
        .from('configuracion')
        .select('tasa_dolar')
        .single(); // Traemos el registro único de configuración

      if (error) throw error;

      if (data) {
        setTasaBCV(Number(data.tasa_dolar));
      }
    } catch (error) {
      console.error("Error al sincronizar tasa desde DB:", error);
    } finally {
      setLoadingTasa(false);
    }
  };

  useEffect(() => {
    obtenerTasaReal();
  }, []);

  // Función para formatear Bolívares (VES)
  const formatBs = (montoUsd: number) => {
    const total = montoUsd * tasaBCV;
    return new Intl.NumberFormat('es-VE', { 
      style: 'currency', 
      currency: 'VES',
      minimumFractionDigits: 2
    }).format(total);
  };

  return (
    <div className="p-6 md:p-8 bg-[#050810] min-h-screen">
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
            Auditoría & Reportes
          </h1>
          <div className="h-1 w-20 bg-red-600 mt-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]"></div>
        </div>
        
        <div className="flex gap-3">
          {/* BADGE DE TASA REAL (CONEXIÓN DB) */}
          <div className="flex items-center gap-3 bg-[#0a0f1a] border border-white/10 px-4 py-2 rounded-xl shadow-inner group">
            <RefreshCw 
              size={14} 
              className={`text-red-500 ${loadingTasa ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500 cursor-pointer'}`}
              onClick={obtenerTasaReal} // Permite refrescar manualmente
            />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-tight">DB Configurada</span>
              <span className="text-xs font-bold text-white">
                {loadingTasa ? 'Sincronizando...' : `BCV: ${tasaBCV.toFixed(2)}`}
              </span>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-red-700 transition-all">
            <Download size={14} /> Exportar Auditoría
          </button>
        </div>
      </div>

      {/* KPIs CON CÁLCULO EN VIVO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[ 
          { label: 'Total Ingresos', color: 'green', icon: <TrendingUp />, usd: 0 },
          { label: 'Total Egresos', color: 'red', icon: <TrendingDown />, usd: 0 },
          { label: 'Balance Real', color: 'blue', icon: <DollarSign />, usd: 0 }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#0a0f1a] border-2 border-white/5 p-7 rounded-[2.5rem] relative overflow-hidden shadow-2xl transition-all hover:border-white/10">
            <div className="flex items-center gap-4 mb-5">
              <div className={`bg-${kpi.color}-500/10 p-3 rounded-2xl text-${kpi.color}-500`}>
                {kpi.icon}
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[4px]">{kpi.label}</p>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white italic leading-none mb-2 tracking-tighter">
                $ {kpi.usd.toFixed(2)}
              </h3>
              <p className={`text-sm font-bold text-${kpi.color}-500/80 italic tracking-tight`}>
                {loadingTasa ? 'Cargando VES...' : formatBs(kpi.usd)}
              </p>
            </div>

            <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-${kpi.color}-500/5 blur-3xl rounded-full`}></div>
          </div>
        ))}
      </div>

      {/* LISTADO DE OPERACIONES (TABLA) */}
      <div className="bg-[#0a0f1a] border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent flex justify-between items-center">
          <h2 className="text-xl font-black italic uppercase text-white tracking-tight">Listado de Operaciones</h2>
          <button className="flex items-center gap-2 text-[9px] font-black text-gray-400 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:text-white hover:bg-white/10 transition-all">
            <Filter size={12} className="text-red-500" /> FILTRAR POR ESTADO
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-600 bg-black/20">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px]">Fecha Operación</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px]">Ref. ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px]">Concepto / Motivo</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-right">Monto USD</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-right text-red-600">Monto VES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center justify-center opacity-30">
                    <div className="w-16 h-16 border-4 border-dashed border-red-600 rounded-full animate-spin-slow mb-6"></div>
                    <p className="font-black uppercase tracking-[5px] text-xs">Sincronizando con PostgreSQL...</p>
                    <span className="text-[10px] mt-2 italic text-red-500">Tasa actual: {tasaBCV.toFixed(2)} Bs</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportes;