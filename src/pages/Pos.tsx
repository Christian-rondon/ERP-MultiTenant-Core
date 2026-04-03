import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TASA_BCV = 450.00;

export default function Pos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo USD");

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) console.error("Error BD:", error);
    setProductos(data || []);
  };

  const agregarAlCarrito = (p: any) => {
    const existe = carrito.find(item => item.id === p.id);
    if (existe) {
      setCarrito(carrito.map(item => item.id === p.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    } else {
      setCarrito([...carrito, { ...p, cantidad: 1 }]);
    }
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) return;
    try {
      const { data: tenant } = await supabase.from('tenants').select('id').limit(1).single();
      const totalUSD = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

      const { data: venta, error: vError } = await supabase.from('ventas').insert([{
        tenant_id: tenant?.id,
        total: totalUSD,
        metodo_pago: metodoPago
      }]).select().single();

      if (vError) throw vError;

      for (const item of carrito) {
        await supabase.rpc('restar_stock', { p_id: item.id, cant: item.cantidad });
      }

      setCarrito([]);
      fetchProductos();
      alert("¡Venta Exitosa!");
    } catch (err) {
      console.error("Error al procesar:", err);
    }
  };

  const subtotalUSD = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div className="flex h-screen bg-[#0a0f1a] text-white p-6 gap-6">
      <div className="flex-1 bg-[#161d2b] rounded-3xl p-6 border border-white/5 overflow-hidden flex flex-col">
        <input 
          type="text" placeholder="Buscar..."
          className="w-full p-4 bg-black/20 border border-white/10 rounded-2xl mb-6 outline-none"
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-4 overflow-y-auto">
          {productos.filter(p => p.nombre?.toLowerCase().includes(busqueda.toLowerCase())).map(p => (
            <button key={p.id} onClick={() => agregarAlCarrito(p)} className="p-4 bg-[#1f2937] rounded-2xl border border-white/5 text-left">
              <p className="text-sm font-bold uppercase truncate">{p.nombre}</p>
              <p className="text-[10px] text-gray-500">STOCK: {p.stock}</p>
              <p className="text-xl font-black mt-2">${p.precio}</p>
              <p className="text-[#00df9a] text-xs">Bs.S {(p.precio * TASA_BCV).toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="w-[350px] bg-[#161d2b] rounded-3xl p-6 border border-white/5 flex flex-col">
        <h2 className="text-xl font-black mb-6 text-blue-500">CARRITO</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {carrito.map(item => (
            <div key={item.id} className="flex justify-between text-xs bg-black/20 p-3 rounded-xl">
              <span>{item.nombre} (x{item.cantidad})</span>
              <span className="font-bold">${(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-3xl font-black text-right">${subtotalUSD.toFixed(2)}</p>
          <p className="text-xl font-black text-[#00df9a] text-right mb-6">Bs.S {(subtotalUSD * TASA_BCV).toFixed(2)}</p>
          <button onClick={finalizarVenta} className="w-full bg-blue-600 p-4 rounded-2xl font-black uppercase">Finalizar</button>
        </div>
      </div>
    </div>
  );
}