import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Usamos las variables de entorno directamente
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export default function App() {
  const [view, setView] = useState('login'); 
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setView('dashboard');
    });
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      setView('dashboard');
    }
  };

  if (view === 'dashboard') {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <header style={{ background: '#0f172a', color: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '22px' }}>Construcciones Express 🏗️</h1>
        </header>
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#1e293b' }}>Panel de Control Venezuela</h2>
          <p style={{ color: '#64748b' }}>Sistema Activo 24/7</p>
          <div style={{ marginTop: '20px', padding: '15px', borderLeft: '4px solid #2563eb', background: '#eff6ff' }}>
            <strong>Estatus:</strong> Conexión con Supabase Exitosa ✅
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => setView('login'))} 
                  style={{ marginTop: '30px', backgroundColor: '#ef4444', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', padding: '20px' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '350px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '10px' }}>ERP Login</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '14px' }}>Introduce tus credenciales</p>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' }} required />
        <input type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }} required />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }}>
          {loading ? 'Entrando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
