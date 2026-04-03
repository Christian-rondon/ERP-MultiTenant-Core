import React from 'react';
import MainLayout from '../components/MainLayout';

export default function Configuracion() {
  return (
    <MainLayout title="Configuración">
      <div className="bg-[#111827] p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
        <h3 className="text-3xl font-black italic uppercase text-blue-400">Ajustes del Sistema</h3>
        <p className="text-gray-400 mt-4 font-bold">Configuración de Tasa BCV y Negocio.</p>
      </div>
    </MainLayout>
  );
}
