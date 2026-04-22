import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Download, RefreshCcw, ArrowUpRight, Store } from 'lucide-react';

export default function Ventas() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [comercios, setComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totales, setTotales] = useState({ usd: 0, bs: 0 });
  
  // Estado local para forzar el renderizado del select
  const [idSeleccionado, setIdSeleccionado] = useState(localStorage.getItem('comercio_seleccionado_id') || "");

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // 1. Cargar Comercios
      const { data: c } = await supabase.from('comercios').select('id, nombre').order('nombre');
      if (c) setComercios(c);

      // 2. Cargar Ventas
      let query = supabase.from('ventas').select('*, comercios(nombre)');
      if (idSeleccionado) {
        query = query.eq('comercio_id', idSeleccionado);
      }
      
      const { data: v, error } = await query.order('created_at', { ascending: false });
      if (v) {
        setVentas(v);
        const sumUsd = v.reduce((acc, curr) => acc + (curr.total_usd || 0), 0);
        const sumBs = v.reduce((acc, curr) => acc + (curr.total_bs || 0), 0);
        setTotales({ usd: sumUsd, bs: sumBs });
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [idSeleccionado]);

  // FUNCIONES DE BOTONES
  const btnRefrescar = () => {
    alert("🔄 Refrescando conexión con Supabase...");
    cargarDatos();
  };

  const btnDescargar = () => {
    alert("📥 Generando reporte de auditoría...");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ventas));
    window.open(dataStr);
  };

  const cambiarComercio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoId = e.target.value;
    alert("🏪 Cambiando al Nodo ID: " + (nuevoId || "Global"));
    localStorage.setItem('comercio_seleccionado_id', nuevoId);
    setIdSeleccionado(nuevoId);
  };

  return (
    <div className="p-4 space-y-6 relative z-10"> {/* Añadido z-10 para asegurar clics */}
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a2233] p-6 rounded-2xl border border-white/5">
        <div>
          <h1 className="text-2xl font-black italic text-[#00d1ff] uppercase">Historial de Operaciones</h1>
          <div className="flex gap-4 mt-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <Calendar size={12}/> Registros: {ventas.length}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* SELECTOR */}
          <div className="relative z-20">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00d1ff] pointer-events-none" size={16} />
            <select 
              onChange={cambiarComercio}
              value={idSeleccionado}
              className="pl-10 pr-8 py-2.5 bg-black border border-[#00d1ff]/50 rounded-xl text-[10px] font-black text-white uppercase appearance-none cursor-pointer hover:border-[#00d1ff]"
            >
              <option value="">-- NODOS GLOBALES --</option>
              {comercios.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {/* BOTÓN REFRESCAR */}
          <button 
            onClick={btnRefrescar}
            className="bg-white/5 hover:bg-[#00d1ff]/20 p-3 rounded-xl text-white border border-white/10 active:scale-95 transition-all"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""}/>
          </button>
          
          {/* BOTÓN DESCARGAR */}
          <button 
            onClick={btnDescargar}
            className="bg-white/5 hover:bg-green-500/20 p-3 rounded-xl text-white border border-white/10 active:scale-95 transition-all"
          >
            <Download size={20}/>
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-[#111827] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-black/40">
            <tr>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase">Comercio</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase text-right">Total USD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={2} className="p-10 text-center text-xs text-[#00d1ff] animate-pulse">SINCRONIZANDO...</td></tr>
            ) : (
              ventas.map((v) => (
                <tr key={v.id} className="hover:bg-white/[0.02]">
                  <td className="p-4 text-[10px] text-white font-bold uppercase">{v.comercios?.nombre || 'N/A'}</td>
                  <td className="p-4 text-right text-[11px] font-black text-[#00d1ff] italic">${v.total_usd?.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}