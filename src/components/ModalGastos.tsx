import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Receipt, DollarSign, Wallet, AlertCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ModalGastos({ isOpen, onClose, onSave }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: '',
    monto_usd: '',
    monto_bs: '',
    categoria: 'Operativo'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const session = JSON.parse(localStorage.getItem('nexo_session') || 'null');

    try {
      const { error } = await supabase.from('gastos').insert([{
        comercio_id: session?.comercio_id,
        descripcion: formData.descripcion,
        monto_usd: parseFloat(formData.monto_usd) || 0,
        monto_bs: parseFloat(formData.monto_bs) || 0,
        categoria: formData.categoria,
        registrado_por: session?.id
      }]);

      if (error) throw error;
      
      onSave(); // Refresca los datos del Dashboard/Reporte
      onClose(); // Cierra el modal
      setFormData({ descripcion: '', monto_usd: '', monto_bs: '', categoria: 'Operativo' });
    } catch (err) {
      console.error("Error al registrar gasto:", err);
      alert("Hubo un error al guardar el egreso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999] flex items-center justify-center p-4">
      <div className="bg-[#0a0f1a] border border-red-500/30 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.1)] animate-in zoom-in duration-300">
        
        {/* Header del Modal */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-red-500/5">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle size={18} />
            <h3 className="font-black italic uppercase text-xs tracking-widest">Registrar Egreso de Caja</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="text-[9px] font-black uppercase text-gray-500 mb-2 block tracking-widest text-center">Descripción del Gasto</label>
            <input 
              required
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-red-500 outline-none transition-all text-center"
              placeholder="Ej: Pago de flete, Almuerzos, Servicios..."
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase text-gray-500 mb-2 block tracking-widest text-green-400 text-center">Monto USD</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14}/>
                <input 
                  type="number"
                  step="0.01"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-10 text-sm text-white outline-none focus:border-green-400 text-center"
                  placeholder="0.00"
                  value={formData.monto_usd}
                  onChange={(e) => setFormData({...formData, monto_usd: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-gray-500 mb-2 block tracking-widest text-[#00d1ff] text-center">Monto BS</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={14}/>
                <input 
                  type="number"
                  step="0.01"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-10 text-sm text-white outline-none focus:border-[#00d1ff] text-center"
                  placeholder="0.00"
                  value={formData.monto_bs}
                  onChange={(e) => setFormData({...formData, monto_bs: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-red-600 text-white font-black uppercase italic rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:bg-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'PROCESANDO...' : <><Receipt size={18}/> CONFIRMAR SALIDA</>}
          </button>
        </form>
      </div>
    </div>
  );
}