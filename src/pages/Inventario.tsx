import React from 'react';
import MainLayout from '../components/MainLayout';

export default function Inventario() {
  return (
    <MainLayout title="Inventario">
      <div className="bg-[#111827] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
        <h3 className="text-3xl font-black italic uppercase text-blue-400">Control de Stock</h3>
        <p className="text-gray-400 mt-4 font-bold uppercase text-xs tracking-widest">Productos totales: Conectando...</p>
      </div>
    </MainLayout>
  );
}
