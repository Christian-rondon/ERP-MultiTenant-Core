import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, Smartphone, CreditCard, Coins, DollarSign, 
  Layers, CheckCircle2, Plus, Minus, ShoppingCart, Store 
} from 'lucide-react';

export default function POS() {
  const [productos, setProductos] = useState<any[]>([]);
  const [tasaBCV, setTasaBCV] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [userRole, setUserRole] = useState(''); 
  const [comercioIdActual, setComercioIdActual] = useState('');
  const [listaComercios, setListaComercios] = useState<any[]>([]);

  const [metodoPago, setMetodoPago] = useState('efectivo_usd');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState<any[]>([]);

  // 1. CARGAR SESIÓN Y FORZAR VERIFICACIÓN DE ROL
  useEffect(() => {
    async function getInitialSession() {
      console.log("Verificando sesión...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No hay usuario autenticado en Auth");
        return;
      }

      // Buscamos en tu tabla de usuarios el rol y el comercio
      const { data: perfil, error } = await supabase
        .from('usuarios')
        .select('rol, comercio_id')
        .eq('id', user.id) 
        .single();

      if (error) {
        console.error("Error al obtener perfil de la tabla usuarios:", error);
        return;
      }

      if (perfil) {
        console.log("Perfil detectado:", perfil);
        setUserRole(perfil.rol);
        
        if (perfil.rol === 'SUPER_ADMIN') {
          console.log("Acceso de SUPER_ADMIN confirmado. Cargando comercios...");
          const { data: cData } = await supabase.from('comercios').select('id, nombre');
          if (cData) setListaComercios(cData);
        } else {
          setComercioIdActual(perfil.comercio_id);
        }
      }
    }
    getInitialSession();
  }, []);

  // 2. CARGAR PRODUCTOS Y TASA
  useEffect(() => {
    async function fetchDatosComercio() {
      if (!comercioIdActual) return;
      
      setLoading(true);
      try {
        const { data: pData } = await supabase
          .from('productos')
          .select('*')
          .eq('comercio_id', comercioIdActual);
        
        const { data: config } = await supabase
          .from('configuraciones')
          .select('tasa_bcv')
          .eq('comercio_id', comercioIdActual)
          .single();

        if (pData) setProductos(pData);
        if (config) setTasaBCV(config.tasa_bcv);
      } catch (e) {
        console.error("Error en fetchDatosComercio:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchDatosComercio();
  }, [comercioIdActual]);

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()));
  }, [busqueda, productos]);

  const agregarAlCarrito = (p: any) => {
    const existe = carrito.find(item => item.id === p.id);
    if (existe) {
      setCarrito(carrito.map(item => item.id === p.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    } else {
      setCarrito([...carrito, { ...p, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id: any, delta: number) => {
    setCarrito(carrito.map(item => {
      if (item.id === id) {
        const n = item.cantidad + delta;
        return n > 0 ? { ...item, cantidad: n } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const totalUSD = carrito.reduce((acc, i) => acc + (i.precio * i.cantidad), 0);
  const totalBS = totalUSD * tasaBCV;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-[#0a0f1a] overflow-hidden">
      
      {/* BARRA SUPERIOR REVISADA */}
      {userRole === 'SUPER_ADMIN' ? (
        <div className="px-6 py-4 bg-[#111827] border-b border-[#00d1ff]/20 flex items-center gap-4 z-50">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00d1ff]/10 border border-[#00d1ff]/20 rounded-lg">
            <Store className="text-[#00d1ff]" size={16} />
            <span className="text-[10px] font-black text-[#00d1ff] uppercase italic tracking-tighter">Panel SuperAdmin</span>
          </div>
          
          <select 
            className="flex-1 max-w-xs bg-[#0f172a] border border-white/10 rounded-xl p-2.5 text-white text-[10px] font-bold uppercase outline-none focus:border-[#00d1ff]/50"
            value={comercioIdActual}
            onChange={(e) => setComercioIdActual(e.target.value)}
          >
            <option value="">-- SELECCIONAR COMERCIO --</option>
            {listaComercios.map(c => (
              <option key={c.id} value={c.id} className="bg-[#0f172a]">{c.nombre}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="hidden">Rol detectado: {userRole}</div> 
      )}

      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* LADO IZQUIERDO */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="BUSCAR PRODUCTO..."
              className="w-full bg-[#111827] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black italic uppercase text-white outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <div className="w-8 h-8 border-2 border-[#00d1ff] border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-[10px] font-black uppercase italic text-white">Cargando...</p>
              </div>
            ) : !comercioIdActual ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 italic">
                <Store size={48} className="mb-4 opacity-10"/>
                <p className="text-xs uppercase font-black tracking-widest text-center">
                  {userRole === 'SUPER_ADMIN' ? 'Selecciona un comercio arriba' : 'No tienes un comercio asignado'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {productosFiltrados.map((p) => (
                  <div key={p.id} onClick={() => agregarAlCarrito(p)} className="bg-[#111827] border border-white/5 p-4 rounded-[2rem] hover:border-[#00d1ff]/30 cursor-pointer active:scale-95 transition-all">
                    <div className="aspect-square bg-black/40 rounded-2xl mb-4 flex items-center justify-center text-gray-700">
                      <ShoppingCart size={32} />
                    </div>
                    <h4 className="text-[10px] font-black text-white uppercase italic truncate">{p.nombre}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[11px] font-black text-[#00d1ff] italic">${p.precio}</span>
                      <span className="text-[8px] font-bold text-gray-600 uppercase">Stock: {p.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="w-[380px] bg-[#111827] rounded-[2.5rem] border border-white/5 flex flex-col shadow-2xl overflow-hidden">
          <div className="p-6 flex-1 flex flex-col min-h-0">
            <h3 className="text-[10px] font-black uppercase text-gray-500 italic mb-6 flex items-center gap-2">
              <ShoppingCart size={14}/> Detalle de Orden
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scroll">
              {carrito.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-white uppercase italic truncate">{item.nombre}</p>
                    <p className="text-[9px] text-[#00d1ff] font-black italic">${(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => actualizarCantidad(item.id, -1)} className="p-1 bg-white/5 rounded-md text-gray-400 hover:text-white"><Minus size={12}/></button>
                    <span className="text-[10px] font-black italic w-4 text-center text-white">{item.cantidad}</span>
                    <button onClick={() => actualizarCantidad(item.id, 1)} className="p-1 bg-white/5 rounded-md text-gray-400 hover:text-white"><Plus size={12}/></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-[8px] font-black uppercase text-gray-600 italic mb-3">Método de Cobro</p>
              <div className="grid grid-cols-2 gap-1.5">
                <MiniPaymentBtn active={metodoPago === 'efectivo_usd'} onClick={() => setMetodoPago('efectivo_usd')} label="USD" icon={<DollarSign size={12}/>} color="text-green-400" />
                <MiniPaymentBtn active={metodoPago === 'efectivo_bs'} onClick={() => setMetodoPago('efectivo_bs')} label="BS" icon={<Coins size={12}/>} color="text-white" />
                <MiniPaymentBtn active={metodoPago === 'pago_movil'} onClick={() => setMetodoPago('pago_movil')} label="P. Móvil" icon={<Smartphone size={12}/>} color="text-[#00d1ff]" />
                <MiniPaymentBtn active={metodoPago === 'punto'} onClick={() => setMetodoPago('punto')} label="Punto" icon={<CreditCard size={12}/>} color="text-purple-400" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-black/20 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black text-gray-600 uppercase italic">Total General</p>
                <p className="text-2xl font-black italic text-white tracking-tighter">${totalUSD.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-gray-600 uppercase italic">En Bolívares (Tasa: {tasaBCV})</p>
                <p className="text-xs font-black italic text-gray-400">Bs. {totalBS.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            <button onClick={() => alert("Venta registrada")} className="w-full bg-[#00d1ff] py-3 rounded-xl text-black font-black uppercase italic text-[10px] tracking-widest shadow-[0_4px_20px_rgba(0,209,255,0.2)]">
              <CheckCircle2 size={14} className="inline mr-2"/> Procesar Venta
            </button>
          </div>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA DE COMERCIO INFERIOR (SUPER_ADMIN) */}
      {userRole === 'SUPER_ADMIN' && (
        <div className="px-6 py-3 bg-[#0f172a] border-t border-[#00d1ff]/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Search className="text-gray-500" size={14} />
            <span className="text-[9px] font-bold text-gray-500 uppercase italic">Buscador Rápido de Comercio:</span>
          </div>
          <select 
            className="flex-1 max-w-md bg-[#111827] border border-white/5 rounded-lg p-2 text-white text-[10px] font-bold uppercase outline-none focus:border-[#00d1ff]/30"
            value={comercioIdActual}
            onChange={(e) => setComercioIdActual(e.target.value)}
          >
            <option value="">CAMBIAR ENTIDAD COMERCIAL...</option>
            {listaComercios.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function MiniPaymentBtn({ label, icon, color, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${active ? `bg-white/5 border-white/20 ${color} shadow-sm` : 'bg-transparent border-white/5 text-gray-600'}`}>
      <div className={active ? color : 'text-gray-700'}>{icon}</div>
      <span className="text-[9px] font-black uppercase italic">{label}</span>
    </button>
  );
}