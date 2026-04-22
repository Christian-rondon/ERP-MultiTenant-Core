import React, { useState } from 'react';
import { 
  Search, Smartphone, CreditCard, Coins, DollarSign, 
  Layers, CheckCircle2, Plus, Minus, Trash2, ShoppingCart 
} from 'lucide-react';

export default function POS() {
  const [metodoPago, setMetodoPago] = useState('efectivo_usd');
  const [busqueda, setBusqueda] = useState('');

  return (
    <div className="flex h-[calc(100vh-100px)] gap-6 p-6 bg-[#0a0f1a] overflow-hidden">
      
      {/* LADO IZQUIERDO: SELECCIÓN DE PRODUCTOS */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text"
            placeholder="BUSCAR PRODUCTO O CÓDIGO DE BARRAS..."
            className="w-full bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black italic uppercase tracking-widest focus:border-[#00d1ff]/50 outline-none transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Ejemplo de Producto Card */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-[#111827] border border-white/5 p-4 rounded-[2rem] hover:border-[#00d1ff]/30 transition-all cursor-pointer group">
                <div className="aspect-square bg-black/40 rounded-2xl mb-4 flex items-center justify-center text-gray-700">
                  <ShoppingCart size={32} />
                </div>
                <h4 className="text-[10px] font-black text-white uppercase italic truncate">Producto de Ejemplo {i}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[11px] font-black text-[#00d1ff] italic">$12.50</span>
                  <span className="text-[8px] font-bold text-gray-600 uppercase">Stock: 24</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LADO DERECHO: CARRITO Y MÉTODOS (DISEÑO REDUCIDO) */}
      <div className="w-[380px] bg-[#111827] rounded-[2.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 flex-1 flex flex-col min-h-0">
          <h3 className="text-[10px] font-black uppercase text-gray-500 italic tracking-[0.2em] mb-6 flex items-center gap-2">
            <ShoppingCart size={14}/> Detalle de Orden
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scroll">
            {/* Item en Carrito */}
            <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-2xl border border-white/5">
              <div className="min-w-0">
                <p className="text-[9px] font-black text-white uppercase italic truncate">Cemento Gris 42.5kg</p>
                <p className="text-[9px] text-[#00d1ff] font-black italic">$8.50</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 bg-white/5 rounded-md text-gray-400 hover:text-white"><Minus size={12}/></button>
                <span className="text-[10px] font-black italic w-4 text-center">2</span>
                <button className="p-1 bg-white/5 rounded-md text-gray-400 hover:text-white"><Plus size={12}/></button>
              </div>
            </div>
          </div>

          {/* SECCIÓN MÉTODOS COMPACTA */}
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[8px] font-black uppercase text-gray-600 italic mb-3 tracking-widest">Método de Cobro</p>
            <div className="grid grid-cols-2 gap-1.5">
              <MiniPaymentBtn 
                active={metodoPago === 'efectivo_usd'} 
                onClick={() => setMetodoPago('efectivo_usd')}
                label="USD" icon={<DollarSign size={12}/>} color="text-green-400" 
              />
              <MiniPaymentBtn 
                active={metodoPago === 'efectivo_bs'} 
                onClick={() => setMetodoPago('efectivo_bs')}
                label="BS" icon={<Coins size={12}/>} color="text-white" 
              />
              <MiniPaymentBtn 
                active={metodoPago === 'pago_movil'} 
                onClick={() => setMetodoPago('pago_movil')}
                label="P. Móvil" icon={<Smartphone size={12}/>} color="text-[#00d1ff]" 
              />
              <MiniPaymentBtn 
                active={metodoPago === 'punto'} 
                onClick={() => setMetodoPago('punto')}
                label="Punto" icon={<CreditCard size={12}/>} color="text-purple-400" 
              />
            </div>
            <button 
              onClick={() => setMetodoPago('mixto')}
              className={`w-full mt-1.5 flex items-center justify-center gap-2 py-1.5 rounded-lg border transition-all ${
                metodoPago === 'mixto' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-white/[0.02] border-white/5 text-gray-600 font-bold'
              }`}
            >
              <Layers size={11}/>
              <span className="text-[8px] font-black uppercase italic">Pago Mixto</span>
            </button>
          </div>
        </div>

        {/* FOOTER: TOTAL Y PROCESAR */}
        <div className="p-6 bg-black/20 border-t border-white/5 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[8px] font-black text-gray-600 uppercase italic">Total General</p>
              <p className="text-2xl font-black italic text-white tracking-tighter">$17.00</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-gray-600 uppercase italic">En Bolívares</p>
              <p className="text-xs font-black italic text-gray-400">Bs. 620,50</p>
            </div>
          </div>

          <button className="w-full bg-[#00d1ff] py-3 rounded-xl text-black font-black uppercase italic text-[10px] tracking-widest shadow-[0_4px_20px_rgba(0,209,255,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2">
            <CheckCircle2 size={14}/> Procesar Venta
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniPaymentBtn({ label, icon, color, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
        ${active 
          ? `bg-white/5 border-white/20 ${color} shadow-sm` 
          : 'bg-transparent border-white/5 text-gray-600 hover:bg-white/[0.02]'}
      `}
    >
      <div className={active ? color : 'text-gray-700'}>{icon}</div>
      <span className="text-[9px] font-black uppercase italic">{label}</span>
    </button>
  );
}