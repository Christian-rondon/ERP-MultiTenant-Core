import React, { useState } from 'react';
import { 
  Search, Plus, Minus, Trash2, 
  User, CreditCard, Banknote, 
  ShoppingCart, Receipt, Calculator
} from 'lucide-react';

const Pos = () => {
  // Estado para el carrito de compras
  const [cart, setCart] = useState([
    { id: '1', nombre: 'Cemento Gris 42.5kg', precio: 8.50, cantidad: 2 },
    { id: '2', nombre: 'Bombillo LED 12W', precio: 1.50, cantidad: 5 },
  ]);

  const tasaBCV = 45.12;
  const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const totalBs = subtotal * tasaBCV;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
      
      {/* 1. SECTOR DE BÚSQUEDA Y SELECCIÓN (IZQUIERDA) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00d1ff]" size={20} />
            <input 
              type="text" 
              placeholder="ESCANEAR BARCODE O BUSCAR PRODUCTO..." 
              className="w-full pl-14 pr-6 py-5 bg-[#050a15]/60 border border-white/10 rounded-2xl text-white focus:border-[#00d1ff]/50 focus:outline-none uppercase font-black tracking-widest text-sm"
            />
          </div>
        </div>

        {/* LISTADO DE RESULTADOS / CATEGORÍAS RÁPIDAS */}
        <div className="flex-1 bg-[#10172a]/40 border border-white/10 rounded-3xl p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <button key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#00d1ff]/30 transition-all text-left group">
                <p className="text-[10px] font-black text-white uppercase mb-1 group-hover:text-[#00d1ff]">Producto Ejemplo {i}</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase">$5.00</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. EL CARRITO Y TOTALES (DERECHA) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="flex-1 bg-[#10172a]/60 backdrop-blur-xl border border-[#00d1ff]/20 rounded-3xl p-6 flex flex-col shadow-[0_0_50px_rgba(0,209,255,0.05)]">
          
          {/* Cliente Quick-Select */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00d1ff]/10 rounded-lg text-[#00d1ff]"><User size={18}/></div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Consumidor Final</p>
            </div>
            <button className="text-[10px] font-bold text-[#00d1ff] uppercase">Cambiar</button>
          </div>

          {/* Lista del Carrito */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-white uppercase">{item.nombre}</p>
                  <p className="text-[9px] text-gray-500 font-bold tracking-widest">${item.precio} c/u</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white/5 rounded-xl border border-white/10">
                    <button className="p-2 text-gray-500 hover:text-white"><Minus size={12}/></button>
                    <span className="text-[10px] font-black px-2">{item.cantidad}</span>
                    <button className="p-2 text-[#00d1ff] hover:text-white"><Plus size={12}/></button>
                  </div>
                  <button className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>

          {/* Totales y Pago */}
          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
            <div className="flex justify-between text-gray-500 uppercase font-black text-[10px] tracking-[2px]">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#00d1ff]/5 rounded-2xl border border-[#00d1ff]/20">
              <span className="text-[10px] font-black text-[#00d1ff] uppercase tracking-[3px]">Total Bs.</span>
              <span className="text-xl font-black text-white italic">Bs. {totalBs.toLocaleString('de-DE', {minimumFractionDigits: 2})}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                <Banknote className="text-green-500" size={20} />
                <span className="text-[8px] font-black uppercase tracking-widest">Efectivo</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-[#00d1ff] rounded-2xl hover:scale-105 transition-all text-[#050a15]">
                <CreditCard size={20} />
                <span className="text-[8px] font-black uppercase tracking-widest">Procesar</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Pos;