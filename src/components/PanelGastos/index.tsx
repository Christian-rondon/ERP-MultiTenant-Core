import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, DollarSign, Calculator, AlertCircle, Send, Store } from 'lucide-react';

interface PanelGastosProps {
  onSave?: () => void;
}

const PanelGastos = ({ onSave }: PanelGastosProps) => {
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [comercios, setComercios] = useState<any[]>([]);
  const [comercioSeleccionado, setComercioSeleccionado] = useState<any>(null);
  
  const session = JSON.parse(localStorage.getItem('nexo_session') || '{}');
  const esSuperAdmin = session.rol?.toLowerCase() === 'superadmin';
  const miComercioId = session.comercio_id;
  const miComercioNombre = session.nombre_comercio || "MI COMERCIO";

  const [formData, setFormData] = useState({
    descripcion: '',
    monto_usd: '',
    monto_bs: ''
  });

  useEffect(() => {
    if (esSuperAdmin) {
      const loadComercios = async () => {
        const { data } = await supabase.from('comercios').select('id, nombre_comercio');
        if (data) setComercios(data);
      };
      loadComercios();
    }
  }, [esSuperAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (esSuperAdmin && !comercioSeleccionado) return alert("Selecciona un comercio");

    setLoading(true);
    try {
      const { error } = await supabase.from('egresos').insert([{
        comercio_id: esSuperAdmin ? comercioSeleccionado?.id : miComercioId,
        descripcion: formData.descripcion,
        monto_usd: parseFloat(formData.monto_usd),
        monto_bs: parseFloat(formData.monto_bs),
        metodo_pago: 'Efectivo',
        fecha: new Date().toISOString()
      }]);
      if (error) throw error;
      if (onSave) onSave();
      setFormData({ descripcion: '', monto_usd: '', monto_bs: '' });
      setComercioSeleccionado(null);
      setBusqueda('');
      alert("✅ GASTO PROCESADO");
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="w-full bg-[#0a0f1a] border-2 border-red-500/20 rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in duration-500">
      
      {/* HEADER COMPACTO */}
      <div className="p-5 border-b border-white/5 bg-gradient-to-r from-red-600/10 to-transparent flex items-center gap-4">
        <div className="bg-red-600 p-2.5 rounded-xl shadow-lg shadow-red-900/20">
          <AlertCircle className="text-white" size={18} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase italic text-white tracking-tighter">Registrar Egreso</h3>
          <p className="text-[9px] text-red-500 font-bold uppercase tracking-[3px] opacity-70">CASH OUT PROTOCOL</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* SELECCIÓN DE COMERCIO (Si es Admin) */}
        {esSuperAdmin ? (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="BUSCAR NODO..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 text-xs font-bold text-white outline-none focus:border-red-500/50 transition-all"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            {busqueda && !comercioSeleccionado && (
               <div className="max-h-32 overflow-y-auto bg-black/80 rounded-xl border border-white/10 p-2 custom-scrollbar">
                  {comercios.filter(c => c.nombre_comercio.toLowerCase().includes(busqueda.toLowerCase())).map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => {setComercioSeleccionado(c); setBusqueda(c.nombre_comercio)}}
                      className="p-2 hover:bg-red-600 rounded-lg cursor-pointer text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-wider"
                    >
                      {c.nombre_comercio}
                    </div>
                  ))}
               </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <Store size={16} className="text-red-500" />
            <span className="text-xs font-black text-gray-300 uppercase tracking-widest">{miComercioNombre}</span>
          </div>
        )}

        {/* CONCEPTO */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Motivo</label>
          <input 
            required
            className="w-full bg-[#050810] border border-white/5 rounded-xl py-4 px-5 text-sm font-bold text-white outline-none focus:border-red-500/50 transition-all shadow-inner placeholder:text-gray-800"
            placeholder="EJ: PAGO PROVEEDOR..."
            value={formData.descripcion}
            onChange={e => setFormData({...formData, descripcion: e.target.value})}
          />
        </div>

        {/* MONTOS SPLIT */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">USD $</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-green-500" size={16} />
              <input 
                required type="number" step="0.01"
                placeholder="0.00"
                className="w-full bg-[#050810] border border-white/5 rounded-xl py-3.5 pl-9 text-lg font-black text-white outline-none focus:border-green-500/40 transition-all"
                value={formData.monto_usd}
                onChange={e => setFormData({...formData, monto_usd: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">BS .</label>
            <div className="relative">
              <Calculator className="absolute left-3 top-3.5 text-blue-500" size={16} />
              <input 
                required type="number" step="0.01"
                placeholder="0.00"
                className="w-full bg-[#050810] border border-white/5 rounded-xl py-3.5 pl-9 text-lg font-black text-white outline-none focus:border-blue-500/40 transition-all"
                value={formData.monto_bs}
                onChange={e => setFormData({...formData, monto_bs: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* BOTÓN CONFIRMAR */}
        <button 
          disabled={loading}
          className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase italic tracking-[4px] text-sm shadow-xl transition-all active:scale-95 border-b-4 border-red-900 flex items-center justify-center gap-3 group mt-2"
        >
          {loading ? 'ENVIANDO...' : (
            <>
              CONFIRMAR <Send size={16} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PanelGastos;