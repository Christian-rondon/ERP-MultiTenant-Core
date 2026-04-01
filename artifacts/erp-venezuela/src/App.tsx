import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// ENLACE DIRECTO DE TU LOGO NEXO
const NEXO_LOGO_URL = 'https://i.ibb.co/Lz0D7mY/Whats-App-Image-2026-04-01-at-11-10-21-AM.jpg';

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
            <img src={NEXO_LOGO_URL} alt="Nexo" style={{ height: '40px', borderRadius: '50%' }} />
            <span style={{ fontWeight: 'bold', letterSpacing: '2px' }}>NEXO VENEZUELA</span>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => setView('login'))} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
        </header>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div style={cardStyle}>
            <div style={labelStyle}>Ventas Totales</div>
            <div style={valueStyle}>$ 0.00</div>
          </div>
          <div style={{ ...cardStyle, border: '1px solid rgba(34, 211, 238, 0.2)' }}>
            <div style={{ ...labelStyle, color: '#22d3ee' }}>Tasa BCV</div>
            <div style={{ ...valueStyle, color: '#22d3ee' }}>Bs. 36.45</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      background: 'linear-gradient(rgba(2,6,23,0.85), rgba(2,6,23,0.95)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2001") center/cover' 
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px', padding: '50px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <div style={{ width: '120px', height: '120px', margin: '0 auto 25px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #22d3ee', boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}>
          <img src={NEXO_LOGO_URL} alt="Nexo Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 style={{ color: 'white', letterSpacing: '6px', margin: '0', fontSize: '36px', fontWeight: '900' }}>NEXO</h1>
        <p style={{ color: '#64748b', fontSize: '13px', letterSpacing: '4px', marginBottom: '40px', textTransform: 'uppercase' }}>Venezuela</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Usuario Nexo" onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} style={inputStyle} />
          <button type="submit" style={btnStyle}>Entrar al Sistema</button>
        </form>
        <p style={{ marginTop: '40px', color: '#334155', fontSize: '10px', letterSpacing: '1px' }}>© 2026 NEXO GROUP · GESTOR INTELIGENTE</p>
      </div>
    </div>
  );
}

const cardStyle = { background: 'rgba(255, 255, 255, 0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' };
const labelStyle = { color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' };
const valueStyle = { fontSize: '42px', fontWeight: '800', marginTop: '10px' };
const inputStyle = { width: '100%', padding: '16px', marginBottom: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', outline: 'none', fontSize: '16px' };
const btnStyle = { width: '100%', padding: '16px', background: 'linear-gradient(90deg, #2563eb, #22d3ee)', border: 'none', borderRadius: '16px', color: '#020617', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(34,211,238,0.3)' };
