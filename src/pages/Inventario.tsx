import React from 'react';
import { 
  Package, Search, Plus, Filter, 
  ArrowUpRight, ArrowDownRight, MoreVertical, 
  Edit3, Trash2, Barcode, DollarSign 
} from 'lucide-react';

const Inventario = () => {
  // Datos de ejemplo para visualizar el diseño profesional
  const productos = [
    { id: '1', nombre: 'Cemento Gris 42.5kg', codigo: '75010203', stock: 150, precio: 8.50, categoria: 'Construcción', status: 'In-Stock' },
    { id: '2', nombre: 'Tubo PVC 1/2" 6mts', codigo: '75010405', stock: 12, precio: 3.20, categoria: 'Plomería', status: 'Low-Stock' },
    { id: '3', nombre: 'Pintura Clase A Blanca', codigo: '75010607', stock: 45, precio: 25.00, categoria: 'Pinturas', status: 'In-Stock' },
    { id: '4', nombre: 'Bombillo LED 12W', codigo: '75010809', stock: 0, precio: 1.50, categoria: 'Electricidad', status: 'Out-of-Stock' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER & MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-[4px] uppercase text-white italic">Control de Stock</h2>
            <p className="text-[10px] font-bold tracking-[3px] text-[#00d1ff] uppercase mt-2 italic">Gestión de Mercancía Global</p>
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00d1ff] to-[#0057ff] text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)] uppercase text-xs tracking-widest">
            <Plus size={18} /> Añadir Producto
          </button>
        </div>

        <div className="lg:col-span-4 bg-[#10172a]/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col justify-center">
          <p className="text-[9px] font-black tracking-[3px] text-gray-500 uppercase mb-2">Valor Total Inventario</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white italic">$12,450.00</h3>
            <span className="text-[10px] text-green-500 font-bold uppercase">+Bs 562,740</span>
          </div>
        </div>
      </div>

      {/* 2. FILTROS Y BÚSQUEDA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00d1ff] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="BUSCAR POR NOMBRE, CÓDIGO O BARCODE..." 
            className="w-full pl-14 pr-6 py-5 bg-[#10172a]/40 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-[#00d1ff]/50 focus:ring-1 focus:ring-[#00d1ff]/20 transition-all placeholder:text-gray-600 uppercase font-bold tracking-widest"
          />
        </div>
        <div className="md:col-span-3">
          <select className="w-full h-full px-6 bg-[#10172a]/40 border border-white/10 rounded-2xl text-gray-400 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-[#00d1ff]/50">
            <option>Todas las Categorías</option>
            <option>Construcción</option>
            <option>Plomería</option>
            <option>Electricidad</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button className="w-full h-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all uppercase font-black text-[10px] tracking-widest">
            <Barcode size={18} /> Scan
          </button>
        </div>
      </div>

      {/* 3. TABLA DE PRODUCTOS TECH */}
      <div className="bg-[#10172a]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
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
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#00d1ff]/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white uppercase tracking-wider">{prod.nombre}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{prod.codigo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                      {prod.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black ${prod.stock <= 15 ? 'text-orange-500' : 'text-white'}`}>
                        {prod.stock}
                      </span>
                      <span className="text-[9px] text-gray-600 font-bold uppercase italic text-nowrap">Unidades</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-[#00d1ff] tracking-wider">${prod.precio.toFixed(2)}</span>
                      <span className="text-[8px] text-gray-600 font-bold uppercase">Bs {(prod.precio * 45).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${
                      prod.status === 'In-Stock' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                      prod.status === 'Low-Stock' ? 'text-orange-500 border-orange-500/20 bg-orange-500/5' :
                      'text-red-500 border-red-500/20 bg-red-500/5'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"><Edit3 size={14}/></button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#00d1ff] transition-all"><MoreVertical size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventario;