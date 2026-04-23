import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  TrendingUp, 
  Package, 
  AlertCircle,
  ShoppingCart,
  Wallet,
  RefreshCw,
  Globe
} from 'lucide-react';

export default function StoreDashboard() {
  const { id: urlId } = useParams();
  const [comercioInfo, setComercioInfo] = useState({ nombre: '', rif: '', id: '' });
  const [tasaReal, setTasaReal] = useState(0);
  const [stats, setStats] = useState({
    valorInventario: 0,
    productosTotal: 0,
    stockBajo: 0
  });
  const [topProductos, setTopProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('nexo_session') || 'null');
    const activeId = urlId || session?.comercio_id;
    if (activeId) fetchOwnerData(activeId);
  }, [urlId]);

  async function fetchOwnerData(id: string) {
    try {
      setLoading(true);

      // 1. OBTENER TASA REAL DESDE TABLA 'configuracion'
      const { data: config } = await supabase
        .from('configuracion')
        .select('tasa_dolar')
        .single();
      
      if (config) setTasaReal(config.tasa_dolar);

      // 2. Info del Comercio
      const { data: store } = await supabase.from('comercios').select('*').eq('id', id).single();
      if (store) setComercioInfo(store);

      // 3. Inventario y Valorización
      const { data: productos } = await supabase
        .from('productos')
        .select('stock, precio_costo, nombre, ventas_totales')
        .eq('comercio_id', id);
      
      if (productos) {
        // Cálculo de inversión: stock * precio_costo
        const valorTotal = productos.reduce((acc, p) => acc + (Number(p.stock) * Number(p.precio_costo || 0)), 0);
        const bajo = productos.filter(p => p.stock < 5).length;
        const top = [...productos].sort((a, b) => b.ventas_totales - a.ventas_totales).slice(0, 5);

        setStats({
          valorInventario: valorTotal,
          productosTotal: productos.length,
          stockBajo: bajo
        });
        setTopProductos(top);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* TICKER DE TASA REAL - DINÁMICO */}
      <div className="flex justify-between items-center bg-[#111827] border border-[#00d1ff]/20 p-4 rounded-2xl shadow-[0_0_20px_rgba(0,209,255,0.05)]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00d1ff]/10 rounded-lg">
              <Globe size={16} className="text-[#00d1ff] animate-pulse"/>
            </div>
            <div>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Monitor BCV / Oficial</p>
              <p className="text-lg font-black text-white italic">Bs. {tasaReal.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-[9px] font-bold text-[#00d1ff] uppercase italic tracking-tighter">Sincronización segura con servidor central activa</p>
        </div>
      </div>

      {/* HEADER */}
      <header>
        <p className="text-[#00d1ff] text-[10px] font-black uppercase tracking-[0.4em] mb-1">Terminal de Inteligencia Local</p>
        <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">{comercioInfo.nombre}</h1>
        <div className="mt-3 flex gap-4">
           <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-gray-400 uppercase italic">RIF: {comercioInfo.rif || 'S/N'}</span>
           <span className="px-3 py-1 bg-[#00d1ff]/10 border border-[#00d1ff]/20 rounded-full text-[9px] font-black text-[#00d1ff] uppercase italic">ID NODO: {urlId?.split('-')[0] || 'MASTER'}</span>
        </div>
      </header>

      {/* MÉTRICAS DE PATRIMONIO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          label="Inversión en Mercancía" 
          val={`$${stats.valorInventario.toLocaleString()}`} 
          subtext="Capital total en estantería"
          icon={<Wallet className="text-[#00d1ff]" />}
          highlight={true}
        />
        <MetricCard 
          label="Artículos Únicos" 
          val={`${stats.productosTotal} SKU`} 
          subtext="Variedad en catálogo"
          icon={<Package className="text-gray-400" />}
        />
        <MetricCard 
          label="Alertas de Reposición" 
          val={stats.stockBajo} 
          subtext="Productos por agotarse"
          icon={<AlertCircle className={stats.stockBajo > 0 ? "text-red-500 animate-bounce" : "text-green-500"} />}
          alert={stats.stockBajo > 0}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* TOP PRODUCTOS */}
        <div className="bg-[#111827] border border-white/5 p-8 rounded-[2.5rem]">
          <h3 className="text-xs font-black uppercase italic tracking-widest flex items-center gap-2 mb-8">
            <TrendingUp size={16} className="text-[#00d1ff]"/> Ranking de Movimiento
          </h3>
          <div className="space-y-4">
            {topProductos.map((p, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-[#00d1ff]/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-[#00d1ff] italic border border-white/5 group-hover:border-[#00d1ff]/50">
                    #{i+1}
                  </div>
                  <p className="text-xs font-bold text-gray-300 uppercase">{p.nombre}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#00d1ff] italic">{p.ventas_totales || 0} UNI</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTA DE COMPRA INTELIGENTE */}
        <div className="bg-[#111827] border border-red-500/10 p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShoppingCart size={120} className="text-red-500" />
          </div>
          <h3 className="text-xs font-black uppercase italic tracking-widest flex items-center gap-2 mb-8 text-red-500">
            <AlertCircle size={16}/> Necesidad de Compra
          </h3>
          <div className="space-y-4 relative z-10">
             {topProductos.filter(p => p.stock < 10).length > 0 ? (
               topProductos.filter(p => p.stock < 10).map((p, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tighter">{p.nombre}</p>
                      <p className="text-[9px] font-bold text-red-400 uppercase mt-1 italic">Stock Crítico: {p.stock} unidades</p>
                    </div>
                    <RefreshCw size={14} className="text-red-500 animate-spin-slow" />
                 </div>
               ))
             ) : (
               <div className="py-10 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase italic">Inventario Optimizado</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-componente de tarjetas
function MetricCard({ label, val, subtext, icon, highlight, alert }: any) {
  return (
    <div className={`p-6 rounded-[2rem] border transition-all ${
      highlight ? 'bg-[#00d1ff]/5 border-[#00d1ff]/30 shadow-[0_0_40px_rgba(0,209,255,0.05)]' : 
      alert ? 'bg-red-500/5 border-red-500/20' : 'bg-[#111827] border-white/5'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">{label}</span>
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
      </div>
      <h2 className={`text-4xl font-black italic tracking-tighter leading-none ${highlight ? 'text-[#00d1ff]' : alert ? 'text-red-500' : 'text-white'}`}>
        {val}
      </h2>
      <p className="text-[9px] font-bold text-gray-600 uppercase italic mt-4">{subtext}</p>
    </div>
  );
}