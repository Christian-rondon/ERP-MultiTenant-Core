import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Inventario() {
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('productos').select('*');
      if (data) setProductos(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">📦 INVENTARIO</h2>
      <div className="grid gap-2">
        {productos.map((p) => (
          <div key={p.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between">
            <span>{p.nombre}</span>
            <span className="text-cyan-400">${p.precio}</span>
          </div>
        ))}
      </div>
    </div>
  );
}