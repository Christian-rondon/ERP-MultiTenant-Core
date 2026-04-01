import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
      else window.location.href = '/';
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <nav style={{ backgroundColor: '#0f172a', color: 'white', padding: '15px 25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>Construcciones Express</h1>
        <span>{user?.email}</span>
      </nav>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#64748b', marginTop: 0 }}>Ventas del Día</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>$ 0.00</p>
          <span style={{ color: '#10b981', fontWeight: '500' }}>+ 0% vs ayer</span>
        </div>
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#64748b', marginTop: 0 }}>Tasa BCV</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '10px 0' }}>Bs. 36.40</p>
          <span style={{ color: '#64748b' }}>Actualizado hoy</span>
        </div>
      </div>
      
      <button 
        onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
        style={{ marginTop: '40px', padding: '12px 25px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
