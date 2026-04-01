import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// LOGO NEXO EXACTO (SVG)
const NexoLogo = () => (
  <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}>
      {/* Anillo Metálico */}
      <circle cx="50" cy="50" r="48" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="50" cy="50" r="44" fill="#020617" stroke="#475569" strokeWidth="1" />
      {/* N Estilizada con Gradiente Nexo */}
      <defs>
        <linearGradient id="nexoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M30 75V25H42L58 58V25H70V75H58L42 42V75H30Z" fill="url(#nexoGrad)" />
      <path d="M65 22H78V35H73V28L58 43L54 39L69 24H65V22Z" fill="#22d3ee" />
    </svg>
  </div>
);

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
    if (error) alert("Error de Nexo: " + error.message);
    else setView('dashboard');
  };

  if (view === 'loading') return <div style={{ background: '#020617', height: '100vh' }} />;

  if (view === 'dashboard') {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
           <h2 style={{ margin: 0, fontSize: '18px', letterSpacing: '2px' }}>NEXO VENEZUELA</h2>
           <button onClick={() => supabase.auth.signOut().then(() => setView('login'))} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '5px 15px' }}>Salir</button>
        </header>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <h1 style={{ color: '#22d3ee' }}>Bienvenido al Gestor Inteligente</h1>
          <p style={{ color: '#94a3b8' }}>Panel de Control Activo</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: 'linear-gradient(rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 0.9)), url("https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop") center/cover'
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', padding: '20px' }}>
        <NexoLogo />
        <h1 style={{ color: 'white', fontSize: '32px', margin: '0', fontWeight: 'bold', letterSpacing: '4px' }}>NEXO</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', letterSpacing: '2px', marginBottom: '30px' }}>VENEZUELA</p>
        
        <form onSubmit={handleLogin}>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <input type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} style={inputStyle} />
          </div>
          <button type="submit" style={btnStyle}>Entrar al Sistema Nexo</button>
        </form>
        <p style={{ marginTop: '30px', color: '#475569', fontSize: '10px' }}>© 2026 Nexo Group · GESTOR INTELIGENTE VENEZUELA</p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '16px 16px 16px 45px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
  outline: 'none',
  backdropFilter: 'blur(5px)'
};

const btnStyle = {
  width: '100%',
  padding: '16px',
  background: 'linear-gradient(90deg, #2563eb, #22d3ee)',
  color: 'white',
  border: 'none',
  borderRadius: '30px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)'
};
