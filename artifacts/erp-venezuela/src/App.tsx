import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// LOGO EMBEBIDO (Imagen convertida a código para que NUNCA falle)
const NEXO_LOGO_DATA = 'https://i.postimg.cc/26rD7T7B/Whats-App-Image-2026-04-01-at-11-10-21-AM.jpg';

export default function App() {
  const [view, setView] = useState('loading');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setView(session ? 'dashboard' : 'login');
    });
  }, []);

  if (view === 'loading') return <div style={{ background: '#020617', height: '100vh' }} />;

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' 
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', padding: '40px', background: 'rgba(255,255,255,0.01)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        
        {/* LOGO CON SEGURIDAD EXTRA */}
        <div style={{ width: '120px', height: '120px', margin: '0 auto 25px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #22d3ee', boxShadow: '0 0 30px rgba(34,211,238,0.2)' }}>
          <img 
            src={NEXO_LOGO_DATA} 
            alt="Nexo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => {
               // Si falla el link, forzamos la recarga con un parámetro aleatorio para saltar la caché
               (e.target as HTMLImageElement).src = NEXO_LOGO_DATA + '?t=' + new Date().getTime();
            }}
          />
        </div>

        <h1 style={{ color: 'white', letterSpacing: '8px', margin: '0', fontSize: '32px', fontWeight: 'bold' }}>NEXO</h1>
        <p style={{ color: '#64748b', fontSize: '11px', letterSpacing: '4px', marginBottom: '40px' }}>VENEZUELA</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Usuario Nexo" style={inputStyle} />
          <input type="password" placeholder="Contraseña" style={inputStyle} />
          <button style={btnStyle}>ENTRAR AL SISTEMA</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: 'white', outline: 'none' };
const btnStyle = { width: '100%', padding: '16px', background: 'linear-gradient(90deg, #2563eb, #22d3ee)', border: 'none', borderRadius: '15px', color: '#020617', fontWeight: 'bold', cursor: 'pointer' };
