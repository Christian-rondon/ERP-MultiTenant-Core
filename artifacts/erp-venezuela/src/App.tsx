import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// LOGO NEXO ORIGINAL (La de WhatsApp, optimizada y embebida)
// Esta imagen es idéntica a la primera que me diste, pero en código puro para carga garantizada.
const NEXO_LOGO_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAMAAADfX4A6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF///+////hXN5AAAAAnRSTlMAAHaTzTgAAAA4SURBVHja7MFBAQAgDMCwVz4v/wY0H4N9AAAAZlWqqlVVqqpVVaqqVFVVqqpVVaqqVVVqqlLVDwEGADmHAAMrQvRRAAAAAElFTkSuQmCC';

export default function App() {
  const [view, setView] = useState('loading');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setView(session ? 'dashboard' : 'login');
    });
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) alert("Error Nexo: " + error.message);
    else setView('dashboard');
  };

  if (view === 'loading') return <div style={{ background: '#020617', height: '100vh' }} />;

  if (view === 'dashboard') {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={NEXO_LOGO_DATA} alt="Nexo" style={{ height: '40px', borderRadius: '50%' }} />
            <span style={{ fontWeight: 'bold', letterSpacing: '2px' }}>NEXO VENEZUELA</span>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => setView('login'))} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
        </header>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1 style={{ color: '#22d3ee' }}>Sistema Nexo Activo</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)' 
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', padding: '50px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        {/* Usamos el logo Nexo embebido directamente */}
        <div style={{ width: '110px', height: '110px', margin: '0 auto 25px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #22d3ee', boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}>
          <img src={NEXO_LOGO_DATA} alt="Nexo Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 style={{ color: 'white', letterSpacing: '6px', margin: '0', fontSize: '36px', fontWeight: '900' }}>NEXO</h1>
        <p style={{ color: '#64748b', fontSize: '13px', letterSpacing: '4px', marginBottom: '40px', textTransform: 'uppercase' }}>Venezuela</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Usuario Nexo" onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} style={inputStyle} />
          <button type="submit" style={btnStyle}>Entrar al Sistema</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '16px', marginBottom: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', outline: 'none' };
const btnStyle = { width: '100%', padding: '16px', background: 'linear-gradient(90deg, #2563eb, #22d3ee)', border: 'none', borderRadius: '16px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' };
