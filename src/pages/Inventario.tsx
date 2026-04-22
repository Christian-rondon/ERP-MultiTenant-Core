import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, Plus, Barcode, Edit3, Trash2, Store 
} from 'lucide-react';

const Inventario = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [comercios, setComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasaActual, setTasaActual] = useState(45);
  const [filtroNombre, setFiltroNombre] = useState("");

  // 1. Cargamos comercios y tasa al iniciar
  const fetchInitialData = async () => {
    // Cargar Comercios para el Selector
    const { data: dataComercios } = await supabase.from('comercios').select('id, nombre').order('nombre');
    if (dataComercios) setComercios(dataComercios);

    // Cargar Tasa dinámica de configuración
    const { data: dataConfig } = await supabase.from('configuracion').select('tasa_dolar').eq('id', 1).single();
    if (dataConfig?.tasa_dolar) setTasaActual(dataConfig.tasa_dolar);
  };

  // 2. Función Maestra de carga de productos
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const idRemoto = localStorage.getItem('comercio_seleccionado_id');
      
      let query = supabase.from('productos').select('*');

      // Si hay un comercio seleccionado, filtramos estrictamente por ese ID
      if (idRemoto && idRemoto !== "") {
        query = query.eq('comercio_id', idRemoto);
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
  }, []);

  // 3. Manejador de cambio de comercio
  const seleccionarComercio = (id: string) => {
    if (id) {
      localStorage.setItem('comercio_seleccionado_id', id);
    } else {
      localStorage.removeItem('comercio_seleccionado_id');
    }
    fetchProductos();
  };

  // 4. Lógica de búsqueda local (por nombre o código)
  const productosFiltrados = productos.filter(p => 
    p.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()) || 
    p.codigo?.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  // Cálculo de valor total basado en lo que hay en pantalla
  const valorTotal = productosFiltrados.reduce((acc, prod) => 
    acc + (Number(prod.precio || 0) * Number(prod.stock || 0)), 0
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER & MÉTRICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-[4px] uppercase text-white italic">Control de Stock</h2>
            <p className="text-[10px] font-bold tracking-[3px] text-[#00d1ff] uppercase mt-2 italic">
              {localStorage.getItem('comercio_seleccionado_id') ? 'GESTIÓN REMOTA DE CLIENTE' : 'Gestión de Mercancía Global'}
            </p>
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00d1ff] to-[#0057ff] text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)] uppercase text-xs tracking-widest">
            <Plus size={18} /> Añadir Producto
          </button>
        </div>

        <div className="lg:col-span-4 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col justify-center">
          <p className="text-[9px] font-black tracking-[3px] text-gray-500 uppercase mb-2">Valor Total Inventario</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white italic">${valorTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase">+Bs {(valorTotal * tasaActual).toLocaleString('de-DE')}</span>
          </div>
        </div>
      </div>

      {/* SELECTOR DE COMERCIOS */}
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

      {/* BÚSQUEDA Y FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00d1ff] transition-colors" size={20} />
          <input 
            type="text" 
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            placeholder="BUSCAR POR NOMBRE, CÓDIGO O BARCODE..." 
            className="w-full pl-14 pr-6 py-5 bg-[#10172a]/40 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-[#00d1ff]/50 focus:ring-1 focus:ring-[#00d1ff]/20 transition-all placeholder:text-gray-600 uppercase font-bold tracking-widest"
          />
        </div>
        <div className="md:col-span-3">
          <select className="w-full h-full px-6 bg-[#10172a]/40 border border-white/10 rounded-2xl text-gray-400 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-[#00d1ff]/50">
            <option>Todas las Categorías</option>
          </select>
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
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Producto / Código</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Categoría</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Stock</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Precio (Ref)</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px]">Estado</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[3px] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-20 text-gray-500 font-black text-[10px] uppercase tracking-widest animate-pulse">Cargando base de datos...</td></tr>
              ) : productosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-gray-500 font-black text-[10px] uppercase tracking-widest">No hay resultados para mostrar</td></tr>
              ) : (
                productosFiltrados.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#00d1ff]/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white uppercase tracking-wider">{prod.nombre}</span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{prod.codigo || 'S/N'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-gray-400 uppercase tracking-tighter border border-white/5">
                        {prod.categoria || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${prod.stock <= 10 ? 'text-orange-500' : 'text-white'}`}>{prod.stock}</span>
                        <span className="text-[8px] text-gray-600 font-bold uppercase italic">Unid.</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-[#00d1ff] text-xs">
                      <div className="flex flex-col">
                        <span>${Number(prod.precio || 0).toFixed(2)}</span>
                        <span className="text-[8px] text-gray-600 font-bold uppercase">Bs {(Number(prod.precio || 0) * tasaActual).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${
                        prod.stock > 10 ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                        prod.stock > 0 ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' :
                        'text-red-500 border-red-500/20 bg-red-500/5'
                      }`}>
                        {prod.stock > 10 ? 'In-Stock' : prod.stock > 0 ? 'Low-Stock' : 'Out-of-Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"><Edit3 size={14} /></button>
                        <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
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