import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

export default function Inventario() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      // Por ahora traemos todos, luego filtraremos por el Tenant logueado
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-gray-500 text-sm">Control total de stock y mercancía.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-[#161d2b] border border-white/5 hover:bg-white/5 px-6 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest">
            📥 Importar
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 text-xs uppercase tracking-widest">
            + Agregar Producto
          </button>
        </div>
      </div>

      <div className="bg-[#161d2b] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/5">
              <th className="p-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Producto</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Categoría</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Precio (USD)</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-500 tracking-widest">Stock</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cargando ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500 italic">Cargando almacén...</td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-500 italic">No hay productos registrados.</td>
              </tr>
            ) : (
              productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="p-5 font-bold text-sm text-gray-200">{prod.nombre}</td>
                  <td className="p-5">
                    <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase">
                      {prod.categoria}
                    </span>
                  </td>
                  <td className="p-5 font-mono text-blue-400">${prod.precio.toFixed(2)}</td>
                  <td className="p-5 font-bold">{prod.stock}</td>
                  <td className="p-5 text-center">
                    {prod.stock > 5 ? (
                      <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-black uppercase">Disponible</span>
                    ) : (
                      <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-black uppercase">Stock Bajo</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}