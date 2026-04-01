import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// LINK DIRECTO EXTRAÍDO DE TU CAPTURA DE IMGBB
const NEXO_LOGO = "https://i.ibb.co/L68M99p/Whats-App-Image-2026-04-01-at-11-10-21-AM.jpg";

export default function App() {
  const [view, setView] = useState('loading');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setView(session ? 'dashboard' : 'login');
    });
  }, []);

  if (view === 'loading') return <div style={{background:'#020617',height:'100vh'}}/>;

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* CONTENEDOR DEL LOGO NEXO */}
        <div style={{ width: '110px', height: '110px', margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #22d3ee', boxShadow: '0 0 20px rgba(34,211,238,0.3)' }}>
          <img 
            src={NEXO_LOGO} 
            alt="Nexo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {(e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=NEXO'}} 
          />
        </div>

        <h1 style={{ color: 'white', letterSpacing: '5px', margin: '0', fontSize: '32px', fontWeight: 'bold' }}>NEXO</h1>
        <p style={{ color: '#64748b', fontSize: '11px', letterSpacing: '3px', marginBottom: '30px' }}>VENEZUELA</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Usuario" style={inputStyle} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" style={inputStyle} onChange={e => setPass(e.target.value)} />
          <button style={btnStyle}>ENTRAR AL SISTEMA</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', outline: 'none' };
const btnStyle = { width: '100%', padding: '15px', background: 'linear-gradient(to right, #2563eb, #22d3ee)', border: 'none', borderRadius: '12px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' };
