import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // IMPORTANTE: Para recibir el ID
import { supabase } from '../lib/supabase';
import { 
  Search, Plus, Barcode, Edit3, Trash2, Store, ArrowLeft 
} from 'lucide-react';

const Inventario = () => {
  const location = useLocation();
  // Capturamos el ID y el Nombre que enviamos desde el StoreDashboard
  const idDesdeDashboard = location.state?.idTarget;
  const nombreDesdeDashboard = location.state?.nombreTarget;

  const [productos, setProductos] = useState<any[]>([]);
  const [comercios, setComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasaActual, setTasaActual] = useState(45);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [userRol, setUserRol] = useState('');

  // 1. Carga inicial de datos de soporte
  const fetchInitialData = async () => {
    const session = JSON.parse(localStorage.getItem('nexo_session') || 'null');
    setUserRol(session?.rol?.toLowerCase() || '');

    const { data: dataComercios } = await supabase.from('comercios').select('id, nombre').order('nombre');
    if (dataComercios) setComercios(dataComercios);

    const { data: dataConfig } = await supabase.from('configuracion').select('tasa_dolar').eq('id', 1).single();
    if (dataConfig?.tasa_dolar) setTasaActual(dataConfig.tasa_dolar);
  };

  // 2. Función Maestra con Lógica de Aislamiento (Multi-tenant)
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const session = JSON.parse(localStorage.getItem('nexo_session') || 'null');
      
      // LÓGICA DE PRIORIDAD DE ID:
      // 1. Si venimos del Dashboard (idDesdeDashboard)
      // 2. Si no, lo que esté en el select (localStorage 'comercio_seleccionado_id')
      // 3. Si no, el ID del propio usuario (si es dueño/cajera)
      const idFiltro = idDesdeDashboard || 
                       localStorage.getItem('comercio_seleccionado_id') || 
                       session?.comercio_id;
      
      let query = supabase.from('productos').select('*');

      if (idFiltro) {
        query = query.eq('comercio_id', idFiltro);
      }

      const { data, error } = await query.order('nombre', { ascending: true });
      
      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchProductos();
  }, [idDesdeDashboard]); // Re-ejecutar si cambia el comercio objetivo

  const seleccionarComercio = (id: string) => {
    if (id) {
      localStorage.setItem('comercio_seleccionado_id', id);
    } else {
      localStorage.removeItem('comercio_seleccionado_id');
    }
    fetchProductos();
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()) || 
    p.codigo?.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  const valorTotal = productosFiltrados.reduce((acc, prod) => 
    acc + (Number(prod.precio || 0) * Number(prod.stock || 0)), 0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* INDICADOR DE CONTEXTO (Solo si estamos auditando un comercio específico) */}
      {idDesdeDashboard && (
        <div className="bg-[#00d1ff]/10 border border-[#00d1ff]/20 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00d1ff]/20 rounded-lg text-[#00d1ff]">
              <Store size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#00d1ff] uppercase tracking-widest leading-none">Auditando Inventario</p>
              <p className="text-white font-bold uppercase italic text-sm">{nombreDesdeDashboard}</p>
            </div>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="text-[9px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            Cerrar Auditoría ×
          </button>
        </div>
      )}

      {/* HEADER & MÉTRICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-[4px] uppercase text-white italic leading-none">Inventario</h2>
            <p className="text-[10px] font-bold tracking-[3px] text-gray-500 uppercase mt-3 italic">
              {idDesdeDashboard ? 'MODO SUPERVISIÓN ACTIVO' : 'GESTIÓN DE STOCK LOCAL'}
            </p>
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#00d1ff] text-[#0a0f1d] font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)] uppercase text-xs tracking-widest">
            <Plus size={18} /> Nuevo Item
          </button>
        </div>

        <div className="lg:col-span-4 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col justify-center">
          <p className="text-[9px] font-black tracking-[3px] text-gray-500 uppercase mb-2">Valor en Anaquel</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white italic">${valorTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase">Ref</span>
          </div>
        </div>
      </div>

      {/* SELECTOR DE COMERCIOS (SOLO PARA SUPERADMIN Y SI NO HAY UN ID FORZADO) */}
      {userRol === 'superadmin' && !idDesdeDashboard && (
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#00d1ff]">
            <Store size={20} />
          </div>
          <select 
            onChange={(e) => seleccionarComercio(e.target.value)}
            value={localStorage.getItem('comercio_seleccionado_id') || ""}
            className="w-full pl-14 pr-6 py-4 bg-[#10172a]/80 border border-[#00d1ff]/30 rounded-2xl text-sm text-white focus:outline-none focus:border-[#00d1ff] transition-all uppercase font-bold tracking-widest appearance-none cursor-pointer"
          >
            <option value="">-- SELECCIONAR COMERCIO PARA AUDITAR --</option>
            {comercios.map(c => (
              <option key={c.id} value={c.id} className="bg-[#10172a]">{c.nombre}</option>
            ))}
          </select>
        </div>
      )}

      {/* BÚSQUEDA Y FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-10 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00d1ff] transition-colors" size={20} />
          <input 
            type="text" 
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            placeholder="BUSCAR POR NOMBRE O CÓDIGO..." 
            className="w-full pl-14 pr-6 py-5 bg-[#10172a]/40 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-[#00d1ff]/50 transition-all placeholder:text-gray-600 uppercase font-bold tracking-widest"
          />
        </div>
        <div className="md:col-span-2">
          <button className="w-full h-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all uppercase font-black text-[10px] tracking-widest">
            <Barcode size={18} /> Scan
          </button>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-gray-500">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px]">Producto / Código</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px]">Stock</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px]">Precio Unit.</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px]">Total Bs</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[3px] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500 font-black text-[10px] uppercase tracking-widest animate-pulse text-[#00d1ff]">Sincronizando con el Nodo...</td></tr>
              ) : productosFiltrados.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20 text-gray-500 font-black text-[10px] uppercase tracking-widest">No hay mercancía registrada en este comercio</td></tr>
              ) : (
                productosFiltrados.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#00d1ff]/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white uppercase tracking-wider">{prod.nombre}</span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{prod.codigo || 'SIN CÓDIGO'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${prod.stock <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{prod.stock}</span>
                        <span className="text-[8px] text-gray-600 font-bold uppercase italic">Unid.</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-[#00d1ff] text-xs">
                      ${Number(prod.precio || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 font-black text-gray-400 text-[10px]">
                      Bs {(Number(prod.precio || 0) * tasaActual).toLocaleString('es-VE')}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-[#00d1ff]/20 rounded-lg text-[#00d1ff] transition-all"><Edit3 size={14} /></button>
                        <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventario;