import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
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
    if (error) alert("Error Nexo: " + error.message);
    else setView('dashboard');
  };

  if (view === 'loading') return <div style={{ background: '#020617', height: '100vh' }} />;

  if (view === 'dashboard') {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
          <h2 style={{ margin: 0, letterSpacing: '2px' }}>NEXO VENEZUELA</h2>
          <button onClick={() => supabase.auth.signOut().then(() => setView('login'))} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer' }}>Salir</button>
        </header>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1 style={{ fontSize: '40px', color: '#22d3ee' }}>Bienvenido, Socio</h1>
          <p style={{ color: '#94a3b8' }}>Sistema NEXO GESTOR inteligente activado.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      background: 'linear-gradient(rgba(2,6,23,0.8), rgba(2,6,23,0.8)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2001") center/cover' 
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <path d="M30 70V30H40L60 60V30H70V70H60L40 40V70H30Z" fill="#22d3ee" />
            <path d="M65 25L75 25L75 35M75 25L55 45" stroke="#22d3ee" strokeWidth="3" fill="none" />
          </svg>
        </div>
        <h1 style={{ color: 'white', letterSpacing: '5px', margin: '10px 0' }}>NEXO</h1>
        <p style={{ color: '#94a3b8', fontSize: '12px', letterSpacing: '3px', marginBottom: '30px' }}>VENEZUELA</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} style={inputStyle} />
          <button type="submit" style={btnStyle}>Entrar al Sistema Nexo</button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '15px', marginBottom: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', outline: 'none' };
const btnStyle = { width: '100%', padding: '15px', background: 'linear-gradient(to right, #2563eb, #22d3ee)', border: 'none', borderRadius: '15px', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(34,211,238,0.3)' };
