import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PRODUCT_TEMPLATES } from '../lib/initialData';

export default function MasterConfig() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Comercio General');
  const [cargando, setCargando] = useState(false);

  const crearComercioConInventario = async () => {
    if (!nombre.trim()) return alert("Escribe el nombre del comercio");
    
    setCargando(true);
    try {
      // 1. Crear el Tenant (Comercio)
      const { data: tenant, error: tError } = await supabase
        .from('tenants')
        .insert([{ name: nombre, type: tipo }])
        .select()
        .single();

      if (tError) throw tError;

      // 2. Obtener los productos plantilla
      // Usamos "as keyof typeof PRODUCT_TEMPLATES" para que TypeScript no de error
      const productosBase = PRODUCT_TEMPLATES[tipo as keyof typeof PRODUCT_TEMPLATES] || PRODUCT_TEMPLATES["Comercio General"];

      // 3. Insertar los productos vinculados al nuevo tenant.id
      const productosParaInsertar = productosBase.map(p => ({
        nombre: p.nombre,
        precio: p.precio,
        categoria: p.categoria,
        stock: p.stock,
        tenant_id: tenant.id // Vinculamos al nuevo comercio
      }));

      const { error: pError } = await supabase
        .from('productos')
        .insert(productosParaInsertar);

      if (pError) throw pError;

      alert(`✅ ¡Éxito! Comercio "${nombre}" creado con su inventario inicial.`);
      setNombre(''); // Limpiar formulario
      
    } catch (error: any) {
      console.error("Error detallado:", error);
      alert("Error: " + (error.message || "No se pudo registrar"));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-8 bg-[#0a0f1a] min-h-screen text-white">
      <header className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="bg-blue-600 p-1 rounded-md text-xs">💎</span> Configuración Maestra
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* PARÁMETROS GLOBALES */}
        <div className="bg-[#161d2b] p-8 rounded-3xl border border-white/5 shadow-2xl">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">✅ Parámetros Globales</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Tasa BCV</label>
              <input type="number" defaultValue="463.10" className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none font-mono text-blue-400" />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">IVA (%)</label>
              <input type="number" defaultValue="0" className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none font-mono" />
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">
            Guardar Parámetros
          </button>
        </div>

        {/* CREAR NUEVO COMERCIO */}
        <div className="bg-[#161d2b] p-8 rounded-3xl border border-white/5 shadow-2xl">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">🏢 Registro de Nuevo Cliente</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Nombre del Comercio</label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Abasto La Bendición" 
                className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-purple-500" 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2">Tipo de Negocio</label>
              <select 
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-black/30 border border-white/10 p-3 rounded-xl outline-none focus:border-purple-500 text-gray-300"
              >
                <option value="Comercio General">📦 Comercio General</option>
                <option value="Repuestos Moto">🏍️ Repuestos Moto</option>
                <option value="Panadería">🥐 Panadería</option>
                <option value="Ferretería">🔨 Ferretería</option>
              </select>
            </div>
            <button 
              onClick={crearComercioConInventario}
              disabled={cargando}
              className={`w-full ${cargando ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'} text-white px-6 py-4 rounded-xl font-bold mt-2 shadow-lg transition-all uppercase text-[10px] tracking-widest`}
            >
              {cargando ? 'Registrando...' : '+ Crear Comercio y Cargar Catálogo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}