import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// URL DIRECTA DE POSTIMAGES APLICADA
const NEXO_LOGO_URL = 'https://i.postimg.cc/26rD7T7B/Whats-App-Image-2026-04-01-at-11-10-21-AM.jpg';

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
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={NEXO_LOGO_URL} alt="Nexo" style={{ height: '40px', borderRadius: '50%' }} />
            <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>NEXO VENEZUELA</span>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => setView('login'))} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer' }}>Salir</button>
        </header>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1 style={{ color: '#22d3ee' }}>Panel Nexo Activo</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)' 
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '110px', height: '110px', margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #22d3ee', boxShadow: '0 0 20px rgba(34,211,238,0.3)' }}>
          <img src={NEXO_LOGO_URL} alt="Nexo Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 style={{ color: 'white', letterSpacing: '5px', margin: '0', fontSize: '32px', fontWeight: 'bold' }}>NEXO</h1>
        <p style={{ color: '#64748b', fontSize: '12px', letterSpacing: '3px', marginBottom: '30px' }}>VENEZUELA</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Usuario" onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} style={inputStyle} />
          <button type="submit" style={btnStyle}>Entrar al Sistema</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '15px', marginBottom: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none' };
const btnStyle = { width: '100%', padding: '15px', background: 'linear-gradient(to right, #2563eb, #22d3ee)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
